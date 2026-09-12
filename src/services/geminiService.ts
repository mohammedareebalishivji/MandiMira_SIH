import { GoogleGenAI, Type } from '@google/genai';
import {
  ArrivalRecord,
  BuyerDemand,
  FarmerLot,
  MandiItem,
  QualityAssessment,
  QualitySpec,
  UserRole
} from '../types';

/**
 * Gemini-backed market intelligence.
 *
 * Every call degrades gracefully: if the key is missing, the network is down,
 * or the model returns something unparseable, we fall back to a deterministic
 * locally-computed answer so the farmer is never left staring at an error.
 */

const API_KEY = process.env.GEMINI_API_KEY ?? '';
// gemini-2.5-flash is closed to new API keys; the API itself directs new
// callers to the 3.6 line. Verified against models.list for this key.
// Ordered fallback: if the first model is overloaded we drop to the next.
const MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];

/** Transient Gemini failures (overload, rate limit) are common enough to be worth retrying. */
const isTransient = (err: unknown): boolean => {
  const msg = err instanceof Error ? err.message : String(err);
  return /\b(429|500|502|503|504)\b/.test(msg) || /UNAVAILABLE|RESOURCE_EXHAUSTED|overload/i.test(msg);
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Runs `attempt` against each model in turn, retrying transient errors with
 * backoff before moving on. Throws the last error if every option fails.
 */
async function withResilience<T>(attempt: (model: string) => Promise<T>): Promise<T> {
  let lastErr: unknown = new Error('No Gemini attempt was made.');
  for (const model of MODELS) {
    for (let tryNo = 0; tryNo < 3; tryNo++) {
      try {
        return await attempt(model);
      } catch (err) {
        lastErr = err;
        if (!isTransient(err)) break;       // a real error — try the next model
        await sleep(400 * 2 ** tryNo);      // 400ms, 800ms, 1600ms
      }
    }
  }
  throw lastErr;
}

export const isGeminiConfigured = (): boolean => API_KEY.length > 0;

let client: GoogleGenAI | null = null;
const getClient = (): GoogleGenAI | null => {
  if (!API_KEY) return null;
  if (!client) client = new GoogleGenAI({ apiKey: API_KEY });
  return client;
};

export interface AiCallResult<T> {
  data: T;
  source: 'gemini' | 'fallback';
  error?: string;
}

/* ------------------------------------------------------------------
 * 1. MARKET INTELLIGENCE BRIEF
 * ---------------------------------------------------------------- */

export interface MarketBrief {
  headline: string;
  priceOutlook: string;
  demandSignal: string;
  actionNow: string;
  riskFlag: string;
  confidence: 'low' | 'medium' | 'high';
}

const briefSchema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING, description: 'One sentence, max 18 words, plain language a farmer reads first.' },
    priceOutlook: { type: Type.STRING, description: 'Where the rate is heading over 3-7 days and why. Max 40 words.' },
    demandSignal: { type: Type.STRING, description: 'Who is buying, what volume and at what grade. Max 40 words.' },
    actionNow: { type: Type.STRING, description: 'The single concrete step to take today. Max 30 words.' },
    riskFlag: { type: Type.STRING, description: 'The main thing that could go wrong with this plan. Max 30 words.' },
    confidence: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
  },
  required: ['headline', 'priceOutlook', 'demandSignal', 'actionNow', 'riskFlag', 'confidence']
};

const fallbackBrief = (lot: FarmerLot, mandis: MandiItem[]): MarketBrief => {
  const best = [...mandis].sort((a, b) => b.netRealizationPerQtl - a.netRealizationPerQtl)[0];
  const spread = best ? best.netRealizationPerQtl - lot.localMandiBenchmark : 0;
  return {
    headline: `${lot.cropNameEn}: best net realisation today is ${best?.name ?? 'your local mandi'}.`,
    priceOutlook: `Local benchmark is ₹${lot.localMandiBenchmark}/Qtl. After transport, ${best?.name ?? 'the local yard'} nets ₹${best?.netRealizationPerQtl ?? lot.localMandiBenchmark}/Qtl — a ₹${Math.abs(Math.round(spread))} ${spread >= 0 ? 'gain' : 'shortfall'} per quintal.`,
    demandSignal: 'Verified processor and retail demand is open for Grade A volume. Bulk lots attract a premium over single-farmer consignments.',
    actionNow: lot.hasRainAlert
      ? 'Rain alert active — move the lot under cover or despatch today rather than holding in the open.'
      : 'Compare the net-of-transport column, not the headline rate, before booking a vehicle.',
    riskFlag: 'Arrivals can swing intraday. Confirm the rate at the gate before unloading.',
    confidence: 'medium'
  };
};

