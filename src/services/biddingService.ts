import { CropAuction, CropBid, TransactionRecord, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'mandimitra_crop_auctions';

function getFutureDate(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

export const INITIAL_AUCTIONS: CropAuction[] = [
  {
    id: 'auc-onion-01',
    lotId: 'lot-patil-01',
    farmerId: 'farmer-9822041234',
    farmerName: 'Rameshwar Patil',
    farmerPhone: '9822041234',
    farmerLocation: 'Niphad, Nashik, MH',
    farmerTrustScore: 82,
    cropNameEn: 'Nashik Red Onion',
    cropType: 'onion',
    variety: 'Garwa / Late Kharif',
    quantityKg: 4000,
    grade: 'Grade A',
    basePricePerQtl: 2750,
    minIncrementPerQtl: 25,
    currentHighestBidPerQtl: 2880,
    highestBidderName: 'Imran Shaikh',
    highestBidderId: '9028033907',
    totalBidsCount: 3,
    type: 'FORWARD',
    deliveryPreference: 'Ex-Farm Gate Pickup',
    paymentTermsPreference: 'Same-day DBT on digital weighment',
    expiresAt: getFutureDate(42),
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    bids: [
      {
        id: 'bid-01',
        auctionId: 'auc-onion-01',
        bidderId: '9028033907',
        bidderName: 'Imran Shaikh',
        bidderRole: 'middleman',
        bidderOrg: 'Shaikh Trading Co. · APMC MH-NSK-4471',
        bidderPhone: '9028033907',
        bidderTrustScore: 74,
        offeredPricePerQtl: 2880,
        totalAmount: 115200,
        proposedDeliveryDate: 'Tomorrow, 10:00 AM',
        paymentTerms: 'Instant DBT on digital weighment (APMC Mandi Gateway)',
        pickupOption: 'Self Pickup (Trader arranges own 4-tonne truck)',
        notes: 'Ready for direct farm-gate loading. Certified digital scales onboard.',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'bid-02',
        auctionId: 'auc-onion-01',
        bidderId: '8080012466',
        bidderName: 'Priya Nair',
        bidderRole: 'buyer',
        bidderOrg: 'Sahyadri Foods Pvt Ltd · Procurement',
        bidderPhone: '8080012466',
        bidderTrustScore: 95,
        offeredPricePerQtl: 2830,
        totalAmount: 113200,
        proposedDeliveryDate: 'Within 48 hours',
        paymentTerms: 'Escrow Protected Bank DBT in 24h',
        pickupOption: 'Farmer Delivery to Mohadi Processing Unit',
        notes: 'Corporate processor lot specification Grade A standard.',
        status: 'OUTBID',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'bid-03',
        auctionId: 'auc-onion-01',
        bidderId: '9890123456',
        bidderName: 'Rajesh Agrawal',
        bidderRole: 'middleman',
        bidderOrg: 'Agrawal Agro Merchants',
        bidderPhone: '9890123456',
        bidderTrustScore: 68,
        offeredPricePerQtl: 2780,
        totalAmount: 111200,
        proposedDeliveryDate: 'Tomorrow afternoon',
        paymentTerms: 'NEFT Transfer within 4 hours',
        pickupOption: 'Self Pickup',
        notes: 'Can lift full lot together.',
        status: 'OUTBID',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ]
  },
  {
    id: 'auc-potato-02',
    lotId: 'lot-dhumal-02',
    farmerId: 'farmer-9422019922',
    farmerName: 'Suresh Dhumal',
    farmerPhone: '9422019922',
    farmerLocation: 'Khed, Pune, MH',
    farmerTrustScore: 78,
    cropNameEn: 'Pukhraj Potato',
    cropType: 'potato',
    variety: 'Table Potato (Fresh)',
    quantityKg: 6000,
    grade: 'Grade B',
    basePricePerQtl: 1350,
    minIncrementPerQtl: 20,
    currentHighestBidPerQtl: 1420,
    highestBidderName: 'Vikas Traders',
    highestBidderId: '9765432100',
    totalBidsCount: 2,
    type: 'SPOT',
    deliveryPreference: 'Nearest Mandi Yard Delivery',
    paymentTermsPreference: 'Immediate Mandi Slip settlement',
    expiresAt: getFutureDate(18),
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    bids: [
      {
        id: 'bid-04',
        auctionId: 'auc-potato-02',
        bidderId: '9765432100',
        bidderName: 'Vikas Traders',
        bidderRole: 'middleman',
        bidderOrg: 'Vikas Agri Sourcing · Pune Market Yard',
        bidderPhone: '9765432100',
        bidderTrustScore: 81,
        offeredPricePerQtl: 1420,
        totalAmount: 85200,
        proposedDeliveryDate: 'Today 6:00 PM',
        paymentTerms: 'Instant Cash / UPI at Yard weighbridge',
        pickupOption: 'Farmer delivery to Khed yard',
        notes: 'Good lot, ready to receive right away.',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: 'bid-05',
        auctionId: 'auc-potato-02',
        bidderId: '9028033907',
        bidderName: 'Imran Shaikh',
        bidderRole: 'middleman',
        bidderOrg: 'Shaikh Trading Co.',
        bidderPhone: '9028033907',
        bidderTrustScore: 74,
        offeredPricePerQtl: 1380,
        totalAmount: 82800,
        proposedDeliveryDate: 'Tomorrow Morning',
        paymentTerms: 'Same-day DBT on digital weighment',
        pickupOption: 'Self Pickup',
        status: 'OUTBID',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
      }
    ]
  },
  {
    id: 'auc-tomato-03',
    lotId: 'lot-wagh-03',
    farmerId: 'farmer-9922883344',
    farmerName: 'Anita Wagh',
    farmerPhone: '9922883344',
    farmerLocation: 'Ozar, Nashik, MH',
    farmerTrustScore: 85,
    cropNameEn: 'Hybrid Red Tomato',
    cropType: 'tomato',
    variety: 'Abhinav 1057',
    quantityKg: 2500,
    grade: 'Fair Average Quality (FAQ)',
    basePricePerQtl: 1700,
    minIncrementPerQtl: 20,
    currentHighestBidPerQtl: 1780,
    highestBidderName: 'Priya Nair',
    highestBidderId: '8080012466',
    totalBidsCount: 2,
    type: 'FORWARD',
    deliveryPreference: 'Ex-Farm Gate Pickup',
    paymentTermsPreference: 'UPI Instant Settlement',
    expiresAt: getFutureDate(30),
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    bids: [
      {
        id: 'bid-06',
        auctionId: 'auc-tomato-03',
        bidderId: '8080012466',
        bidderName: 'Priya Nair',
        bidderRole: 'buyer',
        bidderOrg: 'Sahyadri Foods Pvt Ltd',
        bidderPhone: '8080012466',
        bidderTrustScore: 95,
        offeredPricePerQtl: 1780,
        totalAmount: 44500,
        proposedDeliveryDate: 'Tomorrow 8:00 AM',
        paymentTerms: 'Direct Company DBT in 6 hours',
        pickupOption: 'Self Pickup with Crates',
        notes: 'Includes food-grade crates provided free for packaging.',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
      },
      {
        id: 'bid-07',
        auctionId: 'auc-tomato-03',
        bidderId: '9822334455',
        bidderName: 'Kailash Sonawane',
        bidderRole: 'middleman',
        bidderOrg: 'Sonawane Commission Agent',
        bidderPhone: '9822334455',
        bidderTrustScore: 72,
        offeredPricePerQtl: 1740,
        totalAmount: 43500,
        proposedDeliveryDate: 'Tomorrow Morning',
        paymentTerms: 'UPI on weighment',
        pickupOption: 'Self Pickup',
        status: 'OUTBID',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      }
    ]
  },
  {
    id: 'auc-soybean-04',
    lotId: 'lot-shinde-04',
    farmerId: 'farmer-9422556677',
    farmerName: 'Dinkar Shinde',
    farmerPhone: '9422556677',
    farmerLocation: 'Latur, MH',
    farmerTrustScore: 90,
    cropNameEn: 'Yellow Soybean',
    cropType: 'soybean',
    variety: 'JS-335',
    quantityKg: 5000,
    grade: 'Grade A',
    basePricePerQtl: 4500,
    minIncrementPerQtl: 50,
    currentHighestBidPerQtl: 4650,
    highestBidderName: 'Marathwada Oil Mills',
    highestBidderId: '9423112233',
    totalBidsCount: 1,
    type: 'FORWARD',
    deliveryPreference: 'Mill Gate Delivery',
    paymentTermsPreference: 'NEFT on Quality Check',
    expiresAt: getFutureDate(72),
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    bids: [
      {
        id: 'bid-08',
        auctionId: 'auc-soybean-04',
        bidderId: '9423112233',
        bidderName: 'Marathwada Oil Mills',
        bidderRole: 'buyer',
        bidderOrg: 'Marathwada Solvent Extractions',
        bidderPhone: '9423112233',
        bidderTrustScore: 89,
        offeredPricePerQtl: 4650,
        totalAmount: 232500,
        proposedDeliveryDate: 'Within 3 days',
        paymentTerms: 'Direct Mill DBT upon oil content test',
        pickupOption: 'Farmer Delivery to Latur MIDC',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
      }
    ]
  }
];

type Listener = (auctions: CropAuction[]) => void;

class BiddingService {
  private listeners: Set<Listener> = new Set();
  private auctions: CropAuction[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.auctions = JSON.parse(JSON.stringify(INITIAL_AUCTIONS));
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.auctions = JSON.parse(stored);
      } else {
        this.auctions = JSON.parse(JSON.stringify(INITIAL_AUCTIONS));
        this.persist();
      }
    } catch {
      this.auctions = JSON.parse(JSON.stringify(INITIAL_AUCTIONS));
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.auctions));
      } catch (e) {
        console.warn('[BiddingService] Failed to write to localStorage', e);
      }
    }
    this.notify();
  }

  private notify() {
    const copy = this.getAuctions();
    this.listeners.forEach((fn) => {
      try {
        fn(copy);
      } catch (e) {
        console.error('[BiddingService] Listener error', e);
      }
    });
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getAuctions());
    return () => {
      this.listeners.delete(listener);
    };
  }

  getAuctions(): CropAuction[] {
    return JSON.parse(JSON.stringify(this.auctions));
  }

  getAuction(id: string): CropAuction | undefined {
    const match = this.auctions.find((a) => a.id === id);
    return match ? JSON.parse(JSON.stringify(match)) : undefined;
  }

  getAuctionsForFarmer(farmerPhoneOrName: string): CropAuction[] {
    const q = farmerPhoneOrName.trim().toLowerCase();
    return this.getAuctions().filter(
      (a) => a.farmerPhone.toLowerCase().includes(q) || a.farmerName.toLowerCase().includes(q)
    );
  }

  getAuctionsForBidder(bidderIdOrPhone: string): { auction: CropAuction; myBid: CropBid }[] {
    const q = bidderIdOrPhone.trim().toLowerCase();
    const results: { auction: CropAuction; myBid: CropBid }[] = [];
    for (const a of this.getAuctions()) {
      const myBid = a.bids.find(
        (b) => b.bidderId.toLowerCase() === q || b.bidderPhone.toLowerCase() === q
      );
      if (myBid) {
        results.push({ auction: a, myBid });
      }
    }
    return results;
  }

  createAuction(params: {
    lotId?: string;
    farmerId: string;
    farmerName: string;
    farmerPhone: string;
    farmerLocation: string;
    farmerTrustScore: number;
    cropNameEn: string;
    cropType: CropAuction['cropType'];
    variety: string;
    quantityKg: number;
    grade: CropAuction['grade'];
    basePricePerQtl: number;
    minIncrementPerQtl?: number;
    type?: CropAuction['type'];
    deliveryPreference?: string;
    paymentTermsPreference?: string;
    durationHours?: number;
  }): CropAuction {
    const id = `auc-${Date.now().toString().slice(-6)}`;
    const newAuction: CropAuction = {
      id,
      lotId: params.lotId || `lot-${Date.now().toString().slice(-6)}`,
      farmerId: params.farmerId,
      farmerName: params.farmerName,
      farmerPhone: params.farmerPhone,
      farmerLocation: params.farmerLocation,
      farmerTrustScore: params.farmerTrustScore,
      cropNameEn: params.cropNameEn,
      cropType: params.cropType,
      variety: params.variety,
      quantityKg: params.quantityKg,
      grade: params.grade,
      basePricePerQtl: Math.round(params.basePricePerQtl),
      minIncrementPerQtl: params.minIncrementPerQtl || 25,
      currentHighestBidPerQtl: 0,
      totalBidsCount: 0,
      type: params.type || 'FORWARD',
      deliveryPreference: params.deliveryPreference || 'Ex-Farm Gate Pickup',
      paymentTermsPreference: params.paymentTermsPreference || 'Same-day DBT on weighment',
      expiresAt: getFutureDate(params.durationHours || 48),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      bids: []
    };

    this.auctions.unshift(newAuction);
    this.persist();

    // Async sync to Supabase if configured
    if (isSupabaseConfigured) {
      supabase
        .from('auctions')
        .insert({
          id,
          farmer_id: params.farmerId,
          commodity: params.cropNameEn,
          quantity_quintals: Math.round(params.quantityKg / 100),
          base_price: params.basePricePerQtl,
          type: newAuction.type,
          expiry_date: newAuction.expiresAt,
          status: 'ACTIVE'
        })
        .then(
          ({ error }) => {
            if (error) console.warn('[Supabase] create auction error:', error.message);
          },
          () => {}
        );
    }

    return newAuction;
  }

  placeBid(
    auctionId: string,
    bidInput: {
      bidderId: string;
      bidderName: string;
      bidderRole: UserRole;
      bidderOrg: string;
      bidderPhone: string;
      bidderTrustScore: number;
      offeredPricePerQtl: number;
      proposedDeliveryDate?: string;
      paymentTerms?: string;
      pickupOption?: string;
      notes?: string;
    }
  ): { success: boolean; error?: string; bid?: CropBid; auction?: CropAuction } {
    const auction = this.auctions.find((a) => a.id === auctionId);
    if (!auction) {
      return { success: false, error: 'Auction not found' };
    }
    if (auction.status !== 'ACTIVE') {
      return { success: false, error: `Auction is ${auction.status.toLowerCase()} and cannot accept bids.` };
    }

    const offeredPrice = Math.round(bidInput.offeredPricePerQtl);
    const minAcceptable = auction.currentHighestBidPerQtl > 0
      ? auction.currentHighestBidPerQtl + auction.minIncrementPerQtl
      : auction.basePricePerQtl;

    if (offeredPrice < minAcceptable) {
      return {
        success: false,
        error: `Bid must be at least ₹${minAcceptable.toLocaleString('en-IN')}/Qtl (Minimum increment is ₹${auction.minIncrementPerQtl}/Qtl).`
      };
    }

    const qtl = auction.quantityKg / 100;
    const totalAmount = Math.round(qtl * offeredPrice);

    // Update existing bid from same bidder or create new
    const bidId = `bid-${Date.now().toString().slice(-6)}`;
    const newBid: CropBid = {
      id: bidId,
      auctionId,
      bidderId: bidInput.bidderId,
      bidderName: bidInput.bidderName,
      bidderRole: bidInput.bidderRole,
      bidderOrg: bidInput.bidderOrg,
      bidderPhone: bidInput.bidderPhone,
      bidderTrustScore: bidInput.bidderTrustScore,
      offeredPricePerQtl: offeredPrice,
      totalAmount,
      proposedDeliveryDate: bidInput.proposedDeliveryDate || 'Tomorrow morning',
      paymentTerms: bidInput.paymentTerms || 'Same-day DBT on digital weighment',
      pickupOption: bidInput.pickupOption || 'Self Pickup (Trader arranges truck)',
      notes: bidInput.notes || '',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Mark previous pending bids as OUTBID
    auction.bids.forEach((b) => {
      if (b.status === 'PENDING') {
        b.status = 'OUTBID';
      }
    });

    // Check if this bidder already had a bid; if so, replace or append
    const existingIndex = auction.bids.findIndex(
      (b) => b.bidderId === bidInput.bidderId || b.bidderPhone === bidInput.bidderPhone
    );
    if (existingIndex >= 0) {
      auction.bids.splice(existingIndex, 1);
    }
    auction.bids.unshift(newBid);

    auction.currentHighestBidPerQtl = offeredPrice;
    auction.highestBidderName = bidInput.bidderName;
    auction.highestBidderId = bidInput.bidderId;
    auction.totalBidsCount = auction.bids.length;

    this.persist();

    // Async sync to Supabase if configured
    if (isSupabaseConfigured) {
      supabase
        .from('bids')
        .insert({
          id: bidId,
          auction_id: auctionId,
          bidder_id: bidInput.bidderId,
          offered_price: offeredPrice,
          quality_grade: auction.grade,
          status: 'PENDING'
        })
        .then(
          ({ error }) => {
            if (error) console.warn('[Supabase] place bid error:', error.message);
          },
          () => {}
        );
    }

    return { success: true, bid: newBid, auction: JSON.parse(JSON.stringify(auction)) };
  }

  acceptBid(
    auctionId: string,
    bidId: string
  ): {
    success: boolean;
    error?: string;
    auction?: CropAuction;
    winningBid?: CropBid;
    transaction?: TransactionRecord;
  } {
    const auction = this.auctions.find((a) => a.id === auctionId);
    if (!auction) {
      return { success: false, error: 'Auction not found' };
    }
    if (auction.status !== 'ACTIVE') {
      return { success: false, error: 'Auction is not active' };
    }

    const winningBid = auction.bids.find((b) => b.id === bidId);
    if (!winningBid) {
      return { success: false, error: 'Bid not found' };
    }

    // Award auction
    auction.status = 'AWARDED';
    auction.winningBidId = bidId;

    auction.bids.forEach((b) => {
      if (b.id === bidId) {
        b.status = 'ACCEPTED';
      } else {
        b.status = 'REJECTED';
      }
    });

    // Generate Ledger Transaction Record
    const qtl = auction.quantityKg / 100;
    const grossAmount = Math.round(qtl * winningBid.offeredPricePerQtl);
    const transaction: TransactionRecord = {
      id: `TXN-AUC-${Date.now().toString().slice(-6)}`,
      lotId: auction.lotId,
      cropName: auction.cropNameEn,
      quantityKg: auction.quantityKg,
      ratePerQtl: winningBid.offeredPricePerQtl,
      grossAmount,
      netPayout: grossAmount,
      buyerName: `${winningBid.bidderName} (${winningBid.bidderOrg || 'Trader'})`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Booked',
      bankRef: `DBT-APMC-${Math.floor(100000 + Math.random() * 900000)}`,
      mode: 'APMC Digital Escrow & DBT'
    };

    this.persist();

    return {
      success: true,
      auction: JSON.parse(JSON.stringify(auction)),
      winningBid: JSON.parse(JSON.stringify(winningBid)),
      transaction
    };
  }

  rejectBid(auctionId: string, bidId: string): { success: boolean; error?: string } {
    const auction = this.auctions.find((a) => a.id === auctionId);
    if (!auction) return { success: false, error: 'Auction not found' };
    const bid = auction.bids.find((b) => b.id === bidId);
    if (!bid) return { success: false, error: 'Bid not found' };

    bid.status = 'REJECTED';

    // Recalculate highest pending bid
    const remainingPending = auction.bids.filter((b) => b.status === 'PENDING' || b.status === 'OUTBID');
    if (remainingPending.length > 0) {
      remainingPending.sort((a, b) => b.offeredPricePerQtl - a.offeredPricePerQtl);
      remainingPending[0].status = 'PENDING';
      auction.currentHighestBidPerQtl = remainingPending[0].offeredPricePerQtl;
      auction.highestBidderName = remainingPending[0].bidderName;
      auction.highestBidderId = remainingPending[0].bidderId;
    } else {
      auction.currentHighestBidPerQtl = 0;
      auction.highestBidderName = undefined;
      auction.highestBidderId = undefined;
    }

    this.persist();
    return { success: true };
  }

  cancelAuction(auctionId: string): { success: boolean; error?: string } {
    const auction = this.auctions.find((a) => a.id === auctionId);
    if (!auction) return { success: false, error: 'Auction not found' };

    auction.status = 'CANCELLED';
    auction.bids.forEach((b) => {
      b.status = 'REJECTED';
    });

    this.persist();
    return { success: true };
  }

  resetToDefaults() {
    this.auctions = JSON.parse(JSON.stringify(INITIAL_AUCTIONS));
    this.persist();
  }
}

export const biddingService = new BiddingService();
