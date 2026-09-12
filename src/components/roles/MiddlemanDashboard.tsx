import React, { useState } from 'react';
import {
  Handshake, TrendingUp, Calculator, Gavel, Boxes, ShieldCheck, IndianRupee,
  Truck, ArrowUpRight, CheckCircle2, AlertCircle, Clock, FileText, ChevronRight
} from 'lucide-react';
import { UserSession } from '../../types';
import { TabId } from '../../data/navigation';
import { CROP_BENCHMARKS } from '../../data/marketData';
import { Translations } from '../../i18n';

interface Props {
  session: UserSession;
  onChangeTab: (tab: TabId) => void;
  t: Translations;
}

export const MiddlemanDashboard: React.FC<Props> = ({ session, onChangeTab, t }) => {
  const [calcCrop, setCalcCrop] = useState<'onion' | 'tomato' | 'potato' | 'soybean' | 'wheat'>('onion');
  const [calcBuyPrice, setCalcBuyPrice] = useState<number>(2850);
  const [calcQuantityQtl, setCalcQuantityQtl] = useState<number>(50);
  const handlingPerQtl = 45;

  const benchmark = CROP_BENCHMARKS[calcCrop] || 2800;
  const grossSpreadPerQtl = benchmark - calcBuyPrice;
  const netMarginPerQtl = grossSpreadPerQtl - handlingPerQtl;
  const totalNetMargin = Math.round(netMarginPerQtl * calcQuantityQtl);
  const totalCommitment = Math.round(calcBuyPrice * calcQuantityQtl);

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* Top Header */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#904d00]/10 flex items-center justify-center flex-shrink-0">
              <Handshake className="w-6 h-6 text-[#904d00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm font-bold text-[#191c1a] text-lg sm:text-xl">
                  {session.organisation}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#904d00] text-white font-label-sm text-[10px] font-bold uppercase tracking-wider">
                  {t.traderCockpit}
                </span>
              </div>
              <p className="font-body-sm text-xs sm:text-sm text-[#404941]">
                {t.traderTagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeTab('bidding')}
              className="min-h-[40px] px-3.5 rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <Gavel className="w-4 h-4" />
              <span>{t.ctaLiveBidding}</span>
            </button>
          </div>
        </div>

        {/* 4 Core Trader Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Today's Turnover</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">₹3,48,000</span>
            <span className="text-[10px] text-[#16532d] font-semibold">120 Qtl Moved</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Net Booked Margin</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#16532d]">+₹13,200</span>
            <span className="text-[10px] text-[#717970]">Avg ₹110/qtl spread</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Auction Quotes</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#904d00]">3 Active</span>
            <span className="text-[10px] text-[#16532d] font-semibold">1 Leading · 1 Outbid · 1 Won</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Trust Score</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">{session.trustScore}/100</span>
            <span className="text-[10px] text-[#16532d] font-semibold">APMC Verified Gate DBT</span>
          </div>
        </div>
      </section>

      {/* Action Quick Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onChangeTab('bidding')}
          className="bg-white p-4 rounded-2xl border border-[#c0c9be]/60 hover:border-[#16532d] transition-all text-left flex items-start justify-between gap-2 shadow-xs group cursor-pointer"
        >
          <div className="flex flex-col gap-1">
            <div className="w-8 h-8 rounded-xl bg-[#16532d]/10 flex items-center justify-center text-[#16532d]">
              <Gavel className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-[#191c1a] mt-1">Live Bidding Yard</span>
            <span className="text-[11px] text-[#404941]">Place quotes on active farmer lots</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#c0c9be] group-hover:text-[#16532d] transition-colors" />
        </button>

        <button
          onClick={() => onChangeTab('sourcing')}
          className="bg-white p-4 rounded-2xl border border-[#c0c9be]/60 hover:border-[#904d00] transition-all text-left flex items-start justify-between gap-2 shadow-xs group cursor-pointer"
        >
          <div className="flex flex-col gap-1">
            <div className="w-8 h-8 rounded-xl bg-[#904d00]/10 flex items-center justify-center text-[#904d00]">
              <Boxes className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-[#191c1a] mt-1">Direct Supply Board</span>
            <span className="text-[11px] text-[#404941]">Inspect 5+ freshly listed farm lots</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#c0c9be] group-hover:text-[#904d00] transition-colors" />
        </button>

        <button
          onClick={() => onChangeTab('demand')}
          className="bg-white p-4 rounded-2xl border border-[#c0c9be]/60 hover:border-[#002b7b] transition-all text-left flex items-start justify-between gap-2 shadow-xs group cursor-pointer"
        >
          <div className="flex flex-col gap-1">
            <div className="w-8 h-8 rounded-xl bg-[#002b7b]/10 flex items-center justify-center text-[#002b7b]">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-[#191c1a] mt-1">Stock Procurement Order</span>
            <span className="text-[11px] text-[#404941]">Broadcast your buying volume to farmers</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#c0c9be] group-hover:text-[#002b7b] transition-colors" />
        </button>
      </div>

      {/* Real-time Spread & Margin Calculator */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#904d00]" />
          <div>
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
              Trader Spread &amp; Net Margin Calculator
            </h3>
            <span className="text-xs text-[#404941]">
              Simulate profit before quoting: Mandi Terminal Benchmark less buy price and handling.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#191c1a]">Commodity</label>
            <select
              value={calcCrop}
              onChange={(e) => setCalcCrop(e.target.value as any)}
              className="p-2.5 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none cursor-pointer"
            >
              <option value="onion">Onion (Lasalgaon APMC)</option>
              <option value="potato">Potato (Pune Yard)</option>
              <option value="tomato">Tomato (Pimpalgaon)</option>
              <option value="soybean">Soybean (Latur)</option>
              <option value="wheat">Wheat (Nashik)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#191c1a]">Buy Price from Farmer (₹/Qtl)</label>
            <input
              type="number"
              value={calcBuyPrice}
              onChange={(e) => setCalcBuyPrice(Number(e.target.value))}
              min={100}
              step={25}
              className="p-2.5 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-bold outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#191c1a]">Consignment Quantity (Qtl)</label>
            <input
              type="number"
              value={calcQuantityQtl}
              onChange={(e) => setCalcQuantityQtl(Number(e.target.value))}
              min={1}
              step={5}
              className="p-2.5 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-bold outline-none"
            />
          </div>
        </div>

        {/* Calculation Result Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#f7faf5] p-3.5 rounded-xl border border-[#c0c9be]/40 text-xs">
          <div>
            <span className="text-[#717970] block uppercase text-[10px]">Mandi Benchmark</span>
            <strong className="font-metric-lg text-sm font-bold text-[#191c1a]">
              ₹{benchmark}/qtl
            </strong>
          </div>

          <div>
            <span className="text-[#717970] block uppercase text-[10px]">Handling &amp; APMC Cess</span>
            <strong className="font-metric-lg text-sm font-bold text-[#404941]">
              ₹{handlingPerQtl}/qtl
            </strong>
          </div>

          <div>
            <span className="text-[#717970] block uppercase text-[10px]">Net Margin / Qtl</span>
            <strong className={`font-metric-lg text-sm font-bold ${netMarginPerQtl >= 0 ? 'text-[#16532d]' : 'text-[#ba1a1a]'}`}>
              {netMarginPerQtl >= 0 ? '+' : ''}₹{netMarginPerQtl}/qtl
            </strong>
          </div>

          <div>
            <span className="text-[#717970] block uppercase text-[10px]">Total Expected Margin</span>
            <strong className={`font-metric-lg text-base font-bold ${totalNetMargin >= 0 ? 'text-[#16532d]' : 'text-[#ba1a1a]'}`}>
              {totalNetMargin >= 0 ? '+' : ''}₹{totalNetMargin.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#404941]">
          <span>Total Capital Commitment: <strong>₹{totalCommitment.toLocaleString('en-IN')}</strong></span>
          <button
            onClick={() => onChangeTab('bidding')}
            className="text-xs font-bold text-[#16532d] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Quote on Live Auction Yard</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Active Scheduled Consignments */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
        <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
          Today's Scheduled Pickups &amp; Mandi Settlement
        </h3>

        <div className="flex flex-col gap-2">
          {[
            { lot: 'Nashik Red Onion (40 Qtl)', farmer: 'Rameshwar Patil', village: 'Niphad', status: 'Loading Verified', amount: 115200, time: 'Today 2:00 PM' },
            { lot: 'Pukhraj Potato (60 Qtl)', farmer: 'Suresh Dhumal', village: 'Khed', status: 'In-Transit to Yard', amount: 85200, time: 'Today 5:30 PM' }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/40 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#904d00]/10 flex items-center justify-center text-[#904d00]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#191c1a]">{item.lot}</span>
                  <div className="text-[11px] text-[#404941]">Farmer: {item.farmer} · {item.village}</div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="font-bold text-[#16532d]">₹{item.amount.toLocaleString('en-IN')}</span>
                <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-[#b2f1be] text-[#00210c] font-bold">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
