import { FarmerLot, DecisionResult, SimDay, FactorItem } from '../types';

export function calculateSellingDecision(lot: FarmerLot): DecisionResult {
  const qtl = lot.quantityKg / 100;
  const spotRate = lot.localMandiBenchmark;
  const transportPerQtl = 90; // local mandi benchmark transport

  // Day 0 Net Realization
  const day0Gross = qtl * spotRate;
  const day0Transport = qtl * transportPerQtl;
  const day0Net = Math.round(day0Gross - day0Transport);

  // Generate day-by-day projections from Day 0 to Day 14
  const simDays: SimDay[] = [];
  const daysToSimulate = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  let bestDayIndex = 0;
  let maxNetRealization = -Infinity;

  for (const day of daysToSimulate) {
    let projectedRate = spotRate;
    let spoilageFraction = 0;
    let storageCostPerQtl = 0;

    if (lot.cropType === 'onion') {
      if (lot.storageAvailable) {
        // Price peak around day 4 due to Gujarat arrival delay (+₹140/q expected)
        if (day <= 4) {
          projectedRate = spotRate + day * 135;
        } else {
          projectedRate = spotRate + 4 * 135 - (day - 4) * 55;
        }
        // Low shrinkage in ventilated chawl: ~0.35% per day
        spoilageFraction = (day * 0.0035) * (lot.hasRainAlert ? 2.5 : 1);
        storageCostPerQtl = day * 3.5;
      } else {
        // No storage -> high spoilage in field
        projectedRate = spotRate + (day <= 2 ? day * 40 : -day * 60);
        spoilageFraction = day * 0.038;
        storageCostPerQtl = 0;
      }
    } else if (lot.cropType === 'tomato') {
      // Perishable: high decay, market gluts
      projectedRate = Math.max(800, spotRate - day * 65);
      spoilageFraction = Math.min(0.85, day * 0.085);
      storageCostPerQtl = 0;
    } else if (lot.cropType === 'potato') {
      // Moderate shelf life
      projectedRate = spotRate + (day <= 6 ? day * 30 : -day * 25);
      spoilageFraction = day * 0.008;
      storageCostPerQtl = day * 2.0;
    } else {
      projectedRate = spotRate + day * 25;
      spoilageFraction = day * 0.005;
      storageCostPerQtl = day * 2;
    }

    const effectiveWeightKg = lot.quantityKg * (1 - spoilageFraction);
    const effectiveQtl = effectiveWeightKg / 100;
    const grossVal = Math.round(effectiveQtl * projectedRate);
    const storageCost = Math.round(qtl * storageCostPerQtl);
    const transportCost = Math.round(effectiveQtl * transportPerQtl);
    const netRealization = Math.round(grossVal - storageCost - transportCost);

    let explanation = '';
    if (day === 0) {
      explanation = 'Immediate liquidity. However, you miss out if supply gap peaks later this week.';
    } else if (day === 4 && lot.cropType === 'onion' && lot.storageAvailable) {
      explanation = 'Supply gap hits peak due to delayed Gujarat arrivals. Beyond 4 days, on-farm shrinkage starts eroding your profit!';
    } else if (day > 4 && lot.cropType === 'onion') {
      explanation = 'Crop moisture weight drops and storage sorting costs begin eating your margin.';
    } else if (lot.cropType === 'tomato') {
      explanation = day === 0 ? 'Optimal dispatch. Heat and lack of cold chain degrade tomato skins fast.' : `Loss of ₹${Math.abs(day0Net - netRealization).toLocaleString()} due to rapid perishing.`;
    } else {
      explanation = `Projected rate ₹${projectedRate}/q. Effective net realization after factoring transport & storage.`;
    }

    simDays.push({
      day,
      label: `${day}d`,
      projectedRate,
      grossVal,
      spoilageLossKg: Math.round(lot.quantityKg * spoilageFraction),
      storageCost,
      transportCost,
      netRealization,
      explanation
    });

    if (netRealization > maxNetRealization) {
      maxNetRealization = netRealization;
      bestDayIndex = day;
    }
  }

  // Override logic based on Farmer Constraints
  let action: 'HOLD' | 'SELL_NOW' | 'JOIN_POOL' = 'HOLD';
  let holdDays = bestDayIndex;
  let confidence = 78;
  let headlineTitle = '';
  let headlineGain = '';
  let reasoning = '';
  let riskWarning = '';

  // Check 1: Small Lot Pooling Rule
  if (lot.quantityKg <= 250) {
    action = 'JOIN_POOL';
    holdDays = 0;
    confidence = 86;
    headlineTitle = 'JOIN POP-UP POOL';
    headlineGain = 'Unlock +₹1,960 Bulk Premium';
    reasoning = 'For small lots under 250 kg, high individual freight eats profit. Aggregating with village neighbors achieves bulk corporate processor rates.';
    riskWarning = 'Pool expires in 3 hours. Dispatch scheduled with Sahyadri Agro.';
  }
  // Check 2: Tomato / Perishable or Urgent Cash or No Storage
  else if (lot.cropType === 'tomato' || !lot.storageAvailable || lot.cashUrgency === 'urgent') {
    action = 'SELL_NOW';
    holdDays = 0;
    confidence = lot.cropType === 'tomato' ? 92 : 88;
    headlineTitle = 'SELL NOW';
    const avoidLoss = Math.max(1200, Math.round(day0Net - (simDays[3]?.netRealization || day0Net - 2100)));
    headlineGain = `Avoid ₹${avoidLoss.toLocaleString()} Spoilage & Decay Loss`;
    reasoning = !lot.storageAvailable 
      ? 'No protected on-farm storage available. Field exposure degrades skin quality rapidly.'
      : lot.cashUrgency === 'urgent'
      ? 'Immediate cash requirement for farm inputs overrides speculative future price margins.'
      : 'High ambient temperature & high perishability make holding economically disadvantageous.';
    riskWarning = 'Delaying sale past 24 hours causes sharp weight drop and discount rejections.';
  }
  // Check 3: Standard Hold Recommendation
  else {
    action = 'HOLD';
    holdDays = bestDayIndex > 0 ? bestDayIndex : 4;
    confidence = 78;
    headlineTitle = `HOLD ${holdDays} DAYS`;
    const gain = Math.max(2200, simDays[holdDays].netRealization - day0Net);
    headlineGain = `Earn up to ₹${gain.toLocaleString()} MORE`;
    reasoning = 'Regional pipeline restocking and delayed arrivals from neighboring districts create a 96-hour supply deficit.';
    riskWarning = 'Do not hold past Day 5 without specialized aeration, as sprout initiation penalties apply.';
  }

  // Mark best day in simDays
  const targetDay = action === 'HOLD' ? holdDays : 0;
  simDays.forEach((d) => {
    if (d.day === targetDay) {
      d.isPeak = true;
    }
  });

  const projectedNet = simDays[targetDay]?.netRealization ?? day0Net;
  const netGain = projectedNet - day0Net;

  const factors: FactorItem[] = [
    {
      id: 'trend',
      label: 'Price Trend',
      value: action === 'HOLD' ? '+₹140/q Expected' : action === 'JOIN_POOL' ? 'Bulk Buyers Active' : 'Downward / Gluts',
      status: action === 'HOLD' ? 'positive' : action === 'JOIN_POOL' ? 'positive' : 'negative',
      icon: 'trending_up',
      detail: action === 'HOLD' ? 'Lower arrivals in Lasalgaon & Pimpalgaon over next 3 days' : 'Arrival supply exceeds local mandi absorptive capacity'
    },
    {
      id: 'weather',
      label: 'Weather Forecast',
      value: lot.hasRainAlert ? 'Rain Alert ⛈️ (High Risk)' : 'Dry 5 Days (Good)',
      status: lot.hasRainAlert ? 'warning' : 'positive',
      icon: 'wb_sunny',
      detail: lot.hasRainAlert ? 'High moisture threatens fungal rot' : 'Low ambient humidity maintains bulb firmness'
    },
    {
      id: 'storage',
      label: 'Storage Viability',
      value: lot.storageAvailable ? 'Ventilated Chawl' : 'None (Field Side)',
      status: lot.storageAvailable ? 'positive' : 'negative',
      icon: 'warehouse',
      detail: lot.storageAvailable ? 'Adequate aeration restricts heat buildup' : 'High ambient temperature induces shrinkage'
    },
    {
      id: 'spoilage',
      label: 'Spoilage Risk',
      value: action === 'HOLD' ? 'Low (<1.5% loss)' : action === 'JOIN_POOL' ? 'Minimal (Aggregated)' : 'High (8% per day)',
      status: action === 'HOLD' ? 'positive' : action === 'JOIN_POOL' ? 'positive' : 'negative',
      icon: 'pest_control',
      detail: action === 'HOLD' ? 'Curing skin layer intact' : 'Rapid breakdown without cold storage'
    }
  ];

  return {
    action,
    holdDays,
    confidencePercent: confidence,
    headlineTitle,
    headlineGain,
    sellTodayNet: day0Net,
    projectedNet,
    netGain,
    factors,
    reasoningText: reasoning,
    riskWarning,
    formulaDetails: {
      spotPrice: spotRate,
      projectedPrice: simDays[targetDay]?.projectedRate || spotRate,
      transportCostPerQtl: transportPerQtl,
      spoilageLossPercent: (simDays[targetDay]?.spoilageLossKg || 0) / lot.quantityKg * 100,
      storageCostTotal: simDays[targetDay]?.storageCost || 0,
      expectedGainPerQtl: Math.round(netGain / qtl)
    },
    simDays
  };
}
