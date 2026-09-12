import { cropBenchmark } from './priceModel';
import {
  ArrivalRecord,
  CropType,
  BuyerDemand,
  Grievance,
  ImpactMetric,
  PaymentTrackRecord,
  StorageOption,
  SupplyLot,
  TransportOption,
  VerificationProfile
} from '../types';

/* ---------------------------------------------------------
 * 4. ARRIVAL VOLUMES — the single biggest driver of same-day
 *    price movement, and the thing farmers can least see.
 * ------------------------------------------------------- */
export const arrivalRecords: ArrivalRecord[] = [
  {
    mandiId: 'pimpalgaon',
    mandiName: 'Pimpalgaon Mandi',
    todayQtl: 4200,
    yesterdayQtl: 5100,
    sevenDayAvgQtl: 4850,
    changePercent: -17.6,
    congestion: 'Moderate',
    priceImpactNote: 'Arrivals down 18% — sellers hold pricing power today. Rates firming.'
  },
  {
    mandiId: 'lasalgaon',
    mandiName: 'Lasalgaon APMC',
    todayQtl: 11400,
    yesterdayQtl: 8900,
    sevenDayAvgQtl: 9100,
    changePercent: 28.1,
    congestion: 'Heavy',
    priceImpactNote: 'Glut forming. 11.4k Qtl on the yard — expect 3-5% softening by afternoon session.'
  },
  {
    mandiId: 'vashi',
    mandiName: 'Vashi APMC (Mumbai)',
    todayQtl: 18200,
    yesterdayQtl: 17600,
    sevenDayAvgQtl: 17900,
    changePercent: 3.4,
    congestion: 'Heavy',
    priceImpactNote: 'Stable heavy volume. Good liquidity but 6-8 hr unloading queue.'
  },
  {
    mandiId: 'dindori',
    mandiName: 'Dindori Sub-Market',
    todayQtl: 2100,
    yesterdayQtl: 2450,
    sevenDayAvgQtl: 2300,
    changePercent: -14.3,
    congestion: 'Low',
    priceImpactNote: 'Thin arrivals, quick turnaround. Lower headline rate but zero queue time.'
  }
];

/* ---------------------------------------------------------
 * 5a. TRANSPORT OPTIONS
 * ------------------------------------------------------- */
export const transportOptions: TransportOption[] = [
  {
    id: 'tr-jadhav',
    provider: 'Jadhav Roadlines',
    vehicle: 'Tata 407 · Open body',
    capacityKg: 2500,
    costPerKm: 24,
    fixedCost: 350,
    availability: 'Today, 4:00 AM pickup',
    rating: 4.6,
    verified: true,
    coldChain: false,
    notes: 'Returning empty from Pimpalgaon — backhaul discount applied.'
  },
  {
    id: 'tr-shared',
    provider: 'MandiMitra Shared Trip',
    vehicle: 'Eicher 1109 · Shared with 3 farmers',
    capacityKg: 6000,
    costPerKm: 9,
    fixedCost: 180,
    availability: 'Tomorrow, 5:30 AM · 2 slots left',
    rating: 4.3,
    verified: true,
    coldChain: false,
    notes: 'Cheapest per-kg option. Cost split across pooled lots.'
  },
  {
    id: 'tr-cold',
    provider: 'Sahyadri Cold Logistics',
    vehicle: 'Reefer 12ft · 2-8°C',
    capacityKg: 4000,
    costPerKm: 41,
    fixedCost: 900,
    availability: 'Today, 6:00 PM',
    rating: 4.8,
    verified: true,
    coldChain: true,
    notes: 'Required for tomato/leafy despatch beyond 100 km. Cuts spoilage to <1%.'
  },
  {
    id: 'tr-local',
    provider: 'Local Tempo (unverified)',
    vehicle: 'Mahindra Pickup',
    capacityKg: 1200,
    costPerKm: 19,
    fixedCost: 200,
    availability: 'On call',
    rating: 3.4,
    verified: false,
    coldChain: false,
    notes: 'Cash-only, no digital proof of pickup. Not covered by MandiMitra escrow.'
  }
];

/* ---------------------------------------------------------
 * 5b. STORAGE OPTIONS — the alternative to distress selling
 * ------------------------------------------------------- */
