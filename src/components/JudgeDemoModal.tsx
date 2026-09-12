import React from 'react';
import { Award, X, Calculator } from 'lucide-react';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: number) => void;
  currentScenario: number;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
  currentScenario
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-2xl border border-[#c0c9be]/50 flex flex-col gap-3.5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c0c9be]/40 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#fe932c] text-[#2f1500] flex items-center justify-center font-bold flex-shrink-0">
              <Award className="w-5 h-5 text-[#2f1500]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-headline-sm font-bold text-[#191c1a] text-base truncate">
                SIH Judge Walkthrough &amp; Architecture
              </h3>
              <p className="font-label-sm text-[#404941] text-xs">MandiMitra Decision Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Executive Pitch Summary */}
        <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#16532d]/20 text-xs text-[#191c1a] flex flex-col gap-1.5">
          <div className="font-bold text-[#003b1b] text-sm">
            Core Promise: &ldquo;Don&apos;t just know today&apos;s price. Know when, where and how to sell.&rdquo;
          </div>
          <p className="text-[#404941] leading-relaxed">
            Smallholder farmers lose 15-25% of their crop value to premature distress sales, deceptive headline mandi prices, and transit spoilage. MandiMitra turns raw market data into an actionable algorithmic selling decision.
          </p>
        </div>

        {/* 3 Real Scenarios */}
        <div className="flex flex-col gap-2">
          <span className="font-label-sm font-bold text-[#191c1a] uppercase tracking-wider text-[11px]">
            Quick-Test Real Farmer Scenarios:
          </span>

          {/* Scenario 1 */}
          <div
            onClick={() => {
              onSelectScenario(1);
              onClose();
            }}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              currentScenario === 1
                ? 'border-[#16532d] bg-[#b2f1be]/30 shadow-xs'
                : 'border-[#c0c9be]/40 bg-[#f1f4ef] hover:bg-[#e0e3df]'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs text-[#003b1b] truncate">🧅 Scenario 1: Onion Farmer (Nashik)</span>
              <span className="text-[10px] bg-[#16532d] text-white px-2 py-0.5 rounded font-bold flex-shrink-0">
                HOLD 4 DAYS
              </span>
            </div>
            <p className="text-[11px] text-[#404941] mt-1 leading-normal">
              750 kg onion with Kanda Chawl. Model detects supply deficit &amp; projects +₹3,800 net gain on Day 4.
            </p>
          </div>

          {/* Scenario 2 */}
          <div
            onClick={() => {
              onSelectScenario(2);
              onClose();
            }}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              currentScenario === 2
                ? 'border-[#16532d] bg-[#b2f1be]/30 shadow-xs'
                : 'border-[#c0c9be]/40 bg-[#f1f4ef] hover:bg-[#e0e3df]'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs text-[#ba1a1a] truncate">🍅 Scenario 2: Perishable Tomato (Glut)</span>
              <span className="text-[10px] bg-[#ba1a1a] text-white px-2 py-0.5 rounded font-bold flex-shrink-0">
                SELL NOW
              </span>
            </div>
            <p className="text-[11px] text-[#404941] mt-1 leading-normal">
              500 kg tomato, no cold chain, 34°C heatwave. Model overrides speculation to prevent ₹2,100 spoilage loss.
            </p>
          </div>

          {/* Scenario 3 */}
          <div
            onClick={() => {
              onSelectScenario(3);
              onClose();
            }}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
              currentScenario === 3
                ? 'border-[#16532d] bg-[#b2f1be]/30 shadow-xs'
                : 'border-[#c0c9be]/40 bg-[#f1f4ef] hover:bg-[#e0e3df]'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold text-xs text-[#904d00] truncate">🥔 Scenario 3: Small Farmer Aggregation</span>
              <span className="text-[10px] bg-[#fe932c] text-[#2f1500] px-2 py-0.5 rounded font-bold flex-shrink-0">
                JOIN POOL
              </span>
            </div>
            <p className="text-[11px] text-[#404941] mt-1 leading-normal">
              180 kg potato. High freight penalty alone; aggregates with Niphad pool for corporate bulk bonus (+₹1,960).
            </p>
          </div>
        </div>

        {/* Mathematical Engine & Safeguards */}
        <div className="bg-[#f1f4ef] rounded-xl p-3 border border-[#c0c9be]/40 text-xs flex flex-col gap-1.5">
          <div className="font-bold text-[#191c1a] flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-[#16532d]" />
            <span>Objective Function Formula:</span>
          </div>
          <code className="bg-white p-2 rounded border border-[#c0c9be]/30 font-mono text-[11px] block overflow-x-auto text-[#003b1b]">
            Max_t [ P(t) × Q × (1 - Spoilage(t)) - C_transport - C_storage(t) ]
          </code>
          <p className="text-[#404941] text-[11px] leading-normal">
            Unlike raw price aggregators, MandiMitra factors in moisture shrinkage, diesel freight, and APMC cess to calculate true in-hand cash realization.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full min-h-[44px] rounded-lg bg-[#16532d] text-white font-bold text-xs cursor-pointer hover:bg-[#003b1b]"
        >
          Return to Live Application
        </button>
      </div>
    </div>
  );
};
