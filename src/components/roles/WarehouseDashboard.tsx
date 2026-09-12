import React, { useState } from 'react';
import {
  Warehouse, Snowflake, ShieldCheck, Thermometer, Droplets, CheckCircle2,
  FileCheck, IndianRupee, Clock, ArrowUpRight, AlertCircle, Plus
} from 'lucide-react';
import { UserSession } from '../../types';
import { TabId } from '../../data/navigation';
import { Translations } from '../../i18n';

interface Props {
  session: UserSession;
  onChangeTab: (tab: TabId) => void;
  t: Translations;
}

export const WarehouseDashboard: React.FC<Props> = ({ session, onChangeTab, t }) => {
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [occupancyQtl, setOccupancyQtl] = useState<number>(5400);
  const totalCapacityQtl = 8000;
  const occupancyPct = Math.round((occupancyQtl / totalCapacityQtl) * 100);

  const handleApproveBay = (farmer: string, qtl: number) => {
    setOccupancyQtl((prev) => Math.min(totalCapacityQtl, prev + qtl));
    setSuccessToast(`Bay approved for ${farmer} (${qtl} Qtl). Electronic Warehouse Receipt (e-NWR) generated and sent to farmer mobile via SMS.`);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  const handleIssueENWR = () => {
    setSuccessToast('Official e-NWR Certificate #NWR-MH-2026-9921 issued! Farmer can now apply for 75% pledge loan at SBI Lasalgaon.');
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
            <div className="w-11 h-11 rounded-2xl bg-[#2f6a41]/10 flex items-center justify-center flex-shrink-0">
              <Warehouse className="w-6 h-6 text-[#2f6a41]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm font-bold text-[#191c1a] text-lg sm:text-xl">
                  {session.organisation}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#2f6a41] text-white font-label-sm text-[10px] font-bold uppercase tracking-wider">
                  {t.warehouseCockpit}
                </span>
              </div>
              <p className="font-body-sm text-xs sm:text-sm text-[#404941]">
                {t.warehouseTagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleIssueENWR}
              className="min-h-[40px] px-3.5 rounded-xl bg-[#2f6a41] hover:bg-[#1f4a2d] text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <FileCheck className="w-4 h-4" />
              <span>{t.ctaIssueENWR}</span>
            </button>
          </div>
        </div>

        {/* 4 Warehouse Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Capacity Utilization</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">{occupancyPct}%</span>
            <span className="text-[10px] text-[#16532d] font-semibold">{totalCapacityQtl - occupancyQtl} Qtl Available</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Daily Storage Billing</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#16532d]">₹10,800 / day</span>
            <span className="text-[10px] text-[#717970]">₹2.00 / Qtl / day</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Active Farmer Holds</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#2f6a41]">28 Farmers</span>
            <span className="text-[10px] text-[#16532d] font-semibold">Avg 21 days hold</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Spoilage Protection</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">99.92%</span>
            <span className="text-[10px] text-[#16532d] font-semibold">Zero Spoilage Claim Record</span>
          </div>
        </div>
      </section>

      {/* Real-time Chamber Climate Monitoring */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-3.5 shadow-xs">
        <h3 className="font-headline-sm font-bold text-[#191c1a] text-base flex items-center gap-2">
          <Snowflake className="w-5 h-5 text-[#2f6a41]" />
          <span>Live Storage Chamber IoT Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#f7faf5] rounded-xl p-3.5 border border-[#c0c9be]/40 flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <strong className="text-[#191c1a] text-sm">Chamber A — Cold Storage (Potato &amp; Seed)</strong>
              <span className="px-2 py-0.5 rounded-full bg-[#b2f1be] text-[#00210c] text-[10px] font-bold">
                OPTIMAL
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-[#c0c9be]/30">
                <Thermometer className="w-4 h-4 text-[#003b1b]" />
                <div>
                  <span className="text-[10px] text-[#717970] block">Temperature</span>
                  <strong className="text-sm font-bold">4.2°C</strong> (Target: 3-5°C)
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-[#c0c9be]/30">
                <Droplets className="w-4 h-4 text-[#002b7b]" />
                <div>
                  <span className="text-[10px] text-[#717970] block">Humidity (RH)</span>
                  <strong className="text-sm font-bold">91%</strong> (Target: 90-95%)
                </div>
              </div>
            </div>
            <span className="text-[11px] text-[#404941]">Stored volume: 2,400 Qtl Jyoti Potato · Carbon dioxide levels normal.</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3.5 border border-[#c0c9be]/40 flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <strong className="text-[#191c1a] text-sm">Chamber B — Modern Ventilated Chawl (Onion)</strong>
              <span className="px-2 py-0.5 rounded-full bg-[#b2f1be] text-[#00210c] text-[10px] font-bold">
                OPTIMAL
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-[#c0c9be]/30">
                <Thermometer className="w-4 h-4 text-[#003b1b]" />
                <div>
                  <span className="text-[10px] text-[#717970] block">Temperature</span>
                  <strong className="text-sm font-bold">24.5°C</strong> (Ambient Draft)
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-[#c0c9be]/30">
                <Droplets className="w-4 h-4 text-[#002b7b]" />
                <div>
                  <span className="text-[10px] text-[#717970] block">Humidity (RH)</span>
                  <strong className="text-sm font-bold">64%</strong> (Target: 60-70%)
                </div>
              </div>
            </div>
            <span className="text-[11px] text-[#404941]">Stored volume: 3,000 Qtl Garwa Onion · Forced bottom-aeration active.</span>
          </div>
        </div>
      </section>

      {/* Inbound Hold Reservations */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-3 shadow-xs">
        <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
          Inbound Farmer Hold Reservations
        </h3>

        <div className="flex flex-col gap-2">
          {[
            { farmer: 'Rameshwar Patil', crop: 'Nashik Red Onion', qtl: 40, holdDays: 14, village: 'Niphad', reason: 'Holding for post-rain rate recovery' },
            { farmer: 'Kisan Vikas Sangh', crop: 'Yellow Soybean', qtl: 180, holdDays: 30, village: 'Yeola', reason: 'e-NWR loan pledge' }
          ].map((req, i) => (
            <div key={i} className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/40 flex items-center justify-between gap-3 text-xs">
              <div>
                <strong className="text-[#191c1a] text-sm">{req.farmer}</strong>
                <div className="text-[11px] text-[#404941]">
                  {req.crop} · <strong>{req.qtl} Quintals</strong> · {req.holdDays} days hold · {req.village}
                </div>
                <div className="text-[10.5px] text-[#717970]">Note: {req.reason}</div>
              </div>

              <button
                onClick={() => handleApproveBay(req.farmer, req.qtl)}
                className="px-3.5 py-1.5 rounded-lg bg-[#2f6a41] hover:bg-[#1f4a2d] text-white font-bold text-xs cursor-pointer shadow-xs whitespace-nowrap"
              >
                Approve Bay &amp; Issue e-NWR
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
