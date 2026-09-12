#!/usr/bin/env python3
"""
Fit a mandi price reference model from Data.csv and emit a typed TypeScript
artifact the app consumes at runtime.

WHAT THIS DATA CAN AND CANNOT SUPPORT
-------------------------------------
Data.csv is 192 AGMARKNET-style quotes, all carrying the SAME Arrival_Date,
across 55 commodities and 35 markets. Three consequences drive the design:

  1. NO FORECASTING. One date means no temporal variation, so price movement
     over time is not identifiable. The app must not claim to predict it.

  2. NO GRADE PREMIUM. Only 1 of 186 (commodity, market) groups contains more
     than one grade, and grade is near-perfectly confounded with state
     ("Local" is 75/106 Kerala, the priciest state; "Grade B" is 100% Haryana).
     Any grade multiplier fitted here measures geography, not quality, so the
     grade effect is reported as UNIDENTIFIED rather than shipped as a number.

  3. POINT PREDICTION IS WEAK. Leave-one-out MAPE is ~55% even with a state
     adjustment, because within-commodity dispersion is genuinely huge (onion
     spans Rs1,410 to Rs6,000). Reported honestly rather than hidden.

What the data DOES support well, and what this script therefore emits:
  * observed reference price per commodity (median / range / per-market quotes)
  * a state price-level factor (identifiable, and it measurably reduces error)
  * within-market negotiation band from the (max-min)/modal spread
  * cross-market arbitrage spread for the same commodity

These are descriptive statistics with stated uncertainty, which is what a
farmer-facing reference table should be.
"""

import csv
import json
import statistics
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "Data.csv"
TS_OUT = ROOT / "src" / "data" / "priceModel.ts"
JSON_OUT = ROOT / "scripts" / "price_model.json"

# Feed commodity names -> crop types the app already models.
CROP_ALIASES = {
    "onion": "Onion",
    "tomato": "Tomato",
    "potato": "Potato",
    "soybean": "Soyabean",
    "wheat": "Wheat",
}