export const storageOptions: StorageOption[] = [
  {
    id: 'st-own',
    facility: 'Own ventilated chawl',
    type: 'ventilated_chawl',
    distanceKm: 0,
    costPerQtlPerDay: 0,
    capacityQtl: 40,
    availableQtl: 32,
    spoilagePerDayPercent: 0.9,
    maxHoldDays: 21,
    verified: true,
    features: ['No rent', 'Immediate access', 'Weather exposed']
  },
  {
    id: 'st-sahyadri',
    facility: 'Sahyadri Cold Chain, Lasalgaon',
    type: 'cold_storage',
    distanceKm: 14,
    costPerQtlPerDay: 3.2,
    capacityQtl: 8000,
    availableQtl: 1240,
    spoilagePerDayPercent: 0.12,
    maxHoldDays: 120,
    verified: true,
    features: ['2-8°C controlled', 'e-Storage receipt', 'Pledge loan eligible', 'Insured']
  },
  {
    id: 'st-wdra',
    facility: 'WDRA Registered Godown, Niphad',
    type: 'traditional_shed',
    distanceKm: 6,
    costPerQtlPerDay: 1.1,
    capacityQtl: 2500,
    availableQtl: 780,
    spoilagePerDayPercent: 0.55,
    maxHoldDays: 60,
    verified: true,
    features: ['WDRA negotiable receipt', 'Pledge loan @ 7%', 'Fumigated']
  },
  {
    id: 'st-field',
    facility: 'Open field stacking',
    type: 'field_open',
    distanceKm: 0,
    costPerQtlPerDay: 0,
    capacityQtl: 999,
    availableQtl: 999,
    spoilagePerDayPercent: 3.8,
    maxHoldDays: 3,
    verified: false,
    features: ['Free', 'High rain risk', 'Not recommended beyond 48 hrs']
  }
];

/* ---------------------------------------------------------
 * 2 + 3. BUYER DEMAND BOARD with explicit quality specs
 * ------------------------------------------------------- */
