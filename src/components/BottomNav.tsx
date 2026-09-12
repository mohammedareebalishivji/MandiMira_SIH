import React from 'react';
import { Home, TrendingUp, Store, Users, ReceiptText } from 'lucide-react';
import { Translations } from '../i18n';

export type NavTab = 'home' | 'decision' | 'markets' | 'buyers' | 'ledger';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  t: Translations;
  ledgerCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  t,
  ledgerCount = 2
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)] border-t border-[#c0c9be]/30">
      <div className="grid grid-cols-5 h-16 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto items-center px-1 sm:px-4">
        {/* Tab 1: Home */}
        <button
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-all cursor-pointer select-none ${
            activeTab === 'home'
              ? 'text-[#16532d] font-bold'
              : 'text-[#404941] hover:text-[#191c1a]'
          }`}
          id="navTabHome"
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="font-label-sm text-[10px] leading-tight mt-1 truncate max-w-full px-0.5">
            {t.navHome}
          </span>
        </button>

        {/* Tab 2: Decision */}
        <button
          onClick={() => onChangeTab('decision')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-all cursor-pointer select-none ${
            activeTab === 'decision'
              ? 'text-[#16532d] font-bold'
              : 'text-[#404941] hover:text-[#191c1a]'
          }`}
          id="navTabDecision"
        >
          <TrendingUp className={`w-5 h-5 ${activeTab === 'decision' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="font-label-sm text-[10px] leading-tight mt-1 truncate max-w-full px-0.5">
            {t.navDecision}
          </span>
        </button>

        {/* Tab 3: Markets */}
        <button
          onClick={() => onChangeTab('markets')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-all cursor-pointer select-none ${
            activeTab === 'markets'
              ? 'text-[#16532d] font-bold'
              : 'text-[#404941] hover:text-[#191c1a]'
          }`}
          id="navTabMarkets"
        >
          <Store className={`w-5 h-5 ${activeTab === 'markets' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="font-label-sm text-[10px] leading-tight mt-1 truncate max-w-full px-0.5">
            {t.navMarkets}
          </span>
        </button>

        {/* Tab 4: Buyers */}
        <button
          onClick={() => onChangeTab('buyers')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-all cursor-pointer select-none ${
            activeTab === 'buyers'
              ? 'text-[#16532d] font-bold'
              : 'text-[#404941] hover:text-[#191c1a]'
          }`}
          id="navTabBuyers"
        >
          <Users className={`w-5 h-5 ${activeTab === 'buyers' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="font-label-sm text-[10px] leading-tight mt-1 truncate max-w-full px-0.5">
            {t.navBuyers}
          </span>
        </button>

        {/* Tab 5: Ledger / Sales */}
        <button
          onClick={() => onChangeTab('ledger')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] transition-all cursor-pointer select-none ${
            activeTab === 'ledger'
              ? 'text-[#16532d] font-bold'
              : 'text-[#404941] hover:text-[#191c1a]'
          }`}
          id="navTabLedger"
        >
          <div className="relative">
            <ReceiptText className={`w-5 h-5 ${activeTab === 'ledger' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {ledgerCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#fe932c] text-[#2f1500] text-[8px] font-bold flex items-center justify-center shadow-xs">
                {ledgerCount}
              </span>
            )}
          </div>
          <span className="font-label-sm text-[10px] leading-tight mt-1 truncate max-w-full px-0.5">
            {t.navLedger}
          </span>
        </button>
      </div>
    </nav>
  );
};
