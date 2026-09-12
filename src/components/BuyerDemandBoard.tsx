import React, { useState } from 'react';
import {
  Factory, ShieldCheck, MapPin, Clock, IndianRupee, Plus, X, Check, PackageCheck
} from 'lucide-react';
import { buyerDemands as seedDemands } from '../data/marketData';
import { BuyerDemand, FarmerLot, UserRole } from '../types';

interface Props {
  role: UserRole;
  lot: FarmerLot;
  onRespond: (demand: BuyerDemand) => void;
}

const STATUS: Record<BuyerDemand['status'], { bg: string; fg: string; label: string }> = {
  open: { bg: '#b2f1be', fg: '#00210c', label: 'Open' },
  partially_filled: { bg: '#ffdcc3', fg: '#663500', label: 'Filling' },
  closed: { bg: '#e0e3df', fg: '#717970', label: 'Closed' }
};

/**
 * Solution #2 + #6 (buyer side) — the demand board.
 * Sellers see what is actually being bought and at what spec. Buyers post
 * requirements here rather than discovering supply one phone call at a time.
 */
export const BuyerDemandBoard: React.FC<Props> = ({ role, lot, onRespond }) => {
  const [demands, setDemands] = useState<BuyerDemand[]>(seedDemands);
  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({ crop: '', qtl: '', price: '', grade: 'Grade A', window: '', location: '' });

  const isBuyerSide = role === 'buyer';
  const matchesMyCrop = (d: BuyerDemand) => d.cropType === lot.cropType;

  const handlePost = () => {
    if (!form.crop.trim() || !form.qtl || !form.price) return;
    const posted: BuyerDemand = {
      id: `dm-${Math.floor(100 + Math.random() * 899)}`,
      buyerId: 'by-self',
      buyerName: 'Your organisation',
      buyerType: 'Corporate Processor',
      cropNameEn: form.crop,
      cropType: lot.cropType,
      requiredQtl: Number(form.qtl),
      committedQtl: 0,
      gradeRequired: form.grade as BuyerDemand['gradeRequired'],
      pricePerQtl: Number(form.price),
      deliveryWindow: form.window || 'Next 7 days',
      deliveryLocation: form.location || 'To be confirmed',
      paymentTerms: 'T+2 RTGS · escrow-backed',
      qualitySpecs: [],
      status: 'open',
      verified: true,
      postedAgo: 'Just now'
    };
    setDemands([posted, ...demands]);
    setIsPosting(false);
    setForm({ crop: '', qtl: '', price: '', grade: 'Grade A', window: '', location: '' });
  };

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#002b7b]/10 flex items-center justify-center flex-shrink-0">
            <Factory className="w-4.5 h-4.5 text-[#002b7b]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">
              {isBuyerSide ? 'My Demand Orders' : 'Live Buyer Demand'}
            </h3>
            <span className="font-label-sm text-[11px] text-[#404941]">
              {isBuyerSide
                ? 'Post what you need with the spec attached'
                : 'What buyers are actually buying today, and at what grade'}
            </span>
          </div>
        </div>
        {isBuyerSide && !isPosting && (
          <button
            onClick={() => setIsPosting(true)}
            className="min-h-[36px] px-3 rounded-full bg-[#002b7b] text-white font-label-sm text-xs flex items-center gap-1.5 hover:bg-[#003fab] active:scale-95 transition-all cursor-pointer flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Post demand
          </button>
        )}
      </div>

      {isPosting && (
        <div className="rounded-xl border border-[#002b7b]/30 bg-[#f7faf5] p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-[13px] text-[#191c1a]">New demand order</span>
            <button
              onClick={() => setIsPosting(false)}
              className="w-7 h-7 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {([
              ['crop', 'Crop required', 'text'],
              ['qtl', 'Quantity (Qtl)', 'numeric'],
              ['price', 'Offer ₹/Qtl', 'numeric'],
              ['window', 'Delivery window', 'text'],
              ['location', 'Delivery location', 'text']
            ] as const).map(([key, ph, mode]) => (
              <input
                key={key}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: mode === 'numeric' ? e.target.value.replace(/\D/g, '') : e.target.value })
                }
                inputMode={mode === 'numeric' ? 'numeric' : 'text'}
                placeholder={ph}
                className="min-h-[42px] rounded-lg border border-[#c0c9be] bg-white px-2.5 font-body-sm text-[12.5px] outline-none focus:border-[#002b7b] placeholder:text-[#a0a8a0]"
              />
            ))}
            <select
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              className="min-h-[42px] rounded-lg border border-[#c0c9be] bg-white px-2.5 font-body-sm text-[12.5px] outline-none focus:border-[#002b7b] cursor-pointer"
            >
              <option>Grade A</option>
              <option>Grade B</option>
              <option>Fair Average Quality (FAQ)</option>
            </select>
          </div>
          <button
            onClick={handlePost}
            className="min-h-[44px] rounded-lg bg-[#002b7b] text-white font-label-sm text-xs flex items-center justify-center gap-1.5 hover:bg-[#003fab] cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Publish to the supply network
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {demands.map((d) => {
          const st = STATUS[d.status];
          const fillPct = Math.round((d.committedQtl / d.requiredQtl) * 100);
          const remaining = d.requiredQtl - d.committedQtl;
          const relevant = !isBuyerSide && matchesMyCrop(d) && d.status !== 'closed';

          return (
            <div
              key={d.id}
              className={`rounded-xl border p-3 flex flex-col gap-2.5 ${
                relevant ? 'border-[#16532d] bg-[#f1f4ef]' : 'border-[#c0c9be]/40 bg-[#f7faf5]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-md text-[13.5px] text-[#191c1a]">{d.buyerName}</span>
                    {d.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />}
                    {relevant && (
                      <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded-full bg-[#b2f1be] text-[#00210c] uppercase tracking-wider">
                        Matches your lot
                      </span>
                    )}
                  </div>
                  <span className="font-body-sm text-[12px] text-[#404941]">
                    {d.cropNameEn} · {d.gradeRequired}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className="font-label-sm text-[9.5px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ backgroundColor: st.bg, color: st.fg }}
                  >
                    {st.label}
                  </span>
                  <span className="font-metric-lg text-[#191c1a] text-base flex items-center">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {d.pricePerQtl.toLocaleString('en-IN')}
                  </span>
                  <span className="font-label-sm text-[9px] text-[#717970] uppercase tracking-wider">per quintal</span>
                </div>
              </div>

              {/* Fill progress */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-[#e0e3df] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${fillPct}%`, backgroundColor: fillPct >= 100 ? '#16532d' : '#fe932c' }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-[#404941] flex-shrink-0">
                    {d.committedQtl.toLocaleString('en-IN')}/{d.requiredQtl.toLocaleString('en-IN')} Qtl
                  </span>
                </div>
                {remaining > 0 && d.status !== 'closed' && (
                  <span className="font-label-sm text-[10.5px] text-[#904d00]">
                    {remaining.toLocaleString('en-IN')} Qtl still needed · worth ₹
                    {(remaining * d.pricePerQtl).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                <span className="flex items-center gap-1 font-label-sm text-[#404941]">
                  <Clock className="w-3 h-3" /> {d.deliveryWindow}
                </span>
                <span className="flex items-center gap-1 font-label-sm text-[#404941]">
                  <MapPin className="w-3 h-3" /> {d.deliveryLocation}
                </span>
                <span className="flex items-center gap-1 font-label-sm text-[#16532d]">
                  <PackageCheck className="w-3 h-3" /> {d.paymentTerms}
                </span>
              </div>

              {d.qualitySpecs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {d.qualitySpecs.map((s) => (
                    <span
                      key={s.id}
                      className="font-label-sm text-[9.5px] px-2 py-0.5 rounded-full bg-white text-[#404941] border border-[#c0c9be]/50"
                      title={`Worth ₹${s.premiumImpactPerQtl}/Qtl`}
                    >
                      {s.attribute}: {s.requirement}
                    </span>
                  ))}
                </div>
              )}

              {d.status !== 'closed' && (
                <button
                  onClick={() => onRespond(d)}
                  className="min-h-[42px] rounded-lg bg-[#16532d] text-white font-label-sm text-xs flex items-center justify-center gap-1.5 hover:bg-[#003b1b] active:scale-[0.99] transition-all cursor-pointer"
                >
                  {isBuyerSide ? 'View matching supply' : `Offer my ${lot.quantityKg} kg against this order`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
