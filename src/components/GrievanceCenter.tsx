import React, { useState } from 'react';
import {
  Scale, Plus, Loader2, Sparkles, X, Clock, Check, TriangleAlert,
  FileText, ChevronDown, ChevronUp, Gavel
} from 'lucide-react';
import { grievances as seedGrievances } from '../data/marketData';
import { draftGrievance, GrievanceDraft } from '../services/geminiService';
import { Grievance, PaymentTrackRecord, UserSession } from '../types';

interface Props {
  session: UserSession;
  /** Pre-fills the filing form when arriving from a stalled payment. */
  prefillFrom: PaymentTrackRecord | null;
  onClearPrefill: () => void;
  languageName: string;
}

const STATUS: Record<Grievance['status'], { bg: string; fg: string; label: string }> = {
  open: { bg: '#ffdcc3', fg: '#663500', label: 'Open' },
  under_review: { bg: '#ffdcc3', fg: '#663500', label: 'Under review' },
  mediation: { bg: '#9eb5ff', fg: '#002b7b', label: 'In mediation' },
  resolved: { bg: '#b2f1be', fg: '#00210c', label: 'Resolved' },
  escalated: { bg: '#ffdad6', fg: '#93000a', label: 'Escalated' }
};

const CATEGORY_LABEL: Record<string, string> = {
  payment_delay: 'Payment delay',
  weight_dispute: 'Weight dispute',
  quality_rejection: 'Quality rejection',
  price_deviation: 'Price deviation',
  logistics_failure: 'Logistics failure',
  other: 'Other'
};

/**
 * Solution #10 — Grievance and dispute process.
 * Gemini turns a farmer's spoken complaint into a formal, factual filing that
 * an APMC mediator can act on, with an SLA clock running from the moment it lands.
 */
