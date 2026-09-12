import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  statsForCrop,
  cropBenchmark,
  cropBenchmarkInState,
  negotiationBand,
  stateIsCovered,
  COVERED_STATES,
  arbitrageForCrop,
  dispersionIsExtreme
} from '../src/data/priceModel';

describe('Statistical Price Reference Model', () => {
  it('should return benchmark for covered crops (onion, tomato, potato)', () => {
    const onionBenchmark = cropBenchmark('onion');
    assert.ok(onionBenchmark !== null);
    assert.ok(onionBenchmark > 0);

    const tomatoBenchmark = cropBenchmark('tomato');
    assert.ok(tomatoBenchmark !== null);
    assert.ok(tomatoBenchmark > 0);

    const potatoBenchmark = cropBenchmark('potato');
    assert.ok(potatoBenchmark !== null);
    assert.ok(potatoBenchmark > 0);
  });

  it('should return null benchmark for crops not in feed (soybean, wheat)', () => {
    assert.strictEqual(cropBenchmark('soybean'), null);
    assert.strictEqual(cropBenchmark('wheat'), null);
  });

  it('should adjust crop benchmark by state price factor', () => {
    const base = cropBenchmark('onion');
    const keralaRate = cropBenchmarkInState('onion', 'Keralam');
    const rajasthanRate = cropBenchmarkInState('onion', 'Rajasthan');

    assert.ok(base !== null);
    assert.ok(keralaRate !== null);
    assert.ok(rajasthanRate !== null);
    assert.ok(keralaRate! > rajasthanRate!);
  });

  it('should compute negotiation band with floor <= centre <= ceiling', () => {
    const band = negotiationBand('onion', 'Punjab');
    assert.ok(band !== null);
    if (band) {
      assert.ok(band.floor <= band.centre);
      assert.ok(band.centre <= band.ceiling);
      assert.ok(band.bandPercent > 0);
    }
  });

  it('should accurately report covered states', () => {
    assert.ok(COVERED_STATES.length >= 10);
    assert.strictEqual(stateIsCovered('Punjab'), true);
    assert.strictEqual(stateIsCovered('Keralam'), true);
    assert.strictEqual(stateIsCovered('Haryana'), true);
    assert.strictEqual(stateIsCovered('Atlantis'), false);
  });

  it('should compute arbitrage for crops with multiple quotes', () => {
    const arb = arbitrageForCrop('onion');
    assert.ok(arb !== null);
    if (arb) {
      assert.ok(arb.best.price >= arb.worst.price);
      assert.strictEqual(arb.spread, arb.best.price - arb.worst.price);
    }
  });
});
