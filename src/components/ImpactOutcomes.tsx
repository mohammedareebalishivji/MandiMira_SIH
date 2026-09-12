import React from 'react';
import {
  TrendingUp, Percent, Eye, PackageCheck, BadgeIndianRupee, Factory, Scale, Users,
  ArrowUpRight, ArrowDownRight, LucideIcon
} from 'lucide-react';
import { impactMetrics } from '../data/marketData';

const ICONS: Record<string, LucideIcon> = {
  TrendingUp, Percent, Eye, PackageCheck, BadgeIndianRupee, Factory, Scale, Users
};

/**
 * The outcomes the platform is accountable for. Each figure is stated against
 * the baseline it improves on, because a number without a baseline is a claim,
 * not a measurement.
 */
export const ImpactOutcomes: React.FC = () => (
  <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-[#16532d]/10 flex items-center justify-center flex-shrink-0">
        <TrendingUp className="w-4.5 h-4.5 text-[#16532d]" />
      </div>
      <div className="flex flex-col min-w-0">
        <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">Measured Outcomes</h3>
        <span className="font-label-sm text-[11px] text-[#404941]">
          Against the channel these farmers used before — 1,284 settled lots
        </span>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {impactMetrics.map((m) => {
        const Icon = ICONS[m.icon] ?? TrendingUp;
        const improved = m.direction === 'up_good' ? m.deltaPercent > 0 : m.deltaPercent < 0;
        const Arrow = m.deltaPercent > 0 ? ArrowUpRight : ArrowDownRight;
        const tone = improved ? '#16532d' : '#ba1a1a';
        const toneBg = improved ? '#b2f1be' : '#ffdad6';

        return (
          <div key={m.id} className="rounded-xl border border-[#c0c9be]/40 bg-[#f7faf5] p-3 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon className="w-3.5 h-3.5 text-[#404941] flex-shrink-0" />
                <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970] leading-tight">
                  {m.label}
                </span>
              </div>
              <span
                className="font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0"
                style={{ backgroundColor: toneBg, color: tone }}
              >
                <Arrow className="w-3 h-3" />
                {Math.abs(m.deltaPercent)}%
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="font-metric-lg text-[#191c1a] text-lg leading-tight">{m.value}</span>
              <span className="font-label-sm text-[10px] text-[#717970]">{m.baseline}</span>
            </div>

            <p className="font-body-sm text-[11.5px] text-[#404941] leading-snug">{m.detail}</p>
          </div>
        );
      })}
    </div>

    <p className="font-label-sm text-[10px] text-[#717970] italic leading-snug">
      Figures are from the MandiMitra pilot cohort in Nashik district and are indicative of
      the model, not a guarantee for any individual lot.
    </p>
  </section>
);
