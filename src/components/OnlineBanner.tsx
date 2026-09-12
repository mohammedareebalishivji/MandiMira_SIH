import React from 'react';
import { PlayCircle } from 'lucide-react';
import { Translations } from '../i18n';

interface OnlineBannerProps {
  t: Translations;
  currentScenario: number;
  onSelectScenario: (scenario: number) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

export const OnlineBanner: React.FC<OnlineBannerProps> = ({
  t,
  currentScenario,
  onSelectScenario,
  isOffline,
  onToggleOffline
}) => {
  return (
    <section className="bg-[#e6e9e4] rounded-xl p-3 shadow-xs flex flex-col gap-2.5 border border-[#c0c9be]/50">
      {/* Status Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={onToggleOffline}
          className="flex items-center gap-1.5 cursor-pointer bg-transparent hover:opacity-80 transition-opacity min-w-0"
          title="Click to toggle offline simulation for testing offline persistence"
          id="offlineToggleIndicator"
        >
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            {!isOffline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16532d] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16532d]" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d97706]" />
            )}
          </span>
          <span className="font-label-sm text-[#003b1b] font-bold text-xs truncate">
            {!isOffline ? t.onlineStatus : t.offlineStatus}
          </span>
          <span className="text-[10px] text-[#404941] bg-white/70 px-1.5 py-0.5 rounded border border-[#c0c9be]/50 flex-shrink-0">
            {isOffline ? 'Offline' : 'Simulate'}
          </span>
        </button>
      </div>

      {/* Judge Scenario Switcher */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-[#c0c9be]/40">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-label-sm text-[#404941] flex items-center gap-1 text-xs">
            <PlayCircle className="w-3.5 h-3.5 text-[#003b1b] flex-shrink-0" />
            <span>{t.testScenarios}</span>
          </span>
          <span className="font-label-sm text-[#003b1b] font-bold text-xs truncate" id="activeScenarioLabel">
            {currentScenario === 1
              ? 'Scenario 1 (Onion - Hold)'
              : currentScenario === 2
              ? 'Scenario 2 (Tomato - Sell)'
              : 'Scenario 3 (Potato - Pool)'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onSelectScenario(1)}
            id="scenarioBtn1"
            className={`min-h-[44px] p-1 rounded-lg font-label-sm flex flex-col items-center justify-center text-center leading-tight transition-all cursor-pointer ${
              currentScenario === 1
                ? 'bg-[#16532d] text-white shadow-xs font-bold'
                : 'bg-white text-[#191c1a] shadow-2xs hover:bg-[#f1f4ef] border border-[#c0c9be]/40'
            }`}
          >
            <span className="text-sm">🧅 750kg</span>
            <span className="truncate w-full text-[10px] px-0.5">{t.scenario1}</span>
          </button>

          <button
            onClick={() => onSelectScenario(2)}
            id="scenarioBtn2"
            className={`min-h-[44px] p-1 rounded-lg font-label-sm flex flex-col items-center justify-center text-center leading-tight transition-all cursor-pointer ${
              currentScenario === 2
                ? 'bg-[#16532d] text-white shadow-xs font-bold'
                : 'bg-white text-[#191c1a] shadow-2xs hover:bg-[#f1f4ef] border border-[#c0c9be]/40'
            }`}
          >
            <span className="text-sm">🍅 500kg</span>
            <span className="truncate w-full text-[10px] px-0.5">{t.scenario2}</span>
          </button>

          <button
            onClick={() => onSelectScenario(3)}
            id="scenarioBtn3"
            className={`min-h-[44px] p-1 rounded-lg font-label-sm flex flex-col items-center justify-center text-center leading-tight transition-all cursor-pointer ${
              currentScenario === 3
                ? 'bg-[#16532d] text-white shadow-xs font-bold'
                : 'bg-white text-[#191c1a] shadow-2xs hover:bg-[#f1f4ef] border border-[#c0c9be]/40'
            }`}
          >
            <span className="text-sm">🥔 200kg</span>
            <span className="truncate w-full text-[10px] px-0.5">{t.scenario3}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
