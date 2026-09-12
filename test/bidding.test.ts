import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { biddingService } from '../src/services/biddingService';

describe('Bidding & Auction System', () => {
  beforeEach(() => {
    biddingService.resetToDefaults();
  });

  it('should initialize with default active auctions and bids', () => {
    const auctions = biddingService.getAuctions();
    assert.ok(auctions.length >= 4);

    const onionAuc = auctions.find((a) => a.cropType === 'onion');
    assert.ok(onionAuc);
    assert.strictEqual(onionAuc.status, 'ACTIVE');
    assert.ok(onionAuc.bids.length > 0);
    assert.strictEqual(onionAuc.currentHighestBidPerQtl, 2880);
    assert.strictEqual(onionAuc.highestBidderName, 'Imran Shaikh');
  });

  it('should allow farmer to create a new crop auction', () => {
    const newAuction = biddingService.createAuction({
      lotId: 'lot-test-101',
      farmerId: 'farmer-9822041234',
      farmerName: 'Rameshwar Patil',
      farmerPhone: '9822041234',
      farmerLocation: 'Niphad, Nashik',
      farmerTrustScore: 82,
      cropNameEn: 'Nashik Red Onion (Export Grade)',
      cropType: 'onion',
      variety: 'Garwa',
      quantityKg: 5000,
      grade: 'Grade A',
      basePricePerQtl: 2900,
      minIncrementPerQtl: 50,
      durationHours: 24,
      deliveryPreference: 'Ex-Farm Gate Pickup'
    });

    assert.ok(newAuction.id);
    assert.strictEqual(newAuction.cropNameEn, 'Nashik Red Onion (Export Grade)');
    assert.strictEqual(newAuction.quantityKg, 5000);
    assert.strictEqual(newAuction.basePricePerQtl, 2900);
    assert.strictEqual(newAuction.minIncrementPerQtl, 50);
    assert.strictEqual(newAuction.status, 'ACTIVE');
    assert.strictEqual(newAuction.bids.length, 0);

    const fetched = biddingService.getAuction(newAuction.id);
    assert.ok(fetched);
    assert.strictEqual(fetched.id, newAuction.id);
  });

  it('should allow middleman to place a higher competitive bid', () => {
    const auctions = biddingService.getAuctions();
    const target = auctions.find((a) => a.id === 'auc-onion-01')!;
    const previousHighest = target.currentHighestBidPerQtl;
    const newOffer = previousHighest + 50; // 2880 + 50 = 2930

    const result = biddingService.placeBid('auc-onion-01', {
      bidderId: '9028033907',
      bidderName: 'Imran Shaikh',
      bidderRole: 'middleman',
      bidderOrg: 'Shaikh Trading Co.',
      bidderPhone: '9028033907',
      bidderTrustScore: 74,
      offeredPricePerQtl: newOffer,
      proposedDeliveryDate: 'Tomorrow 9:00 AM',
      paymentTerms: 'Instant DBT on weighment',
      pickupOption: 'Self Pickup',
      notes: 'Can lift full lot'
    });

    assert.strictEqual(result.success, true);
    assert.ok(result.bid);
    assert.strictEqual(result.bid.offeredPricePerQtl, newOffer);
    assert.strictEqual(result.bid.status, 'PENDING');

    const updatedAuction = biddingService.getAuction('auc-onion-01')!;
    assert.strictEqual(updatedAuction.currentHighestBidPerQtl, newOffer);
    assert.strictEqual(updatedAuction.highestBidderName, 'Imran Shaikh');
  });

  it('should reject bids below the minimum increment threshold', () => {
    const auctions = biddingService.getAuctions();
    const target = auctions.find((a) => a.id === 'auc-onion-01')!;
    const tooLowOffer = target.currentHighestBidPerQtl + 5; // increment is 25, so +5 should fail

    const result = biddingService.placeBid('auc-onion-01', {
      bidderId: '9999999999',
      bidderName: 'Test Trader',
      bidderRole: 'middleman',
      bidderOrg: 'Test Traders',
      bidderPhone: '9999999999',
      bidderTrustScore: 70,
      offeredPricePerQtl: tooLowOffer
    });

    assert.strictEqual(result.success, false);
    assert.ok(result.error?.includes('must be at least'));
  });

  it('should allow farmer to accept winning bid and create sales transaction', () => {
    const auctions = biddingService.getAuctions();
    const target = auctions.find((a) => a.id === 'auc-onion-01')!;
    const topBid = target.bids[0]; // Imran Shaikh @ 2880

    const acceptResult = biddingService.acceptBid(target.id, topBid.id);
    assert.strictEqual(acceptResult.success, true);
    assert.ok(acceptResult.winningBid);
    assert.strictEqual(acceptResult.winningBid.status, 'ACCEPTED');
    assert.strictEqual(acceptResult.auction?.status, 'AWARDED');
    assert.strictEqual(acceptResult.auction?.winningBidId, topBid.id);

    // Verify other bids are marked rejected
    const otherBids = acceptResult.auction.bids.filter((b) => b.id !== topBid.id);
    for (const b of otherBids) {
      assert.strictEqual(b.status, 'REJECTED');
    }

    // Verify generated sales ledger transaction
    assert.ok(acceptResult.transaction);
    assert.strictEqual(acceptResult.transaction.lotId, target.lotId);
    assert.strictEqual(acceptResult.transaction.ratePerQtl, topBid.offeredPricePerQtl);
    assert.strictEqual(
      acceptResult.transaction.grossAmount,
      Math.round((target.quantityKg / 100) * topBid.offeredPricePerQtl)
    );
    assert.strictEqual(acceptResult.transaction.status, 'Booked');
    assert.ok(acceptResult.transaction.bankRef.startsWith('DBT-APMC-'));
  });

  it('should find auctions by bidder for middleman tracking', () => {
    const imranBids = biddingService.getAuctionsForBidder('9028033907');
    assert.ok(imranBids.length >= 2); // Placed bids on onion and potato

    for (const item of imranBids) {
      assert.ok(item.auction.id);
      assert.strictEqual(item.myBid.bidderPhone, '9028033907');
    }
  });

  it('should find auctions by farmer for farmer dashboard', () => {
    const patilAuctions = biddingService.getAuctionsForFarmer('Rameshwar Patil');
    assert.ok(patilAuctions.length >= 1);
    assert.strictEqual(patilAuctions[0].cropType, 'onion');
  });
});