export const buyerDemands: BuyerDemand[] = [
  {
    id: 'dm-001',
    buyerId: 'by-sahyadri',
    buyerName: 'Sahyadri Foods Pvt Ltd',
    buyerType: 'Corporate Processor',
    cropNameEn: 'Nashik Red Onion',
    cropType: 'onion',
    requiredQtl: 800,
    committedQtl: 545,
    gradeRequired: 'Grade A',
    pricePerQtl: 3420,
    deliveryWindow: 'Next 4 days · 6 AM–2 PM',
    deliveryLocation: 'Mohadi Processing Unit, Nashik',
    paymentTerms: 'T+2 RTGS · escrow-backed',
    status: 'partially_filled',
    verified: true,
    postedAgo: '6 hrs ago',
    qualitySpecs: [
      { id: 'q1', attribute: 'Bulb diameter', requirement: '45–70 mm', meets: 'unknown', premiumImpactPerQtl: 120 },
      { id: 'q2', attribute: 'Moisture content', requirement: '≤ 12%', meets: 'unknown', premiumImpactPerQtl: 90 },
      { id: 'q3', attribute: 'Sprouting', requirement: 'Nil', meets: 'unknown', premiumImpactPerQtl: 150 },
      { id: 'q4', attribute: 'Foreign matter', requirement: '≤ 1.5% by weight', meets: 'unknown', premiumImpactPerQtl: 60 },
      { id: 'q5', attribute: 'Skin colour', requirement: 'Uniform dark red', meets: 'unknown', premiumImpactPerQtl: 80 }
    ]
  },
  {
    id: 'dm-002',
    buyerId: 'by-bigbasket',
    buyerName: 'Metro Fresh Retail',
    buyerType: 'Direct Retailer',
    cropNameEn: 'Tomato Vaishali',
    cropType: 'tomato',
    requiredQtl: 240,
    committedQtl: 60,
    gradeRequired: 'Grade A',
    pricePerQtl: 1780,
    deliveryWindow: 'Daily · 5 AM cut-off',
    deliveryLocation: 'Nashik DC, Ambad MIDC',
    paymentTerms: 'T+1 UPI · auto-settled',
    status: 'open',
    verified: true,
    postedAgo: '2 hrs ago',
    qualitySpecs: [
      { id: 'q1', attribute: 'Firmness', requirement: 'Hard, no soft spots', meets: 'unknown', premiumImpactPerQtl: 140 },
      { id: 'q2', attribute: 'Colour stage', requirement: 'Breaker to turning', meets: 'unknown', premiumImpactPerQtl: 100 },
      { id: 'q3', attribute: 'Size grading', requirement: '55–75 g per fruit', meets: 'unknown', premiumImpactPerQtl: 70 },
      { id: 'q4', attribute: 'Crate packing', requirement: 'CFB crate, ≤ 12 kg', meets: 'unknown', premiumImpactPerQtl: 50 }
    ]
  },
  {
    id: 'dm-003',
    buyerId: 'by-export',
    buyerName: 'Gulf Agro Exports DMCC',
    buyerType: 'Corporate Processor',
    cropNameEn: 'Nashik Red Onion',
    cropType: 'onion',
    requiredQtl: 2400,
    committedQtl: 1900,
    gradeRequired: 'Grade A',
    pricePerQtl: 3680,
    deliveryWindow: 'Container cut-off in 3 days',
    deliveryLocation: 'JNPT Nhava Sheva CFS',
    paymentTerms: 'LC at sight · 30% advance',
    status: 'partially_filled',
    verified: true,
    postedAgo: '1 day ago',
    qualitySpecs: [
      { id: 'q1', attribute: 'Bulb diameter', requirement: '50–80 mm strictly', meets: 'unknown', premiumImpactPerQtl: 220 },
      { id: 'q2', attribute: 'Pesticide residue', requirement: 'EU MRL compliant · lab cert', meets: 'unknown', premiumImpactPerQtl: 300 },
      { id: 'q3', attribute: 'Double bulbs', requirement: '≤ 2%', meets: 'unknown', premiumImpactPerQtl: 110 },
      { id: 'q4', attribute: 'Neck thickness', requirement: 'Tight cured neck', meets: 'unknown', premiumImpactPerQtl: 90 }
    ]
  },
  {
    id: 'dm-004',
    buyerId: 'by-hotel',
    buyerName: 'Annapurna Institutional Catering',
    buyerType: 'Direct Retailer',
    cropNameEn: 'Potato Jyoti',
    cropType: 'potato',
    requiredQtl: 120,
    committedQtl: 120,
    gradeRequired: 'Fair Average Quality (FAQ)',
    pricePerQtl: 1920,
    deliveryWindow: 'Closed',
    deliveryLocation: 'Nashik Central Kitchen',
    paymentTerms: 'T+7 cheque',
    status: 'closed',
    verified: true,
    postedAgo: '3 days ago',
    qualitySpecs: [
      { id: 'q1', attribute: 'Tuber size', requirement: '40–90 mm', meets: 'unknown', premiumImpactPerQtl: 40 },
      { id: 'q2', attribute: 'Greening', requirement: 'Nil', meets: 'unknown', premiumImpactPerQtl: 80 }
    ]
  }
];

/* ---------------------------------------------------------
 * SUPPLY BOARD — what traders / buyers / FPOs see
 * ------------------------------------------------------- */

/**
 * Fallback reference prices for crops the AGMARKNET feed does not cover.
 * Anything present in Data.csv is served from the trained model instead —
 * see CROP_BENCHMARKS below.
 */
const FALLBACK_BENCHMARKS: Record<CropType, number> = {
  onion: 3420,
  tomato: 1780,
  potato: 1920,
  soybean: 4850,
  wheat: 2550
};

/**
 * Reference price per crop (Rs/Qtl). A trader's spread is only meaningful
 * against the benchmark for the SAME crop, so the margin calculator reads
 * this rather than a single market-wide number.
 *
 * Values come from the model trained on Data.csv where the feed covers the
 * crop, and fall back to the curated defaults where it does not.
 */
export const CROP_BENCHMARKS: Record<CropType, number> = (
  Object.keys(FALLBACK_BENCHMARKS) as CropType[]
).reduce((acc, crop) => {
  acc[crop] = cropBenchmark(crop) ?? FALLBACK_BENCHMARKS[crop];
  return acc;
}, {} as Record<CropType, number>);

