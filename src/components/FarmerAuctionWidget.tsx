import React, { useState, useEffect } from 'react';
import { Gavel, TrendingUp, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Plus } from 'lucide-react';
import { CropAuction, FarmerLot, UserSession } from '../types';
import { biddingService } from '../services/biddingService';

interface Props {
  lot: FarmerLot;
  session: UserSession;
  onOpenBiddingTab: () => void;
  onOpenSourcingTab?: () => void;
}

export const FarmerAuctionWidget: React.FC<Props> = ({ lot, session, onOpenBiddingTab, onOpenSourcingTab }) => {
  const [auctions, setAuctions] = useState<CropAuction[]>([]);

  useEffect(() => {
    const unsub = biddingService.subscribe((updated) => {
      setAuctions(updated);
    });
    return unsub;
  }, []);

  // Find auction for this lot or farmer
  const activeAuction = auctions.find(
    (a) =>
      a.status === 'ACTIVE' &&
      (a.lotId === lot.id ||
        a.farmerPhone === session.phone ||
        a.cropType === lot.cropType)
  );

  const highestBid = activeAuction?.currentHighestBidPerQtl || 0;
  const basePrice = activeAuction?.basePricePerQtl || lot.localMandiBenchmark;
  const gain = highestBid > basePrice ? highestBid - basePrice : 0;
  const totalGain = Math.round(((activeAuction?.quantityKg || lot.quantityKg) / 100) * gain);

  return (
    <div className="bg-gradient-to-br from-[#16532d]/10 via-white to-[#b2f1be]/20 rounded-2xl p-4 border border-[#16532d]/30 shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#16532d] flex items-center justify-center text-white flex-shrink-0">
            <Gavel className="w-4 h-4" />
          </div>
          <div>
            <span className="font-label-sm text-[10px] text-[#16532d] font-bold uppercase tracking-wider block">
              Direct Trader Bidding &amp; Stock
            </span>
            <h4 className="font-headline-sm text-sm font-bold text-[#191c1a]">
              {activeAuction ? 'Active Open Auction on Your Lot' : 'Competitive Bidding &amp; Stock Board'}
            </h4>
          </div>
        </div>

        {activeAuction ? (
          <span className="px-2 py-0.5 rounded-full bg-[#16532d] text-white text-[10px] font-bold animate-pulse">
            ● LIVE ({activeAuction.bids.length} BIDS)
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-[#b2f1be] text-[#00210c] text-[10px] font-bold">
            Guaranteed DBT
          </span>
        )}
      </div>

      {activeAuction ? (
        <div className="flex flex-col gap-2.5">
          <div className="bg-white/80 rounded-xl p-2.5 border border-[#c0c9be]/40 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-[#717970] block">CURRENT HIGHEST BID</span>
              <span className="font-metric-lg text-base font-bold text-[#16532d]">
                ₹{highestBid.toLocaleString('en-IN')}/q
              </span>
              {activeAuction.highestBidderName && (
                <span className="text-[10px] text-[#404941] block">
                  from {activeAuction.highestBidderName}
                </span>
              )}
            </div>

            {gain > 0 && (
              <div className="text-right">
                <span className="text-[10px] text-[#717970] block">PREMIUM OVER RESERVE</span>
                <span className="text-xs font-bold text-[#16532d] bg-[#b2f1be] px-2 py-0.5 rounded-full inline-block">
                  +₹{gain}/q (+₹{totalGain.toLocaleString('en-IN')})
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onOpenBiddingTab}
              className="flex-1 min-h-[42px] rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <span>Review All {activeAuction.bids.length} Bids &amp; Accept</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onOpenSourcingTab && (
              <button
                onClick={onOpenSourcingTab}
                className="min-h-[42px] px-3.5 rounded-xl bg-white hover:bg-[#f1f4ef] text-[#16532d] border border-[#16532d]/40 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                title="Post to Live Supply Board"
              >
                <span>Post Stock</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[#404941] leading-relaxed">
            Invite verified Nashik &amp; Pune middlemen to bid on your {lot.quantityKg.toLocaleString('en-IN')} kg {lot.cropNameEn} lot, or list it on the Live Supply Board.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onOpenBiddingTab}
              className="flex-1 min-h-[42px] rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Live Auction</span>
            </button>
            {onOpenSourcingTab && (
              <button
                onClick={onOpenSourcingTab}
                className="min-h-[42px] px-3.5 rounded-xl bg-white hover:bg-[#f1f4ef] text-[#16532d] border border-[#16532d]/40 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                title="Post to Live Supply Board"
              >
                <span>Post Stock</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
