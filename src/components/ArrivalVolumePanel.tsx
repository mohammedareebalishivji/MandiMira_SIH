import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { arrivalRecords } from '../data/marketData';

const CONGESTION: Record<string, { bg: string; fg: string }> = {
  Low: { bg: '#b2f1be', fg: '#00210c' },
  Moderate: { bg: '#ffdcc3', fg: '#663500' },
  Heavy: { bg: '#ffdad6', fg: '#93000a' }
};

/**
 * Solution #4 — Arrival volumes.
 * Arrivals move the rate before the rate board does. Showing today against
 * the 7-day average is the earliest signal a farmer can act on.
 */
export const ArrivalVolumePanel: React.FC = () => {
  const maxQtl = Math.max(...arrivalRecords.map((a) => Math.max(a.todayQtl, a.sevenDayAvgQtl)));

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#904d00]/10 flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-4.5 h-4.5 text-[#904d00]" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">Today’s Arrivals</h3>
          <span className="font-label-sm text-[11px] text-[#404941]">
            Volume on the yard vs the 7-day average — the rate follows this
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {arrivalRecords.map((a) => {
          const c = CONGESTION[a.congestion];
          const up = a.changePercent > 2;
          const down = a.changePercent < -2;
          const Trend = up ? TrendingUp : down ? TrendingDown : Minus;
          // Heavy arrivals push prices down, so "up" is bad news for the seller.
          const trendColor = up ? '#ba1a1a' : down ? '#16532d' : '#717970';

          return (
            <div key={a.mandiId} className="rounded-xl border border-[#c0c9be]/40 bg-[#f7faf5] p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-[13px] text-[#191c1a] truncate">{a.mandiName}</span>
                  <span className="font-mono text-[11px] text-[#404941]">
                    {a.todayQtl.toLocaleString('en-IN')} Qtl today · 7-day avg {a.sevenDayAvgQtl.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className="font-label-sm text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ backgroundColor: c.bg, color: c.fg }}
                  >
                    {a.congestion}
                  </span>
                  <span className="font-mono text-[12px] font-bold flex items-center gap-0.5" style={{ color: trendColor }}>
                    <Trend className="w-3.5 h-3.5" />
                    {a.changePercent > 0 ? '+' : ''}{a.changePercent}%
                  </span>
                </div>
              </div>

              {/* Today vs average, as two stacked bars */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-wider text-[#717970] w-12 flex-shrink-0">Today</span>
                  <div className="flex-1 h-2.5 rounded-full bg-[#e0e3df] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(a.todayQtl / maxQtl) * 100}%`, backgroundColor: '#16532d' }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-[9px] uppercase tracking-wider text-[#717970] w-12 flex-shrink-0">7-d avg</span>
                  <div className="flex-1 h-2.5 rounded-full bg-[#e0e3df] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(a.sevenDayAvgQtl / maxQtl) * 100}%`, backgroundColor: '#c0c9be' }}
                    />
                  </div>
                </div>
              </div>

              <p className="font-body-sm text-[11.5px] text-[#404941] leading-snug">{a.priceImpactNote}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