export const generateMarketBrief = async (
  lot: FarmerLot,
  mandis: MandiItem[],
  arrivals: ArrivalRecord[],
  demands: BuyerDemand[],
  role: UserRole,
  language = 'English'
): Promise<AiCallResult<MarketBrief>> => {
  const ai = getClient();
  if (!ai) return { data: fallbackBrief(lot, mandis), source: 'fallback', error: 'GEMINI_API_KEY is not set.' };

  const prompt = `You are an agricultural market analyst advising an Indian ${role} in ${lot.district}.
Write in ${language}. Be concrete and numeric. Never invent prices beyond the data given.

FARMER LOT
- Crop: ${lot.cropNameEn} (${lot.variety}), grade ${lot.grade}
- Quantity: ${lot.quantityKg} kg, harvested ${lot.harvestDateDaysAgo} day(s) ago
- Storage: ${lot.storageType}, available: ${lot.storageAvailable}
- Rain alert: ${lot.hasRainAlert}, cash urgency: ${lot.cashUrgency}
- Local mandi benchmark: Rs ${lot.localMandiBenchmark}/quintal

NEARBY MARKETS (gross rate, transport cost, net realisation, arrivals)
${mandis.map((m) => `- ${m.name}: gross Rs${m.grossPricePerQtl}, transport Rs${m.transportCostPerQtl}, NET Rs${m.netRealizationPerQtl}/Qtl, ${m.distanceKm}km, arrivals ${m.arrivalsTotalQtl} Qtl (${m.arrivalTrend})`).join('\n')}

TODAY'S ARRIVAL MOVEMENT
${arrivals.map((a) => `- ${a.mandiName}: ${a.todayQtl} Qtl today vs ${a.sevenDayAvgQtl} 7-day avg (${a.changePercent > 0 ? '+' : ''}${a.changePercent}%), ${a.congestion} congestion`).join('\n')}

OPEN BUYER DEMAND
${demands.filter((d) => d.status !== 'closed').map((d) => `- ${d.buyerName} wants ${d.requiredQtl - d.committedQtl} Qtl more of ${d.cropNameEn} at Rs${d.pricePerQtl}/Qtl, grade ${d.gradeRequired}, ${d.paymentTerms}`).join('\n')}

Judge the sale window on NET realisation after transport and spoilage, not the headline rate.`;

  try {
    const res = await withResilience((model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: briefSchema, temperature: 0.4 }
      })
    );
    const parsed = JSON.parse((res.text ?? '').trim()) as MarketBrief;
    return { data: parsed, source: 'gemini' };
  } catch (err) {
    return {
      data: fallbackBrief(lot, mandis),
      source: 'fallback',
      error: err instanceof Error ? err.message : 'Gemini request failed.'
    };
  }
};

/* ------------------------------------------------------------------
 * 3. QUALITY GRADING against a buyer's published specification
 * ---------------------------------------------------------------- */

const qualitySchema = {
  type: Type.OBJECT,
  properties: {
    grade: { type: Type.STRING, enum: ['Grade A', 'Grade B', 'Fair Average Quality (FAQ)'] },
    confidencePercent: { type: Type.NUMBER },
    summary: { type: Type.STRING, description: 'Two sentences on what the produce will fetch and why.' },
    estimatedPremiumPerQtl: { type: Type.NUMBER, description: 'Rupees per quintal above or below the base rate. Can be negative.' },
    specs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          attribute: { type: Type.STRING },
          requirement: { type: Type.STRING },
          farmerValue: { type: Type.STRING, description: 'What the described produce appears to offer for this attribute.' },
          meets: { type: Type.STRING, enum: ['pass', 'borderline', 'fail', 'unknown'] },
          premiumImpactPerQtl: { type: Type.NUMBER }
        },
        required: ['attribute', 'requirement', 'farmerValue', 'meets', 'premiumImpactPerQtl']
      }
    },
    improvementActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Up to 4 specific, low-cost actions before despatch that would raise the grade.'
    }
  },
  required: ['grade', 'confidencePercent', 'summary', 'estimatedPremiumPerQtl', 'specs', 'improvementActions']
};

