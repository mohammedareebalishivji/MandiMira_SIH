import React from 'react';
import {
  Home, TrendingUp, Store, BarChart3, ScanLine, Truck, Users, Factory, Boxes,
  BadgeIndianRupee, Scale, ShieldCheck, ReceiptText, Target, LayoutGrid, Database, LucideIcon
} from 'lucide-react';
import { TABS, TabId, ROLE_NAV } from '../data/navigation';
import { UserRole } from '../types';

export const NAV_ICONS: Record<string, LucideIcon> = {
  Home, TrendingUp, Store, BarChart3, ScanLine, Truck, Users, Factory, Boxes,
  BadgeIndianRupee, Scale, ShieldCheck, ReceiptText, Target, LayoutGrid, Database
};

interface Props {
  role: UserRole;
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  ledgerCount: number;
  openDisputeCount: number;
}

/**
 * Role-aware bottom navigation. Four primary destinations plus a "More" grid,
 * because the tab set differs per role but the thumb reach does not.
 */
export const RoleNav: React.FC<Props> = ({
  role,
  activeTab,
  onChangeTab,
  ledgerCount,
  openDisputeCount
}) => {
  const { primary, secondary } = ROLE_NAV[role];
  const items: TabId[] = [...primary, 'more'];
  const moreIsActive = activeTab === 'more' || secondary.includes(activeTab);

  const badgeFor = (id: TabId): number => {
    if (id === 'ledger') return ledgerCount;
    if (id === 'grievance') return openDisputeCount;
    return 0;
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)] border-t border-[#c0c9be]/30">
      <div
        className="grid h-16 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto items-center px-1 sm:px-4"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((id) => {
          const tab = TABS[id];
          const Icon = NAV_ICONS[tab.icon] ?? Home;
          const isActive = id === 'more' ? moreIsActive : activeTab === id;
          const badge = badgeFor(id);

          return (
            <button
              key={id}
              onClick={() => onChangeTab(id)}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-all cursor-pointer select-none ${
                isActive ? 'text-[#16532d] font-bold' : 'text-[#404941] hover:text-[#191c1a]'
              }`}
              id={`navTab-${id}`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#fe932c] text-[#2f1500] text-[8px] font-bold flex items-center justify-center shadow-xs">
                    {badge}
                  </span>
                )}
              </div>
              <span className="font-label-sm text-[10px] leading-tight mt-1 truncate max-w-full px-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

/** The "More" destination — a labelled grid of everything else this role can reach. */
export const MoreGrid: React.FC<{
  role: UserRole;
  onChangeTab: (tab: TabId) => void;
}> = ({ role, onChangeTab }) => {
  const { secondary } = ROLE_NAV[role];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {secondary.map((id) => {
        const tab = TABS[id];
        const Icon = NAV_ICONS[tab.icon] ?? Home;
        return (
          <button
            key={id}
            onClick={() => onChangeTab(id)}
            className="group text-left bg-white rounded-2xl border border-[#c0c9be]/60 p-3.5 flex items-start gap-3 hover:border-[#16532d] hover:shadow-[0_4px_16px_rgba(0,59,27,0.07)] active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#f1f4ef] flex items-center justify-center flex-shrink-0 group-hover:bg-[#b2f1be] transition-colors">
              <Icon className="w-5 h-5 text-[#16532d]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm font-bold text-[#191c1a] text-[14px]">{tab.label}</span>
              <span className="font-body-sm text-[12px] text-[#404941] leading-snug">{tab.blurb}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
