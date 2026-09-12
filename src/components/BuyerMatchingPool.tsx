import React, { useState } from 'react';
import { UserPlus, Handshake, ShieldCheck, Info, CheckCircle2 } from 'lucide-react';
import { PopUpPool, BuyerOffer, FarmerLot } from '../types';
import { Translations } from '../i18n';

interface BuyerMatchingPoolProps {
  pool: PopUpPool;
  buyers: BuyerOffer[];
  lot: FarmerLot;
  t: Translations;
  onJoinPool: (pool: PopUpPool) => void;
  onAcceptBuyerOffer: (buyer: BuyerOffer) => void;
}

export const BuyerMatchingPool: React.FC<BuyerMatchingPoolProps> = ({
  pool,
  buyers,
  lot,
  t,
  onJoinPool,
  onAcceptBuyerOffer
}) => {
  const [selectedBuyerForDetails, setSelectedBuyerForDetails] = useState<BuyerOffer | null>(null);
  const primaryBuyer = buyers[0];

  const poolPercentage = Math.min(100, Math.round((pool.currentKg / pool.targetKg) * 100));
  const neededKg = Math.max(0, pool.targetKg - pool.currentKg);

  return (
    <section className="bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-3 border border-[#c0c9be]/40">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="font-label-sm text-[#904d00] font-bold uppercase tracking-wider text-[10px]">
            {t.aggregatedSelling}
          </span>
          <h3 className="font-headline-sm text-[#191c1a] font-bold text-base truncate">
            {t.popUpPoolTitle}
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#b2f1be] text-[#00210c] font-label-sm font-bold text-[11px] flex-shrink-0">
          {t.bulkBonus}
        </span>
      </div>

      {/* Pop-up Pool Card */}
      <div className="bg-[#e6e9e4] rounded-xl p-3 flex flex-col gap-2.5 border border-[#c0c9be]/50">
        <div className="flex items-center justify-between gap-2">
          <span className="font-label-md text-[#191c1a] font-bold flex items-center gap-1.5 text-sm min-w-0">
            <UserPlus className="w-4 h-4 text-[#003b1b] flex-shrink-0" />
            <span className="truncate">{pool.title}</span>
          </span>
          <span className="font-label-sm text-[#003b1b] font-bold text-xs flex-shrink-0">
            Expires in {pool.expiresInHours}h
          </span>
        </div>

        <p className="font-body-sm text-[#404941] text-xs leading-relaxed">
          Combine your {Math.min(lot.quantityKg, 180)}-{lot.quantityKg} kg with neighboring farmers to reach the {pool.targetKg} kg threshold for corporate processing rates.
        </p>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between font-label-sm text-xs">
            <span className="text-[#191c1a]">
              {t.poolProgress}: <strong>{pool.currentKg} kg / {pool.targetKg} kg</strong>
            </span>
            <span className="text-[#003b1b] font-bold">
              {neededKg === 0 ? 'Target Reached!' : `Need ${neededKg} kg`}
            </span>
          </div>
          <div className="w-full bg-[#e0e3df] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#16532d] h-full rounded-full transition-all duration-500"
              style={{ width: `${poolPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between font-label-sm pt-1 text-xs gap-2">
          <span className="text-[#404941] truncate">
            Buyer: <strong>{pool.buyerName}</strong>
          </span>
          <span className="text-[#904d00] font-bold flex-shrink-0">
            +₹{pool.bulkPremiumPerQtl}/q Bulk Premium
          </span>
        </div>

        <button
          onClick={() => onJoinPool(pool)}
          id="joinPopUpPoolBtn"
          className="min-h-[44px] rounded-lg bg-white text-[#003b1b] font-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all cursor-pointer hover:bg-[#f1f4ef] border border-[#c0c9be]/30 text-xs"
        >
          <Handshake className="w-4 h-4" />
          <span>{t.joinPoolBtn} (+₹{pool.gainEstimate.toLocaleString()} Gain)</span>
        </button>
      </div>

      {/* Direct Verified Buyer Card */}
      {primaryBuyer && (
        <div className="bg-[#f1f4ef] rounded-xl p-3 flex flex-col gap-2.5 border border-[#c0c9be]/40">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="font-headline-sm text-[#191c1a] font-bold text-sm truncate">
                  {primaryBuyer.buyerName}
                </span>
                <span title="Govt Verified FPO Partner" className="inline-flex">
                  <ShieldCheck className="w-4 h-4 text-[#16532d] flex-shrink-0" />
                </span>
              </div>
              <span className="font-label-sm text-[#404941] text-xs">
                {primaryBuyer.type} • {primaryBuyer.rating} ★
              </span>
            </div>
            <button
              onClick={() => setSelectedBuyerForDetails(selectedBuyerForDetails ? null : primaryBuyer)}
              className="px-2 py-0.5 rounded bg-[#b2f1be] text-[#00210c] font-label-sm font-bold flex items-center gap-1 cursor-pointer hover:opacity-90 flex-shrink-0 text-xs"
              title="Click to see why match"
            >
              <span>{primaryBuyer.badge || '98% Match'}</span>
              <Info className="w-3 h-3" />
            </button>
          </div>

          {/* Match Score Reason Breakdown (if clicked) */}
          {selectedBuyerForDetails && (
            <div className="bg-white p-2.5 rounded-lg border border-[#c0c9be]/40 text-xs flex flex-col gap-1">
              <span className="font-bold text-[#003b1b]">Why {primaryBuyer.matchScore}% Match for your lot:</span>
              <ul className="list-disc pl-4 text-[#404941] space-y-0.5">
                {primaryBuyer.matchReasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-[#191c1a] font-label-sm">
            <div className="bg-white p-2 rounded border border-[#c0c9be]/30">
              <span className="text-[#404941] block text-[11px]">Offer Price</span>
              <strong className="font-metric-lg text-[#003b1b] text-base">
                ₹{primaryBuyer.offerPricePerQtl.toLocaleString()}/q
              </strong>
            </div>
            <div className="bg-white p-2 rounded border border-[#c0c9be]/30">
              <span className="text-[#404941] block text-[11px]">Payment Terms</span>
              <strong className="text-[#191c1a] block mt-1 text-xs truncate">
                {primaryBuyer.paymentTerms}
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-between font-label-sm text-[#404941] text-xs">
            <span>Pickup: {primaryBuyer.pickupTimeline}</span>
            <span>Weight: {primaryBuyer.weighingMethod}</span>
          </div>

          <button
            onClick={() => onAcceptBuyerOffer(primaryBuyer)}
            id="acceptBuyerOfferBtn"
            className="min-h-[44px] rounded-lg bg-[#16532d] text-white font-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all cursor-pointer hover:bg-[#003b1b] text-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.acceptOfferBtn}</span>
          </button>
        </div>
      )}
    </section>
  );
};
