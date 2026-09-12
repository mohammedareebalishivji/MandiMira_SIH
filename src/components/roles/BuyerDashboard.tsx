import React, { useState } from 'react';
import {
  Factory, ShieldCheck, CheckCircle2, IndianRupee, Clock, ArrowUpRight,
  Plus, PackageCheck, ScanLine, Building2, ChevronRight, AlertCircle
} from 'lucide-react';
import { UserSession } from '../../types';
import { TabId } from '../../data/navigation';
import { Translations } from '../../i18n';

interface Props {
  session: UserSession;
  onChangeTab: (tab: TabId) => void;
  t: Translations;
}

export const BuyerDashboard: React.FC<Props> = ({ session, onChangeTab, t }) => {
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleAuthorizeRelease = (farmer: string, amount: number) => {
    setSuccessToast(`Escrow DBT of ₹${amount.toLocaleString('en-IN')} approved and disbursed to ${farmer}'s bank account upon QC weighment clearance.`);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-[#b2f1be] border border-[#16532d]/40 text-[#00210c] px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16532d] flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="font-bold px-1 text-[#00210c]">✕</button>
        </div>
      )}

      {/* Top Header */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#002b7b]/10 flex items-center justify-center flex-shrink-0">
              <Factory className="w-6 h-6 text-[#002b7b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm font-bold text-[#191c1a] text-lg sm:text-xl">
                  {session.organisation}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#002b7b] text-white font-label-sm text-[10px] font-bold uppercase tracking-wider">
                  {t.buyerCockpit}
                </span>
              </div>
              <p className="font-body-sm text-xs sm:text-sm text-[#404941]">
                {t.buyerTagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeTab('demand')}
              className="min-h-[40px] px-3.5 rounded-xl bg-[#002b7b] hover:bg-[#003fab] text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.ctaPostSpec}</span>
            </button>
          </div>
        </div>

        {/* 4 Core Buyer Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Weekly Sourcing Goal</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">816 / 1,200 Qtl</span>
            <span className="text-[10px] text-[#16532d] font-semibold">68% Fulfilled</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Active Demand Orders</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#002b7b]">3 Live</span>
            <span className="text-[10px] text-[#717970]">Onion, Tomato, Potato</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Quality Compliance</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#16532d]">94.2%</span>
            <span className="text-[10px] text-[#16532d] font-semibold">Grade A Specification</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Escrow Reserve</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">₹24.5 Lakh</span>
            <span className="text-[10px] text-[#16532d] font-semibold">APMC Gateway Funded</span>
          </div>
        </div>
      </section>

      {/* Sourcing & Inspection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Inbound Consignments Today */}
        <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-sm">
              Today's Factory Gate Deliveries
            </h3>
            <span className="text-[10.5px] font-bold text-[#16532d] bg-[#b2f1be] px-2 py-0.5 rounded-full">
              2 Arriving
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { farmer: 'Rameshwar Patil', crop: 'Nashik Red Onion (40 Qtl)', amount: 115200, qc: 'QC Passed (Grade A)', time: 'Arrived 11:30 AM' },
              { farmer: 'Godavari Kisan FPO', crop: 'Red Onion Export Bulk (150 Qtl)', amount: 513000, qc: 'Weighbridge Verified', time: 'Arriving 2:30 PM' }
            ].map((d, i) => (
              <div key={i} className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/40 flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <strong className="text-[#191c1a]">{d.farmer}</strong>
                    <div className="text-[11px] text-[#404941]">{d.crop}</div>
                  </div>
                  <strong className="text-[#16532d] font-metric-lg">₹{d.amount.toLocaleString('en-IN')}</strong>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#c0c9be]/30">
                  <span className="text-[10.5px] text-[#717970]">{d.time} · {d.qc}</span>
                  <button
                    onClick={() => handleAuthorizeRelease(d.farmer, d.amount)}
                    className="px-2.5 py-1 rounded-lg bg-[#16532d] hover:bg-[#003b1b] text-white font-bold text-[11px] cursor-pointer"
                  >
                    Release Escrow DBT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Card 2: Quality Grading & Specification Desk */}
        <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-sm">
              Standard Procurement Specifications
            </h3>
            <button
              onClick={() => onChangeTab('quality')}
              className="text-xs font-bold text-[#002b7b] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>AI Grading Panel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            {[
              { attribute: 'Bulb Diameter', spec: '45–70 mm uniform size', impact: '+₹120/Qtl Premium' },
              { attribute: 'Moisture Content', spec: '≤ 12% moisture on field weighment', impact: 'Rejection if > 15%' },
              { attribute: 'Sprouting / Rot', spec: 'Nil tolerance (0%)', impact: 'Mandatory Grade A condition' },
              { attribute: 'Skin Color', spec: 'Uniform dark red, dry skins intact', impact: '+₹80/Qtl Export Spec' }
            ].map((spec, i) => (
              <div key={i} className="bg-[#f7faf5] rounded-xl p-2.5 border border-[#c0c9be]/30 flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#191c1a]">{spec.attribute}</span>
                  <div className="text-[10.5px] text-[#404941]">{spec.spec}</div>
                </div>
                <span className="text-[10px] font-bold text-[#16532d] bg-[#b2f1be]/50 px-2 py-0.5 rounded-md">
                  {spec.impact}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sourcing Hub Navigation */}
      <div className="bg-gradient-to-br from-[#002b7b]/10 via-white to-[#b2f1be]/20 rounded-2xl p-4 border border-[#002b7b]/30 flex items-center justify-between gap-3 shadow-xs">
        <div>
          <h4 className="font-bold text-sm text-[#191c1a]">Explore Farm Supply &amp; Open Auctions</h4>
          <p className="text-xs text-[#404941]">
            Source verified Grade A lots directly from 400+ Nashik farmers with digital lab certificates.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onChangeTab('sourcing')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#c0c9be] hover:bg-[#f1f4ef] text-xs font-bold text-[#191c1a] cursor-pointer"
          >
            Supply Board
          </button>
          <button
            onClick={() => onChangeTab('bidding')}
            className="px-3.5 py-2 rounded-xl bg-[#002b7b] hover:bg-[#003fab] text-white text-xs font-bold cursor-pointer"
          >
            Live Auctions
          </button>
        </div>
      </div>
    </div>
  );
};
