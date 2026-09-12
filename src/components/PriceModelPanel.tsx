import React, { useState, useMemo } from 'react';
import {
  Database, TriangleAlert, MapPin, ArrowUpRight, Info, ChevronDown, ChevronUp, Sparkles, ArrowRight
} from 'lucide-react';
import {
  PRICE_MODEL_META, MODEL_VALIDATION, GRADE_EFFECT, STATE_FACTORS, STATE_SUPPORT,
  COVERED_STATES, statsForCrop, arbitrageForCrop, negotiationBand, stateIsCovered,
  dispersionIsExtreme
} from '../data/priceModel';
import { predictPrice } from '../services/aiPricePredictor';
import { FarmerLot } from '../types';

interface Props {
  lot: FarmerLot;
  onOpenAIPredictor?: () => void;
}

/**
 * Surfaces the model trained from Data.csv, including what it cannot do.
 * The limits are shown alongside the numbers rather than buried, because a
 * reference price presented without its error bar invites over-trust.
 */
export const PriceModelPanel: React.FC<Props> = ({ lot, onOpenAIPredictor }) => {
  const [showLimits, setShowLimits] = useState(false);
  const stats = statsForCrop(lot.cropType);
  const arb = arbitrageForCrop(lot.cropType);
  const band = negotiationBand(lot.cropType);

  // The lot's district reads like "Nashik, MH" — take the state part.
  const lotState = lot.district.split(',').pop()?.trim() ?? '';
  const covered = stateIsCovered(lotState);
  // A national median cannot act as a floor when markets disagree this much.
  const extremeSpread = dispersionIsExtreme(lot.cropType);

  const aiPrediction = useMemo(() => {
    return predictPrice({
      commodity: lot.cropType,
      state: lotState || undefined,
      grade: lot.grade,
      quantityKg: lot.quantityKg
    });
  }, [lot.cropType, lotState, lot.grade, lot.quantityKg]);

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#002b7b]/10 flex items-center justify-center flex-shrink-0">
            <Database className="w-4.5 h-4.5 text-[#002b7b]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">Observed Market Data & AI Model</h3>
            <span className="font-label-sm text-[11px] text-[#404941]">
              {PRICE_MODEL_META.rows} quotes · {PRICE_MODEL_META.markets} markets · 55 crops trained
            </span>
          </div>
        </div>

        {onOpenAIPredictor && (
          <button
            onClick={onOpenAIPredictor}
            className="text-xs font-bold text-[#16532d] bg-[#d5f5dc] hover:bg-[#b2f1be] px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#16532d]" />
            <span>AI Predictor</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* AI Model Trained Rate Highlight */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#124b26] rounded-xl p-3 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#b2f1be]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#b2f1be]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#88c695]">
              AI ML Clearing Prediction ({lot.grade})
            </span>
            <span className="text-base font-bold font-mono text-white">
              ₹{aiPrediction.predictedModalPrice.toLocaleString('en-IN')}<span className="text-xs font-normal text-[#b2f1be]"> /Qtl</span>
              <span className="text-[11px] font-normal text-[#b2f1be]/80 ml-2">
                (Floor: ₹{aiPrediction.negotiationCorridor.floorRate} · Top: ₹{aiPrediction.negotiationCorridor.premiumRate})
              </span>
            </span>
          </div>
        </div>
        <span className="text-[10.5px] font-semibold text-[#b2f1be] bg-white/10 px-2 py-0.5 rounded-full font-mono">
          {aiPrediction.confidenceScore}% Conf.
        </span>
      </div>

      {!stats ? (
        <div className="bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-3">
          <p className="font-body-sm text-[12.5px] text-[#404941]">
            The feed has no quotes for <span className="font-bold">{lot.cropNameEn}</span>. The app is
            using its curated default price for this crop, not observed market data.
          </p>
        </div>
      ) : (
        <>
          {!covered && (
            <div className="flex items-start gap-2 rounded-xl border border-[#ba1a1a]/30 bg-[#ffdad6] px-3 py-2.5">
              <TriangleAlert className="w-4 h-4 text-[#93000a] flex-shrink-0 mt-0.5" />
              <p className="font-label-sm text-[11px] text-[#93000a] leading-snug">
                This lot is in <span className="font-bold">{lot.district}</span>, and the feed has no
                quotes from there. It covers {COVERED_STATES.length} states only
                ({COVERED_STATES.join(', ')}). The figures below are national reference points, not
                your local rate.
              </p>
            </div>
          )}

          {/* Observed price for this crop */}
          <div className="bg-[#003b1b] rounded-xl p-3.5 flex flex-col gap-1">
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#88c695]">
              {stats.commodity} · median across {stats.markets} markets
            </span>
            <span className="font-metric-xl text-white">₹{stats.medianModal.toLocaleString('en-IN')}<span className="text-sm font-normal"> /Qtl</span></span>
            <span className="font-mono text-[11px] text-[#b2f1be]">
              observed range ₹{stats.minModal.toLocaleString('en-IN')} – ₹{stats.maxModal.toLocaleString('en-IN')}
              {' '}· IQR ₹{stats.iqr[0].toLocaleString('en-IN')}–₹{stats.iqr[1].toLocaleString('en-IN')}
            </span>
          </div>

          {/* Negotiation band and arbitrage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {band && (
              <div className="bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-3 flex flex-col gap-1">
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970]">
                  Typical within-market band · {band.bandPercent}% spread
                </span>
                <span className="font-metric-lg text-[#191c1a] text-base">
                  ₹{band.floor.toLocaleString('en-IN')} – ₹{band.ceiling.toLocaleString('en-IN')}
                </span>
                {extremeSpread ? (
                  <span className="font-label-sm text-[10.5px] text-[#663500] leading-snug">
                    Not a price floor — markets in this feed disagree by{' '}
                    {Math.round((stats.maxModal / Math.max(stats.minModal, 1) - 1) * 100)}%, so use
                    your own market's rate, not this national figure.
                  </span>
                ) : (
                  <span className="font-label-sm text-[10.5px] text-[#93000a]">
                    Do not accept below ₹{band.floor.toLocaleString('en-IN')}/Qtl
                  </span>
                )}
              </div>
            )}

            {arb && (
              <div className="bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-3 flex flex-col gap-1">
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970]">
                  Cross-market spread
                </span>
                <span className="font-metric-lg text-[#16532d] text-base flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  ₹{arb.spread.toLocaleString('en-IN')} ({arb.spreadPercent}%)
                </span>
                <span className="font-label-sm text-[10.5px] text-[#404941] leading-snug">
                  {arb.best.market} ₹{arb.best.price.toLocaleString('en-IN')} vs {arb.worst.market} ₹
                  {arb.worst.price.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Every observed quote for this crop */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970]">
              Every quote in the feed for {stats.commodity}
            </span>
            {stats.marketQuotes.map((q, i) => (
              <div
                key={`${q.market}-${i}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-[#c0c9be]/40 bg-[#f7faf5] px-2.5 py-2"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-[12px] text-[#191c1a] truncate">{q.market}</span>
                  <span className="font-label-sm text-[10px] text-[#717970] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {q.state} · {q.grade}
                  </span>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-mono text-[13px] font-bold text-[#191c1a]">
                    ₹{q.modal.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-[9.5px] text-[#717970]">
                    ₹{q.min.toLocaleString('en-IN')}–{q.max.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* What the model cannot do */}
      <button
        onClick={() => setShowLimits(!showLimits)}
        className="flex items-center justify-between gap-2 rounded-xl border border-[#fe932c]/40 bg-[#ffdcc3] px-3 py-2.5 cursor-pointer text-left"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <TriangleAlert className="w-4 h-4 text-[#663500] flex-shrink-0" />
          <span className="font-label-sm text-[11px] text-[#663500]">
            What this data cannot tell you
          </span>
        </div>
        {showLimits ? (
          <ChevronUp className="w-4 h-4 text-[#663500] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#663500] flex-shrink-0" />
        )}
      </button>

      {showLimits && (
        <div className="flex flex-col gap-2 rounded-xl border border-[#c0c9be]/40 bg-[#f7faf5] p-3">
          {[
            {
              title: 'No price forecast',
              body: `All ${PRICE_MODEL_META.rows} rows carry the same date (${PRICE_MODEL_META.snapshotDate}). With one day of data, price movement over time cannot be estimated. Any "hold for 4 days" advice in this app comes from the rule-based decision engine, not from this dataset.`
            },
            {
              title: 'No grade premium',
              body: GRADE_EFFECT.reason
            },
            {
              title: 'Wide error on any single prediction',
              body: `Leave-one-out validation gives ${MODEL_VALIDATION.commodityPlusState.mape}% mean error (median ${MODEL_VALIDATION.commodityPlusState.medianApe}%), against ${MODEL_VALIDATION.naiveGlobalMedian.mape}% for a naive baseline. Treat these as reference ranges, never quotable prices.`
            }
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-[#002b7b] flex-shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[11.5px] text-[#191c1a]">{item.title}</span>
                <span className="font-body-sm text-[11.5px] text-[#404941] leading-snug">{item.body}</span>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-1 pt-1 border-t border-[#c0c9be]/40">
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970]">
              State price levels the model did learn
            </span>
            <div className="flex flex-wrap gap-1">
              {Object.entries(STATE_FACTORS)
                .sort((a, b) => b[1] - a[1])
                .map(([state, factor]) => (
                  <span
                    key={state}
                    className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-white text-[#404941] border border-[#c0c9be]/50"
                    title={`${STATE_SUPPORT[state]} quotes`}
                  >
                    {state} ×{factor.toFixed(2)}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
