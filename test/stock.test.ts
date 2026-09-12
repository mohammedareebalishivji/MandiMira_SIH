import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { stockService } from '../src/services/stockService';

describe('Stock Posting & Requesting System', () => {
  beforeEach(() => {
    stockService.resetToDefaults();
  });

  it('should initialize with default supply lots and buyer demands', () => {
    const supply = stockService.getSupplyLots();
    const demands = stockService.getBuyerDemands();

    assert.ok(supply.length >= 5);
    assert.ok(demands.length >= 2);

    const onionSupply = supply.find((s) => s.cropType === 'onion');
    assert.ok(onionSupply);
    assert.ok(onionSupply.quantityKg > 0);
  });

  it('should allow farmer to post available crop stock', () => {
    const newLot = stockService.addSupplyLot({
      sellerName: 'Rameshwar Patil',
      sellerRole: 'farmer',
      village: 'Niphad, Nashik',
      cropNameEn: 'Nashik Red Onion (Fresh Harvest)',
      cropType: 'onion',
      variety: 'Garwa',
      quantityKg: 4500,
      grade: 'Grade A',
      askPricePerQtl: 2950,
      harvestedDaysAgo: 1,
      storageType: 'Ventilated Chawl',
      contactPhone: '9822041234',
      notes: 'Cleaned and sorted 50mm+ bulbs ready for direct farm pickup.'
    });

    assert.ok(newLot.id);
    assert.strictEqual(newLot.sellerName, 'Rameshwar Patil');
    assert.strictEqual(newLot.cropNameEn, 'Nashik Red Onion (Fresh Harvest)');
    assert.strictEqual(newLot.quantityKg, 4500);
    assert.strictEqual(newLot.askPricePerQtl, 2950);
    assert.strictEqual(newLot.status, 'AVAILABLE');

    const supplyList = stockService.getSupplyLots();
    assert.strictEqual(supplyList[0].id, newLot.id);
  });

  it('should allow farmer to delete their stock listing', () => {
    const newLot = stockService.addSupplyLot({
      sellerName: 'Anita Wagh',
      sellerRole: 'farmer',
      village: 'Ozar, Nashik',
      cropNameEn: 'Tomato Vaishali',
      cropType: 'tomato',
      quantityKg: 2000,
      grade: 'Grade A',
      askPricePerQtl: 1800
    });

    assert.ok(stockService.getSupplyLots().some((s) => s.id === newLot.id));

    const deleted = stockService.deleteSupplyLot(newLot.id);
    assert.strictEqual(deleted, true);
    assert.ok(!stockService.getSupplyLots().some((s) => s.id === newLot.id));
  });

  it('should allow middleman to post a stock procurement request', () => {
    const newDemand = stockService.addBuyerDemand({
      buyerId: '9028033907',
      buyerName: 'Imran Shaikh',
      buyerRole: 'middleman',
      buyerOrg: 'Shaikh Trading Co.',
      buyerPhone: '9028033907',
      buyerType: 'Middleman / Trader',
      cropNameEn: 'Nashik Red Onion',
      cropType: 'onion',
      requiredQtl: 300,
      gradeRequired: 'Grade A',
      pricePerQtl: 3100,
      deliveryWindow: 'Next 3 days',
      deliveryLocation: 'Ex-Farm Pickup (Truck arranged by trader)',
      paymentTerms: 'Instant DBT on digital weighment',
      notes: 'Need 30 tonnes for Mumbai wholesale dispatch. Digital weighing on farm.'
    });

    assert.ok(newDemand.id);
    assert.strictEqual(newDemand.buyerName, 'Imran Shaikh');
    assert.strictEqual(newDemand.buyerType, 'Middleman / Trader');
    assert.strictEqual(newDemand.requiredQtl, 300);
    assert.strictEqual(newDemand.committedQtl, 0);
    assert.strictEqual(newDemand.status, 'open');

    const demands = stockService.getBuyerDemands();
    assert.strictEqual(demands[0].id, newDemand.id);
  });

  it('should allow farmer to fulfill middleman stock request with committed volume', () => {
    const demand = stockService.addBuyerDemand({
      buyerId: '9028033907',
      buyerName: 'Imran Shaikh',
      buyerRole: 'middleman',
      cropNameEn: 'Nashik Red Onion',
      cropType: 'onion',
      requiredQtl: 100,
      gradeRequired: 'Grade A',
      pricePerQtl: 3000,
      deliveryWindow: 'Tomorrow',
      deliveryLocation: 'Farm gate'
    });

    // First fulfillment of 40 Qtl
    const step1 = stockService.fulfillDemand(demand.id, 40, 'Rameshwar Patil');
    assert.strictEqual(step1.success, true);
    assert.strictEqual(step1.demand?.committedQtl, 40);
    assert.strictEqual(step1.demand?.status, 'partially_filled');

    // Second fulfillment of remaining 60 Qtl
    const step2 = stockService.fulfillDemand(demand.id, 60, 'Sopan Gaikwad');
    assert.strictEqual(step2.success, true);
    assert.strictEqual(step2.demand?.committedQtl, 100);
    assert.strictEqual(step2.demand?.status, 'closed');
  });

  it('should allow middleman to close or delete their stock request', () => {
    const demand = stockService.addBuyerDemand({
      buyerId: '9028033907',
      buyerName: 'Imran Shaikh',
      buyerRole: 'middleman',
      cropNameEn: 'Potato Jyoti',
      cropType: 'potato',
      requiredQtl: 150,
      gradeRequired: 'Grade B',
      pricePerQtl: 1600,
      deliveryWindow: 'Today',
      deliveryLocation: 'Pune Market Yard'
    });

    const deleted = stockService.deleteBuyerDemand(demand.id);
    assert.strictEqual(deleted, true);
    assert.ok(!stockService.getBuyerDemands().some((d) => d.id === demand.id));
  });
});
