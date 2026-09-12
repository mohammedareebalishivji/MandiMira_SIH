import React, { useState } from 'react';
import {
  SlidersHorizontal,
  CheckCircle2,
  Info,
  Warehouse,
  AlertTriangle,
  CloudRain,
  Banknote
} from 'lucide-react';
import { DecisionResult, FarmerLot, SimDay } from '../types';
import { Translations } from '../i18n';

interface WhatIfSimulatorProps {
  decision: DecisionResult;
  lot: FarmerLot;
  t: Translations;
  onUpdateLotFactors: (updates: Partial<FarmerLot>) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  decision,
  lot,
  t,
  onUpdateLotFactors
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(
    decision.action === 'HOLD' ? decision.holdDays : 0
  );

  const activeSimDay: SimDay =
    decision.simDays.find((d) => d.day === selectedDay) ||
    decision.simDays[0] || {
      day: 0,
      label: '0d',
      projectedRate: lot.localMandiBenchmark,
      grossVal: (lot.quantityKg / 100) * lot.localMandiBenchmark,
      spoilageLossKg: 0,
      storageCost: 0,
      transportCost: (lot.quantityKg / 100) * 90,
      netRealization: decision.sellTodayNet,
      explanation: 'Immediate dispatch.'
    };

  const peakDay = decision.simDays.find((d) => d.isPeak)?.day ?? 4;
  const keyDays = [0, 2, 4, 7, 10];