const fallbackAssessment = (lot: FarmerLot, specs: QualitySpec[]): QualityAssessment => ({
  grade: lot.grade,
  confidencePercent: 55,
  summary:
    'Assessed from your declared grade only — AI grading was unavailable. Get a physical sample checked at the buyer gate before committing to a premium price.',
  specs: specs.map((s) => ({ ...s, farmerValue: 'Not assessed', meets: 'unknown' as const })),
  estimatedPremiumPerQtl: 0,
  improvementActions: [
    'Photograph a representative sample in daylight against a plain background.',
    'Remove soil, loose skin and damaged pieces before weighing.',
    'Sort into size bands — mixed sizing is the most common cause of grade downgrade.',
    'Cure onions 48 hrs in shade to tighten the neck and cut moisture.'
  ],
  source: 'manual',
  assessedAt: new Date().toISOString()
});

export const assessQuality = async (
  lot: FarmerLot,
  specs: QualitySpec[],
  farmerDescription: string,
  imageBase64?: { data: string; mimeType: string }
): Promise<AiCallResult<QualityAssessment>> => {
  const ai = getClient();
  if (!ai) return { data: fallbackAssessment(lot, specs), source: 'fallback', error: 'GEMINI_API_KEY is not set.' };

  const textPrompt = `You are a produce quality grader at an Indian APMC mandi.
Assess this lot against the buyer's published specification. Be honest — over-grading costs the farmer a rejection at the gate.

LOT: ${lot.cropNameEn} (${lot.variety}), ${lot.quantityKg} kg, harvested ${lot.harvestDateDaysAgo} day(s) ago, stored in ${lot.storageType}.
FARMER'S OWN DESCRIPTION: ${farmerDescription || '(none given)'}
${imageBase64 ? 'A photograph of the produce is attached — grade primarily from what you can actually see in it.' : 'No photograph was provided — mark visual attributes as "unknown" rather than guessing.'}

BUYER SPECIFICATION
${specs.map((s) => `- ${s.attribute}: ${s.requirement} (worth Rs${s.premiumImpactPerQtl}/Qtl)`).join('\n')}

Return one entry per specification attribute. Where you genuinely cannot tell, use "unknown" and set premiumImpactPerQtl to 0.`;

  try {
    const parts: any[] = [{ text: textPrompt }];
    if (imageBase64) {
      parts.unshift({ inlineData: { data: imageBase64.data, mimeType: imageBase64.mimeType } });
    }
    const res = await withResilience((model) =>
      ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts }],
        config: { responseMimeType: 'application/json', responseSchema: qualitySchema, temperature: 0.2 }
      })
    );
    const raw = JSON.parse((res.text ?? '').trim());
    return {
      data: {
        grade: raw.grade,
        confidencePercent: Math.round(raw.confidencePercent),
        summary: raw.summary,
        estimatedPremiumPerQtl: Math.round(raw.estimatedPremiumPerQtl),
        improvementActions: raw.improvementActions ?? [],
        specs: (raw.specs ?? []).map((s: any, i: number) => ({
          id: specs[i]?.id ?? `s${i}`,
          attribute: s.attribute,
          requirement: s.requirement,
          farmerValue: s.farmerValue,
          meets: s.meets,
          premiumImpactPerQtl: Math.round(s.premiumImpactPerQtl)
        })),
        source: 'ai',
        assessedAt: new Date().toISOString()
      },
      source: 'gemini'
    };
  } catch (err) {
    return {
      data: fallbackAssessment(lot, specs),
      source: 'fallback',
      error: err instanceof Error ? err.message : 'Gemini request failed.'
    };
  }
};

/* ------------------------------------------------------------------
 * NEGOTIATION SCRIPT — turns the price data into words to say aloud
 * ---------------------------------------------------------------- */

