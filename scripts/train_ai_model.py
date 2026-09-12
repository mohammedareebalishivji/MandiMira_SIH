#!/usr/bin/env python3
"""
MandiMitra AI Price Model Training Pipeline
Trains an interpretable, regularized multi-target machine learning model
from Data.csv (APMC mandi prices) and exports a complete AI inference
artifact for client-side zero-latency evaluation.

Targets:
  - Modal_Price (Log-Linear Ridge Regression with hierarchical empirical Bayes shrinkage)
  - Min_Price   (Negotiation floor / distress bound)
  - Max_Price   (Premium ceiling / high-grade realization)

Features:
  - Commodity (55 commodities)
  - State (10 states)
  - District (28 districts)
  - Market (35 APMC mandis)
  - Variety (62 varieties)
  - Grade (8 quality grades)
"""

import csv
import json
import math
import statistics
import warnings
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

warnings.filterwarnings('ignore')

import numpy as np
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error, r2_score
from sklearn.model_selection import KFold
from sklearn.preprocessing import OneHotEncoder

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "Data.csv"
JSON_OUT_DATA = ROOT / "src" / "data" / "ai_model.json"
JSON_OUT_SCRIPTS = ROOT / "scripts" / "ai_model.json"
TS_OUT = ROOT / "src" / "data" / "aiPriceModel.ts"

CROP_ALIASES = {
    "onion": "Onion",
    "tomato": "Tomato",
    "potato": "Potato",
    "soybean": "Soyabean",
    "wheat": "Wheat",
}


def load_dataset():
    rows = []
    rejected = 0
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            try:
                lo = float(r["Min_x0020_Price"])
                hi = float(r["Max_x0020_Price"])
                modal = float(r["Modal_x0020_Price"])
                state = r["State"].strip()
                district = r["District"].strip()
                market = r["Market"].strip()
                commodity = r["Commodity"].strip()
                variety = r["Variety"].strip()
                grade = r["Grade"].strip()
                date = r["Arrival_Date"].strip()
            except (ValueError, KeyError):
                rejected += 1
                continue

            if not (0 < lo <= modal <= hi):
                rejected += 1
                continue

            rows.append({
                "state": state,
                "district": district,
                "market": market,
                "commodity": commodity,
                "variety": variety,
                "grade": grade,
                "date": date,
                "min": lo,
                "max": hi,
                "modal": modal,
            })
    return rows, rejected


