import type { SupportedLang } from '../i18n';

export type Language = SupportedLang;

export type CropType = 'onion' | 'tomato' | 'potato' | 'soybean' | 'wheat';

export type QualityGrade = 'Grade A' | 'Grade B' | 'Fair Average Quality (FAQ)';

export type StorageType = 'ventilated_chawl' | 'cold_storage' | 'traditional_shed' | 'field_open';

export type CashUrgency = 'can_wait' | 'moderate' | 'urgent';

export interface FarmerLot {
  id: string;
  farmerName: string;
  location: string;
  district: string;
  cropNameEn: string;
  cropNameLocal: string;
  cropType: CropType;
  variety: string;
  quantityKg: number;
  grade: QualityGrade;
  harvestDateDaysAgo: number;
  storageType: StorageType;
  storageAvailable: boolean;
  hasRainAlert: boolean;
  cashUrgency: CashUrgency;
  localMandiBenchmark: number; // ₹ per quintal
}

export interface FactorItem {
  id: string;
  label: string;
  value: string;
  status: 'positive' | 'warning' | 'negative' | 'neutral';
  icon: string;
  detail: string;
}

export interface DecisionResult {
  action: 'HOLD' | 'SELL_NOW' | 'JOIN_POOL';
  holdDays: number;
  confidencePercent: number;
  headlineTitle: string;
  headlineGain: string;
  sellTodayNet: number;
  projectedNet: number;
  netGain: number;
  factors: FactorItem[];
  reasoningText: string;
  riskWarning: string;
  formulaDetails: {
    spotPrice: number;
    projectedPrice: number;
    transportCostPerQtl: number;
    spoilageLossPercent: number;
    storageCostTotal: number;
    expectedGainPerQtl: number;
  };
  simDays: SimDay[];
}

export interface SimDay {
  day: number;
  label: string;
  projectedRate: number; // ₹/quintal
  grossVal: number;
  spoilageLossKg: number;
  storageCost: number;
  transportCost: number;
  netRealization: number;
  isPeak?: boolean;
  explanation: string;
}

export interface MandiItem {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  distanceKm: number;
  travelTime: string;
  route: string;
  grossPricePerQtl: number;
  transportCostPerQtl: number;
  handlingCostPerQtl: number;
  arrivalsTotalQtl: number;
  arrivalTrend: 'Heavy' | 'Moderate' | 'Low';
  isRecommended?: boolean;
  isTrap?: boolean;
  trapWarning?: string;
  netRealizationPerQtl: number;
}

export interface BuyerOffer {
  id: string;
  buyerName: string;
  type: 'FPO Aggregator' | 'Corporate Processor' | 'Direct Retailer';
  rating: number;
  matchScore: number;
  matchReasons: string[];
  offerPricePerQtl: number;
  minQuantityKg: number;
  paymentTerms: string;
  pickupTimeline: string;
  weighingMethod: string;
  badge?: string;
  verified: boolean;
}

export interface PopUpPool {
  id: string;
  title: string;
  cropName: string;
  targetKg: number;
  currentKg: number;
  expiresInHours: number;
  buyerName: string;
  bulkPremiumPerQtl: number;
  gainEstimate: number;
  status: 'open' | 'filling' | 'ready';
  contributorsCount: number;
}

export interface TransactionRecord {
  id: string;
  lotId: string;
  cropName: string;
  quantityKg: number;
  ratePerQtl: number;
  grossAmount: number;
  netPayout: number;
  buyerName: string;
  date: string;
  status: 'DBT Settled' | 'In Transit' | 'Weighing Verified' | 'Booked';
  bankRef: string;
  mode: string;
}

/* ============================================================
 * ROLES & SESSION
 * ========================================================== */

export type UserRole =
  | 'farmer'
  | 'fpo'
  | 'middleman'
  | 'buyer'
  | 'transporter'
  | 'warehouse'
  | 'officer';

export interface RoleDefinition {
  id: UserRole;
  label: string;
  labelHi: string;
  tagline: string;
  description: string;
  icon: string;          // lucide icon name
  accent: string;        // hex, drives the role chip
  homeTab: string;
  capabilities: string[];
}

export interface UserSession {
  role: UserRole;
  displayName: string;
  organisation: string;
  phone: string;
  location: string;
  verified: boolean;
  trustScore: number;    // 0-100
  memberSince: string;
}

/* ============================================================
 * QUALITY SPECIFICATION & GRADING
 * ========================================================== */

