import React, { useState } from 'react';
import { Sparkles, RefreshCw, TriangleAlert, Target, TrendingUp, Users, WifiOff, Loader2 } from 'lucide-react';
import { generateMarketBrief, MarketBrief, isGeminiConfigured } from '../services/geminiService';
import { arrivalRecords, buyerDemands } from '../data/marketData';
import { FarmerLot, MandiItem, UserRole } from '../types';

interface Props {
  lot: FarmerLot;
  mandis: MandiItem[];
  role: UserRole;
  languageName: string;
}

/**
 * Solution #1 — Market intelligence.
 * Fuses mandi rates, arrival movement and open buyer demand into one
 * plain-language brief via Gemini, with a deterministic fallback.
 */
export const MarketIntelligenceAI: React.FC<Props> = ({ lot, mandis, role, languageName }) => {
  const [brief, setBrief] = useState<MarketBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'gemini' | 'fallback' | null>(null);
  const [errorNote, setErrorNote] = useState<string>('');

  const run = async () => {
    setLoading(true);
    setErrorNote('');
    const res = await generateMarketBrief(lot, mandis, arrivalRecords, buyerDemands, role, languageName);
    setBrief(res.data);
    setSource(res.source);
    if (res.error) setErrorNote(res.error);
    setLoading(false);
  };

  const rows: { icon: React.ElementType; label: string; value: string; tone: string }[] = brief
    ? [
        { icon: TrendingUp, label: 'Price outlook', value: brief.priceOutlook, tone: '#16532d' },
        { icon: Users, label: 'Demand signal', value: brief.demandSignal, tone: '#002b7b' },
        { icon: Target, label: 'Do this today', value: brief.actionNow, tone: '#904d00' },
        { icon: TriangleAlert, label: 'Watch out for', value: brief.riskFlag, tone: '#ba1a1a' }
      ]
    : [];

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#003b1b] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-[#b2f1be]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">AI Market Brief</h3>
            <span className="font-label-sm text-[11px] text-[#404941]">
              Rates + arrivals + open demand, read together
            </span>
          </div>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="min-h-[36px] px-3 rounded-full bg-[#16532d] text-white font-label-sm text-xs flex items-center gap-1.5 hover:bg-[#003b1b] active:scale-95 transition-all cursor-pointer disabled:opacity-60 flex-shrink-0"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {loading ? 'Reading market…' : brief ? 'Refresh' : 'Generate'}
        </button>
      </div>

      {!isGeminiConfigured() && (
        <div className="flex items-start gap-2 bg-[#ffdcc3] border border-[#fe932c]/40 rounded-lg px-3 py-2">
          <WifiOff className="w-4 h-4 text-[#663500] flex-shrink-0 mt-0.5" />
          <p className="font-label-sm text-[11px] text-[#663500] leading-snug">
            GEMINI_API_KEY is not set — the brief will fall back to locally computed figures.
          </p>
        </div>
      )}

      {!brief && !loading && (
        <div className="bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-4 text-center">
          <p className="font-body-sm text-[13px] text-[#404941]">
            Generate a brief for <span className="font-bold text-[#191c1a]">{lot.cropNameEn}</span> —
            it reads {mandis.length} markets, today’s arrival swings and every open buyer order,
            then tells you what to do about it.
          </p>
        </div>
      )}

      {loading && !brief && (
        <div className="bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-4 flex flex-col gap-2 animate-pulse">
          <div className="h-4 bg-[#e0e3df] rounded w-3/4" />
          <div className="h-3 bg-[#e0e3df] rounded w-full" />
          <div className="h-3 bg-[#e0e3df] rounded w-5/6" />
        </div>
      )}

      {brief && (
        <div className="flex flex-col gap-3">
          <div className="bg-[#003b1b] rounded-xl p-3.5">
            <p className="font-headline-sm text-white leading-snug text-[15px]">{brief.headline}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#16532d] text-[#b2f1be] uppercase tracking-wider">
                {brief.confidence} confidence
              </span>
              <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#16532d] text-[#88c695]">
                {source === 'gemini' ? 'Gemini 3.6 Flash' : 'Offline calculation'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {rows.map((r) => (
              <div
                key={r.label}
                className="bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-3 flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-1.5">
                  <r.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: r.tone }} />
                  <span className="font-label-sm text-[10px] uppercase tracking-wider" style={{ color: r.tone }}>
                    {r.label}
                  </span>
                </div>
                <p className="font-body-sm text-[12.5px] text-[#191c1a] leading-snug">{r.value}</p>
              </div>
            ))}
          </div>

          {errorNote && (
            <p className="font-label-sm text-[10px] text-[#717970] italic">
              Fell back to local calculation: {errorNote}
            </p>
          )}
        </div>
      )}
    </section>
  );
};