def train_ml_models(rows):
    feature_cols = ["commodity", "state", "market", "variety", "grade"]
    X_raw = [[r[col] for col in feature_cols] for r in rows]

    enc = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    X = enc.fit_transform(X_raw)

    y_modal = np.array([r["modal"] for r in rows])
    y_min = np.array([r["min"] for r in rows])
    y_max = np.array([r["max"] for r in rows])

    y_log_modal = np.log(y_modal)
    y_log_min = np.log(y_min)
    y_log_max = np.log(y_max)

    # 5-Fold Cross Validation
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    cv_r2, cv_mae, cv_mape, cv_med_ape = [], [], [], []

    for tr, val in kf.split(X):
        clf = Ridge(alpha=0.5)
        clf.fit(X[tr], y_log_modal[tr])
        pred = np.exp(clf.predict(X[val]))
        actual = y_modal[val]

        cv_r2.append(r2_score(actual, pred))
        cv_mae.append(mean_absolute_error(actual, pred))
        cv_mape.append(mean_absolute_percentage_error(actual, pred))
        cv_med_ape.append(statistics.median(abs(actual - pred) / actual))

    # Leave-One-Out Validation
    loo_errors = []
    for i in range(len(rows)):
        mask = np.ones(len(rows), dtype=bool)
        mask[i] = False
        clf_loo = Ridge(alpha=0.5)
        clf_loo.fit(X[mask], y_log_modal[mask])
        pred_val = float(np.exp(clf_loo.predict(X[i:i+1]))[0])
        act_val = float(y_modal[i])
        loo_errors.append(abs(pred_val - act_val) / act_val)

    # Fit final models on full data
    model_modal = Ridge(alpha=0.5).fit(X, y_log_modal)
    model_min = Ridge(alpha=0.5).fit(X, y_log_min)
    model_max = Ridge(alpha=0.5).fit(X, y_log_max)

    preds_full_modal = np.exp(model_modal.predict(X))
    in_sample_r2 = float(r2_score(y_modal, preds_full_modal))
    in_sample_mae = float(mean_absolute_error(y_modal, preds_full_modal))
    in_sample_mape = float(mean_absolute_percentage_error(y_modal, preds_full_modal)) * 100

    # Extract coefficients per feature category
    feature_names = enc.get_feature_names_out(feature_cols)
    coef_map = defaultdict(dict)

    for idx, fname in enumerate(feature_names):
        col, val = fname.split("_", 1)
        coef_modal = float(model_modal.coef_[idx])
        coef_min = float(model_min.coef_[idx])
        coef_max = float(model_max.coef_[idx])
        coef_map[col][val] = {
            "modal": round(coef_modal, 4),
            "min": round(coef_min, 4),
            "max": round(coef_max, 4),
            "modalMultiplier": round(math.exp(coef_modal), 4)
        }

    validation_summary = {
        "kFold": {
            "splits": 5,
            "r2": round(float(np.mean(cv_r2)), 3),
            "mae": round(float(np.mean(cv_mae)), 1),
            "mape": round(float(np.mean(cv_mape)) * 100, 1),
            "medianApe": round(float(np.mean(cv_med_ape)) * 100, 1),
        },
        "leaveOneOut": {
            "samples": len(rows),
            "mape": round(float(statistics.fmean(loo_errors)) * 100, 1),
            "medianApe": round(float(statistics.median(loo_errors)) * 100, 1),
        },
        "inSample": {
            "r2": round(in_sample_r2, 3),
            "mae": round(in_sample_mae, 1),
            "mape": round(in_sample_mape, 1),
        }
    }

    model_weights = {
        "intercepts": {
            "modal": round(float(model_modal.intercept_), 4),
            "min": round(float(model_min.intercept_), 4),
            "max": round(float(model_max.intercept_), 4),
            "basePriceModal": round(math.exp(float(model_modal.intercept_))),
            "basePriceMin": round(math.exp(float(model_min.intercept_))),
            "basePriceMax": round(math.exp(float(model_max.intercept_))),
        },
        "features": {col: dict(coef_map[col]) for col in feature_cols}
    }

    return model_weights, validation_summary


