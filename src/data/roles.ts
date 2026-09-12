import { RoleDefinition, UserRole, UserSession } from '../types';

/**
 * Every participant in the farm-gate-to-buyer chain gets a first-class role.
 * The role drives which tabs appear, which actions are permitted, and which
 * side of the market intelligence the user sees.
 */
export const ROLES: RoleDefinition[] = [
  {
    id: 'farmer',
    label: 'Farmer',
    labelHi: 'किसान',
    tagline: 'Sell my harvest at the right price',
    description:
      'Individual smallholder or landholding farmer. Get price trends, sale-window advice, verified buyers and payment protection.',
    icon: 'Sprout',
    accent: '#16532d',
    homeTab: 'home',
    capabilities: [
      'Sale-window recommendation',
      'Mandi price comparison',
      'AI quality grading',
      'Verified buyer matching',
      'Payment tracking',
      'Grievance filing'
    ]
  },
  {
    id: 'fpo',
    label: 'FPO / Producer Group',
    labelHi: 'कृषक उत्पादक संगठन',
    tagline: 'Aggregate volume, negotiate as one',
    description:
      'Farmer Producer Organisation or co-operative. Pool member lots into bulk consignments and unlock volume premiums.',
    icon: 'Users',
    accent: '#003b1b',
    homeTab: 'aggregation',
    capabilities: [
      'Member lot aggregation',
      'Bulk premium negotiation',
      'Consolidated logistics',
      'Split settlement to members',
      'Demand board access'
    ]
  },
  {
    id: 'middleman',
    label: 'Middleman / Trader',
    labelHi: 'व्यापारी / आढतिया',
    tagline: 'Source lots, move volume, book margin',
    description:
      'Commission agent, arhtiya or independent trader. Discover supply, quote transparently and build a verifiable track record.',
    icon: 'Handshake',
    accent: '#904d00',
    homeTab: 'sourcing',
    capabilities: [
      'Live supply board',
      'Transparent quoting',
      'Margin calculator',
      'Trust-score building',
      'Logistics booking'
    ]
  },
  {
    id: 'buyer',
    label: 'Buyer / Processor',
    labelHi: 'खरीदार / प्रसंस्करणकर्ता',
    tagline: 'Source consistent, graded volume',
    description:
      'Corporate processor, exporter, institutional buyer or retailer. Post demand with quality specs and source verified lots.',
    icon: 'Factory',
    accent: '#002b7b',
    homeTab: 'demand',
    capabilities: [
      'Post demand with quality specs',
      'Verified supply sourcing',
      'Aggregation from FPOs',
      'Escrow-backed payment',
      'Quality dispute resolution'
    ]
  },
  {
    id: 'transporter',
    label: 'Transporter',
    labelHi: 'परिवहनकर्ता',
    tagline: 'Fill my truck on the return leg',
    description:
      'Fleet owner or individual vehicle operator. Pick up consignment jobs, quote on routes and coordinate pickup windows.',
    icon: 'Truck',
    accent: '#663500',
    homeTab: 'logistics',
    capabilities: [
      'Open consignment jobs',
      'Route & backhaul matching',
      'Digital proof of pickup',
      'Freight payment tracking'
    ]
  },
  {
    id: 'warehouse',
    label: 'Warehouse / Cold Storage',
    labelHi: 'गोदाम / शीत भंडार',
    tagline: 'Monetise idle storage capacity',
    description:
      'Cold-chain operator or warehousing facility. List available capacity, accept bookings and issue storage receipts.',
    icon: 'Warehouse',
    accent: '#2f6a41',
    homeTab: 'storage',
    capabilities: [
      'Publish live capacity',
      'Accept hold bookings',
      'Issue e-storage receipts',
      'Spoilage monitoring'
    ]
  },
  {
    id: 'officer',
    label: 'Mandi / APMC Officer',
    labelHi: 'मंडी अधिकारी',
    tagline: 'Oversee fair trade and resolve disputes',
    description:
      'APMC official or regulator. Monitor arrivals, price deviation, transaction transparency and mediate grievances.',
    icon: 'ShieldCheck',
    accent: '#003fab',
    homeTab: 'oversight',
    capabilities: [
      'Arrival & congestion monitoring',
      'Price deviation alerts',
      'Grievance mediation',
      'Transaction audit trail'
    ]
  }
];

export const getRole = (id: UserRole): RoleDefinition =>
  ROLES.find((r) => r.id === id) ?? ROLES[0];

/** Demo identities pre-filled on the login screen so the flow is instantly testable. */
export const DEMO_SESSIONS: Record<UserRole, UserSession> = {
  farmer: {
    role: 'farmer',
    displayName: 'Rameshwar Patil',
    organisation: 'Independent smallholder · 2.4 acres',
    phone: '9822041234',
    location: 'Niphad, Nashik, MH',
    verified: true,
    trustScore: 82,
    memberSince: 'Jun 2024'
  },
  fpo: {
    role: 'fpo',
    displayName: 'Sunita Deshmukh',
    organisation: 'Godavari Kisan Producer Co. · 412 members',
    phone: '9970088512',
    location: 'Dindori, Nashik, MH',
    verified: true,
    trustScore: 91,
    memberSince: 'Feb 2023'
  },
  middleman: {
    role: 'middleman',
    displayName: 'Imran Shaikh',
    organisation: 'Shaikh Trading Co. · APMC Licence MH-NSK-4471',
    phone: '9028033907',
    location: 'Pimpalgaon, Nashik, MH',
    verified: true,
    trustScore: 74,
    memberSince: 'Sep 2022'
  },
  buyer: {
    role: 'buyer',
    displayName: 'Priya Nair',
    organisation: 'Sahyadri Foods Pvt Ltd · Procurement',
    phone: '8080012466',
    location: 'Mohadi, Nashik, MH',
    verified: true,
    trustScore: 95,
    memberSince: 'Jan 2022'
  },
  transporter: {
    role: 'transporter',
    displayName: 'Balu Jadhav',
    organisation: 'Jadhav Roadlines · 6 vehicles',
    phone: '9422076318',
    location: 'Nashik Rd, MH',
    verified: true,
    trustScore: 79,
    memberSince: 'Mar 2024'
  },
  warehouse: {
    role: 'warehouse',
    displayName: 'Kiran Pawar',
    organisation: 'Sahyadri Cold Chain · 8,000 Qtl capacity',
    phone: '7798055240',
    location: 'Lasalgaon, Nashik, MH',
    verified: true,
    trustScore: 88,
    memberSince: 'Nov 2023'
  },
  officer: {
    role: 'officer',
    displayName: 'A. R. Kulkarni',
    organisation: 'APMC Pimpalgaon · Market Secretary',
    phone: '9403251180',
    location: 'Pimpalgaon Baswant, MH',
    verified: true,
    trustScore: 100,
    memberSince: 'Apr 2021'
  }
};