export const GrievanceCenter: React.FC<Props> = ({ session, prefillFrom, onClearPrefill, languageName }) => {
  const [cases, setCases] = useState<Grievance[]>(seedGrievances);
  const [isFiling, setIsFiling] = useState(Boolean(prefillFrom));
  const [complaint, setComplaint] = useState('');
  const [counterparty, setCounterparty] = useState(prefillFrom?.counterparty ?? '');
  const [txnRef, setTxnRef] = useState(prefillFrom?.txnId ?? '');
  const [amount, setAmount] = useState(
    prefillFrom ? String(prefillFrom.amount - prefillFrom.amountReceived) : ''
  );
  const [draft, setDraft] = useState<GrievanceDraft | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [draftNote, setDraftNote] = useState('');
  const [expanded, setExpanded] = useState<string | null>(seedGrievances[0]?.id ?? null);

  // Open the form pre-filled whenever payment tracking hands us a stalled record.
  React.useEffect(() => {
    if (!prefillFrom) return;
    setIsFiling(true);
    setCounterparty(prefillFrom.counterparty);
    setTxnRef(prefillFrom.txnId);
    setAmount(String(prefillFrom.amount - prefillFrom.amountReceived));
  }, [prefillFrom]);

  const handleDraft = async () => {
    setDrafting(true);
    setDraftNote('');
    const res = await draftGrievance(
      complaint,
      { counterparty: counterparty || 'Unnamed counterparty', txnRef: txnRef || 'N/A', amount: Number(amount) || 0 },
      languageName
    );
    setDraft(res.data);
    if (res.error) setDraftNote(res.error);
    setDrafting(false);
  };

  const handleFile = () => {
    if (!draft) return;
    const filed: Grievance = {
      id: `GRV-2026-${Math.floor(400 + Math.random() * 599)}`,
      raisedBy: session.displayName,
      raisedByRole: session.role,
      against: counterparty || 'Unnamed counterparty',
      category: (draft.category as Grievance['category']) ?? 'other',
      txnRef: txnRef || 'N/A',
      amountDisputed: Number(amount) || 0,
      title: draft.title,
      description: draft.description,
      filedOn: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      slaHours: 72,
      hoursElapsed: 0,
      status: 'open',
      resolutionNote: `Requested remedy: ${draft.suggestedResolution}`,
      timeline: [
        { at: 'Just now', actor: session.displayName, event: 'Grievance filed through MandiMitra' },
        { at: 'Just now', actor: 'MandiMitra System', event: 'Counterparty notified. SLA clock started (72 hrs).' }
      ]
    };
    setCases([filed, ...cases]);
    setExpanded(filed.id);
    setIsFiling(false);
    setDraft(null);
    setComplaint('');
    onClearPrefill();
  };

  const closeForm = () => {
    setIsFiling(false);
    setDraft(null);
    onClearPrefill();
  };

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#ba1a1a]/10 flex items-center justify-center flex-shrink-0">
            <Scale className="w-4.5 h-4.5 text-[#ba1a1a]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">Grievance & Dispute</h3>
            <span className="font-label-sm text-[11px] text-[#404941]">
              Every filing carries a 72-hour SLA and a documented trail
            </span>
          </div>
        </div>
        {!isFiling && (
          <button
            onClick={() => setIsFiling(true)}
            className="min-h-[36px] px-3 rounded-full bg-[#ba1a1a] text-white font-label-sm text-xs flex items-center gap-1.5 hover:bg-[#93000a] active:scale-95 transition-all cursor-pointer flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            File
          </button>
        )}
      </div>

      {/* ---------- FILING FORM ---------- */}
      {isFiling && (
        <div className="rounded-xl border border-[#ba1a1a]/30 bg-[#f7faf5] p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-label-md text-[13px] text-[#191c1a]">New grievance</span>
            <button
              onClick={closeForm}
              className="w-7 h-7 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-[#ba1a1a] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              value={counterparty}
              onChange={(e) => setCounterparty(e.target.value)}
              placeholder="Against whom"
              className="min-h-[42px] rounded-lg border border-[#c0c9be] bg-white px-2.5 font-body-sm text-[12.5px] outline-none focus:border-[#16532d] placeholder:text-[#a0a8a0]"
            />
            <input
              value={txnRef}
              onChange={(e) => setTxnRef(e.target.value)}
              placeholder="Transaction ref"
              className="min-h-[42px] rounded-lg border border-[#c0c9be] bg-white px-2.5 font-mono text-[12px] outline-none focus:border-[#16532d] placeholder:text-[#a0a8a0]"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              inputMode="numeric"
              placeholder="₹ disputed"
              className="min-h-[42px] rounded-lg border border-[#c0c9be] bg-white px-2.5 font-mono text-[12px] outline-none focus:border-[#16532d] placeholder:text-[#a0a8a0]"
            />
          </div>

          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            rows={4}
            placeholder="Tell us what happened in your own words. Plain language is fine — we will turn it into a formal filing."
            className="rounded-lg border border-[#c0c9be] bg-white p-2.5 font-body-sm text-[12.5px] outline-none focus:border-[#16532d] resize-none placeholder:text-[#a0a8a0]"
          />

          <button
            onClick={handleDraft}
            disabled={drafting || !complaint.trim()}
            className="min-h-[44px] rounded-lg bg-[#003b1b] text-white font-label-sm text-xs flex items-center justify-center gap-2 hover:bg-[#16532d] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {drafting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {drafting ? 'Drafting…' : 'Draft my grievance with AI'}
          </button>

          {draft && (
            <div className="flex flex-col gap-2 rounded-lg border border-[#c0c9be]/60 bg-white p-3">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#16532d]" />
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#16532d]">
                  Formal draft · {CATEGORY_LABEL[draft.category] ?? draft.category}
                </span>
              </div>
              <p className="font-label-md text-[13px] text-[#191c1a]">{draft.title}</p>
              <p className="font-body-sm text-[12px] text-[#404941] leading-snug">{draft.description}</p>

              <div className="bg-[#f1f4ef] rounded-lg p-2.5 flex flex-col gap-1">
                <span className="font-label-sm text-[9.5px] uppercase tracking-wider text-[#717970]">
                  Attach this evidence
                </span>
                {draft.evidenceNeeded.map((e, i) => (
                  <span key={i} className="font-body-sm text-[11.5px] text-[#404941] leading-snug">• {e}</span>
                ))}
              </div>

              <div className="bg-[#b2f1be] rounded-lg p-2.5">
                <span className="font-label-sm text-[9.5px] uppercase tracking-wider text-[#14512b] block">
                  Remedy requested
                </span>
                <span className="font-body-sm text-[12px] text-[#00210c] leading-snug">{draft.suggestedResolution}</span>
              </div>

              {draftNote && (
                <p className="font-label-sm text-[10px] text-[#717970] italic">Local draft used: {draftNote}</p>
              )}

              <button
                onClick={handleFile}
                className="min-h-[44px] rounded-lg bg-[#ba1a1a] text-white font-label-sm text-xs flex items-center justify-center gap-1.5 hover:bg-[#93000a] transition-all cursor-pointer"
              >
                <Gavel className="w-4 h-4" />
                File this grievance & start the 72-hour clock
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------- CASE LIST ---------- */}
      <div className="flex flex-col gap-2">
        {cases.map((g) => {
          const st = STATUS[g.status];
          const isOpen = expanded === g.id;
          const slaPct = Math.min(100, Math.round((g.hoursElapsed / g.slaHours) * 100));
          const breached = g.hoursElapsed >= g.slaHours && g.status !== 'resolved';

          return (
            <div key={g.id} className="rounded-xl border border-[#c0c9be]/40 bg-[#f7faf5] overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : g.id)}
                className="w-full p-3 flex flex-col gap-2 text-left cursor-pointer hover:bg-[#f1f4ef] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-[13px] text-[#191c1a] leading-snug">{g.title}</span>
                    <span className="font-mono text-[10px] text-[#717970]">
                      {g.id} · vs {g.against} · {CATEGORY_LABEL[g.category]}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className="font-label-sm text-[9.5px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ backgroundColor: st.bg, color: st.fg }}
                    >
                      {st.label}
                    </span>
                    <span className="font-metric-lg text-[#191c1a] text-sm">
                      ₹{g.amountDisputed.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {g.status !== 'resolved' && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: breached ? '#ba1a1a' : '#717970' }} />
                    <div className="flex-1 h-1.5 rounded-full bg-[#e0e3df] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${slaPct}%`, backgroundColor: breached ? '#ba1a1a' : '#fe932c' }}
                      />
                    </div>
                    <span
                      className="font-mono text-[10px] flex-shrink-0"
                      style={{ color: breached ? '#ba1a1a' : '#404941' }}
                    >
                      {breached ? 'SLA breached' : `${g.slaHours - g.hoursElapsed} hrs left`}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#717970] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#717970] flex-shrink-0" />
                    )}
                  </div>
                )}
              </button>

              {isOpen && (
                <div className="px-3 pb-3 pt-2.5 border-t border-[#c0c9be]/40 flex flex-col gap-2.5">
                  <p className="font-body-sm text-[12px] text-[#404941] leading-snug">{g.description}</p>

                  <div
                    className="rounded-lg p-2.5 flex items-start gap-1.5"
                    style={{ backgroundColor: g.status === 'resolved' ? '#b2f1be' : '#ecefea' }}
                  >
                    {g.status === 'resolved' ? (
                      <Check className="w-3.5 h-3.5 text-[#00210c] flex-shrink-0 mt-0.5" />
                    ) : (
                      <TriangleAlert className="w-3.5 h-3.5 text-[#663500] flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className="font-body-sm text-[11.5px] leading-snug"
                      style={{ color: g.status === 'resolved' ? '#00210c' : '#404941' }}
                    >
                      {g.resolutionNote}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="font-label-sm text-[9.5px] uppercase tracking-wider text-[#717970]">
                      Case trail
                    </span>
                    {g.timeline.map((t, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#16532d] flex-shrink-0 mt-1.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-label-sm text-[11px] text-[#191c1a]">{t.actor}</span>
                            <span className="font-mono text-[9.5px] text-[#717970]">{t.at}</span>
                          </div>
                          <p className="font-body-sm text-[11px] text-[#404941] leading-snug">{t.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
