import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  predictPrice,
  getModelTelemetry,
  getAllCommoditiesList,
  getAllStatesList,
  getAllMarketsList,
  getAllGradesList,
  getGeoHierarchy,
  getStatsForCommodity,
  resolveCommodityName
} from '../src/services/aiPricePredictor';
import { ALL_COMMODITIES } from '../src/data/aiPriceModel';

describe('AI Price Predictor Service', () => {
  it('should return valid model telemetry matching training metrics', () => {
    const telemetry = getModelTelemetry();
    assert.strictEqual(telemetry.rows, 192);
    assert.strictEqual(telemetry.commoditiesCount, 55);
    assert.strictEqual(telemetry.marketsCount, 35);
    assert.strictEqual(telemetry.statesCount, 10);
    assert.ok(telemetry.inSampleR2 > 0.8, 'In-sample R² should be > 0.8');
    assert.ok(telemetry.kFoldR2 > 0.4, '5-fold CV R² should be > 0.4');
    assert.ok(telemetry.kFoldMape < 50, '5-fold CV MAPE should be < 50%');
    assert.ok(telemetry.leaveOneOutMape < 50, 'LOOCV MAPE should be < 50%');
  });

  it('should provide full list of 55 trained commodities', () => {
    const commodities = getAllCommoditiesList();
    assert.strictEqual(commodities.length, 55);
    assert.ok(commodities.includes('Onion'));
    assert.ok(commodities.includes('Tomato'));
    assert.ok(commodities.includes('Potato'));
    assert.ok(commodities.includes('Banana'));
    assert.ok(commodities.includes('Apple'));
    assert.ok(commodities.includes('Rice'));
    assert.ok(commodities.includes('Paddy(Common)'));
    assert.ok(commodities.includes('Chili Red'));
    assert.ok(commodities.includes('Ginger(Green)'));
  });

  it('should resolve commodity aliases and case insensitivity', () => {
    assert.strictEqual(resolveCommodityName('onion'), 'Onion');
    assert.strictEqual(resolveCommodityName('tomato'), 'Tomato');
    assert.strictEqual(resolveCommodityName('potato'), 'Potato');
    assert.strictEqual(resolveCommodityName('banana'), 'Banana');
    assert.strictEqual(resolveCommodityName('apple'), 'Apple');
  });

  it('should predict valid price for Onion with floor <= modal <= ceiling', () => {
    const result = predictPrice({
      commodity: 'Onion',
      state: 'Punjab',
      grade: 'Grade A',
      quantityKg: 2500
    });

    assert.strictEqual(result.commodity, 'Onion');
    assert.strictEqual(result.state, 'Punjab');
    assert.strictEqual(result.grade, 'Grade A');
    assert.ok(result.predictedModalPrice > 0, 'Modal price must be positive');
    assert.ok(result.predictedMinPrice > 0, 'Min price must be positive');
    assert.ok(result.predictedMaxPrice > 0, 'Max price must be positive');
    
    // Negotiation corridor ordering
    assert.ok(
      result.negotiationCorridor.floorRate <= result.negotiationCorridor.fairRate,
      'Floor rate must be <= fair rate'
    );
    assert.ok(
      result.negotiationCorridor.fairRate <= result.negotiationCorridor.premiumRate,
      'Fair rate must be <= premium rate'
    );

    // Lot valuation check
    assert.strictEqual(
      result.totalLotValuation,
      Math.round((2500 / 100) * result.predictedModalPrice)
    );

    // Confidence
    assert.ok(result.confidenceScore >= 50 && result.confidenceScore <= 100);
    assert.ok(result.attributions.length >= 3, 'Must have at least 3 attribution factors');
  });

  it('should reflect geographic price levels (Kerala higher than Rajasthan)', () => {
    const keralaPred = predictPrice({
      commodity: 'Onion',
      state: 'Keralam',
      grade: 'FAQ'
    });

    const rajasthanPred = predictPrice({
      commodity: 'Onion',
      state: 'Rajasthan',
      grade: 'FAQ'
    });

    assert.ok(
      keralaPred.predictedModalPrice > rajasthanPred.predictedModalPrice,
      `Kerala price (${keralaPred.predictedModalPrice}) should be higher than Rajasthan (${rajasthanPred.predictedModalPrice}) based on learned state factor`
    );
  });

  it('should reflect high-value vs staple commodities accurately', () => {
    const gingerPred = predictPrice({ commodity: 'Ginger(Green)', state: 'Keralam' });
    const potatoPred = predictPrice({ commodity: 'Potato', state: 'Bihar' });

    assert.ok(
      gingerPred.predictedModalPrice > 10000,
      `Ginger should predict high value (>10,000), got ${gingerPred.predictedModalPrice}`
    );
    assert.ok(
      potatoPred.predictedModalPrice < 3000,
      `Potato should predict low/staple rate (<3,000), got ${potatoPred.predictedModalPrice}`
    );
  });

  it('should calculate cross-market arbitrage when multiple markets exist', () => {
    const result = predictPrice({
      commodity: 'Onion',
      state: 'Punjab'
    });

    assert.ok(result.arbitrage !== null, 'Onion must have arbitrage opportunities');
    if (result.arbitrage) {
      assert.ok(result.arbitrage.bestMarket.price >= result.arbitrage.worstMarket.price);
      assert.ok(result.arbitrage.maxSpread >= 0);
      assert.ok(result.arbitrage.otherMarkets.length > 0);
    }
  });

  it('should gracefully handle crops not in single-day quotes (e.g. soybean)', () => {
    const soyResult = predictPrice({
      commodity: 'Soyabean',
      state: 'Maharashtra',
      grade: 'Grade A'
    });

    assert.ok(soyResult.predictedModalPrice > 3500, 'Soybean should have calibrated base benchmark');
    assert.strictEqual(soyResult.isInterpolatedState, true);
    assert.ok(soyResult.confidenceScore < 80, 'Confidence should be lower for fallback commodity');
  });

  it('should return valid geographic hierarchy', () => {
    const geo = getGeoHierarchy();
    const states = getAllStatesList();
    assert.strictEqual(states.length, 10);
    
    for (const state of states) {
      const entry = geo[state as keyof typeof geo];
      assert.ok(entry, `State ${state} must exist in geoHierarchy`);
      assert.ok(entry.districts.length > 0, `State ${state} must have districts`);
      assert.ok(entry.markets.length > 0, `State ${state} must have markets`);
      assert.ok(entry.factor > 0, `State ${state} factor must be positive`);
    }
  });

  it('should return stats for existing commodity and null for unknown', () => {
    const onionStats = getStatsForCommodity('Onion');
    assert.ok(onionStats !== null);
    assert.strictEqual(onionStats?.commodity, 'Onion');
    assert.ok(onionStats!.quotes > 0);
    assert.ok(onionStats!.medianModal > 0);

    const unknownStats = getStatsForCommodity('DragonFruitX99');
    assert.strictEqual(unknownStats, null);
  });
});