/** Which crops are backed by observed market data rather than a default. */
export const BENCHMARK_SOURCE: Record<CropType, 'observed' | 'default'> = (
  Object.keys(FALLBACK_BENCHMARKS) as CropType[]
).reduce((acc, crop) => {
  acc[crop] = cropBenchmark(crop) !== null ? 'observed' : 'default';
  return acc;
}, {} as Record<CropType, 'observed' | 'default'>);
export const supplyLots: SupplyLot[] = [
  {
    id: 'sl-01', sellerName: 'Rameshwar Patil', sellerRole: 'farmer', village: 'Niphad',
    cropNameEn: 'Nashik Red Onion', cropType: 'onion', quantityKg: 750, grade: 'Grade A', askPricePerQtl: 3300,
    harvestedDaysAgo: 2, verified: true, trustScore: 82, photosCount: 4
  },
  {
    id: 'sl-02', sellerName: 'Godavari Kisan Producer Co.', sellerRole: 'fpo', village: 'Dindori',
    cropNameEn: 'Nashik Red Onion', cropType: 'onion', quantityKg: 41000, grade: 'Grade A', askPricePerQtl: 3450,
    harvestedDaysAgo: 4, verified: true, trustScore: 91, photosCount: 12
  },
  {
    id: 'sl-03', sellerName: 'Anita Wagh', sellerRole: 'farmer', village: 'Ozar',
    cropNameEn: 'Tomato Vaishali', cropType: 'tomato', quantityKg: 1400, grade: 'Grade A', askPricePerQtl: 1690,
    harvestedDaysAgo: 0, verified: true, trustScore: 77, photosCount: 3
  },
  {
    id: 'sl-04', sellerName: 'Sopan Gaikwad', sellerRole: 'farmer', village: 'Chandwad',
    cropNameEn: 'Potato Jyoti', cropType: 'potato', quantityKg: 2600, grade: 'Grade B', askPricePerQtl: 1760,
    harvestedDaysAgo: 6, verified: false, trustScore: 58, photosCount: 1
  },
  {
    id: 'sl-05', sellerName: 'Kisan Vikas Sangh', sellerRole: 'fpo', village: 'Yeola',
    cropNameEn: 'Soybean', cropType: 'soybean', quantityKg: 18500, grade: 'Fair Average Quality (FAQ)', askPricePerQtl: 4720,
    harvestedDaysAgo: 9, verified: true, trustScore: 86, photosCount: 8
  }
];

/* ---------------------------------------------------------
 * 9. PAYMENT TRACKING
 * ------------------------------------------------------- */
const ms = (
  stage: PaymentTrackRecord['milestones'][number]['stage'],
  label: string,
  at: string | null,
  status: PaymentTrackRecord['milestones'][number]['status'],
  note: string
) => ({ stage, label, at, status, note });

export const paymentRecords: PaymentTrackRecord[] = [
  {
    id: 'pt-001',
    txnId: 'TXN-MH-88421',
    counterparty: 'Sahyadri Foods Pvt Ltd',
    cropName: 'Nashik Red Onion · 750 kg',
    amount: 25650,
    amountReceived: 25650,
    dueDate: '10 Sep 2026',
    daysOutstanding: 0,
    escrowProtected: true,
    risk: 'low',
    milestones: [
      ms('lot_booked', 'Lot booked', '08 Sep · 09:12', 'done', 'Digital offer accepted at ₹3,420/Qtl'),
      ms('picked_up', 'Picked up', '08 Sep · 16:40', 'done', 'Jadhav Roadlines · MH15-BJ-4402'),
      ms('weighed', 'Weighbridge verified', '09 Sep · 06:55', 'done', 'Net 748 kg · 2 kg transit shrinkage'),
      ms('quality_checked', 'Quality accepted', '09 Sep · 08:10', 'done', 'Grade A confirmed · no deduction'),
      ms('invoice_raised', 'Invoice raised', '09 Sep · 09:00', 'done', 'INV/SF/26/1188'),
      ms('payment_initiated', 'Payment released from escrow', '10 Sep · 11:02', 'done', 'RTGS UTR 8829104477'),
      ms('settled', 'Settled to bank', '10 Sep · 11:44', 'done', 'Bank of Maharashtra ****4902')
    ]
  },
  {
    id: 'pt-002',
    txnId: 'TXN-MH-88690',
    counterparty: 'Metro Fresh Retail',
    cropName: 'Tomato Vaishali · 500 kg',
    amount: 8900,
    amountReceived: 0,
    dueDate: '13 Sep 2026',
    daysOutstanding: 1,
    escrowProtected: true,
    risk: 'low',
    milestones: [
      ms('lot_booked', 'Lot booked', '11 Sep · 18:30', 'done', 'Offer accepted at ₹1,780/Qtl'),
      ms('picked_up', 'Picked up', '12 Sep · 05:05', 'done', 'Reefer despatch · temp logged 4°C'),
      ms('weighed', 'Weighbridge verified', '12 Sep · 07:20', 'done', 'Net 500 kg · nil shrinkage'),
      ms('quality_checked', 'Quality check in progress', null, 'active', 'DC inspection queue · ETA 2 hrs'),
      ms('invoice_raised', 'Invoice raised', null, 'pending', ''),
      ms('payment_initiated', 'Payment release', null, 'pending', 'Escrow holds ₹8,900'),
      ms('settled', 'Settled to bank', null, 'pending', '')
    ]
  },
  {
    id: 'pt-003',
    txnId: 'TXN-MH-87004',
    counterparty: 'Bhosale Commission Agent (unverified)',
    cropName: 'Potato Jyoti · 1,800 kg',
    amount: 32400,
    amountReceived: 12000,
    dueDate: '02 Sep 2026',
    daysOutstanding: 10,
    escrowProtected: false,
    risk: 'high',
    milestones: [
      ms('lot_booked', 'Lot booked', '29 Aug · 10:00', 'done', 'Verbal rate — no digital offer on record'),
      ms('picked_up', 'Picked up', '29 Aug · 14:20', 'done', 'Buyer-arranged vehicle, no e-proof'),
      ms('weighed', 'Weighbridge verified', '30 Aug · 08:00', 'done', 'Buyer-side weighing · farmer not present'),
      ms('quality_checked', 'Quality accepted with deduction', '30 Aug · 09:30', 'done', '₹4,200 deducted — reason not documented'),
      ms('invoice_raised', 'Invoice raised', '30 Aug · 12:00', 'done', 'Handwritten patti'),
      ms('payment_initiated', 'Part payment only', '02 Sep · 16:00', 'blocked', '₹12,000 of ₹32,400 paid. ₹20,400 overdue 10 days.'),
      ms('settled', 'Settled to bank', null, 'blocked', 'Grievance GRV-2026-0311 filed')
    ]
  }
];

