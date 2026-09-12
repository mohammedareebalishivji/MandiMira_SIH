// GENERATED FILE — do not edit by hand.
// Produced by scripts/train_price_model.py from Data.csv
// Re-run: python3 scripts/train_price_model.py
//
// Source: 192 mandi quotes · 55 commodities · 35 markets
// Snapshot date: 12/09/2026 (single day)
//
// SCOPE AND LIMITS — read before relying on these numbers:
//   • NO FORECASTING. All rows share one date, so price movement over time is
//     not identifiable. `supportsForecasting` is false and the UI must not
//     present these figures as a prediction.
//   • NO GRADE PREMIUM. Only 1 of 186 (commodity, market) groups contain more than one grade, and grade is confounded with state. A grade premium fitted on this data would measure geography, not quality.
//     `GRADE_EFFECT.identified` is false.
//   • POINT ACCURACY IS LOW. Leave-one-out MAPE is 55.1%
//     (median APE 37.3%) against a naive baseline of
//     71.1%. Treat every figure as a reference range,
//     never a quotable price.

import { CropType } from '../types';

export interface MarketQuote {
  market: string;
  state: string;
  district: string;
  grade: string;
  min: number;
  max: number;
  modal: number;
}

export interface CommodityPriceStats {
  commodity: string;
  quotes: number;
  markets: number;
  medianModal: number;
  minModal: number;
  maxModal: number;
  /** Interquartile range of modal prices across markets. */
  iqr: [number, number];
  /** Median within-market (max-min)/modal spread, as a percentage. */
  bandPercent: number;
  /** Where the modal price sits in the day's band. >0.5 favours the seller. */
  modalPosition: number;
  bestMarket: string;
  bestMarketPrice: number;
  worstMarket: string;
  worstMarketPrice: number;
  crossMarketSpread: number;
  states: string[];
  marketQuotes: MarketQuote[];
}

export const PRICE_MODEL_META = {
  "rows": 192,
  "rejectedRows": 0,
  "commodities": 55,
  "markets": 35,
  "states": 10,
  "snapshotDate": "12/09/2026",
  "distinctDates": 1,
  "trainedAt": "2026-09-12",
  "supportsForecasting": false
} as const;

/** Leave-one-out validation. Published so the UI can show its own error bars. */
export const MODEL_VALIDATION = {
  "commodityOnly": {
    "samples": 153,
    "mape": 60.2,
    "medianApe": 43.3
  },
  "commodityPlusState": {
    "samples": 153,
    "mape": 55.1,
    "medianApe": 37.3
  },
  "naiveGlobalMedian": {
    "samples": 192,
    "mape": 71.1,
    "medianApe": 46.2
  }
} as const;

/**
 * Why no grade multiplier is shipped. Kept in the artifact so the reason
 * travels with the data instead of living only in a commit message.
 */
export const GRADE_EFFECT = {
  "identified": false,
  "reason": "Only 1 of 186 (commodity, market) groups contain more than one grade, and grade is confounded with state. A grade premium fitted on this data would measure geography, not quality.",
  "marketsWithGradeContrast": 1,
  "totalCommodityMarketGroups": 186,
  "stateGroupsWithGradeContrast": 19,
  "gradeConcentration": {
    "Grade A": {
      "quotes": 27,
      "topState": "Punjab",
      "topStateShare": 0.704
    },
    "Grade B": {
      "quotes": 11,
      "topState": "Haryana",
      "topStateShare": 1.0
    },
    "Medium": {
      "quotes": 6,
      "topState": "Uttarakhand",
      "topStateShare": 0.833
    },
    "Local": {
      "quotes": 106,
      "topState": "Keralam",
      "topStateShare": 0.708
    },
    "FAQ": {
      "quotes": 37,
      "topState": "Punjab",
      "topStateShare": 0.459
    },
    "Grade Range-2": {
      "quotes": 1,
      "topState": "Andhra Pradesh",
      "topStateShare": 1.0
    },
    "Grade Range-1": {
      "quotes": 3,
      "topState": "Andhra Pradesh",
      "topStateShare": 1.0
    },
    "Non-FAQ": {
      "quotes": 1,
      "topState": "Andhra Pradesh",
      "topStateShare": 1.0
    }
  }
} as const;

