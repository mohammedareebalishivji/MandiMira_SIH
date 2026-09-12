import React from 'react';
import {
  BrainCircuit,
  TrendingUp,
  AlertCircle,
  Users,
  HelpCircle,
  ArrowLeftRight,
  Sun,
  Warehouse,
  AlertTriangle,
  Info
} from 'lucide-react';
import { DecisionResult, FarmerLot } from '../types';
import { Translations } from '../i18n';

interface HeroDecisionCardProps {
  decision: DecisionResult;
  lot: FarmerLot;
  t: Translations;
  onWhyClick: () => void;
  onCompareClick: () => void;
}

function RenderFactorIcon({ iconName }: { iconName: string }) {
  switch (iconName) {
    case 'trending_up':
      return <TrendingUp className="w-4 h-4 text-[#b2f1be] flex-shrink-0" />;
    case 'wb_sunny':
      return <Sun className="w-4 h-4 text-[#b2f1be] flex-shrink-0" />;
    case 'warehouse':
      return <Warehouse className="w-4 h-4 text-[#b2f1be] flex-shrink-0" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-[#b2f1be] flex-shrink-0" />;
    default:
      return <Info className="w-4 h-4 text-[#b2f1be] flex-shrink-0" />;
  }
}

export const HeroDecisionCard: React.FC<HeroDecisionCardProps> = ({
  decision,
  lot,
  t,
  onWhyClick,
  onCompareClick
}) => {
  const isHold = decision.action === 'HOLD';
  const isSellNow = decision.action === 'SELL_NOW';

  return (
    <section
      id="heroDecisionCard"
      className="relative overflow-hidden bg-[#003b1b] rounded-2xl p-4 text-white shadow-md flex flex-col gap-3"
    >
      {/* Subtle accent glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#97d5a3]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Tag & Confidence */}
      <div className="flex items-center justify-between gap-2 relative z-10 flex-wrap">
        <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full backdrop-blur-xs min-w-0">
          <BrainCircuit className="w-4 h-4 text-[#b2f1be] flex-shrink-0" />
          <span className="font-label-sm text-[#b2f1be] uppercase tracking-wider font-bold truncate text-[11px]">
            {t.sellingDecision}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full flex-shrink-0">
          <span className="font-label-sm text-[#b2f1be] text-xs">{t.confidence}:</span>
          <span className="font-label-sm text-white font-bold text-xs" id="decisionConfidence">
            {decision.confidencePercent}%
          </span>
        </div>
      </div>

      {/* Action Title & Gain Subtitle */}
      <div className="flex flex-col relative z-10 pt-1">
        <div className="flex items-baseline gap-2">
          <h2
            className="font-display-lg-mobile font-black tracking-tight text-[#b2f1be] leading-tight text-2xl sm:text-3xl"
            id="decisionActionText"
          >
            {decision.headlineTitle}
          </h2>
        </div>
        <p
          className="font-headline-sm font-bold text-[#ffdcc3] mt-1 text-sm sm:text-base leading-snug"
          id="decisionGainText"
        >
          {decision.headlineGain}
        </p>
      </div>

      {/* Math Comparison Box */}
      <div className="bg-[#16532d]/80 rounded-xl p-3 flex items-center justify-between gap-2 relative z-10 border border-[#88c695]/30">
        <div className="flex flex-col min-w-0">
          <span className="font-label-sm text-[#97d5a3] text-[11px] truncate">{t.sellTodayNet}</span>
          <span className="font-metric-lg text-white font-bold text-lg leading-tight" id="mathSellToday">
            ₹{decision.sellTodayNet.toLocaleString()}
          </span>
          <span className="font-label-sm text-[#97d5a3] text-[10px] truncate">
            ₹{lot.localMandiBenchmark.toLocaleString()}/qtl {t.spotPrice}
          </span>
        </div>

        <div className="flex items-center text-[#ffdcc3] px-1 flex-shrink-0">
          {isHold ? (
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          ) : isSellNow ? (
            <AlertCircle className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <Users className="w-6 h-6 stroke-[2.5]" />
          )}
        </div>

        <div className="flex flex-col text-right min-w-0">
          <span className="font-label-sm text-[#ffdcc3] text-[11px] truncate">
            {isHold
              ? `At Day ${decision.holdDays} Net`
              : isSellNow
              ? 'Delaying Past 3d'
              : 'With Pool Bonus'}
          </span>
          <span className="font-metric-lg text-[#ffdcc3] font-bold text-lg leading-tight" id="mathProjected">
            ₹{decision.projectedNet.toLocaleString()}
          </span>
          <span className="font-label-sm text-[#b2f1be] font-bold text-[10px] truncate" id="mathDifference">
            {isHold
              ? `+₹${decision.netGain.toLocaleString()} ${t.mathDifferenceGain}`
              : isSellNow
              ? `-₹${Math.abs(decision.netGain).toLocaleString()} loss if held`
              : `+₹${decision.netGain.toLocaleString()} pool gain`}
          </span>
        </div>
      </div>

      {/* 4 Key Factor Badges Grid */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        {decision.factors.map((factor) => (
          <div
            key={factor.id}
            className="bg-[#16532d]/50 rounded-lg p-2 flex items-start gap-1.5 border border-[#88c695]/20 min-w-0"
          >
            <div className="mt-0.5">
              <RenderFactorIcon iconName={factor.icon} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-sm text-[#97d5a3] leading-none truncate text-[10px]">
                {factor.label}
              </span>
              <span className="font-body-sm text-white font-bold leading-tight mt-1 truncate text-xs">
                {factor.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick CTAs inside Hero */}
      <div className="grid grid-cols-2 gap-2 pt-1 relative z-10">
        <button
          onClick={onWhyClick}
          className="min-h-[44px] rounded-lg bg-white text-[#003b1b] font-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all cursor-pointer px-2 text-xs"
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{t.whyThis}</span>
        </button>
        <button
          onClick={onCompareClick}
          className="min-h-[44px] rounded-lg bg-[#fe932c] text-[#2f1500] font-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all cursor-pointer px-2 text-xs"
        >
          <ArrowLeftRight className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{t.compareMandis}</span>
        </button>
      </div>
    </section>
  );
};