/* ---------------------------------------------------------
 * 10. GRIEVANCE / DISPUTE REGISTER
 * ------------------------------------------------------- */
export const grievances: Grievance[] = [
  {
    id: 'GRV-2026-0311',
    raisedBy: 'Rameshwar Patil',
    raisedByRole: 'farmer',
    against: 'Bhosale Commission Agent',
    category: 'payment_delay',
    txnRef: 'TXN-MH-87004',
    amountDisputed: 20400,
    title: '₹20,400 outstanding for 10 days beyond agreed terms',
    description:
      'Lot of 1,800 kg Potato Jyoti lifted on 29 Aug against a verbal rate of ₹1,800/Qtl. Only ₹12,000 received. An unexplained ₹4,200 quality deduction was applied without a documented inspection report.',
    filedOn: '09 Sep 2026 · 10:24',
    slaHours: 72,
    hoursElapsed: 51,
    status: 'mediation',
    resolutionNote: 'APMC Pimpalgaon assigned mediator. Buyer response due within 21 hrs.',
    timeline: [
      { at: '09 Sep · 10:24', actor: 'Rameshwar Patil', event: 'Grievance filed with weighbridge slip and payment screenshot' },
      { at: '09 Sep · 11:02', actor: 'MandiMitra System', event: 'Auto-notified counterparty. SLA clock started (72 hrs).' },
      { at: '10 Sep · 09:15', actor: 'APMC Pimpalgaon', event: 'Case accepted for mediation. Officer A. R. Kulkarni assigned.' },
      { at: '11 Sep · 14:40', actor: 'Bhosale Commission Agent', event: 'Partial response: disputes deduction amount, offers ₹16,000 settlement.' }
    ]
  },
  {
    id: 'GRV-2026-0298',
    raisedBy: 'Anita Wagh',
    raisedByRole: 'farmer',
    against: 'Metro Fresh Retail',
    category: 'weight_dispute',
    txnRef: 'TXN-MH-86550',
    amountDisputed: 2140,
    title: '38 kg weight difference between farm-gate and DC weighing',
    description:
      'Farm-gate digital weight recorded 1,400 kg. Buyer DC recorded 1,362 kg on arrival. Transit was 90 minutes in a reefer — shrinkage of this magnitude is not plausible.',
    filedOn: '05 Sep 2026 · 15:10',
    slaHours: 72,
    hoursElapsed: 72,
    status: 'resolved',
    resolutionNote:
      'Reefer temperature log and both weighbridge tickets reviewed. Buyer accepted 24 kg as genuine shrinkage and credited ₹1,350 for the remaining 14 kg. Settled 08 Sep.',
    timeline: [
      { at: '05 Sep · 15:10', actor: 'Anita Wagh', event: 'Grievance filed with both weighbridge tickets' },
      { at: '06 Sep · 10:00', actor: 'Metro Fresh Retail', event: 'Submitted DC weighing CCTV timestamp and reefer temp log' },
      { at: '07 Sep · 12:30', actor: 'MandiMitra Mediation', event: 'Independent shrinkage benchmark applied (1.7% for 90-min reefer transit)' },
      { at: '08 Sep · 11:00', actor: 'Metro Fresh Retail', event: '₹1,350 credited. Case closed by mutual agreement.' }
    ]
  },
  {
    id: 'GRV-2026-0322',
    raisedBy: 'Godavari Kisan Producer Co.',
    raisedByRole: 'fpo',
    against: 'Gulf Agro Exports DMCC',
    category: 'quality_rejection',
    txnRef: 'TXN-MH-88900',
    amountDisputed: 184000,
    title: '400 Qtl rejected at CFS citing double-bulb ratio',
    description:
      'Consignment rejected at JNPT CFS on the ground that double bulbs exceeded 2%. Our pre-despatch sample report from an NABL lab recorded 1.4%. No joint re-sampling was offered before rejection.',
    filedOn: '11 Sep 2026 · 19:45',
    slaHours: 48,
    hoursElapsed: 18,
    status: 'under_review',
    resolutionNote: 'Awaiting buyer inspection report and CFS sampling protocol.',
    timeline: [
      { at: '11 Sep · 19:45', actor: 'Godavari Kisan Producer Co.', event: 'Grievance filed with NABL lab report attached' },
      { at: '11 Sep · 20:10', actor: 'MandiMitra System', event: 'High-value case — escalated to senior mediation queue.' },
      { at: '12 Sep · 09:30', actor: 'MandiMitra Mediation', event: 'Joint re-sampling proposed at CFS within 24 hrs.' }
    ]
  }
];

