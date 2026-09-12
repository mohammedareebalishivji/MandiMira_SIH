import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { api } from '../src/api';
import { initialScenarios, defaultMandis } from '../src/data/mockData';

describe('API Services', () => {
  const lot = initialScenarios[1];

  it('api.recommendations.get should return valid decision', async () => {
    const res = await api.recommendations.get(lot);
    assert.ok(['HOLD', 'SELL_NOW', 'JOIN_POOL'].includes(res.action));
    assert.ok(res.confidencePercent > 0);
    assert.ok(res.simDays.length === 15);
  });

  it('api.markets.list should return mandis with computed net realization', async () => {
    const mandis = await api.markets.list(lot);
    assert.ok(mandis.length > 0);
    for (const m of mandis) {
      assert.strictEqual(m.netRealizationPerQtl, m.grossPricePerQtl - m.transportCostPerQtl);
      assert.ok(m.distanceKm > 0);
    }
  });

  it('api.buyers.list should return buyer offers', async () => {
    const buyers = await api.buyers.list(lot);
    assert.ok(buyers.length > 0);
    for (const b of buyers) {
      assert.ok(b.buyerName);
      assert.ok(b.offerPricePerQtl > 0);
    }
  });

  it('api.buyers.acceptOffer should return booking confirmation', async () => {
    const booking = await api.buyers.acceptOffer('buyer-123', lot.id);
    assert.strictEqual(booking.success, true);
    assert.ok(booking.bookingId.startsWith('BK-'));
  });

  it('api.pools.getActive and join should update pool metrics', async () => {
    const pool = await api.pools.getActive();
    assert.ok(pool.id);
    assert.ok(pool.targetKg > 0);

    const initialKg = pool.currentKg;
    const initialContributors = pool.contributorsCount;
    const updated = await api.pools.join(pool.id, 500);

    assert.strictEqual(updated.currentKg, Math.min(pool.targetKg, initialKg + 500));
    assert.strictEqual(updated.contributorsCount, initialContributors + 1);
  });

  it('api.transactions.list should return initial or configured transactions', async () => {
    const txns = await api.transactions.list();
    assert.ok(txns.length > 0);
    for (const t of txns) {
      assert.ok(t.id);
      assert.ok(t.cropName);
      assert.ok(t.netPayout > 0);
    }
  });
});
