// GENERATED FILE — do not edit by hand.
// Produced by scripts/train_ai_model.py from Data.csv
// Re-run: python3 scripts/train_ai_model.py

import { CropType } from '../types';

export interface MarketQuote {
  market: string;
  district: string;
  state: string;
  variety: string;
  grade: string;
  min: number;
  max: number;
  modal: number;
}

export interface CommodityPriceStats {
  commodity: string;
  quotes: number;
  markets: number;
  states: string[];
  varieties: string[];
  grades: string[];
  medianModal: number;
  minModal: number;
  maxModal: number;
  iqr: [number, number];
  bandPercent: number;
  modalPosition: number;
  bestMarket: string;
  bestMarketPrice: number;
  worstMarket: string;
  worstMarketPrice: number;
  crossMarketSpread: number;
  marketQuotes: MarketQuote[];
}

export interface ModelTelemetry {
  trainedAt: string;
  rows: number;
  commoditiesCount: number;
  marketsCount: number;
  statesCount: number;
  snapshotDate: string;
  kFoldR2: number;
  kFoldMae: number;
  kFoldMape: number;
  inSampleR2: number;
  inSampleMape: number;
  leaveOneOutMape: number;
}

export interface AiModelWeights {
  intercepts: {
    modal: number;
    min: number;
    max: number;
    basePriceModal: number;
    basePriceMin: number;
    basePriceMax: number;
  };
  features: {
    commodity: Record<string, { modal: number; min: number; max: number; modalMultiplier: number }>;
    state: Record<string, { modal: number; min: number; max: number; modalMultiplier: number }>;
    market: Record<string, { modal: number; min: number; max: number; modalMultiplier: number }>;
    variety: Record<string, { modal: number; min: number; max: number; modalMultiplier: number }>;
    grade: Record<string, { modal: number; min: number; max: number; modalMultiplier: number }>;
  };
}