/* ---------------------------------------------------------
 * 7. VERIFIED BUYER & SELLER REGISTRY
 * ------------------------------------------------------- */
export const verificationProfiles: VerificationProfile[] = [
  {
    id: 'vp-sahyadri', name: 'Sahyadri Foods Pvt Ltd', role: 'buyer', trustScore: 95, verified: true,
    licenceId: 'FSSAI 11522003000456 · GSTIN 27AAECS****1ZQ', yearsActive: 11, totalDealsCompleted: 4820,
    onTimePaymentPercent: 98.6, disputeRatePercent: 0.4, avgSettlementDays: 2.1,
    checks: [
      { label: 'GSTIN active & verified', passed: true },
      { label: 'FSSAI licence current', passed: true },
      { label: 'Bank account penny-drop verified', passed: true },
      { label: 'Escrow agreement signed', passed: true },
      { label: 'No unresolved grievance > 30 days', passed: true }
    ]
  },
  {
    id: 'vp-gulf', name: 'Gulf Agro Exports DMCC', role: 'buyer', trustScore: 81, verified: true,
    licenceId: 'IEC 0388****21 · APEDA RCMC 4471', yearsActive: 7, totalDealsCompleted: 1140,
    onTimePaymentPercent: 91.2, disputeRatePercent: 2.8, avgSettlementDays: 6.4,
    checks: [
      { label: 'IEC & APEDA registration valid', passed: true },
      { label: 'LC issuing bank confirmed', passed: true },
      { label: 'Bank account penny-drop verified', passed: true },
      { label: 'Escrow agreement signed', passed: false },
      { label: 'No unresolved grievance > 30 days', passed: false }
    ]
  },
  {
    id: 'vp-bhosale', name: 'Bhosale Commission Agent', role: 'middleman', trustScore: 34, verified: false,
    licenceId: 'APMC licence lapsed — renewal pending since Mar 2026', yearsActive: 14, totalDealsCompleted: 2260,
    onTimePaymentPercent: 62.4, disputeRatePercent: 11.9, avgSettlementDays: 14.8,
    checks: [
      { label: 'APMC trading licence current', passed: false },
      { label: 'GSTIN active & verified', passed: true },
      { label: 'Bank account penny-drop verified', passed: false },
      { label: 'Escrow agreement signed', passed: false },
      { label: 'No unresolved grievance > 30 days', passed: false }
    ]
  },
  {
    id: 'vp-godavari', name: 'Godavari Kisan Producer Co.', role: 'fpo', trustScore: 91, verified: true,
    licenceId: 'CIN U01100MH2023PTC***** · 412 members', yearsActive: 3, totalDealsCompleted: 640,
    onTimePaymentPercent: 96.1, disputeRatePercent: 1.2, avgSettlementDays: 3.0,
    checks: [
      { label: 'Company registration active', passed: true },
      { label: 'Member roll audited', passed: true },
      { label: 'Bank account penny-drop verified', passed: true },
      { label: 'Split-settlement mandate on file', passed: true },
      { label: 'No unresolved grievance > 30 days', passed: true }
    ]
  },
  {
    id: 'vp-jadhav', name: 'Jadhav Roadlines', role: 'transporter', trustScore: 79, verified: true,
    licenceId: 'Transport Licence MH15-TR-8821 · 6 vehicles', yearsActive: 5, totalDealsCompleted: 1890,
    onTimePaymentPercent: 100, disputeRatePercent: 1.8, avgSettlementDays: 0,
    checks: [
      { label: 'Vehicle fitness certificates valid', passed: true },
      { label: 'Goods-in-transit insurance active', passed: true },
      { label: 'Driver verification complete', passed: true },
      { label: 'GPS tracking enabled', passed: true },
      { label: 'No unresolved grievance > 30 days', passed: true }
    ]
  }
];

