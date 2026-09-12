import React, { useState } from 'react';
import {
  ShieldCheck, AlertTriangle, Scale, BarChart3, Clock, IndianRupee,
  CheckCircle2, FileText, ArrowUpRight, Search, Eye, AlertCircle
} from 'lucide-react';
import { UserSession } from '../../types';
import { TabId } from '../../data/navigation';

interface Props {
  session: UserSession;
  onChangeTab: (tab: TabId) => void;
}

export const OfficerDashboard: React.FC<Props> = ({ session, onChangeTab }) => {
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleIssueMediationOrder = (disputeId: string) => {
    setSuccessToast(`Official APMC Mediation Notice issued for dispute #${disputeId}. Escrow balance frozen pending weighbridge audit hearing.`);
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
            <div className="w-11 h-11 rounded-2xl bg-[#003fab]/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#003fab]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm font-bold text-[#191c1a] text-lg sm:text-xl">
                  {session.organisation}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#003fab] text-white font-label-sm text-[10px] font-bold uppercase tracking-wider">
                  APMC Market Regulator
                </span>
              </div>
              <p className="font-body-sm text-xs sm:text-sm text-[#404941]">
                Market Secretary Oversight · Fair Trade Compliance · Arrival Volume &amp; Anti-Cartel Monitoring.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeTab('grievance')}
              className="min-h-[40px] px-3.5 rounded-xl bg-[#003fab] hover:bg-[#002b7b] text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <Scale className="w-4 h-4" />
              <span>Dispute Mediation Desk</span>
            </button>
          </div>
        </div>

        {/* 4 Regulatory Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Today's Yard Arrivals</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">4,200 Qtl</span>
            <span className="text-[10px] text-[#16532d] font-semibold">-17.6% (Firming rates)</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Total Mandi Turnover</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#003fab]">₹1.18 Crore</span>
            <span className="text-[10px] text-[#717970]">100% e-NAM Synced</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Mandi Cess Collected</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#16532d]">₹1,23,900</span>
            <span className="text-[10px] text-[#16532d] font-semibold">1.05% Statutory Cess</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Active Disputes</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#ba1a1a]">2 Open</span>
            <span className="text-[10px] text-[#ba1a1a] font-semibold">72-Hour SLA Active</span>
          </div>
        </div>
      </section>

      {/* Price Deviation & Anti-Cartel Alert Feed */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
              Price Deviation &amp; Anti-Cartel Surveillance
            </h3>
          </div>
          <span className="text-xs text-[#717970]">Real-time APMC algorithm audit</span>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="bg-[#ffdad6]/40 border border-[#ba1a1a]/30 p-3.5 rounded-xl flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#ba1a1a] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#93000a] text-sm block">Abnormal Low Bid Flagged (Trade #TRD-8819)</strong>
                <p className="text-[#404941] mt-0.5 leading-relaxed">
                  Trader <strong>Agrawal Agro Merchants</strong> submitted bid of <strong>₹2,400/Qtl</strong> for Onion Grade A. Modal APMC benchmark is <strong>₹2,790/Qtl</strong> (-14.0% below floor corridor). Potential predatory bid flagged.
                </p>
                <div className="text-[10.5px] text-[#717970] mt-1">
                  Lot: Rameshwar Patil (40 Qtl) · Niphad Gate · Flagged 12 mins ago
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessToast('Formal explanation inquiry sent to trader Agrawal Agro Merchants under APMC Rule 41.');
                setTimeout(() => setSuccessToast(null), 5000);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#ba1a1a] text-white font-bold text-xs whitespace-nowrap cursor-pointer hover:bg-[#93000a]"
            >
              Issue Explanation Notice
            </button>
          </div>

          <div className="bg-[#b2f1be]/30 border border-[#16532d]/20 p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16532d] flex-shrink-0" />
              <span className="text-[#14512b] font-medium">
                Weighbridge #1, #2 &amp; #3 certified. Last digital calibration check passed at 6:00 AM IST (0.01% tolerance).
              </span>
            </div>
            <span className="text-[10px] text-[#717970]">Certified</span>
          </div>
        </div>
      </section>

      {/* Active Dispute Mediation Desk */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm font-bold text-[#191c1a] text-base flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#003fab]" />
            <span>Active Farmer-Trader Dispute Cases</span>
          </h3>
          <button
            onClick={() => onChangeTab('grievance')}
            className="text-xs font-bold text-[#003fab] hover:underline cursor-pointer"
          >
            View Grievance Center →
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {[
            {
              id: 'GRV-401',
              complainant: 'Rameshwar Patil (Farmer)',
              respondent: 'Shaikh Trading Co. (Trader)',
              issue: 'Weight deduction discrepancy of 120 kg at unloading weighbridge',
              amount: 3840,
              sla: '38 hours left',
              status: 'Under Mediation'
            },
            {
              id: 'GRV-402',
              complainant: 'Godavari Kisan FPO',
              respondent: 'Vikas Agri Sourcing',
              issue: 'Payment delay beyond 48-hour APMC gateway settlement mandate',
              amount: 45000,
              sla: '14 hours left',
              status: 'Escrow Frozen'
            }
          ].map((caseItem) => (
            <div key={caseItem.id} className="bg-[#f7faf5] rounded-xl p-3.5 border border-[#c0c9be]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm text-[#191c1a]">{caseItem.id}</strong>
                  <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#663500] font-bold">
                    {caseItem.status}
                  </span>
                  <span className="text-[#717970]">{caseItem.sla}</span>
                </div>
                <div className="text-[#404941] mt-0.5">
                  <strong>{caseItem.complainant}</strong> vs <strong>{caseItem.respondent}</strong>
                </div>
                <div className="text-[11px] text-[#717970] mt-0.5">{caseItem.issue} · Disputed: ₹{caseItem.amount.toLocaleString('en-IN')}</div>
              </div>

              <button
                onClick={() => handleIssueMediationOrder(caseItem.id)}
                className="px-3.5 py-1.5 rounded-lg bg-[#003fab] hover:bg-[#002b7b] text-white font-bold text-xs whitespace-nowrap cursor-pointer shadow-xs"
              >
                Issue Mediation Hearing Order
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
