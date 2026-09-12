import React, { useState } from 'react';
import {
  BadgeIndianRupee, Check, Clock, CircleAlert, Lock, LockOpen,
  ChevronDown, ChevronUp, TriangleAlert
} from 'lucide-react';
import { paymentRecords } from '../data/marketData';
import { PaymentTrackRecord } from '../types';

interface Props {
  onRaiseGrievance: (record: PaymentTrackRecord) => void;
}

const RISK: Record<PaymentTrackRecord['risk'], { bg: string; fg: string; label: string }> = {
  low: { bg: '#b2f1be', fg: '#00210c', label: 'On track' },
  medium: { bg: '#ffdcc3', fg: '#663500', label: 'Watch' },
  high: { bg: '#ffdad6', fg: '#93000a', label: 'At risk' }
};

const STAGE_ICON = {
  done: { Icon: Check, bg: '#16532d', fg: '#ffffff' },
  active: { Icon: Clock, bg: '#fe932c', fg: '#2f1500' },
  pending: { Icon: Clock, bg: '#e0e3df', fg: '#717970' },
  blocked: { Icon: CircleAlert, bg: '#ba1a1a', fg: '#ffffff' }
} as const;

/**
 * Solution #9 — Payment tracking.
 * Every rupee is tied to a milestone. The farmer can see exactly which step
 * the money is sitting at, and whether escrow is protecting it.
 */
export const PaymentTrackingPanel: React.FC<Props> = ({ onRaiseGrievance }) => {
  const [expanded, setExpanded] = useState<string | null>(paymentRecords[1]?.id ?? null);

  const totalOutstanding = paymentRecords.reduce((s, r) => s + (r.amount - r.amountReceived), 0);
  const totalReceived = paymentRecords.reduce((s, r) => s + r.amountReceived, 0);
  const atRisk = paymentRecords.filter((r) => r.risk === 'high');

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#16532d]/10 flex items-center justify-center flex-shrink-0">
          <BadgeIndianRupee className="w-4.5 h-4.5 text-[#16532d]" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">Payment Tracking</h3>
          <span className="font-label-sm text-[11px] text-[#404941]">
            Where every rupee is, milestone by milestone
          </span>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-3">
          <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970] block">Received</span>
          <span className="font-metric-lg text-[#16532d]">₹{totalReceived.toLocaleString('en-IN')}</span>
        </div>
        <div
          className="rounded-xl border p-3"
          style={{
            backgroundColor: totalOutstanding > 0 ? '#ffdcc3' : '#f1f4ef',
            borderColor: totalOutstanding > 0 ? 'rgba(254,147,44,0.4)' : 'rgba(192,201,190,0.4)'
          }}
        >
          <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#663500] block">Outstanding</span>
          <span className="font-metric-lg text-[#904d00]">₹{totalOutstanding.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {atRisk.length > 0 && (
        <div className="flex items-start gap-2 bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-xl px-3 py-2">
          <TriangleAlert className="w-4 h-4 text-[#93000a] flex-shrink-0 mt-0.5" />
          <p className="font-label-sm text-[11px] text-[#93000a] leading-snug">
            {atRisk.length} payment{atRisk.length > 1 ? 's' : ''} outside agreed terms. Deals settled
            outside escrow have no automatic recourse — file a grievance to start the SLA clock.
          </p>
        </div>
      )}

      {/* Records */}
      <div className="flex flex-col gap-2">
        {paymentRecords.map((r) => {
          const risk = RISK[r.risk];
          const isOpen = expanded === r.id;
          const pct = Math.round((r.amountReceived / r.amount) * 100);

          return (
            <div key={r.id} className="rounded-xl border border-[#c0c9be]/40 bg-[#f7faf5] overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : r.id)}
                className="w-full p-3 flex flex-col gap-2 text-left cursor-pointer hover:bg-[#f1f4ef] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-label-md text-[13px] text-[#191c1a] truncate">{r.counterparty}</span>
                      {r.escrowProtected ? (
                        <Lock className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />
                      ) : (
                        <LockOpen className="w-3.5 h-3.5 text-[#ba1a1a] flex-shrink-0" />
                      )}
                    </div>
                    <span className="font-mono text-[10.5px] text-[#404941]">
                      {r.txnId} · {r.cropName}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className="font-label-sm text-[9.5px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ backgroundColor: risk.bg, color: risk.fg }}
                    >
                      {risk.label}
                    </span>
                    <span className="font-metric-lg text-[#191c1a] text-base">
                      ₹{r.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-[#e0e3df] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#16532d' : '#fe932c' }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-[#404941] flex-shrink-0">{pct}% paid</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#717970] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#717970] flex-shrink-0" />
                  )}
                </div>

                {r.daysOutstanding > 0 && (
                  <span className="font-label-sm text-[10.5px] text-[#904d00]">
                    Due {r.dueDate} · {r.daysOutstanding} day{r.daysOutstanding > 1 ? 's' : ''} outstanding
                  </span>
                )}
              </button>

              {isOpen && (
                <div className="px-3 pb-3 flex flex-col gap-2 border-t border-[#c0c9be]/40 pt-2.5">
                  {r.milestones.map((m, i) => {
                    const st = STAGE_ICON[m.status];
                    const isLast = i === r.milestones.length - 1;
                    return (
                      <div key={m.stage} className="flex gap-2.5">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: st.bg }}
                          >
                            <st.Icon className="w-3.5 h-3.5" style={{ color: st.fg }} />
                          </div>
                          {!isLast && (
                            <div
                              className="w-0.5 flex-1 min-h-[14px] my-0.5"
                              style={{ backgroundColor: m.status === 'done' ? '#16532d' : '#e0e3df' }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-baseline justify-between gap-2 flex-wrap">
                            <span
                              className={`font-label-sm text-[12px] ${
                                m.status === 'pending' ? 'text-[#717970]' : 'text-[#191c1a]'
                              }`}
                            >
                              {m.label}
                            </span>
                            {m.at && <span className="font-mono text-[10px] text-[#717970]">{m.at}</span>}
                          </div>
                          {m.note && (
                            <p
                              className={`font-body-sm text-[11px] leading-snug ${
                                m.status === 'blocked' ? 'text-[#93000a]' : 'text-[#404941]'
                              }`}
                            >
                              {m.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {r.amountReceived < r.amount && (
                    <button
                      onClick={() => onRaiseGrievance(r)}
                      className="min-h-[40px] rounded-lg bg-[#ba1a1a] text-white font-label-sm text-xs flex items-center justify-center gap-1.5 hover:bg-[#93000a] active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <TriangleAlert className="w-4 h-4" />
                      Raise a grievance on ₹{(r.amount - r.amountReceived).toLocaleString('en-IN')}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
