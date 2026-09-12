import React, { useState, useEffect, useMemo } from 'react';
import {
  Factory, ShieldCheck, MapPin, Clock, IndianRupee, Plus, X, Check, PackageCheck,
  CheckCircle2, AlertCircle, Trash2, User, Handshake, Filter
} from 'lucide-react';
import { BuyerDemand, FarmerLot, UserRole, UserSession, QualityGrade, CropType } from '../types';
import { stockService } from '../services/stockService';
import { CROP_BENCHMARKS } from '../data/marketData';

interface Props {
  role: UserRole;
  lot: FarmerLot;
  session?: UserSession;
  onRespond: (demand: BuyerDemand) => void;
}

const STATUS: Record<BuyerDemand['status'], { bg: string; fg: string; label: string }> = {
  open: { bg: '#b2f1be', fg: '#00210c', label: 'Open' },
  partially_filled: { bg: '#ffdcc3', fg: '#663500', label: 'Filling' },
  closed: { bg: '#e0e3df', fg: '#717970', label: 'Closed' }
};

/**
 * Stock Demand & Procurement Board:
 * - Middlemen and corporate buyers post procurement orders for commodities they need.
 * - Farmers discover open purchase orders and commit/fulfill stock with guaranteed rates.
 */
export const BuyerDemandBoard: React.FC<Props> = ({ role, lot, session, onRespond }) => {
  const [demands, setDemands] = useState<BuyerDemand[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'myRequests'>('all');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Fulfillment modal state
  const [fulfillingDemand, setFulfillingDemand] = useState<BuyerDemand | null>(null);
  const [fulfillQtyQtl, setFulfillQtyQtl] = useState<number>(Math.round(lot.quantityKg / 100) || 40);

  // Middleman/Buyer Post Request Form
  const [formCrop, setFormCrop] = useState(lot.cropNameEn || 'Nashik Red Onion');
  const [formCropType, setFormCropType] = useState<CropType>(lot.cropType || 'onion');
  const [formQtl, setFormQtl] = useState<number>(200);
  const [formPrice, setFormPrice] = useState<number>(lot.localMandiBenchmark || 2900);
  const [formGrade, setFormGrade] = useState<QualityGrade>('Grade A');
  const [formWindow, setFormWindow] = useState('Next 3 days');
  const [formLocation, setFormLocation] = useState('Ex-Farm Pickup (Trader vehicle arranged)');
  const [formPaymentTerms, setFormPaymentTerms] = useState('Instant DBT on digital weighment');
  const [formNotes, setFormNotes] = useState('');

  const isMiddleman = role === 'middleman';
  const isBuyer = role === 'buyer';
  const canPostDemand = isMiddleman || isBuyer;
  const isFarmer = role === 'farmer' || role === 'fpo';

  useEffect(() => {
    const unsub = stockService.subscribeDemands((updated) => {
      setDemands(updated);
    });
    return unsub;
  }, []);

  // Filtered demands
  const filteredDemands = useMemo(() => {
    return demands.filter((d) => {
      if (selectedCrop !== 'all' && d.cropType !== selectedCrop) return false;
      if (filterType === 'myRequests' && session) {
        return d.buyerId === session.phone || d.buyerPhone === session.phone || d.buyerName.includes(session.displayName);
      }
      return true;
    });
  }, [demands, selectedCrop, filterType, session]);

  const handlePostDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCrop.trim() || formQtl <= 0 || formPrice <= 0) return;

    const created = stockService.addBuyerDemand({
      buyerId: session?.phone || 'by-middleman',
      buyerName: session?.displayName || (isMiddleman ? 'Shaikh Trading Co.' : 'Procurement Desk'),
      buyerRole: role,
      buyerPhone: session?.phone,
      buyerOrg: session?.organisation,
      buyerType: isMiddleman ? 'Middleman / Trader' : 'Corporate Processor',
      cropNameEn: formCrop,
      cropType: formCropType,
      requiredQtl: Number(formQtl),
      gradeRequired: formGrade,
      pricePerQtl: Number(formPrice),
      deliveryWindow: formWindow,
      deliveryLocation: formLocation,
      paymentTerms: formPaymentTerms,
      notes: formNotes,
      qualitySpecs: formNotes
        ? [{ id: 'spec-1', attribute: 'Quality requirement', requirement: formNotes, meets: 'unknown', premiumImpactPerQtl: 50 }]
        : []
    });

    setIsPosting(false);
    setSuccessBanner(
      `Your stock request for ${created.requiredQtl} Qtl of ${created.cropNameEn} @ ₹${created.pricePerQtl}/Qtl has been broadcast to all farmers!`
    );
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  const handleConfirmFulfill = () => {
    if (!fulfillingDemand) return;
    const res = stockService.fulfillDemand(
      fulfillingDemand.id,
      fulfillQtyQtl,
      session?.displayName || 'Farmer'
    );

    if (res.success) {
      onRespond(fulfillingDemand);
      setSuccessBanner(
        `Successfully committed ${fulfillQtyQtl} Qtl (${(fulfillQtyQtl * 100).toLocaleString('en-IN')} kg) to ${fulfillingDemand.buyerName}! Total payout scheduled: ₹${(fulfillQtyQtl * fulfillingDemand.pricePerQtl).toLocaleString('en-IN')}.`
      );
      setFulfillingDemand(null);
      setTimeout(() => setSuccessBanner(null), 7000);
    }
  };

  const handleDeleteDemand = (id: string) => {
    if (confirm('Are you sure you want to cancel this stock request?')) {
      stockService.deleteBuyerDemand(id);
      setSuccessBanner('Stock request removed.');
      setTimeout(() => setSuccessBanner(null), 4000);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3 shadow-xs">
      {/* Toast Banner */}
      {successBanner && (
        <div className="bg-[#b2f1be] border border-[#16532d]/40 text-[#00210c] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16532d] flex-shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="font-bold px-1 text-[#00210c]">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#002b7b]/10 flex items-center justify-center flex-shrink-0">
            <Factory className="w-4.5 h-4.5 text-[#002b7b]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">
              {isMiddleman ? 'Trader Stock Requests & Sourcing' : 'Live Buyer & Trader Demand'}
            </h3>
            <span className="font-label-sm text-[11px] text-[#404941]">
              {isMiddleman
                ? 'Request commodity volume with your target price and specifications'
                : 'Open stock purchase orders from verified middlemen, processors and retailers'}
            </span>
          </div>
        </div>

        {/* Middleman / Buyer Button to Post Stock Request */}
        {canPostDemand && !isPosting && (
          <button
            onClick={() => setIsPosting(true)}
            className="min-h-[38px] px-3.5 rounded-xl bg-[#002b7b] hover:bg-[#003fab] text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isMiddleman ? 'Request Stock / Post Need' : 'Post Demand Order'}</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-2.5 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#717970] flex-shrink-0" />

          {canPostDemand && (
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#c0c9be]/40">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  filterType === 'all' ? 'bg-[#002b7b] text-white' : 'text-[#404941]'
                }`}
              >
                All Demand Orders
              </button>
              <button
                onClick={() => setFilterType('myRequests')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  filterType === 'myRequests' ? 'bg-[#002b7b] text-white' : 'text-[#404941]'
                }`}
              >
                My Stock Requests
              </button>
            </div>
          )}

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-white border border-[#c0c9be] rounded-lg px-2 py-1 text-xs text-[#191c1a] font-medium outline-none cursor-pointer"
          >
            <option value="all">All Commodities</option>
            <option value="onion">Onion</option>
            <option value="potato">Potato</option>
            <option value="tomato">Tomato</option>
            <option value="soybean">Soybean</option>
            <option value="wheat">Wheat</option>
          </select>
        </div>

        <span className="font-label-sm text-[11px] text-[#717970]">
          {filteredDemands.length} active purchase orders
        </span>
      </div>

      {/* POST STOCK REQUEST MODAL / FORM (FOR MIDDLEMAN / BUYER) */}
      {isPosting && (
        <div className="rounded-xl border border-[#002b7b]/40 bg-[#f7faf5] p-4 flex flex-col gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#002b7b]/20 pb-2">
            <div className="flex items-center gap-2">
              <Handshake className="w-4.5 h-4.5 text-[#002b7b]" />
              <span className="font-headline-sm font-bold text-sm text-[#191c1a]">
                {isMiddleman ? 'Post Stock Request (Procurement Order)' : 'Post New Demand Order'}
              </span>
            </div>
            <button
              onClick={() => setIsPosting(false)}
              className="w-7 h-7 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handlePostDemand} className="flex flex-col gap-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#191c1a]">Commodity Required</label>
                <input
                  type="text"
                  value={formCrop}
                  onChange={(e) => setFormCrop(e.target.value)}
                  required
                  placeholder="e.g. Nashik Red Onion"
                  className="p-2 bg-white rounded-lg border border-[#c0c9be] font-medium outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#191c1a]">Crop Category</label>
                <select
                  value={formCropType}
                  onChange={(e) => setFormCropType(e.target.value as any)}
                  className="p-2 bg-white rounded-lg border border-[#c0c9be] font-medium outline-none cursor-pointer"
                >
                  <option value="onion">Onion</option>
                  <option value="potato">Potato</option>
                  <option value="tomato">Tomato</option>
                  <option value="soybean">Soybean</option>
                  <option value="wheat">Wheat</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#191c1a]">Required Volume (Quintals)</label>
                <input
                  type="number"
                  value={formQtl}
                  onChange={(e) => setFormQtl(Number(e.target.value))}
                  min={10}
                  step={10}
                  required
                  className="p-2 bg-white rounded-lg border border-[#c0c9be] font-bold outline-none"
                />
                <span className="text-[10px] text-[#717970]">{(formQtl * 100).toLocaleString('en-IN')} kg required</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#191c1a]">Offered Buying Rate (₹ / Quintal)</label>
                <input
                  type="number"
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  min={100}
                  step={25}
                  required
                  className="p-2 bg-white rounded-lg border border-[#c0c9be] font-bold outline-none"
                />
                <span className="text-[10px] text-[#717970]">
                  Benchmark: ₹{CROP_BENCHMARKS[formCropType] || 2800}/qtl
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#191c1a]">Minimum Quality Grade</label>
                <select
                  value={formGrade}
                  onChange={(e) => setFormGrade(e.target.value as any)}
                  className="p-2 bg-white rounded-lg border border-[#c0c9be] font-medium outline-none cursor-pointer"
                >
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="Fair Average Quality (FAQ)">Fair Average Quality (FAQ)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#191c1a]">Delivery / Pickup Window</label>
                <select
                  value={formWindow}
                  onChange={(e) => setFormWindow(e.target.value)}
                  className="p-2 bg-white rounded-lg border border-[#c0c9be] font-medium outline-none cursor-pointer"
                >
                  <option value="Immediate (Today / Tomorrow)">Immediate (Today / Tomorrow)</option>
                  <option value="Next 3 days">Next 3 days</option>
                  <option value="Next 7 days">Next 7 days</option>
                  <option value="Weekly recurring contract">Weekly recurring contract</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#191c1a]">Delivery / Pickup Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  required
                  placeholder="e.g. Ex-Farm Pickup (Trader vehicle arranged) or Pimpalgaon Yard"
                  className="p-2 bg-white rounded-lg border border-[#c0c9be] font-medium outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#191c1a]">Payment Settlement Terms</label>
                <select
                  value={formPaymentTerms}
                  onChange={(e) => setFormPaymentTerms(e.target.value)}
                  className="p-2 bg-white rounded-lg border border-[#c0c9be] font-medium outline-none cursor-pointer"
                >
                  <option value="Instant DBT on digital weighment">Instant DBT on digital weighment (Recommended)</option>
                  <option value="Same-day APMC Gateway settlement">Same-day APMC Gateway settlement</option>
                  <option value="T+1 Bank RTGS · Escrow-backed">T+1 Bank RTGS · Escrow-backed</option>
                  <option value="Immediate Cash / UPI at Yard Gate">Immediate Cash / UPI at Yard Gate</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#191c1a]">Quality Specifications &amp; Notes for Farmers</label>
              <input
                type="text"
                placeholder="e.g. 50mm+ diameter, dry outer skins, no sprouts, crates provided"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="p-2 bg-white rounded-lg border border-[#c0c9be] outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="flex-1 min-h-[40px] rounded-xl border border-[#c0c9be] text-[#404941] font-bold hover:bg-[#ecefea] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[40px] rounded-xl bg-[#002b7b] hover:bg-[#003fab] text-white font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
              >
                Publish Stock Request to Farmers
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Demand Cards List */}
      <div className="flex flex-col gap-2.5">
        {filteredDemands.map((d) => {
          const st = STATUS[d.status];
          const fillPct = Math.round((d.committedQtl / d.requiredQtl) * 100);
          const remaining = d.requiredQtl - d.committedQtl;
          const relevant = isFarmer && d.cropType === lot.cropType && d.status !== 'closed';
          const isMine = session
            ? d.buyerId === session.phone || d.buyerPhone === session.phone || d.buyerName.includes(session.displayName)
            : false;

          return (
            <div
              key={d.id}
              className={`rounded-xl border p-3.5 flex flex-col gap-2.5 transition-all ${
                isMine
                  ? 'border-[#002b7b]/60 bg-[#f7faf5] shadow-xs'
                  : relevant
                  ? 'border-[#16532d] bg-[#f1f4ef]'
                  : 'border-[#c0c9be]/40 bg-[#f7faf5]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-md text-[13.5px] font-bold text-[#191c1a]">{d.buyerName}</span>
                    {d.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />}
                    <span className="font-label-sm text-[9.5px] px-2 py-0.5 rounded-full bg-[#002b7b]/10 text-[#002b7b] font-bold">
                      {d.buyerType || 'Procurement Buyer'}
                    </span>
                    {relevant && (
                      <span className="font-label-sm text-[9px] px-1.5 py-0.5 rounded-full bg-[#b2f1be] text-[#00210c] uppercase tracking-wider font-bold">
                        Matches your lot
                      </span>
                    )}
                    {isMine && (
                      <span className="font-label-sm text-[9px] px-2 py-0.5 rounded-full bg-[#002b7b] text-white font-bold">
                        My Request
                      </span>
                    )}
                  </div>
                  <span className="font-body-sm text-[12px] text-[#404941]">
                    {d.cropNameEn} · {d.gradeRequired}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span
                    className="font-label-sm text-[9.5px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold"
                    style={{ backgroundColor: st.bg, color: st.fg }}
                  >
                    {st.label}
                  </span>
                  <span className="font-metric-lg text-[#191c1a] text-base font-bold flex items-center">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {d.pricePerQtl.toLocaleString('en-IN')}
                  </span>
                  <span className="font-label-sm text-[9px] text-[#717970] uppercase tracking-wider">per quintal</span>
                </div>
              </div>

              {/* Progress & Fill Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#404941]">
                    Committed: <strong>{d.committedQtl} Qtl</strong> / {d.requiredQtl} Qtl ({fillPct}%)
                  </span>
                  {remaining > 0 && d.status !== 'closed' && (
                    <span className="font-bold text-[#904d00]">
                      {remaining} Qtl needed (₹{(remaining * d.pricePerQtl).toLocaleString('en-IN')})
                    </span>
                  )}
                </div>
                <div className="flex-1 h-2 rounded-full bg-[#e0e3df] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, fillPct)}%`, backgroundColor: fillPct >= 100 ? '#16532d' : '#fe932c' }}
                  />
                </div>
              </div>

              {/* Terms & Location */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                <span className="flex items-center gap-1 font-label-sm text-[#404941]">
                  <Clock className="w-3 h-3 text-[#717970]" /> {d.deliveryWindow}
                </span>
                <span className="flex items-center gap-1 font-label-sm text-[#404941]">
                  <MapPin className="w-3 h-3 text-[#717970]" /> {d.deliveryLocation}
                </span>
                <span className="flex items-center gap-1 font-label-sm text-[#16532d] font-semibold">
                  <PackageCheck className="w-3 h-3" /> {d.paymentTerms}
                </span>
              </div>

              {d.notes && (
                <p className="text-[11.5px] text-[#404941] bg-white/80 p-2 rounded-lg border border-[#c0c9be]/30">
                  📌 "{d.notes}"
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                {isMine ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-[#002b7b] font-semibold">
                      Your procurement request is live for farmers
                    </span>
                    <button
                      onClick={() => handleDeleteDemand(d.id)}
                      className="min-h-[34px] px-3 rounded-lg border border-[#ba1a1a]/40 text-[#ba1a1a] text-xs font-bold flex items-center gap-1 hover:bg-[#ffdad6] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Close / Remove</span>
                    </button>
                  </div>
                ) : isFarmer && d.status !== 'closed' ? (
                  <button
                    onClick={() => {
                      setFulfillingDemand(d);
                      setFulfillQtyQtl(Math.min(remaining, Math.round(lot.quantityKg / 100) || 40));
                    }}
                    className="w-full min-h-[42px] rounded-xl bg-[#16532d] text-white font-label-sm text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#003b1b] active:scale-[0.99] transition-all cursor-pointer shadow-xs"
                  >
                    <Handshake className="w-4 h-4" />
                    <span>Fulfill with my stock · ₹{d.pricePerQtl.toLocaleString('en-IN')}/q</span>
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}

        {filteredDemands.length === 0 && (
          <p className="font-body-sm text-[13px] text-[#717970] text-center py-6">
            No stock requests match these filters.
          </p>
        )}
      </div>

      {/* FULFILL STOCK REQUEST MODAL (FOR FARMER) */}
      {fulfillingDemand && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#c0c9be]/50 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#c0c9be]/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-[#16532d]" />
                <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
                  Commit Stock to Request
                </h3>
              </div>
              <button
                onClick={() => setFulfillingDemand(null)}
                className="w-8 h-8 rounded-full bg-[#f1f4ef] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#404941] leading-relaxed">
              Supply your harvested stock directly to <strong>{fulfillingDemand.buyerName}</strong> ({fulfillingDemand.buyerType}) under guaranteed terms.
            </p>

            <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/40 text-xs flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-[#717970]">Requested Commodity:</span>
                <span className="font-bold text-[#191c1a]">{fulfillingDemand.cropNameEn} ({fulfillingDemand.gradeRequired})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Agreed Purchase Rate:</span>
                <span className="font-bold text-[#16532d] text-sm">₹{fulfillingDemand.pricePerQtl.toLocaleString('en-IN')} / Qtl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Delivery Location:</span>
                <span className="font-semibold text-[#191c1a] text-right">{fulfillingDemand.deliveryLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Payment Terms:</span>
                <span className="font-semibold text-[#191c1a] text-right">{fulfillingDemand.paymentTerms}</span>
              </div>
            </div>

            {/* Quantity Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#191c1a] flex justify-between">
                <span>Quantity you want to commit (Quintals)</span>
                <span className="text-[#717970] font-normal">
                  Remaining needed: {fulfillingDemand.requiredQtl - fulfillingDemand.committedQtl} Qtl
                </span>
              </label>
              <input
                type="number"
                value={fulfillQtyQtl}
                onChange={(e) => setFulfillQtyQtl(Number(e.target.value))}
                min={1}
                max={fulfillingDemand.requiredQtl - fulfillingDemand.committedQtl}
                step={1}
                className="w-full p-2.5 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-sm font-bold outline-none"
              />
              <span className="text-[10px] text-[#717970]">
                = {(fulfillQtyQtl * 100).toLocaleString('en-IN')} kg of stock
              </span>
            </div>

            {/* Total Payout */}
            <div className="bg-[#b2f1be]/40 p-3 rounded-xl border border-[#16532d]/20 text-xs flex justify-between items-center">
              <span className="font-bold text-[#191c1a]">Your Total Payout:</span>
              <span className="font-metric-lg text-lg font-bold text-[#16532d]">
                ₹{(fulfillQtyQtl * fulfillingDemand.pricePerQtl).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFulfillingDemand(null)}
                className="flex-1 min-h-[42px] rounded-xl border border-[#c0c9be] text-[#404941] text-xs font-bold hover:bg-[#f1f4ef] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFulfill}
                className="flex-1 min-h-[42px] rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
              >
                Confirm Stock Commitment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
