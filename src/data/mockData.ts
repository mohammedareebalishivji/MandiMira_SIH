import { FarmerLot, MandiItem, BuyerOffer, PopUpPool, TransactionRecord } from '../types';

export const initialScenarios: Record<number, FarmerLot> = {
  1: {
    id: 'MH-2026-00421',
    farmerName: 'Rameshwar ji',
    location: 'Niphad, Nashik',
    district: 'Nashik, MH',
    cropNameEn: 'Nashik Red Onion',
    cropNameLocal: 'नाशिक लाल कांदा',
    cropType: 'onion',
    variety: 'Garwa / Red Onion',
    quantityKg: 750,
    grade: 'Grade A',
    harvestDateDaysAgo: 2,
    storageType: 'ventilated_chawl',
    storageAvailable: true,
    hasRainAlert: false,
    cashUrgency: 'can_wait',
    localMandiBenchmark: 3200
  },
  2: {
    id: 'MH-2026-00892',
    farmerName: 'Rameshwar ji',
    location: 'Niphad, Nashik',
    district: 'Nashik, MH',
    cropNameEn: 'Tomato Vaishali',
    cropNameLocal: 'टोमॅटो वैशाली',
    cropType: 'tomato',
    variety: 'Vaishali Hybrid',
    quantityKg: 500,
    grade: 'Grade A',
    harvestDateDaysAgo: 0,
    storageType: 'field_open',
    storageAvailable: false,
    hasRainAlert: true,
    cashUrgency: 'urgent',
    localMandiBenchmark: 1450
  },
  3: {
    id: 'MH-2026-01044',
    farmerName: 'Rameshwar ji',
    location: 'Niphad, Nashik',
    district: 'Nashik, MH',
    cropNameEn: 'Potato Jyoti',
    cropNameLocal: 'बटाटा कुफरी ज्योती',
    cropType: 'potato',
    variety: 'Kufri Jyoti Table',
    quantityKg: 180,
    grade: 'Grade B',
    harvestDateDaysAgo: 1,
    storageType: 'traditional_shed',
    storageAvailable: true,
    hasRainAlert: false,
    cashUrgency: 'can_wait',
    localMandiBenchmark: 1800
  }
};

export const defaultMandis: MandiItem[] = [
  {
    id: 'pimpalgaon',
    name: 'Pimpalgaon Mandi',
    hindiName: 'पिंपलगांव मंडी',
    marathiName: 'पिंपळगाव कृ.उ.बा.स.',
    distanceKm: 18,
    travelTime: '35 mins',
    route: 'via Niphad Rd',
    grossPricePerQtl: 3250,
    transportCostPerQtl: 90,
    handlingCostPerQtl: 0,
    arrivalsTotalQtl: 4200,
    arrivalTrend: 'Moderate',
    isRecommended: true,
    netRealizationPerQtl: 3160
  },
  {
    id: 'lasalgaon',
    name: 'Lasalgaon APMC',
    hindiName: 'लासलगांव एपीएमसी',
    marathiName: 'लासलगाव मुख्य आवार',
    distanceKm: 52,
    travelTime: '1.5 hrs',
    route: 'via State Hwy 17',
    grossPricePerQtl: 3320,
    transportCostPerQtl: 260,
    handlingCostPerQtl: 0,
    arrivalsTotalQtl: 11400,
    arrivalTrend: 'Heavy',
    isTrap: true,
    trapWarning: '₹100 less in hand due to longer transit & diesel!',
    netRealizationPerQtl: 3060
  },
  {
    id: 'vashi',
    name: 'Vashi APMC (Mumbai)',
    hindiName: 'वाशी एपीएमसी (मुंबई)',
    marathiName: 'वाशी नवी मुंबई बाजार',
    distanceKm: 180,
    travelTime: '8 hrs',
    route: 'via Mumbai-Agra National Hwy',
    grossPricePerQtl: 3500,
    transportCostPerQtl: 520,
    handlingCostPerQtl: 0,
    arrivalsTotalQtl: 18200,
    arrivalTrend: 'Heavy',
    netRealizationPerQtl: 2980
  },
  {
    id: 'dindori',
    name: 'Dindori Sub-Market',
    hindiName: 'दिंडोरी उप-बाजार',
    marathiName: 'दिंडोरी उपबाजार',
    distanceKm: 26,
    travelTime: '45 mins',
    route: 'via SH 24',
    grossPricePerQtl: 3120,
    transportCostPerQtl: 110,
    handlingCostPerQtl: 0,
    arrivalsTotalQtl: 2100,
    arrivalTrend: 'Low',
    netRealizationPerQtl: 3010
  }
];