export interface QualitySpec {
  id: string;
  attribute: string;
  requirement: string;
  farmerValue?: string;
  meets: 'pass' | 'borderline' | 'fail' | 'unknown';
  premiumImpactPerQtl: number;
}

export interface QualityAssessment {
  grade: QualityGrade;
  confidencePercent: number;
  summary: string;
  specs: QualitySpec[];
  estimatedPremiumPerQtl: number;
  improvementActions: string[];
  source: 'ai' | 'manual' | 'lab';
  assessedAt: string;
}

/* ============================================================
 * ARRIVALS, TRANSPORT & STORAGE
 * ========================================================== */

export interface ArrivalRecord {
  mandiId: string;
  mandiName: string;
  todayQtl: number;
  yesterdayQtl: number;
  sevenDayAvgQtl: number;
  changePercent: number;
  congestion: 'Low' | 'Moderate' | 'Heavy';
  priceImpactNote: string;
}

export interface TransportOption {
  id: string;
  provider: string;
  vehicle: string;
  capacityKg: number;
  costPerKm: number;
  fixedCost: number;
  availability: string;
  rating: number;
  verified: boolean;
  coldChain: boolean;
  notes: string;
}

export interface StorageOption {
  id: string;
  facility: string;
  type: StorageType;
  distanceKm: number;
  costPerQtlPerDay: number;
  capacityQtl: number;
  availableQtl: number;
  spoilagePerDayPercent: number;
  maxHoldDays: number;
  verified: boolean;
  features: string[];
}

/* ============================================================
 * BUYER SIDE
 * ========================================================== */

export interface BuyerDemand {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: BuyerOffer['type'];
  cropNameEn: string;
  cropType: CropType;
  requiredQtl: number;
  committedQtl: number;
  gradeRequired: QualityGrade;
  pricePerQtl: number;
  deliveryWindow: string;
  deliveryLocation: string;
  paymentTerms: string;
  qualitySpecs: QualitySpec[];
  status: 'open' | 'partially_filled' | 'closed';
  verified: boolean;
  postedAgo: string;
}

export interface SupplyLot {
  id: string;
  sellerName: string;
  sellerRole: UserRole;
  village: string;
  cropNameEn: string;
  cropType: CropType;
  quantityKg: number;
  grade: QualityGrade;
  askPricePerQtl: number;
  harvestedDaysAgo: number;
  verified: boolean;
  trustScore: number;
  photosCount: number;
}

/* ============================================================
 * PAYMENT TRACKING & GRIEVANCE
 * ========================================================== */

export type PaymentStage =
  | 'lot_booked'
  | 'picked_up'
  | 'weighed'
  | 'quality_checked'
  | 'invoice_raised'
  | 'payment_initiated'
  | 'settled';

export interface PaymentMilestone {
  stage: PaymentStage;
  label: string;
  at: string | null;
  status: 'done' | 'active' | 'pending' | 'blocked';
  note: string;
}

export interface PaymentTrackRecord {
  id: string;
  txnId: string;
  counterparty: string;
  cropName: string;
  amount: number;
  amountReceived: number;
  dueDate: string;
  daysOutstanding: number;
  escrowProtected: boolean;
  milestones: PaymentMilestone[];
  risk: 'low' | 'medium' | 'high';
}

export type GrievanceCategory =
  | 'payment_delay'
  | 'weight_dispute'
  | 'quality_rejection'
  | 'price_deviation'
  | 'logistics_failure'
  | 'other';

export interface Grievance {
  id: string;
  raisedBy: string;
  raisedByRole: UserRole;
  against: string;
  category: GrievanceCategory;
  txnRef: string;
  amountDisputed: number;
  title: string;
  description: string;
  filedOn: string;
  slaHours: number;
  hoursElapsed: number;
  status: 'open' | 'under_review' | 'mediation' | 'resolved' | 'escalated';
  resolutionNote: string;
  timeline: { at: string; actor: string; event: string }[];
}

/* ============================================================
 * VERIFICATION & IMPACT
 * ========================================================== */

export interface VerificationProfile {
  id: string;
  name: string;
  role: UserRole;
  trustScore: number;
  verified: boolean;
  licenceId: string;
  yearsActive: number;
  totalDealsCompleted: number;
  onTimePaymentPercent: number;
  disputeRatePercent: number;
  avgSettlementDays: number;
  checks: { label: string; passed: boolean }[];
}

export interface ImpactMetric {
  id: string;
  label: string;
  value: string;
  baseline: string;
  deltaPercent: number;
  direction: 'up_good' | 'down_good';
  detail: string;
  icon: string;
}
