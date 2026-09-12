import React, { useState, useEffect, useMemo } from 'react';
import {
  Gavel, TrendingUp, ShieldCheck, ShieldAlert, Clock, IndianRupee,
  CheckCircle2, XCircle, ArrowUpRight, Plus, Filter, AlertCircle,
  Truck, Calendar, UserCheck, Calculator, Sparkles, Building2, ChevronDown, ChevronUp
} from 'lucide-react';
import { CropAuction, CropBid, FarmerLot, TransactionRecord, UserSession } from '../types';
import { biddingService } from '../services/biddingService';
import { CROP_BENCHMARKS } from '../data/marketData';
import { TabId } from '../data/navigation';

interface Props {
  session: UserSession;
  lot: FarmerLot;
  onAuctionAwarded?: (txn: TransactionRecord) => void;
  onNavigateToTab?: (tab: TabId) => void;
}

export const BiddingCenter: React.FC<Props> = ({
  session,
  lot,
  onAuctionAwarded,
  onNavigateToTab
}) => {
  const [auctions, setAuctions] = useState<CropAuction[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'yard' | 'myBids' | 'myAuctions'>('yard');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [expandedAuctionId, setExpandedAuctionId] = useState<string | null>(null);

  // Modal states
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidTargetAuction, setBidTargetAuction] = useState<CropAuction | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(0);
  const [bidDeliveryDate, setBidDeliveryDate] = useState('Tomorrow, 10:00 AM');
  const [bidPaymentTerms, setBidPaymentTerms] = useState('Instant DBT on digital weighment');
  const [bidPickupOption, setBidPickupOption] = useState('Self Pickup (Trader vehicle)');
  const [bidNotes, setBidNotes] = useState('');
  const [bidError, setBidError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAuctionCrop, setNewAuctionCrop] = useState(lot.cropNameEn);
  const [newAuctionType, setNewAuctionType] = useState<CropAuction['cropType']>(lot.cropType);
  const [newAuctionQty, setNewAuctionQty] = useState(lot.quantityKg);
  const [newAuctionGrade, setNewAuctionGrade] = useState(lot.grade);
  const [newAuctionBasePrice, setNewAuctionBasePrice] = useState(lot.localMandiBenchmark || 2800);
  const [newAuctionIncrement, setNewAuctionIncrement] = useState(25);
  const [newAuctionDuration, setNewAuctionDuration] = useState(48);
  const [newAuctionDelivery, setNewAuctionDelivery] = useState('Ex-Farm Gate Pickup');

  const [acceptingBid, setAcceptingBid] = useState<{ auction: CropAuction; bid: CropBid } | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const isFarmer = session.role === 'farmer';
  const isMiddleman = session.role === 'middleman';

  useEffect(() => {
    const unsub = biddingService.subscribe((updated) => {
      setAuctions(updated);
    });
    return unsub;
  }, []);

  // Default view based on role
  useEffect(() => {
    if (isFarmer) {
      setActiveSubTab('myAuctions');
    } else {
      setActiveSubTab('yard');
    }
  }, [isFarmer]);

  // Filtered auctions
  const filteredAuctions = useMemo(() => {
    return auctions.filter((a) => {
      if (selectedCrop !== 'all' && a.cropType !== selectedCrop) return false;
      if (activeSubTab === 'myAuctions') {
        return a.farmerPhone === session.phone || a.farmerName.toLowerCase() === session.displayName.toLowerCase();
      }
      return true;
    });
  }, [auctions, selectedCrop, activeSubTab, session]);

  // My placed bids (for middleman/trader)
  const myPlacedBids = useMemo(() => {
    return biddingService.getAuctionsForBidder(session.phone);
  }, [auctions, session]);

  // Farmer's own active auction count
  const myAuctionsCount = useMemo(() => {
    return auctions.filter(
      (a) => a.farmerPhone === session.phone || a.farmerName.toLowerCase() === session.displayName.toLowerCase()
    ).length;
  }, [auctions, session]);

  // Handle open bid modal
  const handleOpenBidModal = (auc: CropAuction) => {
    setBidTargetAuction(auc);
    const minPrice = auc.currentHighestBidPerQtl > 0
      ? auc.currentHighestBidPerQtl + auc.minIncrementPerQtl
      : auc.basePricePerQtl;
    setBidPrice(minPrice);
    setBidError(null);
    setIsBidModalOpen(true);
  };

  // Submit Bid
  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidTargetAuction) return;

    const res = biddingService.placeBid(bidTargetAuction.id, {
      bidderId: session.phone,
      bidderName: session.displayName,
      bidderRole: session.role,
      bidderOrg: session.organisation,
      bidderPhone: session.phone,
      bidderTrustScore: session.trustScore,
      offeredPricePerQtl: bidPrice,
      proposedDeliveryDate: bidDeliveryDate,
      paymentTerms: bidPaymentTerms,
      pickupOption: bidPickupOption,
      notes: bidNotes
    });

    if (!res.success) {
      setBidError(res.error || 'Failed to place bid');
      return;
    }

    setIsBidModalOpen(false);
    setSuccessBanner(`Your bid of ₹${bidPrice.toLocaleString('en-IN')}/Qtl on ${bidTargetAuction.cropNameEn} has been submitted!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // Create Auction
  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault();
    const created = biddingService.createAuction({
      lotId: lot.id,
      farmerId: `farmer-${session.phone}`,
      farmerName: session.displayName,
      farmerPhone: session.phone,
      farmerLocation: session.location,
      farmerTrustScore: session.trustScore,
      cropNameEn: newAuctionCrop,
      cropType: newAuctionType,
      variety: lot.variety || 'Standard Hybrid',
      quantityKg: Number(newAuctionQty),
      grade: newAuctionGrade,
      basePricePerQtl: Number(newAuctionBasePrice),
      minIncrementPerQtl: Number(newAuctionIncrement),
      durationHours: Number(newAuctionDuration),
      deliveryPreference: newAuctionDelivery
    });

    setIsCreateModalOpen(false);
    setActiveSubTab('myAuctions');
    setExpandedAuctionId(created.id);
    setSuccessBanner(`Live auction for ${created.cropNameEn} (${created.quantityKg.toLocaleString('en-IN')} kg) published! Bidders can now place competitive quotes.`);
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  // Accept Bid
  const handleConfirmAcceptBid = () => {
    if (!acceptingBid) return;
    const res = biddingService.acceptBid(acceptingBid.auction.id, acceptingBid.bid.id);
    if (res.success && res.transaction) {
      if (onAuctionAwarded) {
        onAuctionAwarded(res.transaction);
      }
      setSuccessBanner(
        `🎉 Deal Accepted! Lot awarded to ${acceptingBid.bid.bidderName} at ₹${acceptingBid.bid.offeredPricePerQtl.toLocaleString('en-IN')}/Qtl (Total ₹${res.transaction.grossAmount.toLocaleString('en-IN')}). Booked into Sales Ledger.`
      );
      setAcceptingBid(null);
      setTimeout(() => setSuccessBanner(null), 7000);
    }
  };

  const getTimeLeft = (expiresAt: string): string => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Ended';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h left`;
    }
    return `${hours}h ${mins}m left`;
  };

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto w-full">
      {/* Top Banner Alert */}
      {successBanner && (
        <div className="bg-[#b2f1be] border border-[#16532d]/40 text-[#00210c] px-4 py-3 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#16532d] flex-shrink-0" />
            <span className="font-label-md text-xs sm:text-sm font-semibold">{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-[#00210c] hover:opacity-70 text-xs font-bold px-2 py-1">
            ✕
          </button>
        </div>
      )}

      {/* Main Header & Overview Card */}
      <section className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 sm:p-5 flex flex-col gap-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#16532d]/10 flex items-center justify-center flex-shrink-0">
              <Gavel className="w-6 h-6 text-[#16532d]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm font-bold text-[#191c1a] text-lg sm:text-xl">
                  {isFarmer ? 'Farmer Crop Auctions & Live Bids' : 'Trader Bidding Yard & Sourcing'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#16532d] text-white font-label-sm text-[10px] font-bold uppercase tracking-wider">
                  Live System
                </span>
              </div>
              <p className="font-body-sm text-xs sm:text-sm text-[#404941]">
                {isFarmer
                  ? 'Receive competitive spot & forward bids directly from verified traders with instant DBT guarantee.'
                  : 'Bid transparently on fresh farmer consignments with live mandi spread intelligence and APMC gateway.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {isFarmer && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="min-h-[40px] px-3.5 rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Auction</span>
              </button>
            )}
            <button
              onClick={() => biddingService.resetToDefaults()}
              title="Reset auction state to defaults"
              className="min-h-[40px] px-2.5 rounded-xl bg-[#f1f4ef] hover:bg-[#e0e3df] text-[#404941] text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              Reset Demo
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside Bidding Center */}
        <div className="flex items-center justify-between gap-2 border-b border-[#c0c9be]/40 pb-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#f1f4ef] p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('yard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'yard'
                  ? 'bg-white text-[#16532d] shadow-xs'
                  : 'text-[#404941] hover:text-[#191c1a]'
              }`}
            >
              Live Yard ({auctions.filter((a) => a.status === 'ACTIVE').length})
            </button>

            {isFarmer && (
              <button
                onClick={() => setActiveSubTab('myAuctions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'myAuctions'
                    ? 'bg-white text-[#16532d] shadow-xs'
                    : 'text-[#404941] hover:text-[#191c1a]'
                }`}
              >
                <span>My Crop Auctions</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#16532d] text-white text-[10px]">
                  {myAuctionsCount}
                </span>
              </button>
            )}

            {isMiddleman && (
              <button
                onClick={() => setActiveSubTab('myBids')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'myBids'
                    ? 'bg-white text-[#16532d] shadow-xs'
                    : 'text-[#404941] hover:text-[#191c1a]'
                }`}
              >
                <span>My Placed Bids</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#904d00] text-white text-[10px]">
                  {myPlacedBids.length}
                </span>
              </button>
            )}
          </div>

          {/* Filter by Crop */}
          {activeSubTab !== 'myBids' && (
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#717970]" />
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-[#f1f4ef] border border-[#c0c9be]/50 rounded-lg px-2 py-1 text-xs text-[#191c1a] font-medium outline-none cursor-pointer"
              >
                <option value="all">All Crops</option>
                <option value="onion">Onion</option>
                <option value="potato">Potato</option>
                <option value="tomato">Tomato</option>
                <option value="soybean">Soybean</option>
                <option value="wheat">Wheat</option>
              </select>
            </div>
          )}
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#f7faf5] rounded-xl p-2.5 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Active Auctions</span>
            <span className="font-metric-lg text-lg font-bold text-[#16532d]">
              {auctions.filter((a) => a.status === 'ACTIVE').length} Lots
            </span>
          </div>
          <div className="bg-[#f7faf5] rounded-xl p-2.5 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Total Bids Cast</span>
            <span className="font-metric-lg text-lg font-bold text-[#191c1a]">
              {auctions.reduce((sum, a) => sum + a.bids.length, 0)} Bids
            </span>
          </div>
          <div className="bg-[#f7faf5] rounded-xl p-2.5 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">Total Volume</span>
            <span className="font-metric-lg text-lg font-bold text-[#191c1a]">
              {(auctions.reduce((sum, a) => sum + a.quantityKg, 0) / 1000).toFixed(1)} Tonnes
            </span>
          </div>
          <div className="bg-[#f7faf5] rounded-xl p-2.5 border border-[#c0c9be]/30 flex flex-col">
            <span className="font-label-sm text-[10.5px] uppercase tracking-wider text-[#717970]">
              {isFarmer ? 'Highest Premium' : 'My Active Bids'}
            </span>
            <span className="font-metric-lg text-lg font-bold text-[#904d00]">
              {isFarmer ? '+₹130/qtl' : `${myPlacedBids.length} Lots`}
            </span>
          </div>
        </div>
      </section>

      {/* SUB-VIEW 1: MY PLACED BIDS (MIDDLEMAN VIEW) */}
      {activeSubTab === 'myBids' && (
        <section className="flex flex-col gap-3">
          {myPlacedBids.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#c0c9be]/40 p-8 text-center flex flex-col items-center gap-2">
              <Gavel className="w-10 h-10 text-[#c0c9be]" />
              <h4 className="font-bold text-sm text-[#191c1a]">You haven't placed any bids yet</h4>
              <p className="text-xs text-[#404941] max-w-sm">
                Browse the live auction yard to place competitive bids on fresh farmer lots.
              </p>
              <button
                onClick={() => setActiveSubTab('yard')}
                className="mt-2 min-h-[38px] px-4 rounded-xl bg-[#16532d] text-white text-xs font-bold cursor-pointer"
              >
                Explore Live Yard
              </button>
            </div>
          ) : (
            myPlacedBids.map(({ auction, myBid }) => {
              const isLeading = auction.currentHighestBidPerQtl === myBid.offeredPricePerQtl && auction.status === 'ACTIVE';
              const isWon = myBid.status === 'ACCEPTED';
              const isOutbid = myBid.status === 'OUTBID';
              const benchmark = CROP_BENCHMARKS[auction.cropType] || 2800;
              const grossSpread = benchmark - myBid.offeredPricePerQtl;
              const netSpread = grossSpread - 45;

              return (
                <div
                  key={myBid.id}
                  className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-headline-sm font-bold text-[#191c1a] text-base">
                          {auction.cropNameEn}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#16532d] bg-[#b2f1be] px-2 py-0.5 rounded-full">
                          {(auction.quantityKg / 100).toFixed(0)} Qtl ({auction.quantityKg.toLocaleString('en-IN')} kg)
                        </span>
                        <span className="font-label-sm text-[11px] text-[#404941] bg-[#f1f4ef] px-2 py-0.5 rounded-md">
                          {auction.grade}
                        </span>
                      </div>
                      <span className="font-label-sm text-xs text-[#404941] mt-0.5">
                        Farmer: <strong>{auction.farmerName}</strong> · {auction.farmerLocation}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isWon ? (
                        <span className="px-3 py-1 rounded-full bg-[#b2f1be] text-[#00210c] text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16532d]" />
                          Won / Awarded!
                        </span>
                      ) : isLeading ? (
                        <span className="px-3 py-1 rounded-full bg-[#d7f8dd] text-[#14512b] text-xs font-bold flex items-center gap-1 border border-[#16532d]/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16532d]" />
                          Highest Bidder (Leading)
                        </span>
                      ) : isOutbid ? (
                        <span className="px-3 py-1 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-bold flex items-center gap-1 border border-[#ba1a1a]/30">
                          <AlertCircle className="w-3.5 h-3.5 text-[#ba1a1a]" />
                          Outbid (Top: ₹{auction.currentHighestBidPerQtl})
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-[#f1f4ef] text-[#404941] text-xs font-bold">
                          {myBid.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#f7faf5] p-3 rounded-xl border border-[#c0c9be]/30 text-xs">
                    <div>
                      <span className="text-[#717970] block text-[10px] uppercase">My Bid Rate</span>
                      <strong className="text-[#191c1a] font-metric-lg text-sm">
                        ₹{myBid.offeredPricePerQtl.toLocaleString('en-IN')}/q
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#717970] block text-[10px] uppercase">Total Commitment</span>
                      <strong className="text-[#16532d] font-metric-lg text-sm">
                        ₹{myBid.totalAmount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#717970] block text-[10px] uppercase">Mandi Benchmark</span>
                      <strong className="text-[#191c1a] font-metric-lg text-sm">
                        ₹{benchmark.toLocaleString('en-IN')}/q
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#717970] block text-[10px] uppercase">Projected Net Spread</span>
                      <strong className={netSpread >= 0 ? 'text-[#16532d] font-bold text-sm' : 'text-[#ba1a1a] font-bold text-sm'}>
                        {netSpread >= 0 ? '+' : ''}₹{netSpread}/qtl
                      </strong>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                    <div className="flex items-center gap-2 text-xs text-[#717970]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{getTimeLeft(auction.expiresAt)}</span>
                      <span>·</span>
                      <span>{auction.totalBidsCount} total bids</span>
                    </div>

                    {isOutbid && auction.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleOpenBidModal(auction)}
                        className="min-h-[38px] px-4 rounded-xl bg-[#904d00] hover:bg-[#663500] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98 transition-all"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Raise My Bid (Min ₹{(auction.currentHighestBidPerQtl + auction.minIncrementPerQtl).toLocaleString('en-IN')})</span>
                      </button>
                    )}

                    {isWon && (
                      <button
                        onClick={() => onNavigateToTab?.('payments')}
                        className="min-h-[38px] px-4 rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Coordinate Pickup &amp; Escrow</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}

      {/* SUB-VIEW 2: LIVE YARD OR MY AUCTIONS */}
      {activeSubTab !== 'myBids' && (
        <section className="flex flex-col gap-3">
          {filteredAuctions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#c0c9be]/40 p-8 text-center flex flex-col items-center gap-2">
              <Gavel className="w-10 h-10 text-[#c0c9be]" />
              <h4 className="font-bold text-sm text-[#191c1a]">No auctions matching this filter</h4>
              <p className="text-xs text-[#404941]">
                {isFarmer && activeSubTab === 'myAuctions'
                  ? 'You do not have any published auctions right now. Click "Start New Auction" to list your lot for open bidding.'
                  : 'Check back soon as new farm lots are posted throughout the harvest morning.'}
              </p>
              {isFarmer && activeSubTab === 'myAuctions' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2 min-h-[38px] px-4 rounded-xl bg-[#16532d] text-white text-xs font-bold cursor-pointer"
                >
                  Create Your First Auction
                </button>
              )}
            </div>
          ) : (
            filteredAuctions.map((auc) => {
              const isOwner = auc.farmerPhone === session.phone || auc.farmerName.toLowerCase() === session.displayName.toLowerCase();
              const isExpanded = expandedAuctionId === auc.id;
              const benchmark = CROP_BENCHMARKS[auc.cropType] || 2800;
              const highestBid = auc.currentHighestBidPerQtl || auc.basePricePerQtl;
              const traderSpread = benchmark - highestBid - 45;
              const isAwarded = auc.status === 'AWARDED';

              // Middleman bid check
              const myBidOnThis = auc.bids.find(
                (b) => b.bidderPhone === session.phone || b.bidderId === session.phone
              );

              return (
                <div
                  key={auc.id}
                  className={`bg-white rounded-2xl border transition-all shadow-xs flex flex-col gap-3.5 p-4 sm:p-5 ${
                    isAwarded
                      ? 'border-[#16532d]/40 bg-[#f7faf5]'
                      : isOwner
                      ? 'border-[#16532d]/60'
                      : 'border-[#c0c9be]/60'
                  }`}
                >
                  {/* Top Bar: Crop, Status, Time */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#f1f4ef] flex items-center justify-center flex-shrink-0 text-xl">
                        {auc.cropType === 'onion' ? '🧅' : auc.cropType === 'tomato' ? '🍅' : auc.cropType === 'potato' ? '🥔' : '🌾'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
                            {auc.cropNameEn}
                          </h3>
                          <span className="font-mono text-xs font-bold text-[#16532d] bg-[#b2f1be] px-2 py-0.5 rounded-full">
                            {(auc.quantityKg / 100).toFixed(0)} Qtl ({auc.quantityKg.toLocaleString('en-IN')} kg)
                          </span>
                          <span className="font-label-sm text-[11px] text-[#404941] bg-[#f1f4ef] px-2 py-0.5 rounded-md">
                            {auc.grade}
                          </span>
                          {auc.type === 'FORWARD' && (
                            <span className="font-label-sm text-[10px] text-[#002b7b] bg-[#e0eaff] px-2 py-0.5 rounded-md font-bold">
                              FORWARD CONTRACT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#404941] mt-0.5 flex-wrap">
                          <span>Farmer: <strong>{auc.farmerName}</strong></span>
                          <span>·</span>
                          <span>📍 {auc.farmerLocation}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 font-bold text-[#16532d]">
                            <ShieldCheck className="w-3.5 h-3.5" /> Trust {auc.farmerTrustScore}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      {isAwarded ? (
                        <span className="px-3 py-1 rounded-full bg-[#b2f1be] text-[#00210c] text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16532d]" />
                          Awarded &amp; Closed
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-[#f1f4ef] text-[#404941] text-xs font-bold flex items-center gap-1 border border-[#c0c9be]/40">
                          <Clock className="w-3.5 h-3.5 text-[#717970]" />
                          {getTimeLeft(auc.expiresAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financial Metrics Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#f7faf5] p-3 rounded-xl border border-[#c0c9be]/40 text-xs">
                    <div>
                      <span className="text-[#717970] block text-[10px] uppercase">Base Reserve</span>
                      <strong className="text-[#191c1a] font-metric-lg text-sm">
                        ₹{auc.basePricePerQtl.toLocaleString('en-IN')}/q
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#717970] block text-[10px] uppercase">Current Top Bid</span>
                      <strong className="text-[#16532d] font-metric-lg text-base flex items-center">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {auc.currentHighestBidPerQtl > 0 ? auc.currentHighestBidPerQtl.toLocaleString('en-IN') : 'No bids yet'}
                        {auc.currentHighestBidPerQtl > 0 && '/q'}
                      </strong>
                      {auc.highestBidderName && (
                        <span className="text-[10px] text-[#404941] block truncate">
                          by {auc.highestBidderName}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[#717970] block text-[10px] uppercase">Lot Total Value</span>
                      <strong className="text-[#191c1a] font-metric-lg text-sm">
                        ₹{Math.round((auc.quantityKg / 100) * highestBid).toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[#717970] block text-[10px] uppercase">
                        {isMiddleman ? 'Trader Net Margin' : 'Bids Count'}
                      </span>
                      {isMiddleman ? (
                        <strong className={traderSpread >= 0 ? 'text-[#16532d] font-bold text-sm' : 'text-[#ba1a1a] font-bold text-sm'}>
                          {traderSpread >= 0 ? '+' : ''}₹{traderSpread}/qtl spread
                        </strong>
                      ) : (
                        <strong className="text-[#191c1a] font-bold text-sm">
                          {auc.bids.length} Active Quotes
                        </strong>
                      )}
                    </div>
                  </div>

                  {/* Middleman Economics / Margin Intelligence Box */}
                  {isMiddleman && !isAwarded && (
                    <div className="bg-[#f1f4ef] rounded-xl p-2.5 border border-[#c0c9be]/40 text-xs flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-[#904d00]" />
                        <span className="text-[#404941]">
                          Mandi Benchmark: <strong>₹{benchmark}/q</strong> · Handling: <strong>₹45/q</strong>
                        </span>
                      </div>
                      <div className="font-label-sm text-[11px] text-[#14512b] font-semibold">
                        💡 Buying at ₹{auc.currentHighestBidPerQtl > 0 ? auc.currentHighestBidPerQtl + auc.minIncrementPerQtl : auc.basePricePerQtl} leaves ~₹{benchmark - (auc.currentHighestBidPerQtl > 0 ? auc.currentHighestBidPerQtl + auc.minIncrementPerQtl : auc.basePricePerQtl) - 45}/q net margin
                      </div>
                    </div>
                  )}

                  {/* Middleman Bid Status pill on this auction */}
                  {isMiddleman && myBidOnThis && (
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                      myBidOnThis.status === 'ACCEPTED'
                        ? 'bg-[#b2f1be] border-[#16532d]/40 text-[#00210c]'
                        : myBidOnThis.status === 'PENDING'
                        ? 'bg-[#d7f8dd] border-[#16532d]/30 text-[#14512b]'
                        : 'bg-[#ffdad6] border-[#ba1a1a]/30 text-[#93000a]'
                    }`}>
                      <span className="font-semibold">
                        {myBidOnThis.status === 'ACCEPTED'
                          ? '🎉 You won this auction!'
                          : myBidOnThis.status === 'PENDING'
                          ? `✅ You are currently leading at ₹${myBidOnThis.offeredPricePerQtl}/Qtl`
                          : `⚠️ You were outbid! Current highest is ₹${auc.currentHighestBidPerQtl}/Qtl (Your bid: ₹${myBidOnThis.offeredPricePerQtl}/Qtl)`}
                      </span>
                      {myBidOnThis.status === 'OUTBID' && !isAwarded && (
                        <button
                          onClick={() => handleOpenBidModal(auc)}
                          className="px-3 py-1 rounded-lg bg-[#ba1a1a] text-white font-bold text-[11px] cursor-pointer hover:bg-[#93000a]"
                        >
                          Raise Bid
                        </button>
                      )}
                    </div>
                  )}

                  {/* Actions & Expand Bids */}
                  <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                    <button
                      onClick={() => setExpandedAuctionId(isExpanded ? null : auc.id)}
                      className="text-xs text-[#16532d] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span>{isExpanded ? 'Hide' : 'Inspect'} Bids ({auc.bids.length})</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isMiddleman && !isAwarded && (
                        <button
                          onClick={() => handleOpenBidModal(auc)}
                          className="min-h-[40px] px-4 rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98 transition-all"
                        >
                          <Gavel className="w-4 h-4" />
                          <span>{myBidOnThis ? 'Update Bid' : 'Place Competitive Bid'}</span>
                        </button>
                      )}

                      {isOwner && !isAwarded && auc.bids.length > 0 && (
                        <span className="text-xs text-[#16532d] font-bold bg-[#b2f1be] px-3 py-1.5 rounded-xl">
                          Ready to Award to Highest Bidder
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Bids Drawer */}
                  {isExpanded && (
                    <div className="border-t border-[#c0c9be]/40 pt-3 flex flex-col gap-2.5 mt-1 animate-in fade-in duration-200">
                      <h4 className="font-label-sm text-[11px] font-bold uppercase tracking-wider text-[#717970]">
                        Incoming Quotes &amp; Bidder History ({auc.bids.length})
                      </h4>

                      {auc.bids.length === 0 ? (
                        <p className="text-xs text-[#717970] py-2">No bids recorded yet on this lot.</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {auc.bids.map((bid) => {
                            const isWinningBid = auc.winningBidId === bid.id || bid.status === 'ACCEPTED';
                            const isTop = bid.offeredPricePerQtl === auc.currentHighestBidPerQtl;

                            return (
                              <div
                                key={bid.id}
                                className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                                  isWinningBid
                                    ? 'bg-[#b2f1be]/60 border-[#16532d]'
                                    : isTop
                                    ? 'bg-white border-[#16532d]/40 shadow-xs'
                                    : 'bg-[#f7faf5] border-[#c0c9be]/30'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs sm:text-sm text-[#191c1a]">
                                        {bid.bidderName}
                                      </span>
                                      <span className="text-[10px] text-[#717970]">({bid.bidderOrg})</span>
                                      <span className="px-1.5 py-0.5 rounded-full bg-[#f1f4ef] text-[10px] font-bold text-[#16532d] flex items-center gap-0.5">
                                        <ShieldCheck className="w-3 h-3" /> {bid.bidderTrustScore}/100
                                      </span>
                                    </div>
                                    <span className="text-[11px] text-[#404941] mt-0.5">
                                      Pickup: {bid.pickupOption} · Timeline: {bid.proposedDeliveryDate}
                                    </span>
                                  </div>

                                  <div className="flex flex-col items-end">
                                    <span className="font-metric-lg text-sm sm:text-base font-bold text-[#16532d]">
                                      ₹{bid.offeredPricePerQtl.toLocaleString('en-IN')}/q
                                    </span>
                                    <span className="text-[10px] text-[#717970]">
                                      Total ₹{bid.totalAmount.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>

                                {bid.notes && (
                                  <p className="text-[11.5px] text-[#404941] bg-white/70 p-2 rounded-lg border border-[#c0c9be]/20">
                                    💬 "{bid.notes}"
                                  </p>
                                )}

                                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                                  <span className="text-[10.5px] text-[#717970]">
                                    Terms: <strong>{bid.paymentTerms}</strong>
                                  </span>

                                  {isOwner && !isAwarded && (
                                    <button
                                      onClick={() => setAcceptingBid({ auction: auc, bid })}
                                      className="min-h-[34px] px-3.5 rounded-lg bg-[#16532d] hover:bg-[#003b1b] text-white text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-98 transition-all shadow-xs"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Accept This Bid</span>
                                    </button>
                                  )}

                                  {isWinningBid && (
                                    <span className="text-xs font-bold text-[#16532d] flex items-center gap-1">
                                      <CheckCircle2 className="w-4 h-4" /> Accepted Winning Offer
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      )}

      {/* MODAL 1: PLACE / RAISE BID (FOR MIDDLEMAN) */}
      {isBidModalOpen && bidTargetAuction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-[#c0c9be]/50 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#c0c9be]/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-[#16532d]" />
                <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
                  Place Quote: {bidTargetAuction.cropNameEn}
                </h3>
              </div>
              <button
                onClick={() => setIsBidModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f4ef] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            {bidError && (
              <div className="p-3 bg-[#ffdad6] text-[#93000a] text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{bidError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitBid} className="flex flex-col gap-3.5">
              {/* Lot Overview */}
              <div className="bg-[#f7faf5] p-3 rounded-xl border border-[#c0c9be]/40 text-xs flex justify-between">
                <div>
                  <span className="text-[#717970] block text-[10px]">LOT QUANTITY</span>
                  <strong>{bidTargetAuction.quantityKg.toLocaleString('en-IN')} kg ({(bidTargetAuction.quantityKg / 100).toFixed(0)} Qtl)</strong>
                </div>
                <div>
                  <span className="text-[#717970] block text-[10px]">BASE RESERVE</span>
                  <strong>₹{bidTargetAuction.basePricePerQtl}/q</strong>
                </div>
                <div>
                  <span className="text-[#717970] block text-[10px]">CURRENT TOP BID</span>
                  <strong className="text-[#16532d]">
                    ₹{bidTargetAuction.currentHighestBidPerQtl || bidTargetAuction.basePricePerQtl}/q
                  </strong>
                </div>
              </div>

              {/* Price Input & Quick Increment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#191c1a] flex justify-between">
                  <span>Your Offered Price (₹ / Quintal)</span>
                  <span className="text-[#717970] font-normal">Min increment: ₹{bidTargetAuction.minIncrementPerQtl}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-[#404941]">₹</span>
                  <input
                    type="number"
                    value={bidPrice}
                    onChange={(e) => setBidPrice(Number(e.target.value))}
                    min={bidTargetAuction.currentHighestBidPerQtl + bidTargetAuction.minIncrementPerQtl}
                    step={5}
                    required
                    className="w-full pl-7 pr-3 py-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-[#191c1a] font-bold text-base outline-none focus:border-[#16532d]"
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {[20, 50, 100, 200].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setBidPrice((prev) => prev + inc)}
                      className="px-2.5 py-1 rounded-lg bg-[#f1f4ef] hover:bg-[#b2f1be] text-[#191c1a] text-xs font-bold cursor-pointer transition-colors border border-[#c0c9be]/30"
                    >
                      +{inc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Profit Calculation */}
              {(() => {
                const benchmark = CROP_BENCHMARKS[bidTargetAuction.cropType] || 2800;
                const handling = 45;
                const netMarginPerQtl = benchmark - bidPrice - handling;
                const totalCommitment = Math.round((bidTargetAuction.quantityKg / 100) * bidPrice);
                const totalNetMargin = Math.round((bidTargetAuction.quantityKg / 100) * netMarginPerQtl);

                return (
                  <div className="bg-[#e6e9e4] p-3 rounded-xl border border-[#c0c9be]/50 text-xs flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#404941]">Total Lot Purchase Cost:</span>
                      <strong className="text-[#191c1a]">₹{totalCommitment.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#404941]">Mandi Benchmark Realisation:</span>
                      <strong className="text-[#191c1a]">₹{benchmark}/qtl</strong>
                    </div>
                    <div className="flex justify-between border-t border-[#c0c9be]/40 pt-1">
                      <span className="font-bold text-[#191c1a]">Your Net Expected Profit:</span>
                      <strong className={totalNetMargin >= 0 ? 'text-[#16532d] font-bold' : 'text-[#ba1a1a] font-bold'}>
                        {totalNetMargin >= 0 ? '+' : ''}₹{totalNetMargin.toLocaleString('en-IN')} (₹{netMarginPerQtl}/qtl)
                      </strong>
                    </div>
                  </div>
                );
              })()}

              {/* Delivery Timeline */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191c1a]">Proposed Pickup Timeline</label>
                <select
                  value={bidDeliveryDate}
                  onChange={(e) => setBidDeliveryDate(e.target.value)}
                  className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none"
                >
                  <option value="Today Evening (Before 6 PM)">Today Evening (Before 6 PM)</option>
                  <option value="Tomorrow, 10:00 AM">Tomorrow Morning (10:00 AM)</option>
                  <option value="Within 48 Hours">Within 48 Hours</option>
                  <option value="Weekend Special Dispatch">Weekend Special Dispatch</option>
                </select>
              </div>

              {/* Pickup Option */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191c1a]">Logistics Arrangement</label>
                <select
                  value={bidPickupOption}
                  onChange={(e) => setBidPickupOption(e.target.value)}
                  className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none"
                >
                  <option value="Self Pickup (Trader arranges own truck)">Self Pickup (Trader arranges own truck)</option>
                  <option value="Farmer delivers to Mandi Yard">Farmer delivers to Mandi Yard</option>
                  <option value="Shared Cold-chain Vehicle">Shared Cold-chain Vehicle</option>
                </select>
              </div>

              {/* Payment Terms */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191c1a]">Payment Terms</label>
                <select
                  value={bidPaymentTerms}
                  onChange={(e) => setBidPaymentTerms(e.target.value)}
                  className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none"
                >
                  <option value="Instant DBT on digital weighment">Instant DBT on digital weighment (Recommended)</option>
                  <option value="24h Escrow via APMC Gateway">24h Escrow via APMC Gateway</option>
                  <option value="Direct UPI at Yard gate">Direct UPI at Yard gate</option>
                  <option value="50% Advance + 50% on delivery">50% Advance + 50% on delivery</option>
                </select>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191c1a]">Note to Farmer (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Digital scales onboard, quick turnaround"
                  value={bidNotes}
                  onChange={(e) => setBidNotes(e.target.value)}
                  className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBidModalOpen(false)}
                  className="flex-1 min-h-[42px] rounded-xl border border-[#c0c9be] text-[#404941] text-xs font-bold hover:bg-[#f1f4ef] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[42px] rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
                >
                  Submit Official Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE NEW AUCTION (FOR FARMER) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#c0c9be]/50 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#c0c9be]/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#16532d]" />
                <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
                  Start Live Crop Auction
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f4ef] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAuction} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191c1a]">Commodity Name</label>
                <input
                  type="text"
                  value={newAuctionCrop}
                  onChange={(e) => setNewAuctionCrop(e.target.value)}
                  required
                  className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Crop Type</label>
                  <select
                    value={newAuctionType}
                    onChange={(e) => setNewAuctionType(e.target.value as any)}
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none"
                  >
                    <option value="onion">Onion</option>
                    <option value="potato">Potato</option>
                    <option value="tomato">Tomato</option>
                    <option value="soybean">Soybean</option>
                    <option value="wheat">Wheat</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Quality Grade</label>
                  <select
                    value={newAuctionGrade}
                    onChange={(e) => setNewAuctionGrade(e.target.value as any)}
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none"
                  >
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Fair Average Quality (FAQ)">FAQ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Quantity (kg)</label>
                  <input
                    type="number"
                    value={newAuctionQty}
                    onChange={(e) => setNewAuctionQty(Number(e.target.value))}
                    min={100}
                    step={50}
                    required
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-bold outline-none"
                  />
                  <span className="text-[10px] text-[#717970]">{(newAuctionQty / 100).toFixed(1)} Quintals</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Base Price (₹/qtl)</label>
                  <input
                    type="number"
                    value={newAuctionBasePrice}
                    onChange={(e) => setNewAuctionBasePrice(Number(e.target.value))}
                    min={500}
                    step={25}
                    required
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-bold outline-none"
                  />
                  <span className="text-[10px] text-[#717970]">Reserve threshold</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Min Increment (₹)</label>
                  <select
                    value={newAuctionIncrement}
                    onChange={(e) => setNewAuctionIncrement(Number(e.target.value))}
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none"
                  >
                    <option value={20}>₹20 / qtl</option>
                    <option value={25}>₹25 / qtl</option>
                    <option value={50}>₹50 / qtl</option>
                    <option value={100}>₹100 / qtl</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1a]">Auction Window</label>
                  <select
                    value={newAuctionDuration}
                    onChange={(e) => setNewAuctionDuration(Number(e.target.value))}
                    className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none"
                  >
                    <option value={12}>12 Hours (Fast Spot)</option>
                    <option value={24}>24 Hours (Next Day)</option>
                    <option value={48}>48 Hours (Standard)</option>
                    <option value={72}>72 Hours</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191c1a]">Delivery Preference</label>
                <select
                  value={newAuctionDelivery}
                  onChange={(e) => setNewAuctionDelivery(e.target.value)}
                  className="w-full p-2 bg-[#f1f4ef] rounded-xl border border-[#c0c9be] text-xs font-medium outline-none"
                >
                  <option value="Ex-Farm Gate Pickup">Ex-Farm Gate Pickup (Trader collects)</option>
                  <option value="Nearest Mandi Yard Delivery">Farmer delivers to nearest APMC yard</option>
                  <option value="Processing Mill Gate">Processing Mill Gate</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 min-h-[42px] rounded-xl border border-[#c0c9be] text-[#404941] text-xs font-bold hover:bg-[#f1f4ef] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[42px] rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
                >
                  Publish Auction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM ACCEPT BID (FOR FARMER) */}
      {acceptingBid && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#c0c9be]/50 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#c0c9be]/40 pb-2.5">
              <CheckCircle2 className="w-6 h-6 text-[#16532d]" />
              <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
                Confirm &amp; Award Deal
              </h3>
            </div>

            <p className="text-xs text-[#404941] leading-relaxed">
              You are about to accept the quote from <strong>{acceptingBid.bid.bidderName}</strong> ({acceptingBid.bid.bidderOrg}). This will close the auction and book the transaction into your verified sales ledger.
            </p>

            <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#c0c9be]/40 text-xs flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-[#717970]">Crop:</span>
                <span className="font-bold text-[#191c1a]">{acceptingBid.auction.cropNameEn} ({acceptingBid.auction.quantityKg} kg)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Winning Rate:</span>
                <span className="font-bold text-[#16532d] text-sm">₹{acceptingBid.bid.offeredPricePerQtl.toLocaleString('en-IN')} / Qtl</span>
              </div>
              <div className="flex justify-between border-t border-[#c0c9be]/30 pt-1.5">
                <span className="font-bold text-[#191c1a]">Gross Farmer Payout:</span>
                <span className="font-metric-lg text-base font-bold text-[#16532d]">
                  ₹{acceptingBid.bid.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Payment Terms:</span>
                <span className="font-semibold text-[#191c1a] text-right">{acceptingBid.bid.paymentTerms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Logistics:</span>
                <span className="font-semibold text-[#191c1a] text-right">{acceptingBid.bid.pickupOption}</span>
              </div>
            </div>

            <div className="text-[11px] text-[#404941] bg-[#b2f1be]/30 p-2.5 rounded-lg border border-[#16532d]/20">
              🛡️ Payment secured under APMC Digital Escrow guarantee. Settlement released within 2 hours of digital weighment.
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAcceptingBid(null)}
                className="flex-1 min-h-[42px] rounded-xl border border-[#c0c9be] text-[#404941] text-xs font-bold hover:bg-[#f1f4ef] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAcceptBid}
                className="flex-1 min-h-[42px] rounded-xl bg-[#16532d] hover:bg-[#003b1b] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all"
              >
                Confirm &amp; Award Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
