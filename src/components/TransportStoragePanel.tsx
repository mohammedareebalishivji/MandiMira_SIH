import React, { useState, useMemo } from 'react';
import {
  Truck, Warehouse, Snowflake, ShieldCheck, ShieldAlert, Star, IndianRupee, Clock
} from 'lucide-react';
import { transportOptions, storageOptions } from '../data/marketData';
import { FarmerLot } from '../types';

interface Props {
  lot: FarmerLot;
  /** Distance to the market the farmer is currently leaning towards. */
  distanceKm: number;
}

/**
 * Solution #5 — Transport and storage, priced against this specific lot.
 * A rate is only real once the cost of getting there (or of waiting) is netted off.
 */
export const TransportStoragePanel: React.FC<Props> = ({ lot, distanceKm }) => {
  const [tab, setTab] = useState<'transport' | 'storage'>('transport');
  const qtl = lot.quantityKg / 100;

  const transportCosted = useMemo(
    () =>
      transportOptions
        .map((t) => {
          const total = Math.round(t.fixedCost + t.costPerKm * distanceKm);
          return { ...t, total, perQtl: Math.round(total / Math.max(qtl, 0.01)), fits: t.capacityKg >= lot.quantityKg };
        })
        .sort((a, b) => a.perQtl - b.perQtl),
    [distanceKm, qtl, lot.quantityKg]
  );

  const storageCosted = useMemo(
    () =>
      storageOptions.map((s) => {
        const sevenDayCost = Math.round(s.costPerQtlPerDay * qtl * 7);
        const sevenDayLossKg = Math.round((lot.quantityKg * s.spoilagePerDayPercent * 7) / 100);
        const lossValue = Math.round((sevenDayLossKg / 100) * lot.localMandiBenchmark);
        return { ...s, sevenDayCost, sevenDayLossKg, lossValue, totalCost: sevenDayCost + lossValue };
      }),
    [qtl, lot.quantityKg, lot.localMandiBenchmark]
  );

  const cheapestHold = [...storageCosted].sort((a, b) => a.totalCost - b.totalCost)[0];

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#663500]/10 flex items-center justify-center flex-shrink-0">
          <Truck className="w-4.5 h-4.5 text-[#663500]" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">Move it or Hold it</h3>
          <span className="font-label-sm text-[11px] text-[#404941]">
            Costed for {lot.quantityKg} kg over {distanceKm} km
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#ecefea] rounded-xl p-1">
        {([['transport', 'Transport', Truck], ['storage', 'Storage', Warehouse]] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 min-h-[38px] rounded-lg font-label-sm text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === id ? 'bg-white text-[#003b1b] shadow-xs' : 'text-[#404941] hover:text-[#191c1a]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'transport' && (
        <div className="flex flex-col gap-2">
          {transportCosted.map((t, i) => (
            <div
              key={t.id}
              className={`rounded-xl border p-3 flex flex-col gap-2 ${
                i === 0 && t.fits ? 'border-[#16532d] bg-[#f1f4ef]' : 'border-[#c0c9be]/40 bg-[#f7faf5]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-md text-[13px] text-[#191c1a]">{t.provider}</span>
                    {t.verified ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-[#ba1a1a] flex-shrink-0" />
                    )}
                    {t.coldChain && <Snowflake className="w-3.5 h-3.5 text-[#002b7b] flex-shrink-0" />}
                    {i === 0 && t.fits && (
                      <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded-full bg-[#b2f1be] text-[#00210c] uppercase tracking-wider">
                        Cheapest
                      </span>
                    )}
                  </div>
                  <span className="font-body-sm text-[11.5px] text-[#404941]">{t.vehicle}</span>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-metric-lg text-[#191c1a] flex items-center text-base">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {t.total.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-[10px] text-[#404941]">₹{t.perQtl}/Qtl</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap text-[11px]">
                <span className="flex items-center gap-1 text-[#404941] font-label-sm">
                  <Clock className="w-3 h-3" /> {t.availability}
                </span>
                <span className="flex items-center gap-1 text-[#404941] font-label-sm">
                  <Star className="w-3 h-3 text-[#fe932c]" /> {t.rating}
                </span>
                <span className="font-mono text-[10px] text-[#717970]">
                  cap {t.capacityKg.toLocaleString('en-IN')} kg
                </span>
              </div>

              <p className="font-body-sm text-[11.5px] text-[#404941] leading-snug">{t.notes}</p>

              {!t.fits && (
                <p className="font-label-sm text-[10px] text-[#93000a] bg-[#ffdad6] rounded-lg px-2 py-1">
                  Too small for {lot.quantityKg} kg — you would need {Math.ceil(lot.quantityKg / t.capacityKg)} trips.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'storage' && (
        <div className="flex flex-col gap-2">
          <div className="bg-[#003b1b] rounded-xl p-3 flex flex-col gap-0.5">
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#88c695]">
              Cheapest way to hold 7 days
            </span>
            <span className="font-headline-sm text-white text-[15px]">{cheapestHold.facility}</span>
            <span className="font-mono text-[11px] text-[#b2f1be]">
              ₹{cheapestHold.sevenDayCost.toLocaleString('en-IN')} rent + ₹{cheapestHold.lossValue.toLocaleString('en-IN')} spoilage
              = ₹{cheapestHold.totalCost.toLocaleString('en-IN')} all-in
            </span>
          </div>

          {storageCosted.map((s) => (
            <div key={s.id} className="rounded-xl border border-[#c0c9be]/40 bg-[#f7faf5] p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-md text-[13px] text-[#191c1a]">{s.facility}</span>
                    {s.verified ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-[#ba1a1a] flex-shrink-0" />
                    )}
                  </div>
                  <span className="font-mono text-[10.5px] text-[#404941]">
                    {s.distanceKm} km · {s.availableQtl.toLocaleString('en-IN')} Qtl free · max {s.maxHoldDays} days
                  </span>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-metric-lg text-[#191c1a] text-base flex items-center">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {s.totalCost.toLocaleString('en-IN')}
                  </span>
                  <span className="font-label-sm text-[9px] text-[#717970] uppercase tracking-wider">7-day all-in</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white rounded-lg border border-[#c0c9be]/40 px-2 py-1.5">
                  <span className="font-label-sm text-[9px] uppercase tracking-wider text-[#717970] block">Rent</span>
                  <span className="font-mono text-[12px] text-[#191c1a]">₹{s.sevenDayCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-white rounded-lg border border-[#c0c9be]/40 px-2 py-1.5">
                  <span className="font-label-sm text-[9px] uppercase tracking-wider text-[#717970] block">
                    Spoilage @ {s.spoilagePerDayPercent}%/day
                  </span>
                  <span className="font-mono text-[12px] text-[#93000a]">
                    {s.sevenDayLossKg} kg · ₹{s.lossValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {s.features.map((f) => (
                  <span
                    key={f}
                    className="font-label-sm text-[9.5px] px-2 py-0.5 rounded-full bg-[#ecefea] text-[#404941] border border-[#c0c9be]/40"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
