import {
  AI_MODEL_METADATA,
  AI_MODEL_VALIDATION,
  AI_MODEL_WEIGHTS,
  ALL_COMMODITIES,
  ALL_STATES,
  ALL_MARKETS,
  ALL_GRADES,
  GEO_HIERARCHY,
  COMMODITY_STATS,
  STATE_FACTORS,
  STATE_SUPPORT,
  CROP_TO_COMMODITY,
  CommodityPriceStats,
  MarketQuote,
  ModelTelemetry
} from '../data/aiPriceModel';
import { CropType } from '../types';

export interface PricePredictionInput {
  commodity: string;
  state?: string;
  district?: string;
  market?: string;
  variety?: string;
  grade?: string;
  quantityKg?: number;
}

export interface AttributionFactor {
  factor: 'baseline' | 'commodity' | 'state' | 'market' | 'variety' | 'grade';
  name: string;
  multiplier: number;
  impactRupees: number;
  percentageImpact: number;
  description: string;
}

export interface ArbitrageInsight {
  market: string;
  district: string;
  state: string;
  modalPrice: number;
  priceDiff: number;
  percentageDiff: number;
  isHigher: boolean;
}

export interface PricePredictionResult {
  commodity: string;
  state: string;
  market: string;
  variety: string;
  grade: string;
  
  // Primary AI Predictions
  predictedModalPrice: number; // ₹/Qtl
  predictedMinPrice: number;   // ₹/Qtl (Floor)
  predictedMaxPrice: number;   // ₹/Qtl (Ceiling)
  pricePerKg: number;          // ₹/Kg
  
  // Total Valuation
  quantityKg?: number;
  totalLotValuation?: number;  // ₹
  
  // Negotiation Corridor
  negotiationCorridor: {
    floorRate: number;         // Do-not-sell-below
    fairRate: number;          // AI Predicted modal
    premiumRate: number;       // Target ceiling
    spreadPercent: number;
  };
  
  // Explainability Attributions
  basePrice: number;
  attributions: AttributionFactor[];
  
  // Reliability & Data Confidence
  confidenceScore: number;     // 0 to 100%
  confidenceLevel: 'High' | 'Moderate' | 'Provisional';
  backingQuotesCount: number;
  isInterpolatedState: boolean;
  
  // Cross-Market Arbitrage Opportunities
  arbitrage: {
    bestMarket: { name: string; price: number; state: string };
    worstMarket: { name: string; price: number; state: string };
    maxSpread: number;
    spreadPercent: number;
    otherMarkets: ArbitrageInsight[];
  } | null;
  
  // Underlying Quotes & Stats from Data.csv
  quotes: MarketQuote[];
  commodityStats: CommodityPriceStats | null;
}

// Fallback benchmarks for commodities not present in Data.csv (e.g. soybean, wheat)
const FALLBACK_BENCHMARKS: Record<string, number> = {
  Soyabean: 4850,
  soybean: 4850,
  Wheat: 2550,
  wheat: 2550
};

/**
 * Standardizes commodity names or crop IDs into the exact name in Data.csv
 */
export function resolveCommodityName(input: string): string {
  if (!input) return 'Onion';
  const trimmed = input.trim();
  
  // Check exact match
  if (ALL_COMMODITIES.includes(trimmed)) return trimmed;
  
  // Check lowercase match
  const lower = trimmed.toLowerCase();
  for (const c of ALL_COMMODITIES) {
    if (c.toLowerCase() === lower) return c;
  }
  
  // Check CropType alias
  const alias = CROP_TO_COMMODITY[lower as CropType];
  if (alias && ALL_COMMODITIES.includes(alias)) return alias;
  
  // Partial substring match
  for (const c of ALL_COMMODITIES) {
    if (c.toLowerCase().includes(lower) || lower.includes(c.toLowerCase())) {
      return c;
    }
  }
  
  return trimmed;
}

