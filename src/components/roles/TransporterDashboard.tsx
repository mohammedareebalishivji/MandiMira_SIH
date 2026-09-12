import React, { useState } from 'react';
import {
  Truck, ShieldCheck, MapPin, IndianRupee, Clock, ArrowRight, CheckCircle2,
  Calendar, Fuel, Route, AlertCircle, FileCheck
} from 'lucide-react';
import { UserSession } from '../../types';
import { TabId } from '../../data/navigation';

interface Props {
  session: UserSession;
  onChangeTab: (tab: TabId) => void;
}

export const TransporterDashboard: React.FC<Props> = ({ session, onChangeTab }) => {
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [acceptedJobs, setAcceptedJobs] = useState<string[]>([]);

  const handleAcceptJob = (jobId: string, route: string, freight: number) => {
    setAcceptedJobs((prev) => [...prev, jobId]);
    setSuccessToast(`Consignment accepted! Assigned to Vehicle MH-15-EG-4812 for route "${route}" (₹${freight.toLocaleString('en-IN')}). Waybill generated.`);
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
            <div className="w-11 h-11 rounded-2xl bg-[#663500]/10 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-[#663500]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm font-bold text-[#191c1a] text-lg sm:text-xl">
                  {session.organisation}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#663500] text-white font-label-sm text-[10px] font-bold uppercase tracking-wider">
                  Freight Fleet Cockpit
                </span>
              </div>
              <p className="font-body-sm text-xs sm:text-sm text-[#404941]">
                Commercial Fleet Operator · 6 Vehicles (Pickups to 16-Tonne Multiaxle) · Nashik APMC Corridor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeTab('logistics')}
              className="min-h-[40px] px-3.5 rounded-xl bg-[#663500] hover:bg-[#4a2600] text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <Route className="w-4 h-4" />
              <span>Costed Route Simulator</span>
            </button>
          </div>
        </div>

        {/* 4 Transporter Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Active Fleet Status</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">4 / 6 Vehicles</span>
            <span className="text-[10px] text-[#16532d] font-semibold">2 Available in Nashik</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Today's Freight</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#16532d]">₹32,400</span>
            <span className="text-[10px] text-[#717970]">3 completed trips</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Return-Leg Capacity</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#904d00]">14 Tonnes</span>
            <span className="text-[10px] text-[#16532d] font-semibold">2 backhaul matches</span>
          </div>

          <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">On-Time Rate</span>
            <span className="font-metric-lg text-lg sm:text-xl font-bold text-[#191c1a]">96.5%</span>
            <span className="text-[10px] text-[#16532d] font-semibold">EPOD Certified</span>
          </div>
        </div>
      </section>

      {/* Open Consignment Load Board */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#663500]" />
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
              Open Consignment Load Board
            </h3>
          </div>
          <span className="text-xs text-[#717970]">Farmers &amp; FPOs awaiting pickup today</span>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              id: 'job-01',
              origin: 'Niphad Farmgate',
              dest: 'Lasalgaon APMC Yard',
              distance: '32 km',
              cargo: '4,000 kg Nashik Red Onion (Garwa Grade A)',
              client: 'Rameshwar Patil (Farmer)',
              freight: 2400,
              pickupTime: 'Today 2:30 PM',
              type: 'Ex-Farm Direct Loading'
            },
            {
              id: 'job-02',
              origin: 'Dindori FPO Hub',
              dest: 'Vashi Terminal, Navi Mumbai',
              distance: '194 km',
              cargo: '14,000 kg Onion Bulk Export Container',
              client: 'Godavari Kisan Producer Co.',
              freight: 15600,
              pickupTime: 'Tomorrow 5:00 AM',
              type: 'Multiaxle Truck Required'
            },
            {
              id: 'job-03',
              origin: 'Ozar Farm Cluster',
              dest: 'Mohadi Processing Unit (Sahyadri Foods)',
              distance: '24 km',
              cargo: '2,500 kg Fresh Tomato in plastic crates',
              client: 'Anita Wagh (Farmer)',
              freight: 1950,
              pickupTime: 'Tomorrow 8:00 AM',
              type: 'Ventilated Pickup Required'
            }
          ].map((job) => {
            const isAccepted = acceptedJobs.includes(job.id);

            return (
              <div
                key={job.id}
                className={`rounded-xl border p-3.5 flex flex-col gap-2.5 text-xs transition-all ${
                  isAccepted ? 'bg-[#b2f1be]/30 border-[#16532d]/40' : 'bg-[#f7faf5] border-[#c0c9be]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#191c1a]">{job.origin}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#717970]" />
                      <span className="font-bold text-sm text-[#191c1a]">{job.dest}</span>
                      <span className="text-[10.5px] text-[#717970]">({job.distance})</span>
                    </div>
                    <div className="text-[#404941] mt-0.5 font-medium">{job.cargo}</div>
                    <div className="text-[11px] text-[#717970] mt-0.5">
                      Client: <strong>{job.client}</strong> · Ready: {job.pickupTime}
                    </div>
                  </div>

                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="font-metric-lg text-base font-bold text-[#16532d]">
                      ₹{job.freight.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-[#717970]">Guaranteed DBT</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#c0c9be]/30">
                  <span className="text-[10.5px] text-[#663500] font-semibold bg-[#663500]/10 px-2 py-0.5 rounded-md">
                    {job.type}
                  </span>

                  {isAccepted ? (
                    <span className="font-bold text-xs text-[#16532d] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Load Accepted · Driver Dispatched
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAcceptJob(job.id, `${job.origin} → ${job.dest}`, job.freight)}
                      className="px-4 py-1.5 rounded-lg bg-[#663500] hover:bg-[#4a2600] text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Accept Consignment Job
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Backhaul & Route Optimizer Alert */}
      <div className="bg-gradient-to-br from-[#663500]/10 via-white to-[#b2f1be]/20 rounded-2xl p-4 border border-[#663500]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-[#663500] uppercase tracking-wider block">
            Return-Leg Matcher (Avoid Empty Run)
          </span>
          <h4 className="font-bold text-sm text-[#191c1a]">
            Vehicle MH-15-BX-9021 unloading in Vashi at 11:00 AM
          </h4>
          <p className="text-xs text-[#404941]">
            Found 8 tonnes organic fertilizer consignment returning from Panvel MIDC to Nashik. Saves ₹4,200 diesel burn.
          </p>
        </div>
        <button
          onClick={() => {
            setSuccessToast('Backhaul job booked! Panvel to Nashik cargo attached to vehicle MH-15-BX-9021.');
            setTimeout(() => setSuccessToast(null), 5000);
          }}
          className="px-4 py-2 rounded-xl bg-[#663500] hover:bg-[#4a2600] text-white text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs"
        >
          Book Return Leg (+₹6,400)
        </button>
      </div>
    </div>
  );
};
