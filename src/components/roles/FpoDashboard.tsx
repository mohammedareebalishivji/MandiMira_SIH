import React, { useState } from 'react';
import {
  Users, TrendingUp, ShieldCheck, IndianRupee, Truck, CheckCircle2,
  ArrowUpRight, Plus, PackageCheck, Calculator, Sparkles, Building2, ChevronRight
} from 'lucide-react';
import { UserSession } from '../../types';
import { TabId } from '../../data/navigation';
import { Translations } from '../../i18n';

interface Props {
  session: UserSession;
  onChangeTab: (tab: TabId) => void;
  t: Translations;
}

export const FpoDashboard: React.FC<Props> = ({ session, onChangeTab, t }) => {
  const [activeTab, setActiveTab] = useState<'pools' | 'members' | 'settlement'>('pools');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Split settlement simulation
  const [buyerPayout, setBuyerPayout] = useState<number>(1368000);
  const fpoCessPercent = 2.0; // 2% retained for cooperative working capital
  const fpoOperatingFee = Math.round((buyerPayout * fpoCessPercent) / 100);
  const memberDisbursement = buyerPayout - fpoOperatingFee;

  const [poolCurrentKg, setPoolCurrentKg] = useState<number>(32000);
  const targetKg = 40000;
  const progressPct = Math.min(100, Math.round((poolCurrentKg / targetKg) * 100));

  const handleAddMemberVolume = () => {
    if (poolCurrentKg >= targetKg) {
      setSuccessToast('Consignment is already at full capacity (40 Tonnes)!');
      return;
    }
    const added = 4000;
    setPoolCurrentKg((prev) => Math.min(targetKg, prev + added));
    setSuccessToast(`Added 4,000 kg from member lot into the bulk export pool. Progress: ${Math.min(100, Math.round(((poolCurrentKg + added) / targetKg) * 100))}%`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const handleDisburseMemberDBT = () => {
    setSuccessToast(`₹${memberDisbursement.toLocaleString('en-IN')} successfully scheduled for instant DBT split settlement across 12 contributing member bank accounts!`);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-[#b2f1be] border border-[#16532d]/40 text-[#00210c] px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16532d] flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="font-bold px-1 text-[#00210c]">✕</button>
        </div>
      )}

      {/* Main Cockpit Banner */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#003b1b]/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-[#003b1b]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm font-bold text-[#191c1a] text-lg sm:text-xl">
                  {session.organisation}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#003b1b] text-white font-label-sm text-[10px] font-bold uppercase tracking-wider">
                  {t.fpoCockpit}
                </span>
              </div>
              <p className="font-body-sm text-xs sm:text-sm text-[#404941]">
                {t.fpoTagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeTab('demand')}
              className="min-h-[40px] px-3.5 rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>{t.ctaBrowseOrders}</span>
            </button>
          </div>
        </div>

        {/* 4 Core FPO Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">{t.metricsActiveMembers}</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">412 Farmers</span>
            <span className="text-[10px] text-[#16532d] font-semibold">18 Member Villages</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">{t.metricsAggregatedVol}</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#003b1b]">41.2 Tonnes</span>
            <span className="text-[10px] text-[#717970]">Onion, Tomato, Soybean</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">{t.metricsBulkPremium}</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#16532d] flex items-center">
              +₹180/qtl
            </span>
            <span className="text-[10px] text-[#16532d] font-semibold">+6.2% over single farm</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">{t.metricsPayouts}</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">98.4%</span>
            <span className="text-[10px] text-[#16532d] font-semibold">Zero payment disputes</span>
          </div>
        </div>
      </section>

      {/* Sub navigation pills */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#c0c9be]/40 self-start shadow-xs text-xs">
        <button
          onClick={() => setActiveTab('pools')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'pools' ? 'bg-[#003b1b] text-white shadow-xs' : 'text-[#404941]'
          }`}
        >
          Consignment Aggregation ({progressPct}%)
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'members' ? 'bg-[#003b1b] text-white shadow-xs' : 'text-[#404941]'
          }`}
        >
          Contributing Members (12 Lots)
        </button>
        <button
          onClick={() => setActiveTab('settlement')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'settlement' ? 'bg-[#003b1b] text-white shadow-xs' : 'text-[#404941]'
          }`}
        >
          Member Split Settlement Calculator
        </button>
      </div>

      {/* VIEW 1: ACTIVE AGGREGATION POOL */}
      {activeTab === 'pools' && (
        <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#003b1b] font-bold">
                Active Bulk Consignment Pool #FPO-NSK-09
              </span>
              <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
                Nashik Red Onion — Corporate Export Truckload (40 Tonnes)
              </h3>
              <p className="font-body-sm text-xs text-[#404941] mt-0.5">
                Aggregating member lots to fill a 40-tonne direct container for Sahyadri Foods Processing Unit.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#b2f1be] text-[#00210c] text-xs font-bold">
              +₹180/qtl Bulk Premium Unlocked
            </span>
          </div>

          {/* Progress bar */}
          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/40 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#191c1a]">
                Consignment Volume: <strong>{(poolCurrentKg / 1000).toFixed(1)} / {(targetKg / 1000).toFixed(1)} Tonnes</strong> ({progressPct}%)
              </span>
              <span className="font-bold text-[#003b1b]">
                {poolCurrentKg >= targetKg ? 'Target Achieved! Ready for Dispatch' : `Need ${((targetKg - poolCurrentKg) / 1000).toFixed(1)} Tonnes`}
              </span>
            </div>

            <div className="w-full bg-[#e0e3df] rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#003b1b] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-[#717970] block">Corporate Buyer:</span>
                <strong>Sahyadri Foods Pvt Ltd</strong>
              </div>
              <div>
                <span className="text-[#717970] block">Agreed Rate:</span>
                <strong className="text-[#16532d]">₹3,420 / Qtl</strong>
              </div>
              <div>
                <span className="text-[#717970] block">Standard Benchmark:</span>
                <span>₹3,240 / Qtl</span>
              </div>
              <div>
                <span className="text-[#717970] block">Total Consignment Value:</span>
                <strong className="text-[#191c1a]">₹13,68,000</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
            <button
              onClick={handleAddMemberVolume}
              className="min-h-[42px] px-4 rounded-xl bg-[#f1f4ef] hover:bg-[#e0e3df] text-[#191c1a] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-[#c0c9be]/40"
            >
              <Plus className="w-4 h-4 text-[#003b1b]" />
              <span>Pool Member Lot (+4,000 kg)</span>
            </button>

            <button
              onClick={() => {
                setSuccessToast('Consignment booked with Jadhav Roadlines 40-tonne container. Scheduled for factory gate arrival tomorrow 8 AM.');
                setTimeout(() => setSuccessToast(null), 6000);
              }}
              className="min-h-[42px] px-5 rounded-xl bg-[#003b1b] hover:bg-[#16532d] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98 transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Dispatch 40-Tonne Consignment</span>
            </button>
          </div>
        </section>
      )}

      {/* VIEW 2: CONTRIBUTING MEMBER LOTS */}
      {activeTab === 'members' && (
        <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
          <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
            Contributing Member Lots in Active Pool
          </h3>

          <div className="flex flex-col gap-2">
            {[
              { name: 'Rameshwar Patil', village: 'Niphad', kg: 4000, grade: 'Grade A', bank: 'SBI Niphad · ****4121', share: 134064 },
              { name: 'Anita Wagh', village: 'Ozar', kg: 6500, grade: 'Grade A', bank: 'BOI Ozar · ****8892', share: 217854 },
              { name: 'Sopan Gaikwad', village: 'Chandwad', kg: 8000, grade: 'Grade A', bank: 'Canara Chandwad · ****1102', share: 268128 },
              { name: 'Dinkar Shinde', village: 'Dindori', kg: 5500, grade: 'Grade A', bank: 'Nashik DCCB · ****7721', share: 184338 },
              { name: 'Kisan Vikas Group (8 members)', village: 'Yeola', kg: 8000, grade: 'Grade A', bank: 'Multi-member Pool', share: 268128 }
            ].map((m, idx) => (
              <div key={idx} className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/40 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#003b1b]/10 flex items-center justify-center font-bold text-[#003b1b]">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#191c1a]">{m.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16532d]" />
                      <span className="text-[#717970]">({m.village})</span>
                    </div>
                    <span className="text-[11px] text-[#404941]">{m.bank} · {m.grade}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-mono font-bold text-sm text-[#191c1a]">{m.kg.toLocaleString('en-IN')} kg</span>
                  <span className="text-[11px] font-bold text-[#16532d]">₹{m.share.toLocaleString('en-IN')} Payout</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIEW 3: MEMBER SPLIT SETTLEMENT CALCULATOR */}
      {activeTab === 'settlement' && (
        <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#003b1b]" />
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
              Automated Member Split Settlement Engine
            </h3>
          </div>
          <p className="text-xs text-[#404941]">
            Transparent revenue pass-through: Corporate processor pays the FPO account via APMC Gateway, and the engine automatically splits net proceeds directly to member farmer accounts minus the 2% cooperative reserve.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f7faf5] p-3.5 rounded-xl border border-[#c0c9be]/40 text-xs">
            <div>
              <span className="text-[#717970] block uppercase text-[10px]">Gross Buyer Payment</span>
              <strong className="font-metric-lg text-lg font-bold text-[#191c1a]">
                ₹{buyerPayout.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-[#717970] block">40 Tonnes @ ₹3,420/Qtl</span>
            </div>

            <div>
              <span className="text-[#717970] block uppercase text-[10px]">2% FPO Reserve Retained</span>
              <strong className="font-metric-lg text-lg font-bold text-[#904d00]">
                ₹{fpoOperatingFee.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-[#717970] block">Retained for grading &amp; logistics</span>
            </div>

            <div>
              <span className="text-[#717970] block uppercase text-[10px]">Net Member Disbursement</span>
              <strong className="font-metric-lg text-lg font-bold text-[#16532d]">
                ₹{memberDisbursement.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-[#16532d] font-bold block">100% Direct DBT to 12 Members</span>
            </div>
          </div>

          <div className="p-3 bg-[#b2f1be]/30 rounded-xl border border-[#16532d]/30 text-xs text-[#14512b] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>All member disbursements verified and audited via PFMS and APMC electronic payment gateway.</span>
          </div>

          <button
            onClick={handleDisburseMemberDBT}
            className="min-h-[44px] rounded-xl bg-[#003b1b] hover:bg-[#16532d] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Authorize Instant Member Split DBT (₹{memberDisbursement.toLocaleString('en-IN')})</span>
          </button>
        </section>
      )}
    </div>
  );
};
