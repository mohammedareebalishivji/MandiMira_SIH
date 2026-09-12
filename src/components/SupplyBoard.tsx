import React, { useState, useMemo, useEffect } from 'react';
import {
  Boxes, ShieldCheck, ShieldAlert, MapPin, Calendar, Camera, IndianRupee, Filter, Calculator,
  Plus, X, Check, Phone, Trash2, CheckCircle2, Warehouse, Tag
} from 'lucide-react';
import { CROP_BENCHMARKS } from '../data/marketData';
import { getRole } from '../data/roles';
import { UserRole, SupplyLot, UserSession, FarmerLot } from '../types';
import { stockService } from '../services/stockService';

interface Props {
  role: UserRole;
  session?: UserSession;
  lot?: FarmerLot;
  onOpenBidding?: () => void;
}

/**
 * Supply-side discovery and stock listings.
 * - Farmers can post their available crop stock with price, grade, storage type and location.
 * - Traders and buyers discover verified supply, inspect spreads and initiate transparent quotes.
 */
export const SupplyBoard: React.FC<Props> = ({ role, session, lot, onOpenBidding }) => {
  const [lots, setLots] = useState<SupplyLot[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minTrust, setMinTrust] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'myStock'>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Post Stock Form State
  const [formCrop, setFormCrop] = useState(lot?.cropNameEn || 'Nashik Red Onion');
  const [formCropType, setFormCropType] = useState(lot?.cropType || 'onion');
  const [formVariety, setFormVariety] = useState(lot?.variety || 'Garwa Late Kharif');
  const [formQuantityKg, setFormQuantityKg] = useState(lot?.quantityKg || 3000);
  const [formGrade, setFormGrade] = useState(lot?.grade || 'Grade A');
  const [formPrice, setFormPrice] = useState(lot?.localMandiBenchmark || 2850);
  const [formVillage, setFormVillage] = useState(session?.location || 'Niphad, Nashik');
  const [formStorageType, setFormStorageType] = useState('Ventilated Chawl');
  const [formHarvestDays, setFormHarvestDays] = useState(1);
  const [formNotes, setFormNotes] = useState('');

  const isTrader = role === 'middleman';
  const isFarmer = role === 'farmer' || role === 'fpo';

  useEffect(() => {
    const unsub = stockService.subscribeSupply((updated) => {
      setLots(updated);
    });
    return unsub;
  }, []);

  const handlePostStock = (e: React.FormEvent) => {
    e.preventDefault();
    const created = stockService.addSupplyLot({
      sellerName: session?.displayName || 'Demo Farmer',
      sellerRole: session?.role || 'farmer',
      village: formVillage,
      cropNameEn: formCrop,
      cropType: formCropType,
      variety: formVariety,
      quantityKg: Number(formQuantityKg),
      grade: formGrade,
      askPricePerQtl: Number(formPrice),
      harvestedDaysAgo: Number(formHarvestDays),
      storageType: formStorageType,
      contactPhone: session?.phone || '9822041234',
      verified: session?.verified ?? true,
      trustScore: session?.trustScore || 82,
      photosCount: 3,
      notes: formNotes,
      availableFrom: 'Immediate loading'
    });

    setIsPostingModalOpen(false);
    setSuccessMsg(`Your stock post for ${created.cropNameEn} (${(created.quantityKg / 100).toFixed(0)} Qtl) is now live on the Supply Board!`);
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  const handleDeleteMyLot = (id: string) => {
    if (confirm('Are you sure you want to remove this stock listing?')) {
      stockService.deleteSupplyLot(id);
      setSuccessMsg('Stock listing removed successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const rows = useMemo(() => {
    return lots
      .filter((l) => {
        if (verifiedOnly && !l.verified) return false;
        if (l.trustScore < minTrust) return false;
        if (selectedCrop !== 'all' && l.cropType !== selectedCrop) return false;
        if (filterType === 'myStock' && session) {
          return l.sellerName === session.displayName || l.contactPhone === session.phone;
        }
        return true;
      })
      .map((l) => {
        const qtl = l.quantityKg / 100;
        const lotValue = Math.round(qtl * l.askPricePerQtl);
        const benchmarkPerQtl = CROP_BENCHMARKS[l.cropType] || 2800;
        const spread = benchmarkPerQtl - l.askPricePerQtl;
        const handlingPerQtl = 45;
        const netMarginPerQtl = spread - handlingPerQtl;
        const isMine = session ? l.sellerName === session.displayName || l.contactPhone === session.phone : false;
        return { ...l, qtl, lotValue, spread, netMarginPerQtl, netMargin: Math.round(netMarginPerQtl * qtl), isMine };
      })
      .sort((a, b) => (b.createdAt ? 1 : 0) - (a.createdAt ? 1 : 0));
  }, [lots, verifiedOnly, minTrust, selectedCrop, filterType, session]);

  const totalVolume = rows.reduce((s, r) => s + r.quantityKg, 0);

  return (
    <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3 shadow-xs">
      {/* Toast Notification */}
      {successMsg && (
        <div className="bg-[#b2f1be] border border-[#16532d]/40 text-[#00210c] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16532d] flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="font-bold px-1 text-[#00210c]">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#904d00]/10 flex items-center justify-center flex-shrink-0">
            <Boxes className="w-4.5 h-4.5 text-[#904d00]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-[15px]">Live Supply Board</h3>
            <span className="font-label-sm text-[11px] text-[#404941]">
              {rows.length} lots · {(totalVolume / 1000).toFixed(1)} tonnes available from farmers
            </span>
          </div>
        </div>

        {/* Farmer Action to Post Stock */}
        {isFarmer && (
          <button
            onClick={() => setIsPostingModalOpen(true)}
            className="min-h-[38px] px-3.5 rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post My Available Stock</span>
          </button>
        )}
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap bg-[#f1f4ef] rounded-xl border border-[#c0c9be]/40 p-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#717970] flex-shrink-0" />

          {/* View Filter */}
          {isFarmer && (
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#c0c9be]/40 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  filterType === 'all' ? 'bg-[#16532d] text-white' : 'text-[#404941]'
                }`}
              >
                All Supply
              </button>
              <button
                onClick={() => setFilterType('myStock')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  filterType === 'myStock' ? 'bg-[#16532d] text-white' : 'text-[#404941]'
                }`}
              >
                My Stock Posts
              </button>
            </div>
          )}

          {/* Crop Selector */}
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

          {/* Verified Only */}
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`min-h-[30px] px-2.5 rounded-full font-label-sm text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
              verifiedOnly
                ? 'bg-[#16532d] text-white'
                : 'bg-white text-[#404941] border border-[#c0c9be]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified only
          </button>
        </div>

        {/* Min Trust Slider */}
        <label className="flex items-center gap-2 min-w-[140px]">
          <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970] whitespace-nowrap">
            Min trust {minTrust}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={minTrust}
            onChange={(e) => setMinTrust(Number(e.target.value))}
            className="flex-1 accent-[#16532d] cursor-pointer"
          />
        </label>
      </div>

      {/* Lot Cards */}
      <div className="flex flex-col gap-2.5">
        {rows.map((l) => {
          const sellerRole = getRole(l.sellerRole);
          const good = l.netMarginPerQtl > 0;

          return (
            <div
              key={l.id}
              className={`rounded-xl border p-3 flex flex-col gap-2.5 transition-all ${
                l.isMine
                  ? 'border-[#16532d]/60 bg-[#f7faf5] shadow-xs'
                  : 'border-[#c0c9be]/40 bg-[#f7faf5]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-md text-[13.5px] font-bold text-[#191c1a]">{l.sellerName}</span>
                    {l.isMine && (
                      <span className="font-label-sm text-[9px] px-2 py-0.5 rounded-full bg-[#16532d] text-white font-bold">
                        My Stock Listing
                      </span>
                    )}
                    {l.verified ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 text-[#ba1a1a] flex-shrink-0" />
                    )}
                    <span
                      className="font-label-sm text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${sellerRole.accent}14`, color: sellerRole.accent }}
                    >
                      {sellerRole.label}
                    </span>
                  </div>
                  <span className="font-body-sm text-[12px] text-[#404941]">
                    {l.cropNameEn} {l.variety ? `(${l.variety})` : ''} · {l.grade}
                  </span>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="font-metric-lg text-[#191c1a] text-base flex items-center font-bold">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {l.askPricePerQtl.toLocaleString('en-IN')}
                  </span>
                  <span className="font-label-sm text-[9px] text-[#717970] uppercase tracking-wider">ask /Qtl</span>
                </div>
              </div>

              {/* Badges and metadata */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                <span className="flex items-center gap-1 font-mono text-[11px] text-[#191c1a] font-bold">
                  {l.quantityKg.toLocaleString('en-IN')} kg ({l.qtl.toFixed(0)} Qtl)
                </span>
                <span className="flex items-center gap-1 font-label-sm text-[#404941]">
                  <MapPin className="w-3 h-3" /> {l.village}
                </span>
                <span className="flex items-center gap-1 font-label-sm text-[#404941]">
                  <Calendar className="w-3 h-3" /> {l.harvestedDaysAgo === 0 ? 'Harvested today' : `${l.harvestedDaysAgo}d ago`}
                </span>
                {l.storageType && (
                  <span className="flex items-center gap-1 font-label-sm text-[#404941]">
                    <Warehouse className="w-3 h-3" /> {l.storageType}
                  </span>
                )}
                <span className="font-label-sm text-[#16532d] font-bold">Trust {l.trustScore}/100</span>
              </div>

              {l.notes && (
                <p className="text-[11.5px] text-[#404941] bg-white/80 p-2 rounded-lg border border-[#c0c9be]/30 leading-snug">
                  📝 "{l.notes}"
                </p>
              )}

              {/* Trader Spread Intelligence */}
              {isTrader && (
                <div
                  className="rounded-lg p-2.5 flex items-center justify-between gap-2"
                  style={{ backgroundColor: good ? '#b2f1be' : '#ffdad6' }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Calculator className="w-3.5 h-3.5 flex-shrink-0" style={{ color: good ? '#14512b' : '#93000a' }} />
                    <span
                      className="font-label-sm text-[10px] uppercase tracking-wider"
                      style={{ color: good ? '#14512b' : '#93000a' }}
                    >
                      Spread ₹{l.spread}/Qtl less ₹45 handling
                    </span>
                  </div>
                  <span className="font-metric-lg text-sm flex-shrink-0 font-bold" style={{ color: good ? '#00210c' : '#93000a' }}>
                    {good ? '+' : '−'}₹{Math.abs(l.netMargin).toLocaleString('en-IN')} ({l.netMarginPerQtl >= 0 ? '+' : ''}₹{l.netMarginPerQtl}/q)
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                {l.isMine ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-[#16532d] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published by you
                    </span>
                    <button
                      onClick={() => handleDeleteMyLot(l.id)}
                      className="min-h-[34px] px-3 rounded-lg border border-[#ba1a1a]/40 text-[#ba1a1a] text-xs font-bold flex items-center gap-1 hover:bg-[#ffdad6] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Listing</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={onOpenBidding}
                      className="flex-1 min-h-[42px] rounded-lg bg-[#16532d] text-white font-label-sm text-xs flex items-center justify-center gap-1.5 hover:bg-[#003b1b] active:scale-[0.99] transition-all cursor-pointer font-bold shadow-xs"
                    >
                      {isTrader ? 'Bid / Send a transparent quote' : 'Request this lot'} · ₹{l.lotValue.toLocaleString('en-IN')}
                    </button>

                    {l.contactPhone && (
                      <a
                        href={`tel:${l.contactPhone}`}
                        title="Call farmer directly"
                        className="w-10 h-10 rounded-lg bg-[#f1f4ef] border border-[#c0c9be]/50 flex items-center justify-center text-[#16532d] hover:bg-[#b2f1be] transition-colors flex-shrink-0"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {rows.length === 0 && (
          <p className="font-body-sm text-[13px] text-[#717970] text-center py-6">
            No stock listings match these filters.
          </p>
        )}
      </div>

      {/* POST STOCK MODAL (FOR FARMERS) */}
      {isPostingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-[#c0c9be]/50 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#c0c9be]/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-[#16532d]" />
                <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
                  Post Available Farm Stock
                </h3>
              </div>
              <button
                onClick={() => setIsPostingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f4ef] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#404941]">
              Publish your harvested stock to the live supply board where verified traders and corporate processors discover and quote on lots.
            </p>

            <form onSubmit={handlePostStock} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Commodity Name</label>
                  <input
                    type="text"
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    required
                    placeholder="e.g. Nashik Red Onion"
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-semibold outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Crop Category</label>
                  <select
                    value={formCropType}
                    onChange={(e) => setFormCropType(e.target.value as any)}
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none cursor-pointer"
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
                  <label className="text-xs font-bold text-[#191c1a]">Available Quantity (kg)</label>
                  <input
                    type="number"
                    value={formQuantityKg}
                    onChange={(e) => setFormQuantityKg(Number(e.target.value))}
                    min={50}
                    step={50}
                    required
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-bold outline-none"
                  />
                  <span className="text-[10px] text-[#717970]">{(Number(formQuantityKg) / 100).toFixed(1)} Quintals</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Asking Price (₹/Qtl)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    min={100}
                    step={25}
                    required
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-bold outline-none"
                  />
                  <span className="text-[10px] text-[#717970]">
                    Benchmark: ₹{CROP_BENCHMARKS[formCropType] || 2800}/qtl
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Quality Grade</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value as any)}
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none cursor-pointer"
                  >
                    <option value="Grade A">Grade A (Premium Export/Retail)</option>
                    <option value="Grade B">Grade B (Standard Market)</option>
                    <option value="Fair Average Quality (FAQ)">Fair Average Quality (FAQ)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Storage Type</label>
                  <select
                    value={formStorageType}
                    onChange={(e) => setFormStorageType(e.target.value)}
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none cursor-pointer"
                  >
                    <option value="Ventilated Chawl">Ventilated Chawl</option>
                    <option value="Cold Storage">Cold Storage</option>
                    <option value="Traditional Shed">Traditional Covered Shed</option>
                    <option value="Field Open">Field Open (Immediate Dispatch)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Farm Location / Village</label>
                  <input
                    type="text"
                    value={formVillage}
                    onChange={(e) => setFormVillage(e.target.value)}
                    required
                    placeholder="e.g. Niphad, Nashik"
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs outline-none font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Days Since Harvest</label>
                  <input
                    type="number"
                    value={formHarvestDays}
                    onChange={(e) => setFormHarvestDays(Number(e.target.value))}
                    min={0}
                    max={120}
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs outline-none font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191c1a]">Stock Description &amp; Quality Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Dried outer skin, sorted 50mm+ bulbs, ready for pickup"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostingModalOpen(false)}
                  className="flex-1 min-h-[42px] rounded-xl border border-[#c0c9be] text-[#404941] text-xs font-bold hover:bg-[#f1f4ef] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[42px] rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
                >
                  Publish Stock Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