/**
 * Evaluates the AI Price Model for any commodity, state, market, variety, and grade.
 * Completely deterministic, zero external calls, <1ms execution.
 */
export function predictPrice(input: PricePredictionInput): PricePredictionResult {
  const resolvedCommodity = resolveCommodityName(input.commodity);
  const commodityKnown = Boolean(COMMODITY_STATS[resolvedCommodity]);
  const stats = COMMODITY_STATS[resolvedCommodity] || null;
  
  const state = input.state?.trim() || (stats?.states[0] ?? 'Maharashtra');
  const validMarketsInState = GEO_HIERARCHY[state as keyof typeof GEO_HIERARCHY]?.markets || [];
  
  // Only use market if explicitly provided, or if default is actually located in this state
  let market = input.market?.trim();
  if (!market) {
    market = stats?.marketQuotes.find(q => q.state === state)?.market || (validMarketsInState.length > 0 ? validMarketsInState[0] : 'State Average APMC');
  }
  
  // Only apply specific variety/grade if user provided it or if it belongs to this commodity
  const variety = input.variety?.trim() || (stats?.varieties.length === 1 ? stats.varieties[0] : 'Standard');
  const grade = input.grade?.trim() || (stats?.grades.length === 1 ? stats.grades[0] : 'FAQ');
  
  const { intercepts, features } = AI_MODEL_WEIGHTS;
  
  let logModal = intercepts.modal;
  let logMin = intercepts.min;
  let logMax = intercepts.max;
  
  const attributions: AttributionFactor[] = [
    {
      factor: 'baseline',
      name: 'All-India Mandi Base Rate',
      multiplier: 1.0,
      impactRupees: intercepts.basePriceModal,
      percentageImpact: 0,
      description: 'National baseline rate across all APMC mandis'
    }
  ];
  
  let cumulativePrice = intercepts.basePriceModal;
  
  // 1. Commodity Factor
  if (commodityKnown && features.commodity[resolvedCommodity]) {
    const cW = features.commodity[resolvedCommodity];
    logModal += cW.modal;
    logMin += cW.min;
    logMax += cW.max;
    
    const newPrice = Math.round(Math.exp(intercepts.modal + cW.modal));
    const impact = newPrice - intercepts.basePriceModal;
    cumulativePrice = newPrice;
    
    attributions.push({
      factor: 'commodity',
      name: resolvedCommodity,
      multiplier: cW.modalMultiplier,
      impactRupees: impact,
      percentageImpact: Math.round((cW.modalMultiplier - 1) * 100),
      description: `Baseline market valuation for ${resolvedCommodity}`
    });
  } else if (FALLBACK_BENCHMARKS[resolvedCommodity]) {
    const fallbackBase = FALLBACK_BENCHMARKS[resolvedCommodity];
    const pseudoLog = Math.log(fallbackBase) - intercepts.modal;
    logModal += pseudoLog;
    logMin += pseudoLog;
    logMax += pseudoLog;
    cumulativePrice = fallbackBase;
    
    attributions.push({
      factor: 'commodity',
      name: `${resolvedCommodity} (Curated)`,
      multiplier: Math.round((fallbackBase / intercepts.basePriceModal) * 100) / 100,
      impactRupees: fallbackBase - intercepts.basePriceModal,
      percentageImpact: Math.round(((fallbackBase / intercepts.basePriceModal) - 1) * 100),
      description: `Reference benchmark for ${resolvedCommodity} (not in single-day quotes)`
    });
  }
  
  // 2. State Factor
  const stateWeight = features.state[state];
  const isCoveredState = Boolean(stateWeight);
  const stateMult = stateWeight ? stateWeight.modalMultiplier : (STATE_FACTORS[state] ?? 1.0);
  
  if (stateWeight) {
    logModal += stateWeight.modal;
    logMin += stateWeight.min;
    logMax += stateWeight.max;
  } else if (STATE_FACTORS[state]) {
    const factorLog = Math.log(STATE_FACTORS[state]);
    logModal += factorLog;
    logMin += factorLog;
    logMax += factorLog;
  }
  
  const priceAfterState = Math.round(cumulativePrice * stateMult);
  attributions.push({
    factor: 'state',
    name: state,
    multiplier: stateMult,
    impactRupees: priceAfterState - cumulativePrice,
    percentageImpact: Math.round((stateMult - 1) * 100),
    description: isCoveredState
      ? `State price index (${stateMult > 1 ? '+' : ''}${Math.round((stateMult - 1) * 100)}% vs national)`
      : 'Pan-India standard state factor'
  });
  cumulativePrice = priceAfterState;
  
  // 3. Market Factor
  if (features.market[market]) {
    const mW = features.market[market];
    logModal += mW.modal;
    logMin += mW.min;
    logMax += mW.max;
    
    const priceAfterMarket = Math.round(cumulativePrice * mW.modalMultiplier);
    attributions.push({
      factor: 'market',
      name: market,
      multiplier: mW.modalMultiplier,
      impactRupees: priceAfterMarket - cumulativePrice,
      percentageImpact: Math.round((mW.modalMultiplier - 1) * 100),
      description: `Market liquidity & volume adjustment for ${market}`
    });
    cumulativePrice = priceAfterMarket;
  }
  
  // 4. Grade Factor
  if (features.grade[grade]) {
    const gW = features.grade[grade];
    logModal += gW.modal;
    logMin += gW.min;
    logMax += gW.max;
    
    const priceAfterGrade = Math.round(cumulativePrice * gW.modalMultiplier);
    attributions.push({
      factor: 'grade',
      name: grade,
      multiplier: gW.modalMultiplier,
      impactRupees: priceAfterGrade - cumulativePrice,
      percentageImpact: Math.round((gW.modalMultiplier - 1) * 100),
      description: `Quality specification premium for ${grade}`
    });
    cumulativePrice = priceAfterGrade;
  }
  
  // 5. Variety Factor
  if (features.variety[variety]) {
    const vW = features.variety[variety];
    logModal += vW.modal;
    logMin += vW.min;
    logMax += vW.max;
    
    const priceAfterVariety = Math.round(cumulativePrice * vW.modalMultiplier);
    attributions.push({
      factor: 'variety',
      name: variety,
      multiplier: vW.modalMultiplier,
      impactRupees: priceAfterVariety - cumulativePrice,
      percentageImpact: Math.round((vW.modalMultiplier - 1) * 100),
      description: `Produce cultivar premium for ${variety}`
    });
    cumulativePrice = priceAfterVariety;
  }
  
  // Final calculated prices
  const predictedModalPrice = Math.max(200, Math.round(Math.exp(logModal)));
  
  // Enforce consistent bounds
  const bandPct = stats?.bandPercent ?? 12.5;
  const halfBand = bandPct / 200;
  
  let predictedMinPrice = Math.round(Math.min(predictedModalPrice * 0.98, Math.exp(logMin)));
  let predictedMaxPrice = Math.round(Math.max(predictedModalPrice * 1.02, Math.exp(logMax)));
  
  const floorRate = Math.round(predictedModalPrice * (1 - halfBand));
  const premiumRate = Math.round(predictedModalPrice * (1 + halfBand));
  
  if (predictedMinPrice > floorRate) predictedMinPrice = floorRate;
  if (predictedMaxPrice < premiumRate) predictedMaxPrice = premiumRate;
  
  // Confidence scoring
  let confidenceScore = 80;
  if (stats) {
    if (stats.quotes >= 5) confidenceScore += 10;
    else if (stats.quotes >= 2) confidenceScore += 5;
    else confidenceScore -= 5;
    
    if (stats.states.includes(state)) confidenceScore += 5;
    if (stats.markets > 3) confidenceScore += 3;
  } else {
    confidenceScore -= 25;
  }
  
  if (!isCoveredState) confidenceScore -= 12;
  confidenceScore = Math.max(30, Math.min(96, confidenceScore));
  
  const confidenceLevel: 'High' | 'Moderate' | 'Provisional' =
    confidenceScore >= 80 ? 'High' : confidenceScore >= 60 ? 'Moderate' : 'Provisional';
    
  // Cross-market Arbitrage Calculation
  let arbitrage: PricePredictionResult['arbitrage'] = null;
  if (stats && stats.marketQuotes.length > 1) {
    const otherMarkets: ArbitrageInsight[] = stats.marketQuotes
      .filter((q) => q.market !== market)
      .map((q) => {
        const diff = q.modal - predictedModalPrice;
        return {
          market: q.market,
          district: q.district,
          state: q.state,
          modalPrice: q.modal,
          priceDiff: diff,
          percentageDiff: Math.round((diff / predictedModalPrice) * 100),
          isHigher: diff > 0
        };
      })
      .sort((a, b) => b.priceDiff - a.priceDiff);
      
    arbitrage = {
      bestMarket: { name: stats.bestMarket, price: stats.bestMarketPrice, state: stats.states[0] ?? '' },
      worstMarket: { name: stats.worstMarket, price: stats.worstMarketPrice, state: stats.states[stats.states.length - 1] ?? '' },
      maxSpread: stats.crossMarketSpread,
      spreadPercent: Math.round((stats.crossMarketSpread / stats.worstMarketPrice) * 100),
      otherMarkets
    };
  }
  
  const pricePerKg = Math.round((predictedModalPrice / 100) * 10) / 10;
  const quantityKg = input.quantityKg;
  const totalLotValuation = quantityKg ? Math.round((quantityKg / 100) * predictedModalPrice) : undefined;
  
  return {
    commodity: resolvedCommodity,
    state,
    market,
    variety,
    grade,
    predictedModalPrice,
    predictedMinPrice,
    predictedMaxPrice,
    pricePerKg,
    quantityKg,
    totalLotValuation,
    negotiationCorridor: {
      floorRate,
      fairRate: predictedModalPrice,
      premiumRate,
      spreadPercent: bandPct
    },
    basePrice: intercepts.basePriceModal,
    attributions,
    confidenceScore,
    confidenceLevel,
    backingQuotesCount: stats?.quotes ?? 0,
    isInterpolatedState: !isCoveredState,
    arbitrage,
    quotes: stats?.marketQuotes ?? [],
    commodityStats: stats
  };
}