  return (
    <section className="bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-3 border border-[#c0c9be]/40">
      {/* Title Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-headline-sm text-[#191c1a] font-bold text-base">
            {t.whatIfTitle}
          </h3>
          <p className="font-body-sm text-[#404941] text-xs">
            {t.whatIfSubtitle}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#ecefea] flex items-center justify-center text-[#003b1b] flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
        </div>
      </div>

      {/* Timeline Labels */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between text-[#404941] font-label-sm text-[11px]">
          <span>Day 0 (Now)</span>
          <span>Day 2</span>
          <span className="text-[#003b1b] font-bold flex items-center gap-0.5">
            ⭐ Day {peakDay} ({decision.action === 'HOLD' ? 'Peak' : 'Best'})
          </span>
          <span>Day 7</span>
          <span>Day 10</span>
        </div>

        {/* Quick Pill Buttons */}
        <div className="grid grid-cols-5 gap-1">
          {keyDays.map((d) => {
            const dayData = decision.simDays.find((item) => item.day === d);
            const netVal = dayData ? `₹${(dayData.netRealization / 1000).toFixed(1)}k` : '';
            const isSelected = selectedDay === d;
            const isTargetPeak = d === peakDay && decision.action === 'HOLD';

            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                id={`simDay${d}`}
                className={`min-h-[44px] rounded-lg font-label-sm p-1 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#16532d] text-white shadow-xs font-bold scale-[1.02]'
                    : isTargetPeak
                    ? 'bg-[#b2f1be] text-[#00210c] font-bold border border-[#16532d]/40'
                    : 'bg-[#ecefea] text-[#191c1a] hover:bg-[#e0e3df]'
                }`}
              >
                <span className="font-bold text-xs truncate">
                  {isTargetPeak ? `⭐ ${d}d` : `${d}d`}
                </span>
                <span className="text-[10px] font-metric-lg truncate">{netVal}</span>
              </button>
            );
          })}
        </div>

        {/* Continuous 0-14 Day Slider */}
        <div className="flex flex-col gap-1 pt-1 bg-[#f1f4ef] p-2.5 rounded-lg border border-[#c0c9be]/30">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#404941] flex-wrap gap-1">
            <span>Projection: <strong>Day {selectedDay}</strong></span>
            <span className="text-[#003b1b] truncate">
              Spot: ₹{activeSimDay.projectedRate}/qtl • Net: ₹{activeSimDay.netRealization.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="14"
            step="1"
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="w-full accent-[#16532d] cursor-pointer h-2 bg-[#e0e3df] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-[#717970] px-0.5">
            <span>0d</span>
            <span>2d</span>
            <span>4d (Peak)</span>
            <span>7d</span>
            <span>10d</span>
            <span>14d</span>
          </div>
        </div>

        {/* Dynamic Explanation of Selected Day */}
        <div
          id="simDetailBox"
          className="bg-[#f1f4ef] rounded-lg p-3 flex items-start gap-2.5 border border-[#c0c9be]/40"
        >
          <div className="flex-shrink-0 mt-0.5">
            {selectedDay === peakDay ? (
              <CheckCircle2 className="w-5 h-5 text-[#16532d]" />
            ) : (
              <Info className="w-5 h-5 text-[#16532d]" />
            )}
          </div>
          <div className="flex flex-col text-[#191c1a] min-w-0 flex-1">
            <span
              className="font-label-md font-bold text-[#003b1b] text-xs"
              id="simDetailTitle"
            >
              Day {selectedDay}: Net ₹{activeSimDay.netRealization.toLocaleString()}{' '}
              {selectedDay === 0
                ? '(Immediate Sale)'
                : selectedDay === peakDay
                ? `(+₹${(activeSimDay.netRealization - decision.sellTodayNet).toLocaleString()} Peak Gain)`
                : activeSimDay.netRealization >= decision.sellTodayNet
                ? `(+₹${(activeSimDay.netRealization - decision.sellTodayNet).toLocaleString()} vs Day 0)`
                : `(-₹${Math.abs(decision.sellTodayNet - activeSimDay.netRealization).toLocaleString()} Decay Loss)`}
            </span>
            <p
              className="font-body-sm text-[#404941] mt-0.5 text-xs leading-relaxed"
              id="simDetailDesc"
            >
              {activeSimDay.explanation}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#404941] pt-1.5 mt-1 border-t border-[#c0c9be]/30">
              <span>Gross: <strong>₹{activeSimDay.grossVal.toLocaleString()}</strong></span>
              <span>• Spoilage loss: <strong className="text-[#ba1a1a]">{activeSimDay.spoilageLossKg} kg</strong></span>
              <span>• Storage: <strong>₹{activeSimDay.storageCost}</strong></span>
              <span>• Transport: <strong>₹{activeSimDay.transportCost}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Sensitivity Toggles for Judges & Farmers */}
      <div className="flex flex-col gap-1.5 pt-1">
        <span className="font-label-sm text-[#404941] font-bold uppercase tracking-wider text-[11px]">
          {t.testVariables}
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {/* Storage Toggle */}
          <button
            onClick={() =>
              onUpdateLotFactors({ storageAvailable: !lot.storageAvailable })
            }
            id="toggleStorage"
            className={`min-h-[40px] px-1.5 rounded-lg font-label-sm flex items-center justify-center text-center gap-1 active:scale-95 transition-all cursor-pointer border text-xs ${
              lot.storageAvailable
                ? 'bg-[#b2f1be] text-[#00210c] border-[#16532d]'
                : 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]'
            }`}
          >
            {lot.storageAvailable ? (
              <Warehouse className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            <span id="toggleStorageText" className="truncate">
              Storage: {lot.storageAvailable ? 'Yes' : 'None'}
            </span>
          </button>

          {/* Rain Alert Toggle */}
          <button
            onClick={() => onUpdateLotFactors({ hasRainAlert: !lot.hasRainAlert })}
            id="toggleRain"
            className={`min-h-[40px] px-1.5 rounded-lg font-label-sm flex items-center justify-center text-center gap-1 active:scale-95 transition-all cursor-pointer border text-xs ${
              lot.hasRainAlert
                ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]'
                : 'bg-[#ecefea] text-[#191c1a] border-[#c0c9be]/40'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-[#904d00] flex-shrink-0" />
            <span id="toggleRainText" className="truncate">
              Rain: {lot.hasRainAlert ? 'Alert ⛈️' : 'None'}
            </span>
          </button>

          {/* Cash Urgency Toggle */}
          <button
            onClick={() =>
              onUpdateLotFactors({
                cashUrgency: lot.cashUrgency === 'urgent' ? 'can_wait' : 'urgent'
              })
            }
            id="toggleCash"
            className={`min-h-[40px] px-1.5 rounded-lg font-label-sm flex items-center justify-center text-center gap-1 active:scale-95 transition-all cursor-pointer border text-xs ${
              lot.cashUrgency === 'urgent'
                ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]'
                : 'bg-[#ecefea] text-[#191c1a] border-[#c0c9be]/40'
            }`}
          >
            <Banknote className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />
            <span id="toggleCashText" className="truncate">
              Cash: {lot.cashUrgency === 'urgent' ? 'Urgent!' : 'Can Wait'}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