/** State price level relative to each commodity's own median. */
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

/** Quotes backing each state factor. Small n means a wide error bar. */
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

export const COMMODITY_STATS: Record<string, CommodityPriceStats> = {
  "Bitter gourd": {
    "commodity": "Bitter gourd",
    "quotes": 8,
    "markets": 8,
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
    "states": [
      "Bihar",
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 7000,
        "max": 8200,
        "modal": 7500
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 4000,
        "max": 4000,
        "modal": 4000
      },
      {
        "market": "Bihpur APMC",
        "state": "Bihar",
        "district": "Bhagalpur",
        "grade": "Local",
        "min": 2500,
        "max": 2500,
        "modal": 2500
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 2000,
        "max": 2500,
        "modal": 2300
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade B",
        "min": 1000,
        "max": 2000,
        "modal": 1500
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
        "grade": "FAQ",
        "min": 1354,
        "max": 1354,
        "modal": 1354
      },
      {
        "market": "Raxaul APMC",
        "state": "Bihar",
        "district": "East Champaran/ Motihari",
        "grade": "Grade A",
        "min": 1100,
        "max": 1300,
        "modal": 1200
      },
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
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
    "states": [
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Vamanapuram Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "FAQ",
        "min": 4000,
        "max": 4500,
        "modal": 4000
      },
      {
        "market": "Sahnewal APMC",
        "state": "Punjab",
        "district": "Ludhiana",
        "grade": "FAQ",
        "min": 3750,
        "max": 3750,
        "modal": 3750
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 3000,
        "max": 3400,
        "modal": 3200
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 3000,
        "max": 3000,
        "modal": 3000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 2000,
        "max": 3000,
        "modal": 2500
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 2000,
        "max": 2400,
        "modal": 2200
      },
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
        "grade": "Medium",
        "min": 1200,
        "max": 2200,
        "modal": 1600
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade B",
        "min": 1000,
        "max": 1400,
        "modal": 1200
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
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
    "states": [
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 6000,
        "max": 7000,
        "modal": 6500
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 2500,
        "max": 4000,
        "modal": 3500
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
        "grade": "FAQ",
        "min": 3174,
        "max": 3174,
        "modal": 3174
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade A",
        "min": 2500,
        "max": 3500,
        "modal": 3000
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 1800,
        "max": 2200,
        "modal": 2000
      },
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 7400,
        "max": 8000,
        "modal": 7600
      },
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 6000,
        "max": 8000,
        "modal": 7000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
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
    "states": [
      "Haryana",
      "Keralam",
      "Punjab"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 7000,
        "max": 8000,
        "modal": 7500
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 3800,
        "max": 4200,
        "modal": 4000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 3600,
        "max": 3600,
        "modal": 3600
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade B",
        "min": 2000,
        "max": 4000,
        "modal": 3000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 4000,
        "max": 5000,
        "modal": 4500
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 2800,
        "max": 3200,
        "modal": 3000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
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
    "states": [
      "Punjab"
    ],
    "marketQuotes": [
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
        "grade": "FAQ",
        "min": 2080,
        "max": 2080,
        "modal": 2080
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
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
    "states": [
      "Haryana",
      "Keralam",
      "Punjab",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 6800,
        "max": 7200,
        "modal": 7000
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 6800,
        "max": 7200,
        "modal": 7000
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 6000,
        "max": 6400,
        "modal": 6200
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 2800,
        "max": 3200,
        "modal": 3000
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade B",
        "min": 2000,
        "max": 4000,
        "modal": 3000
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 2800,
        "max": 3200,
        "modal": 3000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 2000,
        "max": 2700,
        "modal": 2500
      },
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
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
    "states": [
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 4000,
        "max": 6000,
        "modal": 5000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 2500,
        "max": 3500,
        "modal": 3000
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 2000,
        "max": 2400,
        "modal": 2200
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 2000,
        "max": 2000,
        "modal": 2000
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 1000,
        "max": 1400,
        "modal": 1200
      },
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
        "grade": "Local",
        "min": 850,
        "max": 1200,
        "modal": 950
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
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
    "states": [
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 5000,
        "max": 6000,
        "modal": 5500
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 2100,
        "max": 2100,
        "modal": 2100
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 1500,
        "max": 2200,
        "modal": 2000
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 1500,
        "max": 2000,
        "modal": 1800
      },
      {
        "market": "Sahnewal APMC",
        "state": "Punjab",
        "district": "Ludhiana",
        "grade": "FAQ",
        "min": 1800,
        "max": 1800,
        "modal": 1800
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
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
    "states": [
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Tripura",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 4800,
        "max": 5200,
        "modal": 5000
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 3800,
        "max": 4200,
        "modal": 4000
      },
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 3000,
        "max": 4000,
        "modal": 3500
      },
      {
        "market": "Dasda APMC",
        "state": "Tripura",
        "district": "North Tripura",
        "grade": "FAQ",
        "min": 2650,
        "max": 2750,
        "modal": 2700
      },
      {
        "market": "Sahnewal APMC",
        "state": "Punjab",
        "district": "Ludhiana",
        "grade": "FAQ",
        "min": 2400,
        "max": 2400,
        "modal": 2400
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 2000,
        "max": 2000,
        "modal": 2000
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 1500,
        "max": 1800,
        "modal": 1600
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 1000,
        "max": 1500,
        "modal": 1200
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade B",
        "min": 800,
        "max": 1200,
        "modal": 1000
      },
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
        "grade": "Local",
        "min": 800,
        "max": 1000,
        "modal": 900
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
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
    "states": [
      "Haryana",
      "Punjab",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
        "grade": "Medium",
        "min": 7500,
        "max": 10000,
        "modal": 8500
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 5000,
        "max": 10000,
        "modal": 8000
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
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
    "states": [
      "Haryana",
      "Keralam",
      "Rajasthan",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 2800,
        "max": 3500,
        "modal": 3000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 1800,
        "max": 1800,
        "modal": 1800
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade B",
        "min": 800,
        "max": 1200,
        "modal": 1000
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 800,
        "max": 1000,
        "modal": 900
      },
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
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
    "states": [
      "Keralam",
      "Rajasthan"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 18000,
        "max": 20000,
        "modal": 19000
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 8000,
        "max": 8400,
        "modal": 8200
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 5000,
        "max": 5000,
        "modal": 5000
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
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
    "states": [
      "Keralam",
      "Rajasthan"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 7200,
        "max": 8000,
        "modal": 7600
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 3800,
        "max": 4200,
        "modal": 4000
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 1800,
        "max": 2400,
        "modal": 2000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
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
    "states": [
      "Andhra Pradesh",
      "Telangana"
    ],
    "marketQuotes": [
      {
        "market": "Maddipadu APMC",
        "state": "Andhra Pradesh",
        "district": "Prakasam",
        "grade": "FAQ",
        "min": 2800,
        "max": 2800,
        "modal": 2800
      },
      {
        "market": "Santhamaguluru APMC",
        "state": "Andhra Pradesh",
        "district": "Prakasam",
        "grade": "FAQ",
        "min": 2500,
        "max": 2580,
        "modal": 2550
      },
      {
        "market": "Kavali APMC",
        "state": "Andhra Pradesh",
        "district": "SPSR Nellore",
        "grade": "Local",
        "min": 2380,
        "max": 2450,
        "modal": 2410
      },
      {
        "market": "Yellamanchili APMC",
        "state": "Andhra Pradesh",
        "district": "Anakapally",
        "grade": "Local",
        "min": 2390,
        "max": 2450,
        "modal": 2400
      },
      {
        "market": "Atmakur (Nandyal District) APMC",
        "state": "Andhra Pradesh",
        "district": "Nandyal",
        "grade": "FAQ",
        "min": 2300,
        "max": 2441,
        "modal": 2400
      },
      {
        "market": "Peddapuram APMC",
        "state": "Andhra Pradesh",
        "district": "Kakinada",
        "grade": "FAQ",
        "min": 2369,
        "max": 2400,
        "modal": 2395
      },
      {
        "market": "Bhadrachalam APMC",
        "state": "Telangana",
        "district": "Bhadradri Kothagudem",
        "grade": "FAQ",
        "min": 2389,
        "max": 2389,
        "modal": 2389
      },
      {
        "market": "Rampachodvaram APMC",
        "state": "Andhra Pradesh",
        "district": "Polavaram",
        "grade": "Grade Range-2",
        "min": 2369,
        "max": 2389,
        "modal": 2379
      },
      {
        "market": "Pithapuram APMC",
        "state": "Andhra Pradesh",
        "district": "Kakinada",
        "grade": "FAQ",
        "min": 2369,
        "max": 2389,
        "modal": 2379
      },
      {
        "market": "Prattipadu APMC",
        "state": "Andhra Pradesh",
        "district": "Kakinada",
        "grade": "FAQ",
        "min": 2369,
        "max": 2389,
        "modal": 2379
      },
      {
        "market": "Kakinada (Urban) APMC",
        "state": "Andhra Pradesh",
        "district": "Kakinada",
        "grade": "FAQ",
        "min": 2369,
        "max": 2390,
        "modal": 2375
      },
      {
        "market": "Etcherla APMC",
        "state": "Andhra Pradesh",
        "district": "Srikakulam",
        "grade": "FAQ",
        "min": 2369,
        "max": 2369,
        "modal": 2369
      },
      {
        "market": "Karapa APMC",
        "state": "Andhra Pradesh",
        "district": "Kakinada",
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
    "states": [
      "Bihar",
      "Haryana",
      "Keralam",
      "Punjab",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 3800,
        "max": 4500,
        "modal": 4200
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 2300,
        "max": 2300,
        "modal": 2300
      },
      {
        "market": "Raxaul APMC",
        "state": "Bihar",
        "district": "East Champaran/ Motihari",
        "grade": "Grade A",
        "min": 1400,
        "max": 1600,
        "modal": 1500
      },
      {
        "market": "Dasda APMC",
        "state": "Tripura",
        "district": "North Tripura",
        "grade": "FAQ",
        "min": 1400,
        "max": 1500,
        "modal": 1450
      },
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
        "grade": "Medium",
        "min": 800,
        "max": 1200,
        "modal": 1000
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade B",
        "min": 600,
        "max": 1000,
        "modal": 800
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
        "grade": "FAQ",
        "min": 748,
        "max": 748,
        "modal": 748
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 500,
        "max": 7000,
        "modal": 600
      },
      {
        "market": "Babrala APMC",
        "state": "Uttar Pradesh",
        "district": "Badaun",
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
    "states": [
      "Bihar",
      "Haryana",
      "Keralam",
      "Punjab",
      "Tripura",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 5000,
        "max": 7000,
        "modal": 6000
      },
      {
        "market": "Dasda APMC",
        "state": "Tripura",
        "district": "North Tripura",
        "grade": "FAQ",
        "min": 5500,
        "max": 5600,
        "modal": 5550
      },
      {
        "market": "Raxaul APMC",
        "state": "Bihar",
        "district": "East Champaran/ Motihari",
        "grade": "Grade A",
        "min": 4200,
        "max": 4400,
        "modal": 4300
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade B",
        "min": 4000,
        "max": 4500,
        "modal": 4250
      },
      {
        "market": "Sahnewal APMC",
        "state": "Punjab",
        "district": "Ludhiana",
        "grade": "FAQ",
        "min": 4100,
        "max": 4100,
        "modal": 4100
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 3500,
        "max": 4500,
        "modal": 4000
      },
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
        "grade": "Medium",
        "min": 2500,
        "max": 4500,
        "modal": 3500
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 3000,
        "max": 3000,
        "modal": 3000
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
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
    "states": [
      "Bihar",
      "Haryana",
      "Keralam",
      "Punjab",
      "Rajasthan",
      "Uttarakhand"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 6000,
        "max": 7200,
        "modal": 7000
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 5800,
        "max": 6200,
        "modal": 6000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 2000,
        "max": 3000,
        "modal": 2500
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 2000,
        "max": 2000,
        "modal": 2000
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade A",
        "min": 1500,
        "max": 2500,
        "modal": 2000
      },
      {
        "market": "Roorkee APMC",
        "state": "Uttarakhand",
        "district": "Haridwar",
        "grade": "Local",
        "min": 1000,
        "max": 1600,
        "modal": 1300
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 1200,
        "max": 1500,
        "modal": 1300
      },
      {
        "market": "Raxaul APMC",
        "state": "Bihar",
        "district": "East Champaran/ Motihari",
        "grade": "Grade A",
        "min": 900,
        "max": 1100,
        "modal": 1000
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 13000,
        "max": 14800,
        "modal": 14000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 5600,
        "max": 5600,
        "modal": 5600
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
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
    "states": [
      "Andhra Pradesh",
      "Uttar Pradesh"
    ],
    "marketQuotes": [
      {
        "market": "Santhamaguluru APMC",
        "state": "Andhra Pradesh",
        "district": "Prakasam",
        "grade": "FAQ",
        "min": 2400,
        "max": 2480,
        "modal": 2450
      },
      {
        "market": "Etcherla APMC",
        "state": "Andhra Pradesh",
        "district": "Srikakulam",
        "grade": "Local",
        "min": 2400,
        "max": 2400,
        "modal": 2400
      },
      {
        "market": "RAYADURG APMC",
        "state": "Andhra Pradesh",
        "district": "Ananthapuramu",
        "grade": "Grade Range-1",
        "min": 2200,
        "max": 2600,
        "modal": 2400
      },
      {
        "market": "Babrala APMC",
        "state": "Uttar Pradesh",
        "district": "Badaun",
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
    "states": [
      "Punjab"
    ],
    "marketQuotes": [
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
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
    "states": [
      "Keralam",
      "Punjab"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 3500,
        "max": 4500,
        "modal": 4000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 1500,
        "max": 1500,
        "modal": 1500
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 5500,
        "max": 6500,
        "modal": 6000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
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
    "states": [
      "Andhra Pradesh"
    ],
    "marketQuotes": [
      {
        "market": "Gurazala APMC",
        "state": "Andhra Pradesh",
        "district": "Palnadu",
        "grade": "Grade Range-1",
        "min": 17000,
        "max": 28000,
        "modal": 25600
      },
      {
        "market": "Gurazala APMC",
        "state": "Andhra Pradesh",
        "district": "Palnadu",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 3000,
        "max": 4000,
        "modal": 3500
      },
      {
        "market": "Irinjalakkuda Market",
        "state": "Keralam",
        "district": "Thirssur",
        "grade": "FAQ",
        "min": 2500,
        "max": 2700,
        "modal": 2600
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
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
    "states": [
      "Punjab",
      "Rajasthan"
    ],
    "marketQuotes": [
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 1800,
        "max": 2200,
        "modal": 2000
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
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
    "states": [
      "Punjab"
    ],
    "marketQuotes": [
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 2000,
        "max": 2700,
        "modal": 2500
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
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
    "states": [
      "Keralam",
      "Punjab"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 20000,
        "max": 22000,
        "modal": 21000
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 7000,
        "max": 10000,
        "modal": 8000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
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
    "states": [
      "Keralam",
      "Punjab",
      "Rajasthan"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 8000,
        "max": 10000,
        "modal": 9000
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 7800,
        "max": 8200,
        "modal": 8000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
        "grade": "Local",
        "min": 3100,
        "max": 3100,
        "modal": 3100
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
        "grade": "Grade A",
        "min": 2500,
        "max": 3500,
        "modal": 3000
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 1200,
        "max": 1500,
        "modal": 1300
      },
      {
        "market": "Rayya APMC",
        "state": "Punjab",
        "district": "Amritsar",
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
    "states": [
      "Andhra Pradesh"
    ],
    "marketQuotes": [
      {
        "market": "Araku Valley APMC",
        "state": "Andhra Pradesh",
        "district": "Alluri Sitharama Raju",
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
    "states": [
      "Bihar"
    ],
    "marketQuotes": [
      {
        "market": "Bihpur APMC",
        "state": "Bihar",
        "district": "Bhagalpur",
        "grade": "Local",
        "min": 4500,
        "max": 4500,
        "modal": 4500
      },
      {
        "market": "Raxaul APMC",
        "state": "Bihar",
        "district": "East Champaran/ Motihari",
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
    "states": [
      "Haryana",
      "Punjab"
    ],
    "marketQuotes": [
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
        "grade": "Grade B",
        "min": 5000,
        "max": 10000,
        "modal": 7500
      },
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
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
    "states": [
      "Andhra Pradesh"
    ],
    "marketQuotes": [
      {
        "market": "Bhimunipatnam APMC",
        "state": "Andhra Pradesh",
        "district": "Visakhapatnam",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 8800,
        "max": 9200,
        "modal": 9000
      },
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 5000,
        "max": 6000,
        "modal": 5500
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
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
    "states": [
      "Keralam",
      "Rajasthan"
    ],
    "marketQuotes": [
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 4000,
        "max": 4500,
        "modal": 4300
      },
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
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
    "states": [
      "Andhra Pradesh"
    ],
    "marketQuotes": [
      {
        "market": "Phirangipuram APMC",
        "state": "Andhra Pradesh",
        "district": "Guntur",
        "grade": "Local",
        "min": 7500,
        "max": 8700,
        "modal": 8100
      },
      {
        "market": "Markapur APMC",
        "state": "Andhra Pradesh",
        "district": "Markapuram",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Parassala Market",
        "state": "Keralam",
        "district": "Thiruvananthapuram",
        "grade": "Local",
        "min": 6800,
        "max": 7200,
        "modal": 7000
      },
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 6200,
        "max": 7000,
        "modal": 6800
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 6000,
        "max": 8000,
        "modal": 7000
      },
      {
        "market": "Kottarakkara Market",
        "state": "Keralam",
        "district": "Kollam",
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
    "states": [
      "Keralam",
      "Rajasthan"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 8000,
        "max": 9000,
        "modal": 8500
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
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
    "states": [
      "Tripura"
    ],
    "marketQuotes": [
      {
        "market": "Dasda APMC",
        "state": "Tripura",
        "district": "North Tripura",
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
    "states": [
      "Haryana",
      "Punjab",
      "Rajasthan"
    ],
    "marketQuotes": [
      {
        "market": "Sahnewal APMC",
        "state": "Punjab",
        "district": "Ludhiana",
        "grade": "FAQ",
        "min": 4100,
        "max": 4100,
        "modal": 4100
      },
      {
        "market": "Jalore APMC",
        "state": "Rajasthan",
        "district": "Jalore",
        "grade": "Local",
        "min": 2800,
        "max": 3200,
        "modal": 3000
      },
      {
        "market": "Gurgaon APMC",
        "state": "Haryana",
        "district": "Gurgaon",
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
    "states": [
      "Andhra Pradesh"
    ],
    "marketQuotes": [
      {
        "market": "Podili APMC",
        "state": "Andhra Pradesh",
        "district": "Markapuram",
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
    "states": [
      "Punjab"
    ],
    "marketQuotes": [
      {
        "market": "Rampuraphul(Nabha Mandi) APMC",
        "state": "Punjab",
        "district": "Bhatinda",
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
    "states": [
      "Andhra Pradesh"
    ],
    "marketQuotes": [
      {
        "market": "Maddipadu APMC",
        "state": "Andhra Pradesh",
        "district": "Prakasam",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
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
    "states": [
      "Uttar Pradesh"
    ],
    "marketQuotes": [
      {
        "market": "Babrala APMC",
        "state": "Uttar Pradesh",
        "district": "Badaun",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
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
    "states": [
      "Andhra Pradesh"
    ],
    "marketQuotes": [
      {
        "market": "Maddipadu APMC",
        "state": "Andhra Pradesh",
        "district": "Prakasam",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
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
    "states": [
      "Keralam"
    ],
    "marketQuotes": [
      {
        "market": "Piravam Market",
        "state": "Keralam",
        "district": "Ernakulam",
        "grade": "Local",
        "min": 4800,
        "max": 5500,
        "modal": 5000
      }
    ]
  }
};

/** Feed commodity names for the crop types the app models. */
export const CROP_TO_COMMODITY: Partial<Record<CropType, string>> = {
  "onion": "Onion",
  "tomato": "Tomato",
  "potato": "Potato"
};

export const statsForCrop = (crop: CropType): CommodityPriceStats | null => {
  const name = CROP_TO_COMMODITY[crop];
  return (name && COMMODITY_STATS[name]) || null;
};

/** Observed median modal price for a crop, or null if the feed has no data. */
export const cropBenchmark = (crop: CropType): number | null =>
  statsForCrop(crop)?.medianModal ?? null;

/** Apply the learned state price level to a crop's national median. */
export const cropBenchmarkInState = (crop: CropType, state: string): number | null => {
  const base = cropBenchmark(crop);
  if (base === null) return null;
  return Math.round(base * (STATE_FACTORS[state] ?? 1));
};

/**
 * Realistic negotiation band from observed within-market dispersion.
 * Use `floor` as the "do not accept below" line. Grade is deliberately NOT a
 * parameter — see GRADE_EFFECT for why it is not estimable from this data.
 */
export const negotiationBand = (
  crop: CropType,
  state?: string
): { floor: number; centre: number; ceiling: number; bandPercent: number } | null => {
  const stats = statsForCrop(crop);
  const centre = state ? cropBenchmarkInState(crop, state) : cropBenchmark(crop);
  if (!stats || centre === null) return null;
  const half = stats.bandPercent / 100 / 2;
  return {
    floor: Math.round(centre * (1 - half)),
    centre,
    ceiling: Math.round(centre * (1 + half)),
    bandPercent: stats.bandPercent
  };
};

/** Is this state represented in the feed at all? */
export const stateIsCovered = (state: string): boolean =>
  Object.prototype.hasOwnProperty.call(STATE_FACTORS, state);

/** Every state the feed actually covers. */
export const COVERED_STATES: string[] = Object.keys(STATE_FACTORS).sort();

/**
 * True when a crop's prices vary so widely between markets that a single
 * national median must not be presented as a price floor. A farmer in a
 * cheap state would refuse every genuine offer if they trusted it.
 */
export const dispersionIsExtreme = (crop: CropType): boolean => {
  const s = statsForCrop(crop);
  if (!s) return false;
  return s.maxModal / Math.max(s.minModal, 1) >= 2;
};

/** Best and worst market observed for a crop — the arbitrage the farmer can see. */
export const arbitrageForCrop = (crop: CropType) => {
  const s = statsForCrop(crop);
  if (!s) return null;
  return {
    best: { market: s.bestMarket, price: s.bestMarketPrice },
    worst: { market: s.worstMarket, price: s.worstMarketPrice },
    spread: s.crossMarketSpread,
    spreadPercent: Math.round((s.crossMarketSpread / s.worstMarketPrice) * 100)
  };
};