/**
 * Returns metadata and validation telemetry of the trained AI model.
 */
export function getModelTelemetry(): ModelTelemetry {
  return {
    trainedAt: AI_MODEL_METADATA.trainedAt,
    rows: AI_MODEL_METADATA.rows,
    commoditiesCount: AI_MODEL_METADATA.commodities,
    marketsCount: AI_MODEL_METADATA.markets,
    statesCount: AI_MODEL_METADATA.states,
    snapshotDate: AI_MODEL_METADATA.snapshotDate,
    kFoldR2: AI_MODEL_VALIDATION.kFold.r2,
    kFoldMae: AI_MODEL_VALIDATION.kFold.mae,
    kFoldMape: AI_MODEL_VALIDATION.kFold.mape,
    inSampleR2: AI_MODEL_VALIDATION.inSample.r2,
    inSampleMape: AI_MODEL_VALIDATION.inSample.mape,
    leaveOneOutMape: AI_MODEL_VALIDATION.leaveOneOut.mape
  };
}

export function getAllCommoditiesList(): string[] {
  return ALL_COMMODITIES;
}

export function getAllStatesList(): string[] {
  return ALL_STATES;
}

export function getAllMarketsList(): string[] {
  return ALL_MARKETS;
}

export function getAllGradesList(): string[] {
  return ALL_GRADES;
}

export function getGeoHierarchy() {
  return GEO_HIERARCHY;
}

export function getStatsForCommodity(commodity: string): CommodityPriceStats | null {
  const resolved = resolveCommodityName(commodity);
  return COMMODITY_STATS[resolved] ?? null;
}
