import React, { useState, useMemo } from 'react';
import {
  Boxes, ShieldCheck, ShieldAlert, MapPin, Calendar, Camera, IndianRupee, Filter, Calculator
} from 'lucide-react';
import { supplyLots, CROP_BENCHMARKS } from '../data/marketData';
import { getRole } from '../data/roles';
import { UserRole } from '../types';

interface Props {
  role: UserRole;
}

/**
 * Supply-side discovery for traders, buyers and FPOs.
 * The margin calculator is deliberately visible to both sides — a trader who
 * can defend their spread openly is the one farmers keep dealing with.
 */
export const SupplyBoard: React.FC<Props> = ({ role }) => {
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minTrust, setMinTrust] = useState(0);
  const isTrader = role === 'middleman';

  const rows = useMemo(
    () =>
      supplyLots
        .filter((l) => (!verifiedOnly || l.verified) && l.trustScore >= minTrust)
        .map((l) => {
          const qtl = l.quantityKg / 100;
          const lotValue = Math.round(qtl * l.askPricePerQtl);
          // Spread is only meaningful against the benchmark for the same crop.
          const benchmarkPerQtl = CROP_BENCHMARKS[l.cropType];
          const spread = benchmarkPerQtl - l.askPricePerQtl;
          // Transparent trader economics: gross spread less a realistic handling cost.
          const handlingPerQtl = 45;
          const netMarginPerQtl = spread - handlingPerQtl;
          return { ...l, qtl, lotValue, spread, netMarginPerQtl, netMargin: Math.round(netMarginPerQtl * qtl) };
        })
        .sort((a, b) => b.netMarginPerQtl - a.netMarginPerQtl),
    [verifiedOnly, minTrust]
  );

  const totalVolume = rows.reduce((s, r) => s + r.quantityKg, 0);

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#904d00]/10 flex items-center justify-center flex-shrink-0">
          <Boxes className="w-4.5 h-4.5 text-[#904d00]" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">Live Supply Board</h3>
          <span className="font-label-sm text-[11px] text-[#404941]">
            {rows.length} lots · {(totalVolume / 1000).toFixed(1)} tonnes available now
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-2.5">
        <Filter className="w-3.5 h-3.5 text-[#717970] flex-shrink-0" />
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`min-h-[32px] px-2.5 rounded-full font-label-sm text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
            verifiedOnly
              ? 'bg-[#16532d] text-white'
              : 'bg-white text-[#404941] border border-[#c0c9be]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified only
        </button>
        <label className="flex items-center gap-2 flex-1 min-w-[160px]">
          <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970] whitespace-nowrap">
            Min trust {minTrust}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minTrust}
            onChange={(e) => setMinTrust(Number(e.target.value))}
            className="flex-1 accent-[#16532d] cursor-pointer"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((l) => {
          const sellerRole = getRole(l.sellerRole);
          const good = l.netMarginPerQtl > 0;

          return (
            <div key={l.id} className="rounded-xl border border-[#c0c9be]/40 bg-[#f7faf5] p-3 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-md text-[13.5px] text-[#191c1a]">{l.sellerName}</span>
                    {l.verified ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-[#ba1a1a] flex-shrink-0" />
                    )}
                    <span
                      className="font-label-sm text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${sellerRole.accent}14`, color: sellerRole.accent }}
                    >
                      {sellerRole.label}
                    </span>
                  </div>
                  <span className="font-body-sm text-[12px] text-[#404941]">
                    {l.cropNameEn} · {l.grade}
                  </span>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-metric-lg text-[#191c1a] text-base flex items-center">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {l.askPricePerQtl.toLocaleString('en-IN')}
                  </span>
                  <span className="font-label-sm text-[9px] text-[#717970] uppercase tracking-wider">ask /Qtl</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                <span className="flex items-center gap-1 font-mono text-[11px] text-[#191c1a] font-bold">
                  {l.quantityKg.toLocaleString('en-IN')} kg
                </span>
                <span className="flex items-center gap-1 font-label-sm text-[#404941]">
                  <MapPin className="w-3 h-3" /> {l.village}
                </span>
                <span className="flex items-center gap-1 font-label-sm text-[#404941]">
                  <Calendar className="w-3 h-3" /> harvested {l.harvestedDaysAgo}d ago
                </span>
                <span className="flex items-center gap-1 font-label-sm text-[#404941]">
                  <Camera className="w-3 h-3" /> {l.photosCount} photos
                </span>
                <span className="font-label-sm text-[#404941]">Trust {l.trustScore}</span>
              </div>

              {isTrader && (
                <div
                  className="rounded-lg p-2.5 flex items-center justify-between gap-2"
                  style={{ backgroundColor: good ? '#b2f1be' : '#ffdad6' }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Calculator className="w-3.5 h-3.5 flex-shrink-0" style={{ color: good ? '#14512b' : '#93000a' }} />
                    <span
                      className="font-label-sm text-[10px] uppercase tracking-wider"
                      style={{ color: good ? '#14512b' : '#93000a' }}
                    >
                      Spread ₹{l.spread}/Qtl less ₹45 handling
                    </span>
                  </div>
                  <span className="font-metric-lg text-sm flex-shrink-0" style={{ color: good ? '#00210c' : '#93000a' }}>
                    {good ? '+' : '−'}₹{Math.abs(l.netMargin).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <button
                className="min-h-[42px] rounded-lg bg-[#16532d] text-white font-label-sm text-xs flex items-center justify-center gap-1.5 hover:bg-[#003b1b] active:scale-[0.99] transition-all cursor-pointer"
              >
                {isTrader ? 'Send a transparent quote' : 'Request this lot'} · ₹{l.lotValue.toLocaleString('en-IN')}
              </button>
            </div>
          );
        })}

        {rows.length === 0 && (
          <p className="font-body-sm text-[13px] text-[#717970] text-center py-6">
            No lots pass these filters. Lower the trust threshold to see more supply.
          </p>
        )}
      </div>
    </section>
  );
};