export const defaultBuyers: BuyerOffer[] = [
  {
    id: 'kisan-fresh',
    buyerName: 'Kisan Fresh Retail',
    type: 'FPO Aggregator',
    rating: 4.9,
    matchScore: 98,
    matchReasons: [
      'Govt recognized FPO network',
      'Daily direct farmgate route in Niphad cluster',
      'Instant electronic weighing machine with SMS receipt'
    ],
    offerPricePerQtl: 3280,
    minQuantityKg: 400,
    paymentTerms: 'Same-Day DBT',
    pickupTimeline: 'Farmgate within 48h',
    weighingMethod: 'Electronic scale verified',
    badge: '98% Match',
    verified: true
  },
  {
    id: 'sahyadri-agro',
    buyerName: 'Sahyadri Farmer Producer Co.',
    type: 'Corporate Processor',
    rating: 4.8,
    matchScore: 94,
    matchReasons: [
      'Largest farmer-owned horticulture company',
      'Direct processing facility 14 km away',
      'Guaranteed floor price with transparent moisture deduction'
    ],
    offerPricePerQtl: 3320,
    minQuantityKg: 800,
    paymentTerms: '24-hour NEFT/RTGS',
    pickupTimeline: 'Daily scheduled aggregate pickup',
    weighingMethod: 'APMC certified weighbridge',
    badge: 'Bulk Champion',
    verified: true
  },
  {
    id: 'fresh-bazaar',
    buyerName: 'FreshBazaar Hypermarkets',
    type: 'Direct Retailer',
    rating: 4.6,
    matchScore: 89,
    matchReasons: [
      'Direct retail supply chain for metro Mumbai',
      'Grade A premium bonus ₹50/qtl'
    ],
    offerPricePerQtl: 3220,
    minQuantityKg: 300,
    paymentTerms: 'Instant DBT on loading',
    pickupTimeline: 'Next morning 7:00 AM',
    weighingMethod: 'Field crate weight count',
    badge: 'Direct Retail',
    verified: true
  }
];

export const defaultPool: PopUpPool = {
  id: 'pool-niphad-4',
  title: 'Niphad Onion Aggregation Pool #4',
  cropName: 'Nashik Red Onion',
  targetKg: 800,
  currentKg: 620,
  expiresInHours: 3,
  buyerName: 'Sahyadri Agro',
  bulkPremiumPerQtl: 120,
  gainEstimate: 1960,
  status: 'open',
  contributorsCount: 3
};

export const initialTransactions: TransactionRecord[] = [
  {
    id: 'TXN-9021',
    lotId: 'MH-2026-00388',
    cropName: 'Tomato Vaishali',
    quantityKg: 500,
    ratePerQtl: 2840,
    grossAmount: 14200,
    netPayout: 14200,
    buyerName: 'FreshBazaar',
    date: '10 Sep 2026',
    status: 'DBT Settled',
    bankRef: 'UTIBR0004921',
    mode: 'E-Receipt Generated'
  },
  {
    id: 'TXN-8842',
    lotId: 'MH-2026-00210',
    cropName: 'Nashik Red Onion',
    quantityKg: 1200,
    ratePerQtl: 2950,
    grossAmount: 35400,
    netPayout: 34320,
    buyerName: 'Pimpalgaon Mandi Auction',
    date: '28 Aug 2026',
    status: 'DBT Settled',
    bankRef: 'MAHB0001192',
    mode: 'APMC Direct Gate Slip'
  }
];
