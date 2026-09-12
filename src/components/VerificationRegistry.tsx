import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Check, X, Search, Star, Clock, Scale } from 'lucide-react';
import { verificationProfiles } from '../data/marketData';
import { getRole } from '../data/roles';

/**
 * Solution #7 — Verified buyers and sellers.
 * A trust score is only credible if you can see what it is made of, so every
 * profile exposes its underlying checks and its actual payment behaviour.
 */
export const VerificationRegistry: React.FC = () => {
  const [query, setQuery] = useState('');

  const filtered = verificationProfiles.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || getRole(p.role).label.toLowerCase().includes(q);
  });

  const scoreColor = (s: number) => (s >= 80 ? '#16532d' : s >= 60 ? '#904d00' : '#ba1a1a');
  const scoreBg = (s: number) => (s >= 80 ? '#b2f1be' : s >= 60 ? '#ffdcc3' : '#ffdad6');

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#003b1b]/10 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4.5 h-4.5 text-[#003b1b]" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">Trust Registry</h3>
          <span className="font-label-sm text-[11px] text-[#404941]">
            Check who you are dealing with before the truck leaves
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-[#c0c9be] bg-[#f7faf5] px-3 focus-within:border-[#16532d] transition-colors">
        <Search className="w-4 h-4 text-[#717970] flex-shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a buyer, trader, FPO or transporter"
          className="flex-1 bg-transparent py-2.5 font-body-sm text-[13px] outline-none placeholder:text-[#a0a8a0] min-w-0"
        />
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((p) => {
          const role = getRole(p.role);
          const failed = p.checks.filter((c) => !c.passed);

          return (
            <div
              key={p.id}
              className="rounded-xl border p-3 flex flex-col gap-2.5"
              style={{
                borderColor: p.verified ? 'rgba(192,201,190,0.5)' : 'rgba(186,26,26,0.35)',
                backgroundColor: p.verified ? '#f7faf5' : '#fff8f7'
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-md text-[13.5px] text-[#191c1a]">{p.name}</span>
                    {p.verified ? (
                      <ShieldCheck className="w-4 h-4 text-[#16532d] flex-shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-[#ba1a1a] flex-shrink-0" />
                    )}
                  </div>
                  <span
                    className="font-label-sm text-[10px] px-1.5 py-0.5 rounded-full w-fit mt-0.5"
                    style={{ backgroundColor: `${role.accent}14`, color: role.accent }}
                  >
                    {role.label}
                  </span>
                  <span className="font-mono text-[10px] text-[#717970] mt-1 leading-snug">{p.licenceId}</span>
                </div>

                <div
                  className="rounded-xl px-3 py-2 flex flex-col items-center flex-shrink-0"
                  style={{ backgroundColor: scoreBg(p.trustScore) }}
                >
                  <span className="font-metric-lg text-lg leading-none" style={{ color: scoreColor(p.trustScore) }}>
                    {p.trustScore}
                  </span>
                  <span
                    className="font-label-sm text-[8.5px] uppercase tracking-wider"
                    style={{ color: scoreColor(p.trustScore) }}
                  >
                    Trust
                  </span>
                </div>
              </div>

              {/* Behavioural record — the part that actually predicts risk */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { Icon: Star, label: 'Deals done', value: p.totalDealsCompleted.toLocaleString('en-IN') },
                  { Icon: Check, label: 'Paid on time', value: `${p.onTimePaymentPercent}%` },
                  { Icon: Scale, label: 'Dispute rate', value: `${p.disputeRatePercent}%` },
                  { Icon: Clock, label: 'Avg settle', value: `${p.avgSettlementDays} d` }
                ].map((m) => (
                  <div key={m.label} className="bg-white rounded-lg border border-[#c0c9be]/40 px-2 py-1.5">
                    <span className="font-label-sm text-[8.5px] uppercase tracking-wider text-[#717970] flex items-center gap-1">
                      <m.Icon className="w-2.5 h-2.5" />
                      {m.label}
                    </span>
                    <span className="font-mono text-[12px] text-[#191c1a] font-bold">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* The checks behind the badge */}
              <div className="flex flex-col gap-1">
                {p.checks.map((c) => (
                  <div key={c.label} className="flex items-center gap-1.5">
                    {c.passed ? (
                      <Check className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-[#ba1a1a] flex-shrink-0" />
                    )}
                    <span
                      className={`font-body-sm text-[11.5px] ${c.passed ? 'text-[#404941]' : 'text-[#93000a] font-bold'}`}
                    >
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>

              {!p.verified && (
                <p className="font-label-sm text-[11px] text-[#93000a] bg-[#ffdad6] rounded-lg px-2.5 py-2 leading-snug">
                  Not verified — {failed.length} check{failed.length > 1 ? 's' : ''} failing. Deals with this
                  counterparty cannot be escrow-protected, and MandiMitra cannot enforce a settlement on your behalf.
                </p>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="font-body-sm text-[13px] text-[#717970] text-center py-6">
            No one on the registry matches “{query}”.
          </p>
        )}
      </div>
    </section>
  );
};