def load_rows():
    rows, rejected = [], 0
    with open(CSV_PATH, newline="", encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            try:
                lo = float(r["Min_x0020_Price"])
                hi = float(r["Max_x0020_Price"])
                modal = float(r["Modal_x0020_Price"])
            except (ValueError, KeyError):
                rejected += 1
                continue
            if not (0 < lo <= modal <= hi):
                rejected += 1
                continue
            rows.append({
                "state": r["State"].strip(),
                "district": r["District"].strip(),
                "market": r["Market"].strip(),
                "commodity": r["Commodity"].strip(),
                "variety": r["Variety"].strip(),
                "grade": r["Grade"].strip(),
                "date": r["Arrival_Date"].strip(),
                "min": lo, "max": hi, "modal": modal,
            })
    return rows, rejected


def commodity_medians(rows):
    by = defaultdict(list)
    for r in rows:
        by[r["commodity"]].append(r["modal"])
    return {c: statistics.median(v) for c, v in by.items()}


def state_factors(rows):
    """State price level relative to each commodity's own median."""
    cmed = commodity_medians(rows)
    ratios = defaultdict(list)
    for r in rows:
        base = cmed.get(r["commodity"])
        if base:
            ratios[r["state"]].append(r["modal"] / base)
    return {s: round(statistics.median(v), 4) for s, v in ratios.items()}, \
           {s: len(v) for s, v in ratios.items()}


def grade_identifiability(rows):
    """Quantify why the grade effect cannot be estimated from this data."""
    per_market = defaultdict(set)
    per_state = defaultdict(set)
    grade_state = defaultdict(lambda: defaultdict(int))
    for r in rows:
        per_market[(r["commodity"], r["market"])].add(r["grade"])
        per_state[(r["commodity"], r["state"])].add(r["grade"])
        grade_state[r["grade"]][r["state"]] += 1

    contrast_markets = sum(1 for v in per_market.values() if len(v) > 1)
    # Concentration: what share of each grade sits in its single largest state.
    concentration = {}
    for g, states in grade_state.items():
        total = sum(states.values())
        top_state, top_n = max(states.items(), key=lambda kv: kv[1])
        concentration[g] = {
            "quotes": total,
            "topState": top_state,
            "topStateShare": round(top_n / total, 3),
        }

    return {
        "identified": contrast_markets >= 20,
        "reason": (
            f"Only {contrast_markets} of {len(per_market)} (commodity, market) groups "
            f"contain more than one grade, and grade is confounded with state. "
            f"A grade premium fitted on this data would measure geography, not quality."
        ),
        "marketsWithGradeContrast": contrast_markets,
        "totalCommodityMarketGroups": len(per_market),
        "stateGroupsWithGradeContrast": sum(1 for v in per_state.values() if len(v) > 1),
        "gradeConcentration": concentration,
    }


def commodity_stats(rows):
    by = defaultdict(list)
    for r in rows:
        by[r["commodity"]].append(r)

    out = {}
    for commodity, rs in by.items():
        modals = [r["modal"] for r in rs]
        spreads = [(r["max"] - r["min"]) / r["modal"] for r in rs if r["modal"] > 0]
        positions = [
            (r["modal"] - r["min"]) / (r["max"] - r["min"])
            for r in rs if r["max"] > r["min"]
        ]
        best = max(rs, key=lambda r: r["modal"])
        worst = min(rs, key=lambda r: r["modal"])
        quotes = sorted(
            ({"market": r["market"], "state": r["state"], "district": r["district"],
              "grade": r["grade"], "min": round(r["min"]), "max": round(r["max"]),
              "modal": round(r["modal"])} for r in rs),
            key=lambda q: -q["modal"],
        )
        out[commodity] = {
            "commodity": commodity,
            "quotes": len(rs),
            "markets": len({r["market"] for r in rs}),
            "medianModal": round(statistics.median(modals)),
            "minModal": round(min(modals)),
            "maxModal": round(max(modals)),
            "iqr": [
                round(statistics.quantiles(modals, n=4)[0]) if len(modals) >= 4 else round(min(modals)),
                round(statistics.quantiles(modals, n=4)[2]) if len(modals) >= 4 else round(max(modals)),
            ],
            "bandPercent": round(statistics.median(spreads) * 100, 1) if spreads else 0.0,
            "modalPosition": round(statistics.median(positions), 3) if positions else 0.5,
            "bestMarket": best["market"], "bestMarketPrice": round(best["modal"]),
            "worstMarket": worst["market"], "worstMarketPrice": round(worst["modal"]),
            "crossMarketSpread": round(best["modal"] - worst["modal"]),
            "states": sorted({r["state"] for r in rs}),
            "marketQuotes": quotes,
        }
    return out


def loo_validate(rows):
    """Leave-one-out MAPE for commodity-median and commodity+state models."""
    results = {}
    global_median = statistics.median([r["modal"] for r in rows])

    for use_state in (False, True):
        errs = []
        for i, held in enumerate(rows):
            train = rows[:i] + rows[i + 1:]
            peers = [x for x in train if x["commodity"] == held["commodity"]]
            if len(peers) < 2:
                continue
            cmed = commodity_medians(train)
            base = cmed.get(held["commodity"], global_median)
            if use_state:
                sf, _ = state_factors(train)
                base *= sf.get(held["state"], 1.0)
            errs.append(abs(base - held["modal"]) / held["modal"])
        key = "commodityPlusState" if use_state else "commodityOnly"
        results[key] = {
            "samples": len(errs),
            "mape": round(statistics.fmean(errs) * 100, 1),
            "medianApe": round(statistics.median(errs) * 100, 1),
        }

    naive = [abs(global_median - r["modal"]) / r["modal"] for r in rows]
    results["naiveGlobalMedian"] = {
        "samples": len(naive),
        "mape": round(statistics.fmean(naive) * 100, 1),
        "medianApe": round(statistics.median(naive) * 100, 1),
    }
    return results


def to_ts(m):
    j = lambda o: json.dumps(o, indent=2, ensure_ascii=False)
    v = m["validation"]
    g = m["gradeEffect"]
    return f"""// GENERATED FILE — do not edit by hand.
// Produced by scripts/train_price_model.py from Data.csv
// Re-run: python3 scripts/train_price_model.py
//
// Source: {m['meta']['rows']} mandi quotes · {m['meta']['commodities']} commodities · {m['meta']['markets']} markets
// Snapshot date: {m['meta']['snapshotDate']} (single day)
//
// SCOPE AND LIMITS — read before relying on these numbers:
//   • NO FORECASTING. All rows share one date, so price movement over time is
//     not identifiable. `supportsForecasting` is false and the UI must not
//     present these figures as a prediction.
//   • NO GRADE PREMIUM. {g['reason']}
//     `GRADE_EFFECT.identified` is false.
//   • POINT ACCURACY IS LOW. Leave-one-out MAPE is {v['commodityPlusState']['mape']}%
//     (median APE {v['commodityPlusState']['medianApe']}%) against a naive baseline of
//     {v['naiveGlobalMedian']['mape']}%. Treat every figure as a reference range,
//     never a quotable price.

import {{ CropType }} from '../types';

export interface MarketQuote {{
  market: string;
  state: string;
  district: string;
  grade: string;
  min: number;
  max: number;
  modal: number;
}}

export interface CommodityPriceStats {{
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
}}

export const PRICE_MODEL_META = {j(m['meta'])} as const;

/** Leave-one-out validation. Published so the UI can show its own error bars. */
export const MODEL_VALIDATION = {j(m['validation'])} as const;

/**
 * Why no grade multiplier is shipped. Kept in the artifact so the reason
 * travels with the data instead of living only in a commit message.
 */
export const GRADE_EFFECT = {j(m['gradeEffect'])} as const;

/** State price level relative to each commodity's own median. */
export const STATE_FACTORS: Record<string, number> = {j(m['stateFactors'])};

/** Quotes backing each state factor. Small n means a wide error bar. */
export const STATE_SUPPORT: Record<string, number> = {j(m['stateSupport'])};

export const COMMODITY_STATS: Record<string, CommodityPriceStats> = {j(m['commodities'])};

/** Feed commodity names for the crop types the app models. */
export const CROP_TO_COMMODITY: Partial<Record<CropType, string>> = {j(m['cropAliases'])};

export const statsForCrop = (crop: CropType): CommodityPriceStats | null => {{
  const name = CROP_TO_COMMODITY[crop];
  return (name && COMMODITY_STATS[name]) || null;
}};

/** Observed median modal price for a crop, or null if the feed has no data. */
export const cropBenchmark = (crop: CropType): number | null =>
  statsForCrop(crop)?.medianModal ?? null;

/** Apply the learned state price level to a crop's national median. */
export const cropBenchmarkInState = (crop: CropType, state: string): number | null => {{
  const base = cropBenchmark(crop);
  if (base === null) return null;
  return Math.round(base * (STATE_FACTORS[state] ?? 1));
}};

/**
 * Realistic negotiation band from observed within-market dispersion.
 * Use `floor` as the "do not accept below" line. Grade is deliberately NOT a
 * parameter — see GRADE_EFFECT for why it is not estimable from this data.
 */
export const negotiationBand = (
  crop: CropType,
  state?: string
): {{ floor: number; centre: number; ceiling: number; bandPercent: number }} | null => {{
  const stats = statsForCrop(crop);
  const centre = state ? cropBenchmarkInState(crop, state) : cropBenchmark(crop);
  if (!stats || centre === null) return null;
  const half = stats.bandPercent / 100 / 2;
  return {{
    floor: Math.round(centre * (1 - half)),
    centre,
    ceiling: Math.round(centre * (1 + half)),
    bandPercent: stats.bandPercent
  }};
}};

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
export const dispersionIsExtreme = (crop: CropType): boolean => {{
  const s = statsForCrop(crop);
  if (!s) return false;
  return s.maxModal / Math.max(s.minModal, 1) >= 2;
}};

/** Best and worst market observed for a crop — the arbitrage the farmer can see. */
export const arbitrageForCrop = (crop: CropType) => {{
  const s = statsForCrop(crop);
  if (!s) return null;
  return {{
    best: {{ market: s.bestMarket, price: s.bestMarketPrice }},
    worst: {{ market: s.worstMarket, price: s.worstMarketPrice }},
    spread: s.crossMarketSpread,
    spreadPercent: Math.round((s.crossMarketSpread / s.worstMarketPrice) * 100)
  }};
}};
"""


def main():
    rows, rejected = load_rows()
    sf, ssup = state_factors(rows)
    stats = commodity_stats(rows)
    grade = grade_identifiability(rows)
    validation = loo_validate(rows)
    dates = sorted({r["date"] for r in rows})

    aliases = {c: n for c, n in CROP_ALIASES.items() if n in stats}

    model = {
        "meta": {
            "rows": len(rows),
            "rejectedRows": rejected,
            "commodities": len(stats),
            "markets": len({r["market"] for r in rows}),
            "states": len({r["state"] for r in rows}),
            "snapshotDate": dates[0] if len(dates) == 1 else f"{dates[0]}..{dates[-1]}",
            "distinctDates": len(dates),
            "trainedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "supportsForecasting": len(dates) > 1,
        },
        "stateFactors": sf,
        "stateSupport": ssup,
        "gradeEffect": grade,
        "commodities": stats,
        "cropAliases": aliases,
        "validation": validation,
    }

    JSON_OUT.write_text(json.dumps(model, indent=2, ensure_ascii=False))
    TS_OUT.write_text(to_ts(model))

    W = 64
    print("=" * W)
    print("MANDI PRICE REFERENCE MODEL")
    print("=" * W)
    mm = model["meta"]
    print(f"rows accepted / rejected : {mm['rows']} / {mm['rejectedRows']}")
    print(f"commodities / markets    : {mm['commodities']} / {mm['markets']} across {mm['states']} states")
    print(f"distinct dates           : {mm['distinctDates']}  -> forecasting {'ENABLED' if mm['supportsForecasting'] else 'NOT SUPPORTED'}")

    print("\n-- grade premium --------------------------------------------")
    print(f"identified : {grade['identified']}")
    print(f"reason     : {grade['reason']}")
    for g, c in sorted(grade["gradeConcentration"].items(), key=lambda kv: -kv[1]["quotes"])[:5]:
        print(f"   {g:<14} n={c['quotes']:<4} {int(c['topStateShare']*100):>3}% in {c['topState']}")

    print("\n-- leave-one-out validation ---------------------------------")
    for name, r in validation.items():
        print(f"   {name:<22} MAPE {r['mape']:>5.1f}%   median APE {r['medianApe']:>5.1f}%   n={r['samples']}")
    best = validation["commodityPlusState"]["mape"]
    naive = validation["naiveGlobalMedian"]["mape"]
    print(f"   improvement over naive : {(1-best/naive)*100:.1f}% lower error")

    print("\n-- state price levels (relative to commodity median) --------")
    for s, f in sorted(sf.items(), key=lambda kv: -kv[1]):
        print(f"   {s:<18} x{f:<7.3f}  (n={ssup[s]})")

    print("\n-- crops wired into the app ---------------------------------")
    for crop, name in aliases.items():
        s = stats[name]
        print(f"   {crop:<8} <- {name:<10} Rs{s['medianModal']:<6} "
              f"range Rs{s['minModal']}-{s['maxModal']}  band {s['bandPercent']}%  ({s['quotes']} quotes)")
    missing = [c for c in CROP_ALIASES if c not in aliases]
    if missing:
        print(f"   no feed data for: {', '.join(missing)} (app keeps its existing defaults)")

    print(f"\nwrote {TS_OUT.relative_to(ROOT)}")
    print(f"wrote {JSON_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