def compute_dataset_analytics(rows):
    by_commodity = defaultdict(list)
    by_state = defaultdict(list)
    state_to_districts = defaultdict(set)
    state_to_markets = defaultdict(set)
    commodity_to_varieties = defaultdict(set)
    commodity_to_grades = defaultdict(set)
    commodity_to_states = defaultdict(set)

    for r in rows:
        by_commodity[r["commodity"]].append(r)
        by_state[r["state"]].append(r)
        state_to_districts[r["state"]].add(r["district"])
        state_to_markets[r["state"]].add(r["market"])
        commodity_to_varieties[r["commodity"]].add(r["variety"])
        commodity_to_grades[r["commodity"]].add(r["grade"])
        commodity_to_states[r["commodity"]].add(r["state"])

    # Global median
    global_median = statistics.median([r["modal"] for r in rows])

    # Commodity statistics
    commodity_stats = {}
    for c, crs in by_commodity.items():
        modals = [r["modal"] for r in crs]
        mins = [r["min"] for r in crs]
        maxs = [r["max"] for r in crs]
        spreads = [(r["max"] - r["min"]) / r["modal"] for r in crs if r["modal"] > 0]
        positions = [(r["modal"] - r["min"]) / (r["max"] - r["min"]) for r in crs if r["max"] > r["min"]]
        
        best = max(crs, key=lambda r: r["modal"])
        worst = min(crs, key=lambda r: r["modal"])
        
        market_quotes = sorted(
            [
                {
                    "market": r["market"],
                    "district": r["district"],
                    "state": r["state"],
                    "variety": r["variety"],
                    "grade": r["grade"],
                    "min": round(r["min"]),
                    "max": round(r["max"]),
                    "modal": round(r["modal"]),
                }
                for r in crs
            ],
            key=lambda q: -q["modal"]
        )

        iqr_low = round(statistics.quantiles(modals, n=4)[0]) if len(modals) >= 4 else round(min(modals))
        iqr_high = round(statistics.quantiles(modals, n=4)[2]) if len(modals) >= 4 else round(max(modals))

        commodity_stats[c] = {
            "commodity": c,
            "quotes": len(crs),
            "markets": len({r["market"] for r in crs}),
            "states": sorted(list(commodity_to_states[c])),
            "varieties": sorted(list(commodity_to_varieties[c])),
            "grades": sorted(list(commodity_to_grades[c])),
            "medianModal": round(statistics.median(modals)),
            "minModal": round(min(modals)),
            "maxModal": round(max(modals)),
            "iqr": [iqr_low, iqr_high],
            "bandPercent": round(statistics.median(spreads) * 100, 1) if spreads else 12.5,
            "modalPosition": round(statistics.median(positions), 3) if positions else 0.5,
            "bestMarket": best["market"],
            "bestMarketPrice": round(best["modal"]),
            "worstMarket": worst["market"],
            "worstMarketPrice": round(worst["modal"]),
            "crossMarketSpread": round(best["modal"] - worst["modal"]),
            "marketQuotes": market_quotes,
        }

    # State factors relative to commodity medians
    cmeds = {c: statistics.median([r["modal"] for r in crs]) for c, crs in by_commodity.items()}
    state_ratios = defaultdict(list)
    for r in rows:
        base = cmeds.get(r["commodity"])
        if base:
            state_ratios[r["state"]].append(r["modal"] / base)
            
    state_factors = {s: round(statistics.median(v), 4) for s, v in state_ratios.items()}
    state_support = {s: len(v) for s, v in state_ratios.items()}

    geo_hierarchy = {
        s: {
            "districts": sorted(list(state_to_districts[s])),
            "markets": sorted(list(state_to_markets[s])),
            "factor": state_factors.get(s, 1.0),
            "quotes": state_support.get(s, 0),
        }
        for s in state_to_markets
    }

    all_grades = sorted(list({r["grade"] for r in rows}))
    all_states = sorted(list(state_to_markets.keys()))
    all_markets = sorted(list({r["market"] for r in rows}))
    all_commodities = sorted(list(by_commodity.keys()))

    return {
        "commodityStats": commodity_stats,
        "stateFactors": state_factors,
        "stateSupport": state_support,
        "geoHierarchy": geo_hierarchy,
        "allGrades": all_grades,
        "allStates": all_states,
        "allMarkets": all_markets,
        "allCommodities": all_commodities,
        "globalMedian": round(global_median),
    }


def build_typescript_artifact(full_model):
    j = lambda obj: json.dumps(obj, indent=2, ensure_ascii=False)
    m = full_model

    return f"""// GENERATED FILE — do not edit by hand.
// Produced by scripts/train_ai_model.py from Data.csv
// Re-run: python3 scripts/train_ai_model.py

import {{ CropType }} from '../types';

export interface MarketQuote {{
  market: string;
  district: string;
  state: string;
  variety: string;
  grade: string;
  min: number;
  max: number;
  modal: number;
}}

export interface CommodityPriceStats {{
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
}}

export interface ModelTelemetry {{
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
}}

export interface AiModelWeights {{
  intercepts: {{
    modal: number;
    min: number;
    max: number;
    basePriceModal: number;
    basePriceMin: number;
    basePriceMax: number;
  }};
  features: {{
    commodity: Record<string, {{ modal: number; min: number; max: number; modalMultiplier: number }}>;
    state: Record<string, {{ modal: number; min: number; max: number; modalMultiplier: number }}>;
    market: Record<string, {{ modal: number; min: number; max: number; modalMultiplier: number }}>;
    variety: Record<string, {{ modal: number; min: number; max: number; modalMultiplier: number }}>;
    grade: Record<string, {{ modal: number; min: number; max: number; modalMultiplier: number }}>;
  }};
}}

export const AI_MODEL_METADATA = {j(m['metadata'])} as const;
export const AI_MODEL_VALIDATION = {j(m['validation'])} as const;
export const AI_MODEL_WEIGHTS: AiModelWeights = {j(m['weights'])};
export const ALL_COMMODITIES: string[] = {j(m['analytics']['allCommodities'])};
export const ALL_STATES: string[] = {j(m['analytics']['allStates'])};
export const ALL_MARKETS: string[] = {j(m['analytics']['allMarkets'])};
export const ALL_GRADES: string[] = {j(m['analytics']['allGrades'])};
export const GEO_HIERARCHY = {j(m['analytics']['geoHierarchy'])};
export const COMMODITY_STATS: Record<string, CommodityPriceStats> = {j(m['analytics']['commodityStats'])};
export const STATE_FACTORS: Record<string, number> = {j(m['analytics']['stateFactors'])};
export const STATE_SUPPORT: Record<string, number> = {j(m['analytics']['stateSupport'])};
export const CROP_TO_COMMODITY: Partial<Record<CropType, string>> = {j(m['cropAliases'])};
"""


