import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSellingDecision } from '../src/services/decisionEngine';
import { FarmerLot } from '../src/types';
import { initialScenarios } from '../src/data/mockData';

describe('Decision Engine — Selling Logic', () => {
  it('should recommend HOLD for Onion with ventilated storage and no rain alert', () => {
    const lot: FarmerLot = {
      id: 'test-onion',
      farmerName: 'Ramesh Patil',
      location: 'Niphad',
      district: 'Nashik, Maharashtra',
      cropNameEn: 'Nashik Red Onion',
      cropNameLocal: 'नाशिक लाल कांदा',
      cropType: 'onion',
      variety: 'Garwa',
      quantityKg: 3500,
      grade: 'Grade A',
      harvestDateDaysAgo: 2,
      storageType: 'ventilated_chawl',
      storageAvailable: true,
      hasRainAlert: false,
      cashUrgency: 'can_wait',
      localMandiBenchmark: 3100
    };

    const decision = calculateSellingDecision(lot);
    assert.strictEqual(decision.action, 'HOLD');
    assert.ok(decision.holdDays >= 3 && decision.holdDays <= 5, 'Should hold for ~4 days for price peak');
    assert.ok(decision.netGain > 0, 'Projected net gain must be positive');
    assert.ok(decision.projectedNet > decision.sellTodayNet, 'Projected net must exceed sell today net');
    assert.strictEqual(decision.simDays.length, 15, 'Should simulate 15 days (0 to 14)');
  });

  it('should recommend SELL_NOW for perishable Tomato', () => {
    const tomatoLot: FarmerLot = {
      id: 'test-tomato',
      farmerName: 'Sunita Shinde',
      location: 'Ozar',
      district: 'Nashik, Maharashtra',
      cropNameEn: 'Tomato Vaishali',
      cropNameLocal: 'टोमॅटो वैशाली',
      cropType: 'tomato',
      variety: 'Vaishali',
      quantityKg: 2000,
      grade: 'Grade A',
      harvestDateDaysAgo: 1,
      storageType: 'traditional_shed',
      storageAvailable: false,
      hasRainAlert: false,
      cashUrgency: 'can_wait',
      localMandiBenchmark: 1800
    };

    const decision = calculateSellingDecision(tomatoLot);
    assert.strictEqual(decision.action, 'SELL_NOW');
    assert.strictEqual(decision.holdDays, 0);
  });

  it('should recommend SELL_NOW if cash urgency is urgent regardless of storage', () => {
    const urgentLot: FarmerLot = {
      id: 'test-urgent',
      farmerName: 'Ganesh Shinde',
      location: 'Yeola',
      district: 'Nashik, Maharashtra',
      cropNameEn: 'Nashik Red Onion',
      cropNameLocal: 'नाशिक लाल कांदा',
      cropType: 'onion',
      variety: 'Garwa',
      quantityKg: 3000,
      grade: 'Grade A',
      harvestDateDaysAgo: 1,
      storageType: 'ventilated_chawl',
      storageAvailable: true,
      hasRainAlert: false,
      cashUrgency: 'urgent',
      localMandiBenchmark: 3100
    };

    const decision = calculateSellingDecision(urgentLot);
    assert.strictEqual(decision.action, 'SELL_NOW');
    assert.strictEqual(decision.holdDays, 0);
  });

  it('should recommend SELL_NOW or immediate dispatch when rain alert is active on field', () => {
    const rainLot: FarmerLot = {
      id: 'test-rain',
      farmerName: 'Kishor Rao',
      location: 'Dindori',
      district: 'Nashik, Maharashtra',
      cropNameEn: 'Nashik Red Onion',
      cropNameLocal: 'नाशिक लाल कांदा',
      cropType: 'onion',
      variety: 'Garwa',
      quantityKg: 3000,
      grade: 'Grade B',
      harvestDateDaysAgo: 2,
      storageType: 'field_open',
      storageAvailable: false,
      hasRainAlert: true,
      cashUrgency: 'moderate',
      localMandiBenchmark: 2800
    };

    const decision = calculateSellingDecision(rainLot);
    assert.strictEqual(decision.action, 'SELL_NOW');
  });

  it('should calculate decisions for all preset demo scenarios without errors', () => {
    for (const [scenarioKey, lot] of Object.entries(initialScenarios)) {
      const decision = calculateSellingDecision(lot);
      assert.ok(['HOLD', 'SELL_NOW', 'JOIN_POOL'].includes(decision.action));
      assert.ok(decision.confidencePercent >= 50 && decision.confidencePercent <= 100);
      assert.ok(decision.simDays.length === 15);
      assert.ok(decision.factors.length > 0);
      assert.ok(decision.reasoningText.length > 0);
    }
  });
});