export const AI_MODEL_METADATA = {
  "rows": 192,
  "rejectedRows": 0,
  "commodities": 55,
  "markets": 35,
  "states": 10,
  "snapshotDate": "12/09/2026",
  "distinctDates": 1,
  "trainedAt": "2026-09-12 10:50:33 UTC",
  "algorithm": "Multi-Target Log-Linear Ridge Regression with Empirical Bayes Priors",
  "featuresUsed": [
    "Commodity",
    "State",
    "Market",
    "Variety",
    "Grade"
  ],
  "supportsForecasting": false
} as const;
export const AI_MODEL_VALIDATION = {
  "kFold": {
    "splits": 5,
    "r2": 0.473,
    "mae": 1444.9,
    "mape": 39.0,
    "medianApe": 31.8
  },
  "leaveOneOut": {
    "samples": 192,
    "mape": 38.7,
    "medianApe": 30.4
  },
  "inSample": {
    "r2": 0.884,
    "mae": 659.4,
    "mape": 17.9
  }
} as const;
export const AI_MODEL_WEIGHTS: AiModelWeights = {
  "intercepts": {
    "modal": 7.9678,
    "min": 7.8577,
    "max": 8.0181,
    "basePriceModal": 2886,
    "basePriceMin": 2586,
    "basePriceMax": 3035
  },
  "features": {
    "commodity": {
      "Amaranthus": {
        "modal": 0.0401,
        "min": 0.0467,
        "max": 0.0367,
        "modalMultiplier": 1.0409
      },
      "Apple": {
        "modal": 1.1407,
        "min": 1.0714,
        "max": 1.1246,
        "modalMultiplier": 3.1291
      },
      "Ashgourd": {
        "modal": -0.306,
        "min": -0.3104,
        "max": -0.2923,
        "modalMultiplier": 0.7364
      },
      "Bajra(Pearl Millet/Cumbu)": {
        "modal": -0.1187,
        "min": -0.116,
        "max": -0.1174,
        "modalMultiplier": 0.8881
      },
      "Banana": {
        "modal": -0.0108,
        "min": -0.037,
        "max": -0.0362,
        "modalMultiplier": 0.9892
      },
      "Banana - Green": {
        "modal": -0.24,
        "min": -0.2452,
        "max": -0.2261,
        "modalMultiplier": 0.7866
      },
      "Beetroot": {
        "modal": -0.1268,
        "min": -0.1237,
        "max": -0.1093,
        "modalMultiplier": 0.8809
      },
      "Bengal Gram(Gram)(Whole)": {
        "modal": 0.1791,
        "min": 0.1818,
        "max": 0.1803,
        "modalMultiplier": 1.1961
      },
      "Bhindi(Ladies Finger)": {
        "modal": -0.148,
        "min": -0.1758,
        "max": -0.1362,
        "modalMultiplier": 0.8624
      },
      "Bitter gourd": {
        "modal": -0.0777,
        "min": -0.1078,
        "max": -0.0736,
        "modalMultiplier": 0.9253
      },
      "Bottle gourd": {
        "modal": -0.5178,
        "min": -0.4996,
        "max": -0.5249,
        "modalMultiplier": 0.5958
      },
      "Brinjal": {
        "modal": -0.2886,
        "min": -0.2724,
        "max": -0.2959,
        "modalMultiplier": 0.7493
      },
      "Cabbage": {
        "modal": -0.2811,
        "min": -0.2778,
        "max": -0.3434,
        "modalMultiplier": 0.755
      },
      "Capsicum": {
        "modal": 0.2435,
        "min": 0.2071,
        "max": 0.2454,
        "modalMultiplier": 1.2757
      },
      "Carrot": {
        "modal": 0.1254,
        "min": 0.0761,
        "max": 0.1277,
        "modalMultiplier": 1.1336
      },
      "Cauliflower": {
        "modal": 0.1501,
        "min": 0.1674,
        "max": 0.1589,
        "modalMultiplier": 1.1619
      },
      "Chili Red": {
        "modal": 0.5462,
        "min": 0.4716,
        "max": 0.5665,
        "modalMultiplier": 1.7267
      },
      "Cluster beans": {
        "modal": 0.3734,
        "min": 0.3875,
        "max": 0.3248,
        "modalMultiplier": 1.4526
      },
      "Colacasia": {
        "modal": -0.1681,
        "min": -0.1229,
        "max": -0.1869,
        "modalMultiplier": 0.8453
      },
      "Coriander(Leaves)": {
        "modal": 0.1862,
        "min": 0.2103,
        "max": 0.145,
        "modalMultiplier": 1.2046
      },
      "Cotton": {
        "modal": 0.3512,
        "min": 0.3461,
        "max": 0.3601,
        "modalMultiplier": 1.4207
      },
      "Cowpea(Veg)": {
        "modal": -0.4901,
        "min": -0.4897,
        "max": -0.48,
        "modalMultiplier": 0.6126
      },
      "Cucumbar(Kheera)": {
        "modal": -0.2715,
        "min": -0.2582,
        "max": -0.2453,
        "modalMultiplier": 0.7623
      },
      "Drumstick": {
        "modal": 0.3918,
        "min": 0.3961,
        "max": 0.395,
        "modalMultiplier": 1.4796
      },
      "Elephant Yam(Suran)/Amorphophallus": {
        "modal": 0.1064,
        "min": 0.1152,
        "max": 0.1064,
        "modalMultiplier": 1.1122
      },
      "Galgal(Lemon)": {
        "modal": -0.4059,
        "min": -0.4362,
        "max": -0.3992,
        "modalMultiplier": 0.6664
      },
      "Ginger(Dry)": {
        "modal": 0.2989,
        "min": 0.3365,
        "max": 0.2881,
        "modalMultiplier": 1.3484
      },
      "Ginger(Green)": {
        "modal": 0.5658,
        "min": 0.5821,
        "max": 0.5344,
        "modalMultiplier": 1.7608
      },
      "Green Chilli": {
        "modal": 0.0617,
        "min": 0.0683,
        "max": 0.0629,
        "modalMultiplier": 1.0636
      },
      "Guava": {
        "modal": 0.2584,
        "min": 0.2335,
        "max": 0.2088,
        "modalMultiplier": 1.2949
      },
      "Indian Beans(Seam)": {
        "modal": 0.0562,
        "min": 0.0259,
        "max": 0.0629,
        "modalMultiplier": 1.0578
      },
      "Lemon": {
        "modal": 0.5903,
        "min": 0.6239,
        "max": 0.5596,
        "modalMultiplier": 1.8046
      },
      "Little gourd(Kundru)": {
        "modal": 0.0197,
        "min": 0.03,
        "max": 0.0061,
        "modalMultiplier": 1.0198
      },
      "Long Melon(Kakri)": {
        "modal": -0.3168,
        "min": -0.3335,
        "max": -0.3207,
        "modalMultiplier": 0.7284
      },
      "Maize": {
        "modal": -0.1726,
        "min": -0.1618,
        "max": -0.1655,
        "modalMultiplier": 0.8415
      },
      "Mango(Raw-Ripe)": {
        "modal": -0.1951,
        "min": -0.1974,
        "max": -0.1145,
        "modalMultiplier": 0.8228
      },
      "Mousambi(Sweet Lime)": {
        "modal": 0.1142,
        "min": 0.1432,
        "max": 0.0549,
        "modalMultiplier": 1.1209
      },
      "Onion": {
        "modal": 0.4153,
        "min": 0.4474,
        "max": 0.3785,
        "modalMultiplier": 1.5148
      },
      "Paddy(Common)": {
        "modal": -0.2782,
        "min": -0.2694,
        "max": -0.2807,
        "modalMultiplier": 0.7571
      },
      "Papaya(Raw)": {
        "modal": -0.2383,
        "min": -0.2444,
        "max": -0.2505,
        "modalMultiplier": 0.7879
      },
      "Pointed gourd(Parval)": {
        "modal": 0.461,
        "min": 0.4894,
        "max": 0.4364,
        "modalMultiplier": 1.5856
      },
      "Potato": {
        "modal": -0.6653,
        "min": -0.6621,
        "max": -0.2899,
        "modalMultiplier": 0.5141
      },
      "Pumpkin": {
        "modal": -0.5166,
        "min": -0.5031,
        "max": -0.5433,
        "modalMultiplier": 0.5966
      },
      "Raddish": {
        "modal": 0.1643,
        "min": 0.1404,
        "max": 0.1143,
        "modalMultiplier": 1.1785
      },
      "Ragi(Finger Millet)": {
        "modal": -0.0463,
        "min": -0.0302,
        "max": -0.062,
        "modalMultiplier": 0.9548
      },
      "Red gram/Arhar/Tur(whole)": {
        "modal": 0.1602,
        "min": 0.1761,
        "max": 0.1528,
        "modalMultiplier": 1.1737
      },
      "Rice": {
        "modal": 0.0166,
        "min": 0.0185,
        "max": 0.0899,
        "modalMultiplier": 1.0168
      },
      "Ridgeguard(Tori)": {
        "modal": 0.2845,
        "min": 0.2878,
        "max": 0.2315,
        "modalMultiplier": 1.3291
      },
      "Snakeguard": {
        "modal": -0.2439,
        "min": -0.2442,
        "max": -0.2354,
        "modalMultiplier": 0.7835
      },
      "Sweet Potato": {
        "modal": -0.1529,
        "min": -0.1503,
        "max": -0.1493,
        "modalMultiplier": 0.8582
      },
      "Tapioca": {
        "modal": -0.2956,
        "min": -0.3124,
        "max": -0.2767,
        "modalMultiplier": 0.7441
      },
      "Tinda": {
        "modal": 0.1922,
        "min": 0.1942,
        "max": 0.1762,
        "modalMultiplier": 1.2119
      },
      "Tomato": {
        "modal": -0.1582,
        "min": -0.1532,
        "max": -0.1587,
        "modalMultiplier": 0.8536
      },
      "Water Melon": {
        "modal": -0.4365,
        "min": -0.4093,
        "max": -0.5005,
        "modalMultiplier": 0.6463
      },
      "Wood": {
        "modal": -0.3257,
        "min": -0.3308,
        "max": -0.3144,
        "modalMultiplier": 0.722
      }
    },
    "state": {
      "Andhra Pradesh": {
        "modal": 0.3111,
        "min": 0.337,
        "max": 0.306,
        "modalMultiplier": 1.365
      },
      "Bihar": {
        "modal": -0.1106,
        "min": -0.073,
        "max": -0.1574,
        "modalMultiplier": 0.8953
      },
      "Haryana": {
        "modal": -0.0149,
        "min": -0.073,
        "max": 0.0138,
        "modalMultiplier": 0.9852
      },
      "Keralam": {
        "modal": 0.4921,
        "min": 0.5047,
        "max": 0.4964,
        "modalMultiplier": 1.6357
      },
      "Punjab": {
        "modal": -0.1252,
        "min": -0.1233,
        "max": -0.0902,
        "modalMultiplier": 0.8823
      },
      "Rajasthan": {
        "modal": -0.0607,
        "min": -0.0786,
        "max": -0.0328,
        "modalMultiplier": 0.9411
      },
      "Telangana": {
        "modal": 0.0408,
        "min": 0.0496,
        "max": 0.0413,
        "modalMultiplier": 1.0417
      },
      "Tripura": {
        "modal": 0.1465,
        "min": 0.1556,
        "max": 0.08,
        "modalMultiplier": 1.1578
      },
      "Uttar Pradesh": {
        "modal": -0.3822,
        "min": -0.3521,
        "max": -0.4075,
        "modalMultiplier": 0.6823
      },
      "Uttarakhand": {
        "modal": -0.2969,
        "min": -0.3469,
        "max": -0.2497,
        "modalMultiplier": 0.7431
      }
    },
    "market": {
      "Araku Valley APMC": {
        "modal": 0.2989,
        "min": 0.3365,
        "max": 0.2881,
        "modalMultiplier": 1.3484
      },
      "Atmakur (Nandyal District) APMC": {
        "modal": -0.0654,
        "min": -0.0805,
        "max": -0.056,
        "modalMultiplier": 0.9366
      },
      "Babrala APMC": {
        "modal": -0.3822,
        "min": -0.3521,
        "max": -0.4075,
        "modalMultiplier": 0.6823
      },
      "Bhadrachalam APMC": {
        "modal": 0.0408,
        "min": 0.0496,
        "max": 0.0413,
        "modalMultiplier": 1.0417
      },
      "Bhimunipatnam APMC": {
        "modal": -0.0463,
        "min": -0.0302,
        "max": -0.062,
        "modalMultiplier": 0.9548
      },
      "Bihpur APMC": {
        "modal": 0.2044,
        "min": 0.2089,
        "max": 0.1979,
        "modalMultiplier": 1.2267
      },
      "Dasda APMC": {
        "modal": 0.1465,
        "min": 0.1556,
        "max": 0.08,
        "modalMultiplier": 1.1578
      },
      "Etcherla APMC": {
        "modal": -0.1149,
        "min": -0.105,
        "max": -0.1252,
        "modalMultiplier": 0.8914
      },
      "Gurazala APMC": {
        "modal": 0.5462,
        "min": 0.4716,
        "max": 0.5665,
        "modalMultiplier": 1.7267
      },
      "Gurgaon APMC": {
        "modal": -0.0149,
        "min": -0.073,
        "max": 0.0138,
        "modalMultiplier": 0.9852
      },
      "Irinjalakkuda Market": {
        "modal": 0.0283,
        "min": 0.0378,
        "max": 0.0264,
        "modalMultiplier": 1.0287
      },
      "Jalore APMC": {
        "modal": -0.0607,
        "min": -0.0786,
        "max": -0.0328,
        "modalMultiplier": 0.9411
      },
      "Kakinada (Urban) APMC": {
        "modal": -0.0696,
        "min": -0.0687,
        "max": -0.0644,
        "modalMultiplier": 0.9327
      },
      "Karapa APMC": {
        "modal": -0.0302,
        "min": -0.0342,
        "max": -0.0249,
        "modalMultiplier": 0.9703
      },
      "Kavali APMC": {
        "modal": 0.0096,
        "min": 0.02,
        "max": -0.0263,
        "modalMultiplier": 1.0096
      },
      "Kottarakkara Market": {
        "modal": -0.312,
        "min": -0.2662,
        "max": -0.4039,
        "modalMultiplier": 0.732
      },
      "Maddipadu APMC": {
        "modal": 0.0267,
        "min": 0.0338,
        "max": 0.0279,
        "modalMultiplier": 1.0271
      },
      "Markapur APMC": {
        "modal": 0.1644,
        "min": 0.1719,
        "max": 0.1625,
        "modalMultiplier": 1.1787
      },
      "Parassala Market": {
        "modal": 0.1209,
        "min": 0.1243,
        "max": 0.1274,
        "modalMultiplier": 1.1286
      },
      "Peddapuram APMC": {
        "modal": -0.0218,
        "min": -0.0322,
        "max": -0.0162,
        "modalMultiplier": 0.9785
      },
      "Phirangipuram APMC": {
        "modal": 0.1868,
        "min": 0.1742,
        "max": 0.1976,
        "modalMultiplier": 1.2054
      },
      "Piravam Market": {
        "modal": 0.5371,
        "min": 0.4787,
        "max": 0.5784,
        "modalMultiplier": 1.7111
      },
      "Pithapuram APMC": {
        "modal": -0.0262,
        "min": -0.0322,
        "max": -0.0193,
        "modalMultiplier": 0.9741
      },
      "Podili APMC": {
        "modal": 0.1602,
        "min": 0.1761,
        "max": 0.1528,
        "modalMultiplier": 1.1737
      },
      "Prattipadu APMC": {
        "modal": -0.0262,
        "min": -0.0322,
        "max": -0.0193,
        "modalMultiplier": 0.9741
      },
      "RAYADURG APMC": {
        "modal": -0.5614,
        "min": -0.539,
        "max": -0.5405,
        "modalMultiplier": 0.5704
      },
      "Rampachodvaram APMC": {
        "modal": -0.0373,
        "min": -0.0127,
        "max": -0.0529,
        "modalMultiplier": 0.9634
      },
      "Rampuraphul(Nabha Mandi) APMC": {
        "modal": 0.0816,
        "min": 0.0139,
        "max": 0.2068,
        "modalMultiplier": 1.085
      },
      "Raxaul APMC": {
        "modal": -0.315,
        "min": -0.2819,
        "max": -0.3552,
        "modalMultiplier": 0.7298
      },
      "Rayya APMC": {
        "modal": -0.573,
        "min": -0.5435,
        "max": -0.6173,
        "modalMultiplier": 0.5638
      },
      "Roorkee APMC": {
        "modal": -0.2969,
        "min": -0.3469,
        "max": -0.2497,
        "modalMultiplier": 0.7431
      },
      "Sahnewal APMC": {
        "modal": 0.3662,
        "min": 0.4063,
        "max": 0.3204,
        "modalMultiplier": 1.4423
      },
      "Santhamaguluru APMC": {
        "modal": -0.0908,
        "min": -0.1005,
        "max": -0.0825,
        "modalMultiplier": 0.9132
      },
      "Vamanapuram Market": {
        "modal": 0.1177,
        "min": 0.13,
        "max": 0.1681,
        "modalMultiplier": 1.1249
      },
      "Yellamanchili APMC": {
        "modal": 0.0087,
        "min": 0.0204,
        "max": 0.0001,
        "modalMultiplier": 1.0087
      }
    },
    "variety": {
      "1001": {
        "modal": -0.133,
        "min": -0.1233,
        "max": -0.1325,
        "modalMultiplier": 0.8754
      },
      "1121": {
        "modal": -0.0411,
        "min": -0.0444,
        "max": -0.0298,
        "modalMultiplier": 0.9597
      },
      "1st Sort": {
        "modal": 0.3053,
        "min": 0.3283,
        "max": 0.3221,
        "modalMultiplier": 1.357
      },
      "Amaranthus": {
        "modal": 0.0861,
        "min": 0.0972,
        "max": 0.0566,
        "modalMultiplier": 1.0899
      },
      "Amorphophallus": {
        "modal": -0.2623,
        "min": -0.257,
        "max": -0.2618,
        "modalMultiplier": 0.7693
      },
      "Apple": {
        "modal": 0.0288,
        "min": -0.0165,
        "max": 0.1312,
        "modalMultiplier": 1.0292
      },
      "Arhar (Whole)": {
        "modal": 0.1602,
        "min": 0.1761,
        "max": 0.1528,
        "modalMultiplier": 1.1737
      },
      "Ashgourd": {
        "modal": -0.2793,
        "min": -0.3012,
        "max": -0.2575,
        "modalMultiplier": 0.7563
      },
      "B P T": {
        "modal": -0.0193,
        "min": -0.0222,
        "max": -0.013,
        "modalMultiplier": 0.9808
      },
      "Banana - Green": {
        "modal": 0.1294,
        "min": 0.1048,
        "max": 0.1517,
        "modalMultiplier": 1.1382
      },
      "Beetroot": {
        "modal": 0.0403,
        "min": 0.0606,
        "max": 0.0113,
        "modalMultiplier": 1.0411
      },
      "Bhindi": {
        "modal": -0.1297,
        "min": -0.1052,
        "max": -0.1499,
        "modalMultiplier": 0.8783
      },
      "Bitter Gourd": {
        "modal": -0.0476,
        "min": -0.0033,
        "max": -0.0357,
        "modalMultiplier": 0.9535
      },
      "Bold": {
        "modal": -0.1187,
        "min": -0.116,
        "max": -0.1174,
        "modalMultiplier": 0.8881
      },
      "Bottle Gourd": {
        "modal": -0.3216,
        "min": -0.3253,
        "max": -0.2853,
        "modalMultiplier": 0.725
      },
      "Brinjal": {
        "modal": -0.3642,
        "min": -0.3652,
        "max": -0.3481,
        "modalMultiplier": 0.6947
      },
      "Cabbage": {
        "modal": -0.1019,
        "min": -0.1235,
        "max": -0.0429,
        "modalMultiplier": 0.9031
      },
      "Capsicum": {
        "modal": -0.0532,
        "min": -0.0304,
        "max": -0.0478,
        "modalMultiplier": 0.9482
      },
      "Carrot": {
        "modal": -0.1668,
        "min": -0.1105,
        "max": -0.1784,
        "modalMultiplier": 0.8464
      },
      "Cauliflower": {
        "modal": -0.1237,
        "min": -0.1617,
        "max": -0.1774,
        "modalMultiplier": 0.8837
      },
      "Cluster Beans": {
        "modal": -0.3751,
        "min": -0.3852,
        "max": -0.3444,
        "modalMultiplier": 0.6872
      },
      "Common": {
        "modal": -0.0696,
        "min": -0.0687,
        "max": -0.0644,
        "modalMultiplier": 0.9327
      },
      "Coriander": {
        "modal": 0.0015,
        "min": -0.0221,
        "max": 0.0107,
        "modalMultiplier": 1.0015
      },
      "Cotton (Unginned)": {
        "modal": 0.1868,
        "min": 0.1742,
        "max": 0.1976,
        "modalMultiplier": 1.2054
      },
      "Cowpea (Veg)": {
        "modal": 0.5547,
        "min": 0.547,
        "max": 0.5656,
        "modalMultiplier": 1.7415
      },
      "Cucumbar": {
        "modal": -0.139,
        "min": -0.1845,
        "max": -0.15,
        "modalMultiplier": 0.8703
      },
      "Deshi White": {
        "modal": -0.0738,
        "min": -0.0607,
        "max": -0.0954,
        "modalMultiplier": 0.9288
      },
      "Desi": {
        "modal": 0.1644,
        "min": 0.1719,
        "max": 0.1625,
        "modalMultiplier": 1.1787
      },
      "Drumstick": {
        "modal": -0.2453,
        "min": -0.2411,
        "max": -0.2549,
        "modalMultiplier": 0.7825
      },
      "Elephant Yam (Suran)": {
        "modal": 0.3435,
        "min": 0.3561,
        "max": 0.3239,
        "modalMultiplier": 1.4099
      },
      "Eucalyptus": {
        "modal": -0.3257,
        "min": -0.3308,
        "max": -0.3144,
        "modalMultiplier": 0.722
      },
      "Ginger-Organic": {
        "modal": 0.2989,
        "min": 0.3365,
        "max": 0.2881,
        "modalMultiplier": 1.3484
      },
      "Green Chilly": {
        "modal": -0.0529,
        "min": -0.0418,
        "max": -0.0685,
        "modalMultiplier": 0.9485
      },
      "Green Ginger": {
        "modal": 0.1398,
        "min": 0.1602,
        "max": 0.14,
        "modalMultiplier": 1.1501
      },
      "Guava": {
        "modal": 0.617,
        "min": 0.5421,
        "max": 0.7418,
        "modalMultiplier": 1.8534
      },
      "Gulabi": {
        "modal": 0.1791,
        "min": 0.1818,
        "max": 0.1803,
        "modalMultiplier": 1.1961
      },
      "Hybrid": {
        "modal": -0.1052,
        "min": -0.1104,
        "max": -0.1045,
        "modalMultiplier": 0.9001
      },
      "Lemon": {
        "modal": 0.3478,
        "min": 0.3875,
        "max": 0.3292,
        "modalMultiplier": 1.416
      },
      "Local": {
        "modal": 0.4514,
        "min": 0.4516,
        "max": 0.4552,
        "modalMultiplier": 1.5704
      },
      "Mango - Raw-Ripe": {
        "modal": -0.1951,
        "min": -0.1974,
        "max": -0.1145,
        "modalMultiplier": 0.8228
      },
      "Mousambi": {
        "modal": 0.1142,
        "min": 0.1432,
        "max": 0.0549,
        "modalMultiplier": 1.1209
      },
      "Nendra Bale": {
        "modal": 0.2541,
        "min": 0.2857,
        "max": 0.2555,
        "modalMultiplier": 1.2893
      },
      "Onion": {
        "modal": -0.2478,
        "min": -0.2926,
        "max": -0.1537,
        "modalMultiplier": 0.7805
      },
      "Other": {
        "modal": -0.1302,
        "min": -0.1268,
        "max": -0.0929,
        "modalMultiplier": 0.8779
      },
      "Palayamthodan": {
        "modal": -0.3108,
        "min": -0.3058,
        "max": -0.2851,
        "modalMultiplier": 0.7329
      },
      "Potato": {
        "modal": -0.0546,
        "min": -0.0381,
        "max": -0.3672,
        "modalMultiplier": 0.9468
      },
      "Pumpkin": {
        "modal": -0.0593,
        "min": -0.0826,
        "max": -0.0204,
        "modalMultiplier": 0.9425
      },
      "Rasakathai": {
        "modal": 0.1732,
        "min": 0.2023,
        "max": 0.177,
        "modalMultiplier": 1.1891
      },
      "Red": {
        "modal": 0.5462,
        "min": 0.4716,
        "max": 0.5665,
        "modalMultiplier": 1.7267
      },
      "Red Banana": {
        "modal": 0.2541,
        "min": 0.2857,
        "max": 0.2555,
        "modalMultiplier": 1.2893
      },
      "Red Nanital": {
        "modal": 0.3236,
        "min": 0.3356,
        "max": 0.0934,
        "modalMultiplier": 1.3821
      },
      "Ridgeguard(Tori)": {
        "modal": -0.2237,
        "min": -0.2235,
        "max": -0.3249,
        "modalMultiplier": 0.7995
      },
      "Robusta": {
        "modal": -0.3108,
        "min": -0.3058,
        "max": -0.2851,
        "modalMultiplier": 0.7329
      },
      "Round": {
        "modal": 0.2149,
        "min": 0.2104,
        "max": 0.2117,
        "modalMultiplier": 1.2398
      },
      "Round/Long": {
        "modal": 0.0328,
        "min": 0.0205,
        "max": 0.0978,
        "modalMultiplier": 1.0333
      },
      "Samba Masuri": {
        "modal": 0.0408,
        "min": 0.0496,
        "max": 0.0413,
        "modalMultiplier": 1.0417
      },
      "Snakeguard": {
        "modal": -0.1907,
        "min": -0.2003,
        "max": -0.1846,
        "modalMultiplier": 0.8264
      },
      "Sona": {
        "modal": -0.0654,
        "min": -0.0805,
        "max": -0.056,
        "modalMultiplier": 0.9366
      },
      "Sweet Potato": {
        "modal": -0.1529,
        "min": -0.1503,
        "max": -0.1493,
        "modalMultiplier": 0.8582
      },
      "Tapioca": {
        "modal": -0.2956,
        "min": -0.3124,
        "max": -0.2767,
        "modalMultiplier": 0.7441
      },
      "Tinda": {
        "modal": -0.2268,
        "min": -0.2304,
        "max": -0.2169,
        "modalMultiplier": 0.797
      },
      "Tomato": {
        "modal": 0.024,
        "min": 0.0169,
        "max": 0.0272,
        "modalMultiplier": 1.0243
      }
    },
    "grade": {
      "FAQ": {
        "modal": -0.0538,
        "min": 0.0166,
        "max": -0.1033,
        "modalMultiplier": 0.9476
      },
      "Grade A": {
        "modal": -0.0491,
        "min": -0.0998,
        "max": 0.0222,
        "modalMultiplier": 0.9521
      },
      "Grade B": {
        "modal": -0.1992,
        "min": -0.2412,
        "max": -0.1569,
        "modalMultiplier": 0.8194
      },
      "Grade Range-1": {
        "modal": 0.0677,
        "min": 0.0202,
        "max": 0.0602,
        "modalMultiplier": 1.07
      },
      "Grade Range-2": {
        "modal": -0.0373,
        "min": -0.0127,
        "max": -0.0529,
        "modalMultiplier": 0.9634
      },
      "Local": {
        "modal": -0.0974,
        "min": -0.0536,
        "max": -0.1072,
        "modalMultiplier": 0.9072
      },
      "Medium": {
        "modal": 0.209,
        "min": 0.1944,
        "max": 0.1849,
        "modalMultiplier": 1.2324
      },
      "Non-FAQ": {
        "modal": 0.1602,
        "min": 0.1761,
        "max": 0.1528,
        "modalMultiplier": 1.1737
      }
    }
  }
};
export const ALL_COMMODITIES: string[] = [
  "Amaranthus",
  "Apple",
  "Ashgourd",
  "Bajra(Pearl Millet/Cumbu)",
  "Banana",
  "Banana - Green",
  "Beetroot",
  "Bengal Gram(Gram)(Whole)",
  "Bhindi(Ladies Finger)",
  "Bitter gourd",
  "Bottle gourd",
  "Brinjal",
  "Cabbage",
  "Capsicum",
  "Carrot",
  "Cauliflower",
  "Chili Red",
  "Cluster beans",
  "Colacasia",
  "Coriander(Leaves)",
  "Cotton",
  "Cowpea(Veg)",
  "Cucumbar(Kheera)",
  "Drumstick",
  "Elephant Yam(Suran)/Amorphophallus",
  "Galgal(Lemon)",
  "Ginger(Dry)",
  "Ginger(Green)",
  "Green Chilli",
  "Guava",
  "Indian Beans(Seam)",
  "Lemon",
  "Little gourd(Kundru)",
  "Long Melon(Kakri)",
  "Maize",
  "Mango(Raw-Ripe)",
  "Mousambi(Sweet Lime)",
  "Onion",
  "Paddy(Common)",
  "Papaya(Raw)",
  "Pointed gourd(Parval)",
  "Potato",
  "Pumpkin",
  "Raddish",
  "Ragi(Finger Millet)",
  "Red gram/Arhar/Tur(whole)",
  "Rice",
  "Ridgeguard(Tori)",
  "Snakeguard",
  "Sweet Potato",
  "Tapioca",
  "Tinda",
  "Tomato",
  "Water Melon",
  "Wood"
];
export const ALL_STATES: string[] = [
  "Andhra Pradesh",
  "Bihar",
  "Haryana",
  "Keralam",
  "Punjab",
  "Rajasthan",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand"
];
export const ALL_MARKETS: string[] = [
  "Araku Valley APMC",
  "Atmakur (Nandyal District) APMC",
  "Babrala APMC",
  "Bhadrachalam APMC",
  "Bhimunipatnam APMC",
  "Bihpur APMC",
  "Dasda APMC",
  "Etcherla APMC",
  "Gurazala APMC",
  "Gurgaon APMC",
  "Irinjalakkuda Market",
  "Jalore APMC",
  "Kakinada (Urban) APMC",
  "Karapa APMC",
  "Kavali APMC",
  "Kottarakkara Market",
  "Maddipadu APMC",
  "Markapur APMC",
  "Parassala Market",
  "Peddapuram APMC",
  "Phirangipuram APMC",
  "Piravam Market",
  "Pithapuram APMC",
  "Podili APMC",
  "Prattipadu APMC",
  "RAYADURG APMC",
  "Rampachodvaram APMC",
  "Rampuraphul(Nabha Mandi) APMC",
  "Raxaul APMC",
  "Rayya APMC",
  "Roorkee APMC",
  "Sahnewal APMC",
  "Santhamaguluru APMC",
  "Vamanapuram Market",
  "Yellamanchili APMC"
];
export const ALL_GRADES: string[] = [
  "FAQ",
  "Grade A",
  "Grade B",
  "Grade Range-1",
  "Grade Range-2",
  "Local",
  "Medium",
  "Non-FAQ"
];
export const GEO_HIERARCHY = {
  "Bihar": {
    "districts": [
      "Bhagalpur",
      "East Champaran/ Motihari"
    ],
    "markets": [
      "Bihpur APMC",
      "Raxaul APMC"
    ],
    "factor": 1.0488,
    "quotes": 7
  },
  "Haryana": {
    "districts": [
      "Gurgaon"
    ],
    "markets": [
      "Gurgaon APMC"
    ],
    "factor": 0.9547,
    "quotes": 14
  },
  "Uttarakhand": {
    "districts": [
      "Haridwar"
    ],
    "markets": [
      "Roorkee APMC"
    ],
    "factor": 0.64,
    "quotes": 11
  },
  "Keralam": {
    "districts": [
      "Ernakulam",
      "Kollam",
      "Thirssur",
      "Thiruvananthapuram"
    ],
    "markets": [
      "Irinjalakkuda Market",
      "Kottarakkara Market",
      "Parassala Market",
      "Piravam Market",
      "Vamanapuram Market"
    ],
    "factor": 1.1053,
    "quotes": 77
  },
  "Punjab": {
    "districts": [
      "Amritsar",
      "Bhatinda",
      "Ludhiana"
    ],
    "markets": [
      "Rampuraphul(Nabha Mandi) APMC",
      "Rayya APMC",
      "Sahnewal APMC"
    ],
    "factor": 0.978,
    "quotes": 36
  },
  "Rajasthan": {
    "districts": [
      "Jalore"
    ],
    "markets": [
      "Jalore APMC"
    ],
    "factor": 0.8,
    "quotes": 15
  },
  "Andhra Pradesh": {
    "districts": [
      "Alluri Sitharama Raju",
      "Anakapally",
      "Ananthapuramu",
      "Guntur",
      "Kakinada",
      "Markapuram",
      "Nandyal",
      "Palnadu",
      "Polavaram",
      "Prakasam",
      "SPSR Nellore",
      "Srikakulam",
      "Visakhapatnam"
    ],
    "markets": [
      "Araku Valley APMC",
      "Atmakur (Nandyal District) APMC",
      "Bhimunipatnam APMC",
      "Etcherla APMC",
      "Gurazala APMC",
      "Kakinada (Urban) APMC",
      "Karapa APMC",
      "Kavali APMC",
      "Maddipadu APMC",
      "Markapur APMC",
      "Peddapuram APMC",
      "Phirangipuram APMC",
      "Pithapuram APMC",
      "Podili APMC",
      "Prattipadu APMC",
      "RAYADURG APMC",
      "Rampachodvaram APMC",
      "Santhamaguluru APMC",
      "Yellamanchili APMC"
    ],
    "factor": 1.0,
    "quotes": 24
  },
  "Tripura": {
    "districts": [
      "North Tripura"
    ],
    "markets": [
      "Dasda APMC"
    ],
    "factor": 1.3518,
    "quotes": 4
  },
  "Uttar Pradesh": {
    "districts": [
      "Badaun"
    ],
    "markets": [
      "Babrala APMC"
    ],
    "factor": 0.8917,
    "quotes": 3
  },
  "Telangana": {
    "districts": [
      "Bhadradri Kothagudem"
    ],
    "markets": [
      "Bhadrachalam APMC"
    ],
    "factor": 1.0,
    "quotes": 1
  }
};
export const COMMODITY_STATS: Record<string, CommodityPriceStats> = {
  "Bitter gourd": {
    "commodity": "Bitter gourd",
    "quotes": 8,
    "markets": 8,
    "states": [
      "Bihar",
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Uttarakhand"
    ],
    "varieties": [
      "Bitter Gourd",
      "Other"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Grade B",
      "Local"
    ],
    "medianModal": 1900,
    "minModal": 750,
    "maxModal": 7500,
    "iqr": [
      1238,
      3625
    ],
    "bandPercent": 16.3,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 7500,
    "worstMarket": "Roorkee APMC",
    "worstMarketPrice": 750,
    "crossMarketSpread": 6750,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Bitter Gourd",
        "grade": "Local",
        "min": 7000,
        "max": 8200,
        "modal": 7500
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 4000,
        "max": 4000,
        "modal": 4000
      },
      {
        "market": "Bihpur APMC",
        "district": "Bhagalpur",
        "state": "Bihar",
        "variety": "Bitter Gourd",
        "grade": "Local",
        "min": 2500,
        "max": 2500,
        "modal": 2500
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Other",
        "grade": "Local",
        "min": 2000,
        "max": 2500,
        "modal": 2300
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade B",
        "min": 1000,
        "max": 2000,
        "modal": 1500
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Bitter Gourd",
        "grade": "FAQ",
        "min": 1354,
        "max": 1354,
        "modal": 1354
      },
      {
        "market": "Raxaul APMC",
        "district": "East Champaran/ Motihari",
        "state": "Bihar",
        "variety": "Bitter Gourd",
        "grade": "Grade A",
        "min": 1100,
        "max": 1300,
        "modal": 1200
      },
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Local",
        "min": 650,
        "max": 850,
        "modal": 750
      }
    ]
  },
  "Tomato": {
    "commodity": "Tomato",
    "quotes": 9,
    "markets": 9,
    "states": [
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Uttarakhand"
    ],
    "varieties": [
      "Other",
      "Tomato"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Grade B",
      "Local",
      "Medium"
    ],
    "medianModal": 2500,
    "minModal": 715,
    "maxModal": 4000,
    "iqr": [
      1400,
      3475
    ],
    "bandPercent": 12.5,
    "modalPosition": 0.5,
    "bestMarket": "Vamanapuram Market",
    "bestMarketPrice": 4000,
    "worstMarket": "Rayya APMC",
    "worstMarketPrice": 715,
    "crossMarketSpread": 3285,
    "marketQuotes": [
      {
        "market": "Vamanapuram Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Other",
        "grade": "FAQ",
        "min": 4000,
        "max": 4500,
        "modal": 4000
      },
      {
        "market": "Sahnewal APMC",
        "district": "Ludhiana",
        "state": "Punjab",
        "variety": "Tomato",
        "grade": "FAQ",
        "min": 3750,
        "max": 3750,
        "modal": 3750
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Tomato",
        "grade": "Local",
        "min": 3000,
        "max": 3400,
        "modal": 3200
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 3000,
        "max": 3000,
        "modal": 3000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 2000,
        "max": 3000,
        "modal": 2500
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Tomato",
        "grade": "Local",
        "min": 2000,
        "max": 2400,
        "modal": 2200
      },
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Medium",
        "min": 1200,
        "max": 2200,
        "modal": 1600
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade B",
        "min": 1000,
        "max": 1400,
        "modal": 1200
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Other",
        "grade": "FAQ",
        "min": 715,
        "max": 715,
        "modal": 715
      }
    ]
  },
  "Cauliflower": {
    "commodity": "Cauliflower",
    "quotes": 6,
    "markets": 6,
    "states": [
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Uttarakhand"
    ],
    "varieties": [
      "Cauliflower",
      "Local",
      "Other"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Local"
    ],
    "medianModal": 3087,
    "minModal": 1200,
    "maxModal": 6500,
    "iqr": [
      1800,
      4250
    ],
    "bandPercent": 26.7,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 6500,
    "worstMarket": "Roorkee APMC",
    "worstMarketPrice": 1200,
    "crossMarketSpread": 5300,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Cauliflower",
        "grade": "Local",
        "min": 6000,
        "max": 7000,
        "modal": 6500
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Cauliflower",
        "grade": "Grade A",
        "min": 2500,
        "max": 4000,
        "modal": 3500
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Local",
        "grade": "FAQ",
        "min": 3174,
        "max": 3174,
        "modal": 3174
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade A",
        "min": 2500,
        "max": 3500,
        "modal": 3000
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Cauliflower",
        "grade": "Local",
        "min": 1800,
        "max": 2200,
        "modal": 2000
      },
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Local",
        "min": 1000,
        "max": 1600,
        "modal": 1200
      }
    ]
  },
  "Cowpea(Veg)": {
    "commodity": "Cowpea(Veg)",
    "quotes": 3,
    "markets": 3,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Cowpea (Veg)",
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 7000,
    "minModal": 1000,
    "maxModal": 7600,
    "iqr": [
      1000,
      7600
    ],
    "bandPercent": 7.9,
    "modalPosition": 0.417,
    "bestMarket": "Parassala Market",
    "bestMarketPrice": 7600,
    "worstMarket": "Kottarakkara Market",
    "worstMarketPrice": 1000,
    "crossMarketSpread": 6600,
    "marketQuotes": [
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Cowpea (Veg)",
        "grade": "Local",
        "min": 7400,
        "max": 8000,
        "modal": 7600
      },
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Cowpea (Veg)",
        "grade": "Local",
        "min": 6000,
        "max": 8000,
        "modal": 7000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 1000,
        "max": 1000,
        "modal": 1000
      }
    ]
  },
  "Carrot": {
    "commodity": "Carrot",
    "quotes": 5,
    "markets": 5,
    "states": [
      "Haryana",
      "Keralam",
      "Punjab"
    ],
    "varieties": [
      "Carrot",
      "Other"
    ],
    "grades": [
      "Grade A",
      "Grade B",
      "Local"
    ],
    "medianModal": 3600,
    "minModal": 2000,
    "maxModal": 7500,
    "iqr": [
      2500,
      5750
    ],
    "bandPercent": 13.3,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 7500,
    "worstMarket": "Rampuraphul(Nabha Mandi) APMC",
    "worstMarketPrice": 2000,
    "crossMarketSpread": 5500,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Carrot",
        "grade": "Local",
        "min": 7000,
        "max": 8000,
        "modal": 7500
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Carrot",
        "grade": "Local",
        "min": 3800,
        "max": 4200,
        "modal": 4000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 3600,
        "max": 3600,
        "modal": 3600
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade B",
        "min": 2000,
        "max": 4000,
        "modal": 3000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 1500,
        "max": 2500,
        "modal": 2000
      }
    ]
  },
  "Snakeguard": {
    "commodity": "Snakeguard",
    "quotes": 3,
    "markets": 3,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Other",
      "Snakeguard"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 3000,
    "minModal": 2100,
    "maxModal": 4500,
    "iqr": [
      2100,
      4500
    ],
    "bandPercent": 13.3,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 4500,
    "worstMarket": "Kottarakkara Market",
    "worstMarketPrice": 2100,
    "crossMarketSpread": 2400,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Snakeguard",
        "grade": "Local",
        "min": 4000,
        "max": 5000,
        "modal": 4500
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Snakeguard",
        "grade": "Local",
        "min": 2800,
        "max": 3200,
        "modal": 3000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 2100,
        "max": 2100,
        "modal": 2100
      }
    ]
  },
  "Raddish": {
    "commodity": "Raddish",
    "quotes": 2,
    "markets": 2,
    "states": [
      "Punjab"
    ],
    "varieties": [
      "Other"
    ],
    "grades": [
      "FAQ",
      "Grade A"
    ],
    "medianModal": 2040,
    "minModal": 2000,
    "maxModal": 2080,
    "iqr": [
      2000,
      2080
    ],
    "bandPercent": 25.0,
    "modalPosition": 0.5,
    "bestMarket": "Rayya APMC",
    "bestMarketPrice": 2080,
    "worstMarket": "Rampuraphul(Nabha Mandi) APMC",
    "worstMarketPrice": 2000,
    "crossMarketSpread": 80,
    "marketQuotes": [
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Other",
        "grade": "FAQ",
        "min": 2080,
        "max": 2080,
        "modal": 2080
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 1500,
        "max": 2500,
        "modal": 2000
      }
    ]
  },
  "Banana": {
    "commodity": "Banana",
    "quotes": 8,
    "markets": 4,
    "states": [
      "Haryana",
      "Keralam",
      "Punjab",
      "Uttarakhand"
    ],
    "varieties": [
      "Nendra Bale",
      "Other",
      "Palayamthodan",
      "Rasakathai",
      "Red Banana",
      "Robusta"
    ],
    "grades": [
      "Grade A",
      "Grade B",
      "Local",
      "Medium"
    ],
    "medianModal": 3000,
    "minModal": 1000,
    "maxModal": 7000,
    "iqr": [
      2625,
      6800
    ],
    "bandPercent": 13.3,
    "modalPosition": 0.5,
    "bestMarket": "Parassala Market",
    "bestMarketPrice": 7000,
    "worstMarket": "Roorkee APMC",
    "worstMarketPrice": 1000,
    "crossMarketSpread": 6000,
    "marketQuotes": [
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Nendra Bale",
        "grade": "Local",
        "min": 6800,
        "max": 7200,
        "modal": 7000
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Red Banana",
        "grade": "Local",
        "min": 6800,
        "max": 7200,
        "modal": 7000
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Rasakathai",
        "grade": "Local",
        "min": 6000,
        "max": 6400,
        "modal": 6200
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Palayamthodan",
        "grade": "Local",
        "min": 2800,
        "max": 3200,
        "modal": 3000
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade B",
        "min": 2000,
        "max": 4000,
        "modal": 3000
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Robusta",
        "grade": "Local",
        "min": 2800,
        "max": 3200,
        "modal": 3000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 2000,
        "max": 2700,
        "modal": 2500
      },
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Medium",
        "min": 800,
        "max": 1200,
        "modal": 1000
      }
    ]
  },
  "Cucumbar(Kheera)": {
    "commodity": "Cucumbar(Kheera)",
    "quotes": 7,
    "markets": 7,
    "states": [
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Uttarakhand"
    ],
    "varieties": [
      "Cucumbar",
      "Other"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Local"
    ],
    "medianModal": 2000,
    "minModal": 890,
    "maxModal": 5000,
    "iqr": [
      950,
      3000
    ],
    "bandPercent": 33.3,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 5000,
    "worstMarket": "Rayya APMC",
    "worstMarketPrice": 890,
    "crossMarketSpread": 4110,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Cucumbar",
        "grade": "Local",
        "min": 4000,
        "max": 6000,
        "modal": 5000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Cucumbar",
        "grade": "Grade A",
        "min": 2500,
        "max": 3500,
        "modal": 3000
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Cucumbar",
        "grade": "Local",
        "min": 2000,
        "max": 2400,
        "modal": 2200
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 2000,
        "max": 2000,
        "modal": 2000
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Cucumbar",
        "grade": "Local",
        "min": 1000,
        "max": 1400,
        "modal": 1200
      },
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Local",
        "min": 850,
        "max": 1200,
        "modal": 950
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Cucumbar",
        "grade": "FAQ",
        "min": 890,
        "max": 890,
        "modal": 890
      }
    ]
  },
  "Cabbage": {
    "commodity": "Cabbage",
    "quotes": 6,
    "markets": 6,
    "states": [
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan"
    ],
    "varieties": [
      "Cabbage",
      "Other"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Grade B",
      "Local"
    ],
    "medianModal": 1900,
    "minModal": 1200,
    "maxModal": 5500,
    "iqr": [
      1650,
      2950
    ],
    "bandPercent": 23.0,
    "modalPosition": 0.55,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 5500,
    "worstMarket": "Gurgaon APMC",
    "worstMarketPrice": 1200,
    "crossMarketSpread": 4300,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Cabbage",
        "grade": "Local",
        "min": 5000,
        "max": 6000,
        "modal": 5500
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 2100,
        "max": 2100,
        "modal": 2100
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 1500,
        "max": 2200,
        "modal": 2000
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Cabbage",
        "grade": "Local",
        "min": 1500,
        "max": 2000,
        "modal": 1800
      },
      {
        "market": "Sahnewal APMC",
        "district": "Ludhiana",
        "state": "Punjab",
        "variety": "Cabbage",
        "grade": "FAQ",
        "min": 1800,
        "max": 1800,
        "modal": 1800
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade B",
        "min": 1000,
        "max": 1400,
        "modal": 1200
      }
    ]
  },
  "Brinjal": {
    "commodity": "Brinjal",
    "quotes": 11,
    "markets": 10,
    "states": [
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Tripura",
      "Uttarakhand"
    ],
    "varieties": [
      "Brinjal",
      "Other",
      "Round",
      "Round/Long"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Grade B",
      "Local"
    ],
    "medianModal": 2000,
    "minModal": 500,
    "maxModal": 5000,
    "iqr": [
      1000,
      3500
    ],
    "bandPercent": 10.0,
    "modalPosition": 0.5,
    "bestMarket": "Parassala Market",
    "bestMarketPrice": 5000,
    "worstMarket": "Rayya APMC",
    "worstMarketPrice": 500,
    "crossMarketSpread": 4500,
    "marketQuotes": [
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Round",
        "grade": "Local",
        "min": 4800,
        "max": 5200,
        "modal": 5000
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Round/Long",
        "grade": "Local",
        "min": 3800,
        "max": 4200,
        "modal": 4000
      },
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Brinjal",
        "grade": "Local",
        "min": 3000,
        "max": 4000,
        "modal": 3500
      },
      {
        "market": "Dasda APMC",
        "district": "North Tripura",
        "state": "Tripura",
        "variety": "Round/Long",
        "grade": "FAQ",
        "min": 2650,
        "max": 2750,
        "modal": 2700
      },
      {
        "market": "Sahnewal APMC",
        "district": "Ludhiana",
        "state": "Punjab",
        "variety": "Brinjal",
        "grade": "FAQ",
        "min": 2400,
        "max": 2400,
        "modal": 2400
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 2000,
        "max": 2000,
        "modal": 2000
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Brinjal",
        "grade": "Local",
        "min": 1500,
        "max": 1800,
        "modal": 1600
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Brinjal",
        "grade": "Grade A",
        "min": 1000,
        "max": 1500,
        "modal": 1200
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Brinjal",
        "grade": "Grade B",
        "min": 800,
        "max": 1200,
        "modal": 1000
      },
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Local",
        "min": 800,
        "max": 1000,
        "modal": 900
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Brinjal",
        "grade": "FAQ",
        "min": 500,
        "max": 500,
        "modal": 500
      }
    ]
  },
  "Apple": {
    "commodity": "Apple",
    "quotes": 3,
    "markets": 3,
    "states": [
      "Haryana",
      "Punjab",
      "Uttarakhand"
    ],
    "varieties": [
      "Apple",
      "Other"
    ],
    "grades": [
      "Grade A",
      "Grade B",
      "Medium"
    ],
    "medianModal": 8000,
    "minModal": 7500,
    "maxModal": 8500,
    "iqr": [
      7500,
      8500
    ],
    "bandPercent": 62.5,
    "modalPosition": 0.5,
    "bestMarket": "Roorkee APMC",
    "bestMarketPrice": 8500,
    "worstMarket": "Gurgaon APMC",
    "worstMarketPrice": 7500,
    "crossMarketSpread": 1000,
    "marketQuotes": [
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Medium",
        "min": 7500,
        "max": 10000,
        "modal": 8500
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 5000,
        "max": 10000,
        "modal": 8000
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Apple",
        "grade": "Grade B",
        "min": 5000,
        "max": 10000,
        "modal": 7500
      }
    ]
  },
  "Bottle gourd": {
    "commodity": "Bottle gourd",
    "quotes": 5,
    "markets": 5,
    "states": [
      "Haryana",
      "Keralam",
      "Rajasthan",
      "Uttarakhand"
    ],
    "varieties": [
      "Bottle Gourd",
      "Other"
    ],
    "grades": [
      "Grade B",
      "Local"
    ],
    "medianModal": 1000,
    "minModal": 750,
    "maxModal": 3000,
    "iqr": [
      825,
      2400
    ],
    "bandPercent": 23.3,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 3000,
    "worstMarket": "Roorkee APMC",
    "worstMarketPrice": 750,
    "crossMarketSpread": 2250,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Bottle Gourd",
        "grade": "Local",
        "min": 2800,
        "max": 3500,
        "modal": 3000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 1800,
        "max": 1800,
        "modal": 1800
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade B",
        "min": 800,
        "max": 1200,
        "modal": 1000
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Bottle Gourd",
        "grade": "Local",
        "min": 800,
        "max": 1000,
        "modal": 900
      },
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Local",
        "min": 650,
        "max": 850,
        "modal": 750
      }
    ]
  },
  "Ginger(Green)": {
    "commodity": "Ginger(Green)",
    "quotes": 4,
    "markets": 4,
    "states": [
      "Keralam",
      "Rajasthan"
    ],
    "varieties": [
      "Green Ginger",
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 6600,
    "minModal": 4300,
    "maxModal": 19000,
    "iqr": [
      4475,
      16300
    ],
    "bandPercent": 7.7,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 19000,
    "worstMarket": "Jalore APMC",
    "worstMarketPrice": 4300,
    "crossMarketSpread": 14700,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Green Ginger",
        "grade": "Local",
        "min": 18000,
        "max": 20000,
        "modal": 19000
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Green Ginger",
        "grade": "Local",
        "min": 8000,
        "max": 8400,
        "modal": 8200
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 5000,
        "max": 5000,
        "modal": 5000
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Other",
        "grade": "Local",
        "min": 4000,
        "max": 4500,
        "modal": 4300
      }
    ]
  },
  "Beetroot": {
    "commodity": "Beetroot",
    "quotes": 4,
    "markets": 4,
    "states": [
      "Keralam",
      "Rajasthan"
    ],
    "varieties": [
      "Beetroot",
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 3000,
    "minModal": 2000,
    "maxModal": 7600,
    "iqr": [
      2000,
      6700
    ],
    "bandPercent": 10.3,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 7600,
    "worstMarket": "Jalore APMC",
    "worstMarketPrice": 2000,
    "crossMarketSpread": 5600,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Beetroot",
        "grade": "Local",
        "min": 7200,
        "max": 8000,
        "modal": 7600
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Beetroot",
        "grade": "Local",
        "min": 3800,
        "max": 4200,
        "modal": 4000
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Other",
        "grade": "Local",
        "min": 1800,
        "max": 2400,
        "modal": 2000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 2000,
        "max": 2000,
        "modal": 2000
      }
    ]
  },
  "Paddy(Common)": {
    "commodity": "Paddy(Common)",
    "quotes": 13,
    "markets": 13,
    "states": [
      "Andhra Pradesh",
      "Telangana"
    ],
    "varieties": [
      "1001",
      "1121",
      "B P T",
      "Common",
      "Other",
      "Samba Masuri",
      "Sona"
    ],
    "grades": [
      "FAQ",
      "Grade Range-2",
      "Local"
    ],
    "medianModal": 2389,
    "minModal": 2365,
    "maxModal": 2800,
    "iqr": [
      2377,
      2405
    ],
    "bandPercent": 0.8,
    "modalPosition": 0.5,
    "bestMarket": "Maddipadu APMC",
    "bestMarketPrice": 2800,
    "worstMarket": "Karapa APMC",
    "worstMarketPrice": 2365,
    "crossMarketSpread": 435,
    "marketQuotes": [
      {
        "market": "Maddipadu APMC",
        "district": "Prakasam",
        "state": "Andhra Pradesh",
        "variety": "B P T",
        "grade": "FAQ",
        "min": 2800,
        "max": 2800,
        "modal": 2800
      },
      {
        "market": "Santhamaguluru APMC",
        "district": "Prakasam",
        "state": "Andhra Pradesh",
        "variety": "B P T",
        "grade": "FAQ",
        "min": 2500,
        "max": 2580,
        "modal": 2550
      },
      {
        "market": "Kavali APMC",
        "district": "SPSR Nellore",
        "state": "Andhra Pradesh",
        "variety": "Other",
        "grade": "Local",
        "min": 2380,
        "max": 2450,
        "modal": 2410
      },
      {
        "market": "Yellamanchili APMC",
        "district": "Anakapally",
        "state": "Andhra Pradesh",
        "variety": "1001",
        "grade": "Local",
        "min": 2390,
        "max": 2450,
        "modal": 2400
      },
      {
        "market": "Atmakur (Nandyal District) APMC",
        "district": "Nandyal",
        "state": "Andhra Pradesh",
        "variety": "Sona",
        "grade": "FAQ",
        "min": 2300,
        "max": 2441,
        "modal": 2400
      },
      {
        "market": "Peddapuram APMC",
        "district": "Kakinada",
        "state": "Andhra Pradesh",
        "variety": "1001",
        "grade": "FAQ",
        "min": 2369,
        "max": 2400,
        "modal": 2395
      },
      {
        "market": "Bhadrachalam APMC",
        "district": "Bhadradri Kothagudem",
        "state": "Telangana",
        "variety": "Samba Masuri",
        "grade": "FAQ",
        "min": 2389,
        "max": 2389,
        "modal": 2389
      },
      {
        "market": "Rampachodvaram APMC",
        "district": "Polavaram",
        "state": "Andhra Pradesh",
        "variety": "1001",
        "grade": "Grade Range-2",
        "min": 2369,
        "max": 2389,
        "modal": 2379
      },
      {
        "market": "Pithapuram APMC",
        "district": "Kakinada",
        "state": "Andhra Pradesh",
        "variety": "1001",
        "grade": "FAQ",
        "min": 2369,
        "max": 2389,
        "modal": 2379
      },
      {
        "market": "Prattipadu APMC",
        "district": "Kakinada",
        "state": "Andhra Pradesh",
        "variety": "1001",
        "grade": "FAQ",
        "min": 2369,
        "max": 2389,
        "modal": 2379
      },
      {
        "market": "Kakinada (Urban) APMC",
        "district": "Kakinada",
        "state": "Andhra Pradesh",
        "variety": "Common",
        "grade": "FAQ",
        "min": 2369,
        "max": 2390,
        "modal": 2375
      },
      {
        "market": "Etcherla APMC",
        "district": "Srikakulam",
        "state": "Andhra Pradesh",
        "variety": "1121",
        "grade": "FAQ",
        "min": 2369,
        "max": 2369,
        "modal": 2369
      },
      {
        "market": "Karapa APMC",
        "district": "Kakinada",
        "state": "Andhra Pradesh",
        "variety": "1001",
        "grade": "FAQ",
        "min": 2362,
        "max": 2369,
        "modal": 2365
      }
    ]
  },
  "Potato": {
    "commodity": "Potato",
    "quotes": 9,
    "markets": 9,
    "states": [
      "Bihar",
      "Haryana",
      "Keralam",
      "Punjab",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand"
    ],
    "varieties": [
      "Other",
      "Potato",
      "Red Nanital"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Grade B",
      "Local",
      "Medium"
    ],
    "medianModal": 1000,
    "minModal": 590,
    "maxModal": 4200,
    "iqr": [
      674,
      1900
    ],
    "bandPercent": 13.3,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 4200,
    "worstMarket": "Babrala APMC",
    "worstMarketPrice": 590,
    "crossMarketSpread": 3610,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Potato",
        "grade": "Local",
        "min": 3800,
        "max": 4500,
        "modal": 4200
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 2300,
        "max": 2300,
        "modal": 2300
      },
      {
        "market": "Raxaul APMC",
        "district": "East Champaran/ Motihari",
        "state": "Bihar",
        "variety": "Red Nanital",
        "grade": "Grade A",
        "min": 1400,
        "max": 1600,
        "modal": 1500
      },
      {
        "market": "Dasda APMC",
        "district": "North Tripura",
        "state": "Tripura",
        "variety": "Other",
        "grade": "FAQ",
        "min": 1400,
        "max": 1500,
        "modal": 1450
      },
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Medium",
        "min": 800,
        "max": 1200,
        "modal": 1000
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade B",
        "min": 600,
        "max": 1000,
        "modal": 800
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Potato",
        "grade": "FAQ",
        "min": 748,
        "max": 748,
        "modal": 748
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 500,
        "max": 7000,
        "modal": 600
      },
      {
        "market": "Babrala APMC",
        "district": "Badaun",
        "state": "Uttar Pradesh",
        "variety": "Potato",
        "grade": "Medium",
        "min": 580,
        "max": 600,
        "modal": 590
      }
    ]
  },
  "Onion": {
    "commodity": "Onion",
    "quotes": 9,
    "markets": 9,
    "states": [
      "Bihar",
      "Haryana",
      "Keralam",
      "Punjab",
      "Tripura",
      "Uttarakhand"
    ],
    "varieties": [
      "1st Sort",
      "Onion",
      "Other"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Grade B",
      "Local",
      "Medium"
    ],
    "medianModal": 4100,
    "minModal": 1410,
    "maxModal": 6000,
    "iqr": [
      3250,
      4925
    ],
    "bandPercent": 4.7,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 6000,
    "worstMarket": "Rayya APMC",
    "worstMarketPrice": 1410,
    "crossMarketSpread": 4590,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Onion",
        "grade": "Local",
        "min": 5000,
        "max": 7000,
        "modal": 6000
      },
      {
        "market": "Dasda APMC",
        "district": "North Tripura",
        "state": "Tripura",
        "variety": "Onion",
        "grade": "FAQ",
        "min": 5500,
        "max": 5600,
        "modal": 5550
      },
      {
        "market": "Raxaul APMC",
        "district": "East Champaran/ Motihari",
        "state": "Bihar",
        "variety": "1st Sort",
        "grade": "Grade A",
        "min": 4200,
        "max": 4400,
        "modal": 4300
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade B",
        "min": 4000,
        "max": 4500,
        "modal": 4250
      },
      {
        "market": "Sahnewal APMC",
        "district": "Ludhiana",
        "state": "Punjab",
        "variety": "Onion",
        "grade": "FAQ",
        "min": 4100,
        "max": 4100,
        "modal": 4100
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 3500,
        "max": 4500,
        "modal": 4000
      },
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Medium",
        "min": 2500,
        "max": 4500,
        "modal": 3500
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 3000,
        "max": 3000,
        "modal": 3000
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Other",
        "grade": "FAQ",
        "min": 1410,
        "max": 1410,
        "modal": 1410
      }
    ]
  },
  "Bhindi(Ladies Finger)": {
    "commodity": "Bhindi(Ladies Finger)",
    "quotes": 9,
    "markets": 9,
    "states": [
      "Bihar",
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Uttarakhand"
    ],
    "varieties": [
      "Bhindi",
      "Other"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Local"
    ],
    "medianModal": 2000,
    "minModal": 685,
    "maxModal": 7000,
    "iqr": [
      1150,
      4250
    ],
    "bandPercent": 20.0,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 7000,
    "worstMarket": "Rayya APMC",
    "worstMarketPrice": 685,
    "crossMarketSpread": 6315,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Bhindi",
        "grade": "Local",
        "min": 6000,
        "max": 7200,
        "modal": 7000
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Bhindi",
        "grade": "Local",
        "min": 5800,
        "max": 6200,
        "modal": 6000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Bhindi",
        "grade": "Grade A",
        "min": 2000,
        "max": 3000,
        "modal": 2500
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 2000,
        "max": 2000,
        "modal": 2000
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade A",
        "min": 1500,
        "max": 2500,
        "modal": 2000
      },
      {
        "market": "Roorkee APMC",
        "district": "Haridwar",
        "state": "Uttarakhand",
        "variety": "Other",
        "grade": "Local",
        "min": 1000,
        "max": 1600,
        "modal": 1300
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Bhindi",
        "grade": "Local",
        "min": 1200,
        "max": 1500,
        "modal": 1300
      },
      {
        "market": "Raxaul APMC",
        "district": "East Champaran/ Motihari",
        "state": "Bihar",
        "variety": "Bhindi",
        "grade": "Grade A",
        "min": 900,
        "max": 1100,
        "modal": 1000
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Bhindi",
        "grade": "FAQ",
        "min": 685,
        "max": 685,
        "modal": 685
      }
    ]
  },
  "Drumstick": {
    "commodity": "Drumstick",
    "quotes": 3,
    "markets": 3,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Drumstick",
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 5600,
    "minModal": 3000,
    "maxModal": 14000,
    "iqr": [
      3000,
      14000
    ],
    "bandPercent": 12.9,
    "modalPosition": 0.528,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 14000,
    "worstMarket": "Parassala Market",
    "worstMarketPrice": 3000,
    "crossMarketSpread": 11000,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Drumstick",
        "grade": "Local",
        "min": 13000,
        "max": 14800,
        "modal": 14000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 5600,
        "max": 5600,
        "modal": 5600
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Drumstick",
        "grade": "Local",
        "min": 2800,
        "max": 3200,
        "modal": 3000
      }
    ]
  },
  "Maize": {
    "commodity": "Maize",
    "quotes": 4,
    "markets": 4,
    "states": [
      "Andhra Pradesh",
      "Uttar Pradesh"
    ],
    "varieties": [
      "Deshi White",
      "Hybrid",
      "Local"
    ],
    "grades": [
      "FAQ",
      "Grade Range-1",
      "Local"
    ],
    "medianModal": 2400,
    "minModal": 2140,
    "maxModal": 2450,
    "iqr": [
      2205,
      2438
    ],
    "bandPercent": 2.1,
    "modalPosition": 0.5,
    "bestMarket": "Santhamaguluru APMC",
    "bestMarketPrice": 2450,
    "worstMarket": "Babrala APMC",
    "worstMarketPrice": 2140,
    "crossMarketSpread": 310,
    "marketQuotes": [
      {
        "market": "Santhamaguluru APMC",
        "district": "Prakasam",
        "state": "Andhra Pradesh",
        "variety": "Hybrid",
        "grade": "FAQ",
        "min": 2400,
        "max": 2480,
        "modal": 2450
      },
      {
        "market": "Etcherla APMC",
        "district": "Srikakulam",
        "state": "Andhra Pradesh",
        "variety": "Deshi White",
        "grade": "Local",
        "min": 2400,
        "max": 2400,
        "modal": 2400
      },
      {
        "market": "RAYADURG APMC",
        "district": "Ananthapuramu",
        "state": "Andhra Pradesh",
        "variety": "Local",
        "grade": "Grade Range-1",
        "min": 2200,
        "max": 2600,
        "modal": 2400
      },
      {
        "market": "Babrala APMC",
        "district": "Badaun",
        "state": "Uttar Pradesh",
        "variety": "Local",
        "grade": "Local",
        "min": 2130,
        "max": 2150,
        "modal": 2140
      }
    ]
  },
  "Mousambi(Sweet Lime)": {
    "commodity": "Mousambi(Sweet Lime)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Punjab"
    ],
    "varieties": [
      "Mousambi"
    ],
    "grades": [
      "Grade A"
    ],
    "medianModal": 3500,
    "minModal": 3500,
    "maxModal": 3500,
    "iqr": [
      3500,
      3500
    ],
    "bandPercent": 28.6,
    "modalPosition": 0.5,
    "bestMarket": "Rampuraphul(Nabha Mandi) APMC",
    "bestMarketPrice": 3500,
    "worstMarket": "Rampuraphul(Nabha Mandi) APMC",
    "worstMarketPrice": 3500,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Mousambi",
        "grade": "Grade A",
        "min": 3000,
        "max": 4000,
        "modal": 3500
      }
    ]
  },
  "Pumpkin": {
    "commodity": "Pumpkin",
    "quotes": 3,
    "markets": 3,
    "states": [
      "Keralam",
      "Punjab"
    ],
    "varieties": [
      "Other",
      "Pumpkin"
    ],
    "grades": [
      "Grade A",
      "Local"
    ],
    "medianModal": 1500,
    "minModal": 1200,
    "maxModal": 4000,
    "iqr": [
      1200,
      4000
    ],
    "bandPercent": 25.0,
    "modalPosition": 0.45,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 4000,
    "worstMarket": "Rampuraphul(Nabha Mandi) APMC",
    "worstMarketPrice": 1200,
    "crossMarketSpread": 2800,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Pumpkin",
        "grade": "Local",
        "min": 3500,
        "max": 4500,
        "modal": 4000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 1500,
        "max": 1500,
        "modal": 1500
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 1000,
        "max": 1500,
        "modal": 1200
      }
    ]
  },
  "Little gourd(Kundru)": {
    "commodity": "Little gourd(Kundru)",
    "quotes": 2,
    "markets": 2,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 4550,
    "minModal": 3100,
    "maxModal": 6000,
    "iqr": [
      3100,
      6000
    ],
    "bandPercent": 8.3,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 6000,
    "worstMarket": "Kottarakkara Market",
    "worstMarketPrice": 3100,
    "crossMarketSpread": 2900,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 5500,
        "max": 6500,
        "modal": 6000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 3100,
        "max": 3100,
        "modal": 3100
      }
    ]
  },
  "Chili Red": {
    "commodity": "Chili Red",
    "quotes": 2,
    "markets": 1,
    "states": [
      "Andhra Pradesh"
    ],
    "varieties": [
      "Red"
    ],
    "grades": [
      "Grade Range-1",
      "Local"
    ],
    "medianModal": 23050,
    "minModal": 20500,
    "maxModal": 25600,
    "iqr": [
      20500,
      25600
    ],
    "bandPercent": 38.6,
    "modalPosition": 0.712,
    "bestMarket": "Gurazala APMC",
    "bestMarketPrice": 25600,
    "worstMarket": "Gurazala APMC",
    "worstMarketPrice": 20500,
    "crossMarketSpread": 5100,
    "marketQuotes": [
      {
        "market": "Gurazala APMC",
        "district": "Palnadu",
        "state": "Andhra Pradesh",
        "variety": "Red",
        "grade": "Grade Range-1",
        "min": 17000,
        "max": 28000,
        "modal": 25600
      },
      {
        "market": "Gurazala APMC",
        "district": "Palnadu",
        "state": "Andhra Pradesh",
        "variety": "Red",
        "grade": "Local",
        "min": 16000,
        "max": 23000,
        "modal": 20500
      }
    ]
  },
  "Ashgourd": {
    "commodity": "Ashgourd",
    "quotes": 3,
    "markets": 3,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Ashgourd",
      "Other"
    ],
    "grades": [
      "FAQ",
      "Local"
    ],
    "medianModal": 2600,
    "minModal": 2000,
    "maxModal": 3500,
    "iqr": [
      2000,
      3500
    ],
    "bandPercent": 7.7,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 3500,
    "worstMarket": "Kottarakkara Market",
    "worstMarketPrice": 2000,
    "crossMarketSpread": 1500,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Ashgourd",
        "grade": "Local",
        "min": 3000,
        "max": 4000,
        "modal": 3500
      },
      {
        "market": "Irinjalakkuda Market",
        "district": "Thirssur",
        "state": "Keralam",
        "variety": "Ashgourd",
        "grade": "FAQ",
        "min": 2500,
        "max": 2700,
        "modal": 2600
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 2000,
        "max": 2000,
        "modal": 2000
      }
    ]
  },
  "Tinda": {
    "commodity": "Tinda",
    "quotes": 2,
    "markets": 2,
    "states": [
      "Punjab",
      "Rajasthan"
    ],
    "varieties": [
      "Other",
      "Tinda"
    ],
    "grades": [
      "FAQ",
      "Local"
    ],
    "medianModal": 1892,
    "minModal": 1785,
    "maxModal": 2000,
    "iqr": [
      1785,
      2000
    ],
    "bandPercent": 10.0,
    "modalPosition": 0.5,
    "bestMarket": "Jalore APMC",
    "bestMarketPrice": 2000,
    "worstMarket": "Rayya APMC",
    "worstMarketPrice": 1785,
    "crossMarketSpread": 215,
    "marketQuotes": [
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Tinda",
        "grade": "Local",
        "min": 1800,
        "max": 2200,
        "modal": 2000
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Other",
        "grade": "FAQ",
        "min": 1785,
        "max": 1785,
        "modal": 1785
      }
    ]
  },
  "Ridgeguard(Tori)": {
    "commodity": "Ridgeguard(Tori)",
    "quotes": 2,
    "markets": 2,
    "states": [
      "Punjab"
    ],
    "varieties": [
      "Other",
      "Ridgeguard(Tori)"
    ],
    "grades": [
      "FAQ",
      "Grade A"
    ],
    "medianModal": 2274,
    "minModal": 2047,
    "maxModal": 2500,
    "iqr": [
      2047,
      2500
    ],
    "bandPercent": 14.0,
    "modalPosition": 0.714,
    "bestMarket": "Rampuraphul(Nabha Mandi) APMC",
    "bestMarketPrice": 2500,
    "worstMarket": "Rayya APMC",
    "worstMarketPrice": 2047,
    "crossMarketSpread": 453,
    "marketQuotes": [
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Ridgeguard(Tori)",
        "grade": "Grade A",
        "min": 2000,
        "max": 2700,
        "modal": 2500
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Other",
        "grade": "FAQ",
        "min": 2047,
        "max": 2047,
        "modal": 2047
      }
    ]
  },
  "Lemon": {
    "commodity": "Lemon",
    "quotes": 3,
    "markets": 3,
    "states": [
      "Keralam",
      "Punjab"
    ],
    "varieties": [
      "Lemon",
      "Other"
    ],
    "grades": [
      "Grade A",
      "Local"
    ],
    "medianModal": 8000,
    "minModal": 3100,
    "maxModal": 21000,
    "iqr": [
      3100,
      21000
    ],
    "bandPercent": 9.5,
    "modalPosition": 0.417,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 21000,
    "worstMarket": "Kottarakkara Market",
    "worstMarketPrice": 3100,
    "crossMarketSpread": 17900,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 20000,
        "max": 22000,
        "modal": 21000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Lemon",
        "grade": "Grade A",
        "min": 7000,
        "max": 10000,
        "modal": 8000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 3100,
        "max": 3100,
        "modal": 3100
      }
    ]
  },
  "Green Chilli": {
    "commodity": "Green Chilli",
    "quotes": 6,
    "markets": 6,
    "states": [
      "Keralam",
      "Punjab",
      "Rajasthan"
    ],
    "varieties": [
      "Green Chilly",
      "Other"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Local"
    ],
    "medianModal": 3050,
    "minModal": 1066,
    "maxModal": 9000,
    "iqr": [
      1242,
      8250
    ],
    "bandPercent": 13.6,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 9000,
    "worstMarket": "Rayya APMC",
    "worstMarketPrice": 1066,
    "crossMarketSpread": 7934,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Green Chilly",
        "grade": "Local",
        "min": 8000,
        "max": 10000,
        "modal": 9000
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Green Chilly",
        "grade": "Local",
        "min": 7800,
        "max": 8200,
        "modal": 8000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 3100,
        "max": 3100,
        "modal": 3100
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Green Chilly",
        "grade": "Grade A",
        "min": 2500,
        "max": 3500,
        "modal": 3000
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Green Chilly",
        "grade": "Local",
        "min": 1200,
        "max": 1500,
        "modal": 1300
      },
      {
        "market": "Rayya APMC",
        "district": "Amritsar",
        "state": "Punjab",
        "variety": "Green Chilly",
        "grade": "FAQ",
        "min": 1066,
        "max": 1066,
        "modal": 1066
      }
    ]
  },
  "Ginger(Dry)": {
    "commodity": "Ginger(Dry)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Andhra Pradesh"
    ],
    "varieties": [
      "Ginger-Organic"
    ],
    "grades": [
      "Grade Range-1"
    ],
    "medianModal": 12000,
    "minModal": 12000,
    "maxModal": 12000,
    "iqr": [
      12000,
      12000
    ],
    "bandPercent": 0.0,
    "modalPosition": 0.5,
    "bestMarket": "Araku Valley APMC",
    "bestMarketPrice": 12000,
    "worstMarket": "Araku Valley APMC",
    "worstMarketPrice": 12000,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Araku Valley APMC",
        "district": "Alluri Sitharama Raju",
        "state": "Andhra Pradesh",
        "variety": "Ginger-Organic",
        "grade": "Grade Range-1",
        "min": 12000,
        "max": 12000,
        "modal": 12000
      }
    ]
  },
  "Pointed gourd(Parval)": {
    "commodity": "Pointed gourd(Parval)",
    "quotes": 2,
    "markets": 2,
    "states": [
      "Bihar"
    ],
    "varieties": [
      "Other"
    ],
    "grades": [
      "Grade A",
      "Local"
    ],
    "medianModal": 3650,
    "minModal": 2800,
    "maxModal": 4500,
    "iqr": [
      2800,
      4500
    ],
    "bandPercent": 3.6,
    "modalPosition": 0.5,
    "bestMarket": "Bihpur APMC",
    "bestMarketPrice": 4500,
    "worstMarket": "Raxaul APMC",
    "worstMarketPrice": 2800,
    "crossMarketSpread": 1700,
    "marketQuotes": [
      {
        "market": "Bihpur APMC",
        "district": "Bhagalpur",
        "state": "Bihar",
        "variety": "Other",
        "grade": "Local",
        "min": 4500,
        "max": 4500,
        "modal": 4500
      },
      {
        "market": "Raxaul APMC",
        "district": "East Champaran/ Motihari",
        "state": "Bihar",
        "variety": "Other",
        "grade": "Grade A",
        "min": 2700,
        "max": 2900,
        "modal": 2800
      }
    ]
  },
  "Guava": {
    "commodity": "Guava",
    "quotes": 2,
    "markets": 2,
    "states": [
      "Haryana",
      "Punjab"
    ],
    "varieties": [
      "Guava",
      "Other"
    ],
    "grades": [
      "Grade A",
      "Grade B"
    ],
    "medianModal": 5000,
    "minModal": 2500,
    "maxModal": 7500,
    "iqr": [
      2500,
      7500
    ],
    "bandPercent": 53.3,
    "modalPosition": 0.5,
    "bestMarket": "Gurgaon APMC",
    "bestMarketPrice": 7500,
    "worstMarket": "Rampuraphul(Nabha Mandi) APMC",
    "worstMarketPrice": 2500,
    "crossMarketSpread": 5000,
    "marketQuotes": [
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Guava",
        "grade": "Grade B",
        "min": 5000,
        "max": 10000,
        "modal": 7500
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 2000,
        "max": 3000,
        "modal": 2500
      }
    ]
  },
  "Ragi(Finger Millet)": {
    "commodity": "Ragi(Finger Millet)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Andhra Pradesh"
    ],
    "varieties": [
      "Local"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 5000,
    "minModal": 5000,
    "maxModal": 5000,
    "iqr": [
      5000,
      5000
    ],
    "bandPercent": 0.0,
    "modalPosition": 0.5,
    "bestMarket": "Bhimunipatnam APMC",
    "bestMarketPrice": 5000,
    "worstMarket": "Bhimunipatnam APMC",
    "worstMarketPrice": 5000,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Bhimunipatnam APMC",
        "district": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "variety": "Local",
        "grade": "Local",
        "min": 5000,
        "max": 5000,
        "modal": 5000
      }
    ]
  },
  "Elephant Yam(Suran)/Amorphophallus": {
    "commodity": "Elephant Yam(Suran)/Amorphophallus",
    "quotes": 3,
    "markets": 3,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Amorphophallus",
      "Elephant Yam (Suran)",
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 5500,
    "minModal": 3100,
    "maxModal": 9000,
    "iqr": [
      3100,
      9000
    ],
    "bandPercent": 4.4,
    "modalPosition": 0.5,
    "bestMarket": "Parassala Market",
    "bestMarketPrice": 9000,
    "worstMarket": "Kottarakkara Market",
    "worstMarketPrice": 3100,
    "crossMarketSpread": 5900,
    "marketQuotes": [
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Elephant Yam (Suran)",
        "grade": "Local",
        "min": 8800,
        "max": 9200,
        "modal": 9000
      },
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Amorphophallus",
        "grade": "Local",
        "min": 5000,
        "max": 6000,
        "modal": 5500
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 3100,
        "max": 3100,
        "modal": 3100
      }
    ]
  },
  "Cluster beans": {
    "commodity": "Cluster beans",
    "quotes": 2,
    "markets": 2,
    "states": [
      "Keralam",
      "Rajasthan"
    ],
    "varieties": [
      "Cluster Beans",
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 4150,
    "minModal": 4000,
    "maxModal": 4300,
    "iqr": [
      4000,
      4300
    ],
    "bandPercent": 10.8,
    "modalPosition": 0.55,
    "bestMarket": "Jalore APMC",
    "bestMarketPrice": 4300,
    "worstMarket": "Parassala Market",
    "worstMarketPrice": 4000,
    "crossMarketSpread": 300,
    "marketQuotes": [
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Other",
        "grade": "Local",
        "min": 4000,
        "max": 4500,
        "modal": 4300
      },
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Cluster Beans",
        "grade": "Local",
        "min": 3800,
        "max": 4200,
        "modal": 4000
      }
    ]
  },
  "Cotton": {
    "commodity": "Cotton",
    "quotes": 2,
    "markets": 2,
    "states": [
      "Andhra Pradesh"
    ],
    "varieties": [
      "Cotton (Unginned)",
      "Desi"
    ],
    "grades": [
      "FAQ",
      "Local"
    ],
    "medianModal": 8050,
    "minModal": 8000,
    "maxModal": 8100,
    "iqr": [
      8000,
      8100
    ],
    "bandPercent": 7.4,
    "modalPosition": 0.5,
    "bestMarket": "Phirangipuram APMC",
    "bestMarketPrice": 8100,
    "worstMarket": "Markapur APMC",
    "worstMarketPrice": 8000,
    "crossMarketSpread": 100,
    "marketQuotes": [
      {
        "market": "Phirangipuram APMC",
        "district": "Guntur",
        "state": "Andhra Pradesh",
        "variety": "Cotton (Unginned)",
        "grade": "Local",
        "min": 7500,
        "max": 8700,
        "modal": 8100
      },
      {
        "market": "Markapur APMC",
        "district": "Markapuram",
        "state": "Andhra Pradesh",
        "variety": "Desi",
        "grade": "FAQ",
        "min": 8000,
        "max": 8000,
        "modal": 8000
      }
    ]
  },
  "Mango(Raw-Ripe)": {
    "commodity": "Mango(Raw-Ripe)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Mango - Raw-Ripe"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 4500,
    "minModal": 4500,
    "maxModal": 4500,
    "iqr": [
      4500,
      4500
    ],
    "bandPercent": 44.4,
    "modalPosition": 0.25,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 4500,
    "worstMarket": "Piravam Market",
    "worstMarketPrice": 4500,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Mango - Raw-Ripe",
        "grade": "Local",
        "min": 4000,
        "max": 6000,
        "modal": 4500
      }
    ]
  },
  "Long Melon(Kakri)": {
    "commodity": "Long Melon(Kakri)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 4000,
    "minModal": 4000,
    "maxModal": 4000,
    "iqr": [
      4000,
      4000
    ],
    "bandPercent": 25.0,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 4000,
    "worstMarket": "Piravam Market",
    "worstMarketPrice": 4000,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 3500,
        "max": 4500,
        "modal": 4000
      }
    ]
  },
  "Amaranthus": {
    "commodity": "Amaranthus",
    "quotes": 3,
    "markets": 3,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Amaranthus",
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 6800,
    "minModal": 2800,
    "maxModal": 7000,
    "iqr": [
      2800,
      7000
    ],
    "bandPercent": 5.7,
    "modalPosition": 0.625,
    "bestMarket": "Parassala Market",
    "bestMarketPrice": 7000,
    "worstMarket": "Kottarakkara Market",
    "worstMarketPrice": 2800,
    "crossMarketSpread": 4200,
    "marketQuotes": [
      {
        "market": "Parassala Market",
        "district": "Thiruvananthapuram",
        "state": "Keralam",
        "variety": "Amaranthus",
        "grade": "Local",
        "min": 6800,
        "max": 7200,
        "modal": 7000
      },
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Amaranthus",
        "grade": "Local",
        "min": 6200,
        "max": 7000,
        "modal": 6800
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 2800,
        "max": 2800,
        "modal": 2800
      }
    ]
  },
  "Banana - Green": {
    "commodity": "Banana - Green",
    "quotes": 2,
    "markets": 2,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Banana - Green",
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 4400,
    "minModal": 1800,
    "maxModal": 7000,
    "iqr": [
      1800,
      7000
    ],
    "bandPercent": 14.3,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 7000,
    "worstMarket": "Kottarakkara Market",
    "worstMarketPrice": 1800,
    "crossMarketSpread": 5200,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Banana - Green",
        "grade": "Local",
        "min": 6000,
        "max": 8000,
        "modal": 7000
      },
      {
        "market": "Kottarakkara Market",
        "district": "Kollam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 1800,
        "max": 1800,
        "modal": 1800
      }
    ]
  },
  "Coriander(Leaves)": {
    "commodity": "Coriander(Leaves)",
    "quotes": 2,
    "markets": 2,
    "states": [
      "Keralam",
      "Rajasthan"
    ],
    "varieties": [
      "Coriander",
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 5650,
    "minModal": 2800,
    "maxModal": 8500,
    "iqr": [
      2800,
      8500
    ],
    "bandPercent": 14.8,
    "modalPosition": 0.55,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 8500,
    "worstMarket": "Jalore APMC",
    "worstMarketPrice": 2800,
    "crossMarketSpread": 5700,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 8000,
        "max": 9000,
        "modal": 8500
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Coriander",
        "grade": "Local",
        "min": 2500,
        "max": 3000,
        "modal": 2800
      }
    ]
  },
  "Rice": {
    "commodity": "Rice",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Tripura"
    ],
    "varieties": [
      "Other"
    ],
    "grades": [
      "FAQ"
    ],
    "medianModal": 3300,
    "minModal": 3300,
    "maxModal": 3300,
    "iqr": [
      3300,
      3300
    ],
    "bandPercent": 3.0,
    "modalPosition": 0.5,
    "bestMarket": "Dasda APMC",
    "bestMarketPrice": 3300,
    "worstMarket": "Dasda APMC",
    "worstMarketPrice": 3300,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Dasda APMC",
        "district": "North Tripura",
        "state": "Tripura",
        "variety": "Other",
        "grade": "FAQ",
        "min": 3250,
        "max": 3350,
        "modal": 3300
      }
    ]
  },
  "Capsicum": {
    "commodity": "Capsicum",
    "quotes": 3,
    "markets": 3,
    "states": [
      "Haryana",
      "Punjab",
      "Rajasthan"
    ],
    "varieties": [
      "Capsicum",
      "Other"
    ],
    "grades": [
      "FAQ",
      "Grade A",
      "Local"
    ],
    "medianModal": 3000,
    "minModal": 3000,
    "maxModal": 4100,
    "iqr": [
      3000,
      4100
    ],
    "bandPercent": 13.3,
    "modalPosition": 0.5,
    "bestMarket": "Sahnewal APMC",
    "bestMarketPrice": 4100,
    "worstMarket": "Jalore APMC",
    "worstMarketPrice": 3000,
    "crossMarketSpread": 1100,
    "marketQuotes": [
      {
        "market": "Sahnewal APMC",
        "district": "Ludhiana",
        "state": "Punjab",
        "variety": "Capsicum",
        "grade": "FAQ",
        "min": 4100,
        "max": 4100,
        "modal": 4100
      },
      {
        "market": "Jalore APMC",
        "district": "Jalore",
        "state": "Rajasthan",
        "variety": "Other",
        "grade": "Local",
        "min": 2800,
        "max": 3200,
        "modal": 3000
      },
      {
        "market": "Gurgaon APMC",
        "district": "Gurgaon",
        "state": "Haryana",
        "variety": "Other",
        "grade": "Grade A",
        "min": 2000,
        "max": 4000,
        "modal": 3000
      }
    ]
  },
  "Red gram/Arhar/Tur(whole)": {
    "commodity": "Red gram/Arhar/Tur(whole)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Andhra Pradesh"
    ],
    "varieties": [
      "Arhar (Whole)"
    ],
    "grades": [
      "Non-FAQ"
    ],
    "medianModal": 8100,
    "minModal": 8100,
    "maxModal": 8100,
    "iqr": [
      8100,
      8100
    ],
    "bandPercent": 2.5,
    "modalPosition": 0.5,
    "bestMarket": "Podili APMC",
    "bestMarketPrice": 8100,
    "worstMarket": "Podili APMC",
    "worstMarketPrice": 8100,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Podili APMC",
        "district": "Markapuram",
        "state": "Andhra Pradesh",
        "variety": "Arhar (Whole)",
        "grade": "Non-FAQ",
        "min": 8000,
        "max": 8200,
        "modal": 8100
      }
    ]
  },
  "Water Melon": {
    "commodity": "Water Melon",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Punjab"
    ],
    "varieties": [
      "Other"
    ],
    "grades": [
      "Grade A"
    ],
    "medianModal": 1200,
    "minModal": 1200,
    "maxModal": 1200,
    "iqr": [
      1200,
      1200
    ],
    "bandPercent": 41.7,
    "modalPosition": 0.4,
    "bestMarket": "Rampuraphul(Nabha Mandi) APMC",
    "bestMarketPrice": 1200,
    "worstMarket": "Rampuraphul(Nabha Mandi) APMC",
    "worstMarketPrice": 1200,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "district": "Bhatinda",
        "state": "Punjab",
        "variety": "Other",
        "grade": "Grade A",
        "min": 1000,
        "max": 1500,
        "modal": 1200
      }
    ]
  },
  "Bengal Gram(Gram)(Whole)": {
    "commodity": "Bengal Gram(Gram)(Whole)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Andhra Pradesh"
    ],
    "varieties": [
      "Gulabi"
    ],
    "grades": [
      "FAQ"
    ],
    "medianModal": 6000,
    "minModal": 6000,
    "maxModal": 6000,
    "iqr": [
      6000,
      6000
    ],
    "bandPercent": 0.0,
    "modalPosition": 0.5,
    "bestMarket": "Maddipadu APMC",
    "bestMarketPrice": 6000,
    "worstMarket": "Maddipadu APMC",
    "worstMarketPrice": 6000,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Maddipadu APMC",
        "district": "Prakasam",
        "state": "Andhra Pradesh",
        "variety": "Gulabi",
        "grade": "FAQ",
        "min": 6000,
        "max": 6000,
        "modal": 6000
      }
    ]
  },
  "Indian Beans(Seam)": {
    "commodity": "Indian Beans(Seam)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 7000,
    "minModal": 7000,
    "maxModal": 7000,
    "iqr": [
      7000,
      7000
    ],
    "bandPercent": 28.6,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 7000,
    "worstMarket": "Piravam Market",
    "worstMarketPrice": 7000,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 6000,
        "max": 8000,
        "modal": 7000
      }
    ]
  },
  "Tapioca": {
    "commodity": "Tapioca",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Tapioca"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 3500,
    "minModal": 3500,
    "maxModal": 3500,
    "iqr": [
      3500,
      3500
    ],
    "bandPercent": 28.6,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 3500,
    "worstMarket": "Piravam Market",
    "worstMarketPrice": 3500,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Tapioca",
        "grade": "Local",
        "min": 3000,
        "max": 4000,
        "modal": 3500
      }
    ]
  },
  "Wood": {
    "commodity": "Wood",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Uttar Pradesh"
    ],
    "varieties": [
      "Eucalyptus"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 540,
    "minModal": 540,
    "maxModal": 540,
    "iqr": [
      540,
      540
    ],
    "bandPercent": 3.7,
    "modalPosition": 0.5,
    "bestMarket": "Babrala APMC",
    "bestMarketPrice": 540,
    "worstMarket": "Babrala APMC",
    "worstMarketPrice": 540,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Babrala APMC",
        "district": "Badaun",
        "state": "Uttar Pradesh",
        "variety": "Eucalyptus",
        "grade": "Local",
        "min": 530,
        "max": 550,
        "modal": 540
      }
    ]
  },
  "Sweet Potato": {
    "commodity": "Sweet Potato",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Sweet Potato"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 5000,
    "minModal": 5000,
    "maxModal": 5000,
    "iqr": [
      5000,
      5000
    ],
    "bandPercent": 20.0,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 5000,
    "worstMarket": "Piravam Market",
    "worstMarketPrice": 5000,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Sweet Potato",
        "grade": "Local",
        "min": 4500,
        "max": 5500,
        "modal": 5000
      }
    ]
  },
  "Bajra(Pearl Millet/Cumbu)": {
    "commodity": "Bajra(Pearl Millet/Cumbu)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Andhra Pradesh"
    ],
    "varieties": [
      "Bold"
    ],
    "grades": [
      "FAQ"
    ],
    "medianModal": 2850,
    "minModal": 2850,
    "maxModal": 2850,
    "iqr": [
      2850,
      2850
    ],
    "bandPercent": 0.0,
    "modalPosition": 0.5,
    "bestMarket": "Maddipadu APMC",
    "bestMarketPrice": 2850,
    "worstMarket": "Maddipadu APMC",
    "worstMarketPrice": 2850,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Maddipadu APMC",
        "district": "Prakasam",
        "state": "Andhra Pradesh",
        "variety": "Bold",
        "grade": "FAQ",
        "min": 2850,
        "max": 2850,
        "modal": 2850
      }
    ]
  },
  "Papaya(Raw)": {
    "commodity": "Papaya(Raw)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 4500,
    "minModal": 4500,
    "maxModal": 4500,
    "iqr": [
      4500,
      4500
    ],
    "bandPercent": 22.2,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 4500,
    "worstMarket": "Piravam Market",
    "worstMarketPrice": 4500,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 4000,
        "max": 5000,
        "modal": 4500
      }
    ]
  },
  "Galgal(Lemon)": {
    "commodity": "Galgal(Lemon)",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 3500,
    "minModal": 3500,
    "maxModal": 3500,
    "iqr": [
      3500,
      3500
    ],
    "bandPercent": 28.6,
    "modalPosition": 0.5,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 3500,
    "worstMarket": "Piravam Market",
    "worstMarketPrice": 3500,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 3000,
        "max": 4000,
        "modal": 3500
      }
    ]
  },
  "Colacasia": {
    "commodity": "Colacasia",
    "quotes": 1,
    "markets": 1,
    "states": [
      "Keralam"
    ],
    "varieties": [
      "Other"
    ],
    "grades": [
      "Local"
    ],
    "medianModal": 5000,
    "minModal": 5000,
    "maxModal": 5000,
    "iqr": [
      5000,
      5000
    ],
    "bandPercent": 14.0,
    "modalPosition": 0.286,
    "bestMarket": "Piravam Market",
    "bestMarketPrice": 5000,
    "worstMarket": "Piravam Market",
    "worstMarketPrice": 5000,
    "crossMarketSpread": 0,
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "district": "Ernakulam",
        "state": "Keralam",
        "variety": "Other",
        "grade": "Local",
        "min": 4800,
        "max": 5500,
        "modal": 5000
      }
    ]
  }
};
export const STATE_FACTORS: Record<string, number> = {
  "Bihar": 1.0488,
  "Haryana": 0.9547,
  "Uttarakhand": 0.64,
  "Keralam": 1.1053,
  "Punjab": 0.978,
  "Rajasthan": 0.8,
  "Andhra Pradesh": 1.0,
  "Tripura": 1.3518,
  "Uttar Pradesh": 0.8917,
  "Telangana": 1.0
};
export const STATE_SUPPORT: Record<string, number> = {
  "Bihar": 7,
  "Haryana": 14,
  "Uttarakhand": 11,
  "Keralam": 77,
  "Punjab": 36,
  "Rajasthan": 15,
  "Andhra Pradesh": 24,
  "Tripura": 4,
  "Uttar Pradesh": 3,
  "Telangana": 1
};
export const CROP_TO_COMMODITY: Partial<Record<CropType, string>> = {
  "onion": "Onion",
  "tomato": "Tomato",
  "potato": "Potato"
};