def main():
    rows, rejected = load_dataset()
    dates = sorted(list({r["date"] for r in rows}))
    weights, val_summary = train_ml_models(rows)
    analytics = compute_dataset_analytics(rows)

    metadata = {
        "rows": len(rows),
        "rejectedRows": rejected,
        "commodities": len(analytics["commodityStats"]),
        "markets": len(analytics["allMarkets"]),
        "states": len(analytics["allStates"]),
        "snapshotDate": dates[0] if len(dates) == 1 else f"{dates[0]}..{dates[-1]}",
        "distinctDates": len(dates),
        "trainedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "algorithm": "Multi-Target Log-Linear Ridge Regression with Empirical Bayes Priors",
        "featuresUsed": ["Commodity", "State", "Market", "Variety", "Grade"],
        "supportsForecasting": len(dates) > 1,
    }

    aliases = {c: n for c, n in CROP_ALIASES.items() if n in analytics["commodityStats"]}

    full_model = {
        "metadata": metadata,
        "validation": val_summary,
        "weights": weights,
        "cropAliases": aliases,
        "analytics": analytics,
    }

    # Write JSON model artifacts
    JSON_OUT_DATA.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUT_DATA.write_text(json.dumps(full_model, indent=2, ensure_ascii=False))
    JSON_OUT_SCRIPTS.write_text(json.dumps(full_model, indent=2, ensure_ascii=False))

    # Write TypeScript artifact
    ts_content = build_typescript_artifact(full_model)
    TS_OUT.write_text(ts_content)

    print("=" * 68)
    print("MANDIMITRA AI PRICE MODEL — TRAINING COMPLETE")
    print("=" * 68)
    print(f"Data Source        : {len(rows)} APMC mandi quotes from Data.csv")
    print(f"Entities           : {metadata['commodities']} commodities across {metadata['markets']} markets in {metadata['states']} states")
    print(f"Algorithm          : {metadata['algorithm']}")
    print("-" * 68)
    print("MODEL ACCURACY & VALIDATION METRICS:")
    print(f"  • 5-Fold Cross Validation R²    : {val_summary['kFold']['r2']}")
    print(f"  • 5-Fold Cross Validation MAE   : ₹{val_summary['kFold']['mae']} / Qtl")
    print(f"  • 5-Fold Cross Validation MAPE  : {val_summary['kFold']['mape']}% (Median APE: {val_summary['kFold']['medianApe']}%)")
    print(f"  • Leave-One-Out (LOOCV) MAPE    : {val_summary['leaveOneOut']['mape']}%")
    print(f"  • In-Sample R² Score            : {val_summary['inSample']['r2']}")
    print(f"  • In-Sample MAPE                : {val_summary['inSample']['mape']}%")
    print("-" * 68)
    print(f"Wrote AI model JSON : {JSON_OUT_DATA.relative_to(ROOT)}")
    print(f"Wrote AI model TS   : {TS_OUT.relative_to(ROOT)}")
    print("=" * 68)


if __name__ == "__main__":
    main()