/* ---------------------------------------------------------
 * OUTCOMES DASHBOARD
 * ------------------------------------------------------- */
export const impactMetrics: ImpactMetric[] = [
  {
    id: 'im-price', label: 'Farmer price realisation', value: '₹3,412 /Qtl', baseline: 'Pre-platform: ₹3,090 /Qtl',
    deltaPercent: 10.4, direction: 'up_good', icon: 'TrendingUp',
    detail: 'Median net realisation across 1,284 settled lots vs the same farmers’ prior-season mandi patti average.'
  },
  {
    id: 'im-cost', label: 'Transaction cost', value: '1.4% of lot value', baseline: 'Traditional channel: 6–8%',
    deltaPercent: -78, direction: 'down_good', icon: 'Percent',
    detail: 'Platform charges 1–2% all-in. Replaces 4–6% commission agent cut plus undocumented deductions.'
  },
  {
    id: 'im-info', label: 'Information asymmetry', value: '4 markets compared', baseline: 'Before: 1 local mandi',
    deltaPercent: 300, direction: 'up_good', icon: 'Eye',
    detail: 'Farmers now see live rates, arrivals and net-of-transport realisation across every reachable market before despatch.'
  },
  {
    id: 'im-loss', label: 'Post-harvest loss', value: '2.8% of volume', baseline: 'District benchmark: 9.1%',
    deltaPercent: -69, direction: 'down_good', icon: 'PackageCheck',
    detail: 'Sale-window advice plus matched storage/cold-chain cut spoilage between harvest and settlement.'
  },
  {
    id: 'im-settle', label: 'Payment settlement time', value: '2.1 days', baseline: 'Traditional: 14–21 days',
    deltaPercent: -87, direction: 'down_good', icon: 'BadgeIndianRupee',
    detail: 'Escrow release on verified weighing and quality acceptance, not on buyer discretion.'
  },
  {
    id: 'im-sourcing', label: 'Buyer fill rate', value: '94% of demand met', baseline: 'Spot sourcing: 61%',
    deltaPercent: 54, direction: 'up_good', icon: 'Factory',
    detail: 'FPO aggregation lets buyers close large graded consignments without chasing individual farmers.'
  },
  {
    id: 'im-dispute', label: 'Disputes resolved in SLA', value: '92% within 72 hrs', baseline: 'Informal channel: no recourse',
    deltaPercent: 92, direction: 'up_good', icon: 'Scale',
    detail: 'Every transaction carries a timestamped weighing, quality and payment record that mediation can rely on.'
  },
  {
    id: 'im-fpo', label: 'FPO aggregation volume', value: '41,000 kg avg lot', baseline: 'Individual lot: 740 kg',
    deltaPercent: 5440, direction: 'up_good', icon: 'Users',
    detail: 'Pooling unlocks the ₹150–320/Qtl bulk premium that individual smallholders can never access alone.'
  }
];
