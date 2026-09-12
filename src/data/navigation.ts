import { UserRole } from '../types';

export type TabId =
  | 'home'
  | 'decision'
  | 'markets'
  | 'arrivals'
  | 'quality'
  | 'logistics'
  | 'buyers'
  | 'demand'
  | 'sourcing'
  | 'payments'
  | 'grievance'
  | 'trust'
  | 'ledger'
  | 'impact'
  | 'pricedata'
  | 'more';

export interface TabDefinition {
  id: TabId;
  label: string;
  /** lucide icon name, resolved in the nav component */
  icon: string;
  blurb: string;
}

export const TABS: Record<TabId, TabDefinition> = {
  home:      { id: 'home',      label: 'Home',      icon: 'Home',            blurb: 'Your lot, today’s call and the market at a glance' },
  decision:  { id: 'decision',  label: 'Decision',  icon: 'TrendingUp',      blurb: 'Sell now or hold — and what it is worth either way' },
  markets:   { id: 'markets',   label: 'Markets',   icon: 'Store',           blurb: 'Net-of-transport realisation across every reachable mandi' },
  arrivals:  { id: 'arrivals',  label: 'Arrivals',  icon: 'BarChart3',       blurb: 'Volume on the yard today vs the 7-day average' },
  quality:   { id: 'quality',   label: 'Quality',   icon: 'ScanLine',        blurb: 'Grade your lot against the buyer’s written specification' },
  logistics: { id: 'logistics', label: 'Logistics', icon: 'Truck',           blurb: 'Transport quotes and storage economics for this lot' },
  buyers:    { id: 'buyers',    label: 'Buyers',    icon: 'Users',           blurb: 'Verified direct buyers and the live aggregation pool' },
  demand:    { id: 'demand',    label: 'Demand',    icon: 'Factory',         blurb: 'Open buyer orders with quality specs attached' },
  sourcing:  { id: 'sourcing',  label: 'Sourcing',  icon: 'Boxes',           blurb: 'Live supply board with transparent spread economics' },
  payments:  { id: 'payments',  label: 'Payments',  icon: 'BadgeIndianRupee', blurb: 'Milestone-by-milestone tracking of every rupee owed' },
  grievance: { id: 'grievance', label: 'Disputes',  icon: 'Scale',           blurb: 'File and follow disputes on a 72-hour SLA' },
  trust:     { id: 'trust',     label: 'Trust',     icon: 'ShieldCheck',     blurb: 'Verification status and payment record of every counterparty' },
  ledger:    { id: 'ledger',    label: 'Ledger',    icon: 'ReceiptText',     blurb: 'Settled transactions and bank references' },
  impact:    { id: 'impact',    label: 'Outcomes',  icon: 'Target',          blurb: 'What the platform has actually changed, against baseline' },
  pricedata: { id: 'pricedata', label: 'Price Data', icon: 'Database',       blurb: 'Observed mandi quotes behind the numbers, and their limits' },
  more:      { id: 'more',      label: 'More',      icon: 'LayoutGrid',      blurb: 'Everything else available to your role' }
};

/** Four primary tabs per role plus "More"; the rest live behind the More grid. */
export const ROLE_NAV: Record<UserRole, { primary: TabId[]; secondary: TabId[] }> = {
  farmer: {
    primary: ['home', 'decision', 'markets', 'buyers'],
    secondary: ['quality', 'arrivals', 'logistics', 'payments', 'grievance', 'trust', 'ledger', 'impact', 'pricedata']
  },
  fpo: {
    primary: ['home', 'demand', 'markets', 'payments'],
    secondary: ['sourcing', 'quality', 'arrivals', 'logistics', 'buyers', 'grievance', 'trust', 'ledger', 'impact', 'pricedata']
  },
  middleman: {
    primary: ['sourcing', 'markets', 'demand', 'payments'],
    secondary: ['arrivals', 'logistics', 'quality', 'grievance', 'trust', 'ledger', 'impact', 'pricedata']
  },
  buyer: {
    primary: ['demand', 'sourcing', 'quality', 'payments'],
    secondary: ['markets', 'arrivals', 'logistics', 'grievance', 'trust', 'ledger', 'impact', 'pricedata']
  },
  transporter: {
    primary: ['logistics', 'sourcing', 'payments', 'trust'],
    secondary: ['markets', 'arrivals', 'demand', 'grievance', 'impact', 'pricedata']
  },
  warehouse: {
    primary: ['logistics', 'sourcing', 'payments', 'trust'],
    secondary: ['markets', 'arrivals', 'demand', 'grievance', 'impact', 'pricedata']
  },
  officer: {
    primary: ['markets', 'arrivals', 'grievance', 'trust'],
    secondary: ['sourcing', 'demand', 'payments', 'logistics', 'quality', 'ledger', 'impact', 'pricedata']
  }
};

export const allTabsFor = (role: UserRole): TabId[] => {
  const nav = ROLE_NAV[role];
  return [...nav.primary, ...nav.secondary];
};