export const generateNegotiationScript = async (
  lot: FarmerLot,
  benchmarkPerQtl: number,
  buyerName: string,
  language = 'English'
): Promise<AiCallResult<string>> => {
  const fallback = `Namaskar. I have ${lot.quantityKg} kg of ${lot.cropNameEn}, ${lot.grade}, harvested ${lot.harvestDateDaysAgo} day(s) ago.

Today's verified benchmark for this grade is ₹${benchmarkPerQtl}/quintal. I have the rate sheet and the arrival figures on my phone.

I am ready to despatch today if you can meet ₹${benchmarkPerQtl}/quintal with digital weighing and payment within 48 hours. If the rate is lower than that, I will hold — I have covered storage and I am not under pressure to sell.`;

  const ai = getClient();
  if (!ai) return { data: fallback, source: 'fallback', error: 'GEMINI_API_KEY is not set.' };

  try {
    const res = await withResilience((model) =>
      ai.models.generateContent({
        model,
        contents: `Write a short, respectful negotiation script in ${language} for an Indian farmer speaking to ${buyerName}.
The farmer has ${lot.quantityKg} kg of ${lot.cropNameEn}, ${lot.grade}, harvested ${lot.harvestDateDaysAgo} day(s) ago.
The verified benchmark rate is Rs ${benchmarkPerQtl} per quintal. Cash urgency: ${lot.cashUrgency}. Storage available: ${lot.storageAvailable}.

Rules: 4 short paragraphs maximum. Cite the benchmark number. Ask for digital weighing and a payment timeline in writing. Give the farmer a dignified way to walk away. No flattery, no filler.`,
        config: { temperature: 0.6 }
      })
    );
    const text = (res.text ?? '').trim();
    return text ? { data: text, source: 'gemini' } : { data: fallback, source: 'fallback' };
  } catch (err) {
    return { data: fallback, source: 'fallback', error: err instanceof Error ? err.message : 'Gemini request failed.' };
  }
};

/* ------------------------------------------------------------------
 * GRIEVANCE DRAFTING — turns a spoken complaint into a filed case
 * ---------------------------------------------------------------- */

export interface GrievanceDraft {
  title: string;
  category: string;
  description: string;
  evidenceNeeded: string[];
  suggestedResolution: string;
}

const grievanceSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'One line, factual, includes the amount if known.' },
    category: {
      type: Type.STRING,
      enum: ['payment_delay', 'weight_dispute', 'quality_rejection', 'price_deviation', 'logistics_failure', 'other']
    },
    description: { type: Type.STRING, description: 'A formal 3-5 sentence statement of facts with dates and amounts. No emotion, no accusation beyond the facts.' },
    evidenceNeeded: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Up to 5 documents that would settle this case.' },
    suggestedResolution: { type: Type.STRING, description: 'The specific, proportionate remedy being asked for.' }
  },
  required: ['title', 'category', 'description', 'evidenceNeeded', 'suggestedResolution']
};

export const draftGrievance = async (
  complaint: string,
  context: { counterparty: string; txnRef: string; amount: number },
  language = 'English'
): Promise<AiCallResult<GrievanceDraft>> => {
  const fallback: GrievanceDraft = {
    title: `Dispute with ${context.counterparty} — ₹${context.amount.toLocaleString('en-IN')} (${context.txnRef})`,
    category: 'other',
    description: complaint || 'Complaint details not captured.',
    evidenceNeeded: [
      'Weighbridge ticket from farm gate and from buyer premises',
      'Digital offer or rate agreement screenshot',
      'Bank statement showing amount actually received',
      'Photographs of the consignment at despatch',
      'Any written quality inspection report'
    ],
    suggestedResolution: `Release of the outstanding ₹${context.amount.toLocaleString('en-IN')} within 7 days, or a documented explanation of every deduction applied.`
  };

  const ai = getClient();
  if (!ai) return { data: fallback, source: 'fallback', error: 'GEMINI_API_KEY is not set.' };

  try {
    const res = await withResilience((model) =>
      ai.models.generateContent({
        model,
        contents: `An Indian farmer has described a trade dispute in their own words. Turn it into a formal grievance that an APMC mediator can act on. Write the output in ${language}.

COUNTERPARTY: ${context.counterparty}
TRANSACTION: ${context.txnRef}
AMOUNT IN DISPUTE: Rs ${context.amount}

FARMER'S WORDS:
"""${complaint}"""

State only what the farmer actually said as fact. Do not invent dates, weights or amounts that were not mentioned.`,
        config: { responseMimeType: 'application/json', responseSchema: grievanceSchema, temperature: 0.3 }
      })
    );
    return { data: JSON.parse((res.text ?? '').trim()) as GrievanceDraft, source: 'gemini' };
  } catch (err) {
    return { data: fallback, source: 'fallback', error: err instanceof Error ? err.message : 'Gemini request failed.' };
  }
};
