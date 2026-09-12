import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Database,
  Sliders,
  Scale,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import {
  predictPrice,
  getAllCommoditiesList,
  getAllStatesList,
  getAllGradesList,
  getGeoHierarchy,
  getModelTelemetry,
  getStatsForCommodity,
  PricePredictionResult
} from '../services/aiPricePredictor';
import { FarmerLot } from '../types';

interface Props {
  lot?: FarmerLot;
  onApplyToLot?: (updatedBenchmark: number, cropName: string, grade: string) => void;
}

const POPULAR_CROPS = [
  'Onion',
  'Tomato',
  'Potato',
  'Banana',
  'Apple',
  'Brinjal',
  'Cauliflower',
  'Ginger(Green)',
  'Chili Red',
  'Paddy(Common)'
];

export const AIPricePredictor: React.FC<Props> = ({ lot, onApplyToLot }) => {
  const telemetry = useMemo(() => getModelTelemetry(), []);
  const allCommodities = useMemo(() => getAllCommoditiesList(), []);
  const allStates = useMemo(() => getAllStatesList(), []);
  const allGrades = useMemo(() => getAllGradesList(), []);
  const geoHierarchy = useMemo(() => getGeoHierarchy(), []);

  // Form State
  const initialCommodity = lot?.cropNameEn?.includes('Onion')
    ? 'Onion'
    : lot?.cropNameEn?.includes('Tomato')
    ? 'Tomato'
    : lot?.cropNameEn?.includes('Potato')
    ? 'Potato'
    : 'Onion';

  const [selectedCommodity, setSelectedCommodity] = useState<string>(initialCommodity);
  const [commoditySearch, setCommoditySearch] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>(allStates[0] || 'Maharashtra');
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade A');
  const [selectedVariety, setSelectedVariety] = useState<string>('');
  const [quantityKg, setQuantityKg] = useState<number>(lot?.quantityKg || 2500);

  const [activeTab, setActiveTab] = useState<'prediction' | 'attributions' | 'arbitrage' | 'quotes' | 'telemetry'>('prediction');
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  // Available markets in current selected state
  const availableMarkets = useMemo(() => {
    const geo = geoHierarchy[selectedState as keyof typeof geoHierarchy];
    return geo?.markets || [];
  }, [selectedState, geoHierarchy]);

  // Commodity stats and known varieties/grades
  const commodityStats = useMemo(() => getStatsForCommodity(selectedCommodity), [selectedCommodity]);

  const availableVarieties = useMemo(() => {
    return commodityStats?.varieties || ['Standard'];
  }, [commodityStats]);

  // Filtered commodities list
  const filteredCommodities = useMemo(() => {
    if (!commoditySearch.trim()) return allCommodities;
    const query = commoditySearch.toLowerCase();
    return allCommodities.filter((c) => c.toLowerCase().includes(query));
  }, [allCommodities, commoditySearch]);

  // Execute AI Inference in real-time
  const prediction: PricePredictionResult = useMemo(() => {
    return predictPrice({
      commodity: selectedCommodity,
      state: selectedState,
      market: selectedMarket || undefined,
      grade: selectedGrade,
      variety: selectedVariety || undefined,
      quantityKg
    });
  }, [selectedCommodity, selectedState, selectedMarket, selectedGrade, selectedVariety, quantityKg]);

  const handleApplyToLot = () => {
    if (onApplyToLot) {
      onApplyToLot(prediction.predictedModalPrice, selectedCommodity, selectedGrade);
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 3500);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header & Status Banner */}
      <div className="bg-gradient-to-br from-[#003b1b] via-[#0f4a25] to-[#002812] rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-radial from-emerald-500/10 to-transparent pointer-events-none rounded-full blur-2xl" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#b2f1be]/15 border border-[#b2f1be]/30 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-[#b2f1be]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-headline-sm">
                  MandiMitra AI Price Model
                </h2>
                <span className="bg-[#b2f1be] text-[#003b1b] text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  ML Trained
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#b2f1be]/90 mt-0.5">
                Trained on APMC mandi transactions (Data.csv) · Multi-target log-linear regression with empirical Bayes priors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/15 text-right">
              <div className="text-[10px] text-[#b2f1be] uppercase font-semibold">Model Accuracy</div>
              <div className="text-sm font-bold text-white font-mono">
                R² {telemetry.inSampleR2} · MAPE {telemetry.kFoldMape}%
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/15 text-right">
              <div className="text-[10px] text-[#b2f1be] uppercase font-semibold">Dataset Scale</div>
              <div className="text-sm font-bold text-white font-mono">
                {telemetry.rows} Quotes · {telemetry.commoditiesCount} Crops
              </div>
            </div>
          </div>
        </div>

        {/* Fast Crop Selector Chips */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#b2f1be]/80 font-medium">
            Quick Select Commodity ({allCommodities.length} total trained):
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {POPULAR_CROPS.map((crop) => (
              <button
                key={crop}
                onClick={() => {
                  setSelectedCommodity(crop);
                  setSelectedMarket('');
                  setSelectedVariety('');
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCommodity === crop
                    ? 'bg-[#b2f1be] text-[#003b1b] font-bold shadow-sm scale-105'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Controls on Left, AI Predictions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#c0c9be]/60 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#c0c9be]/40">
            <Sliders className="w-4 h-4 text-[#16532d]" />
            <h3 className="font-bold text-sm sm:text-base text-[#191c1a]">AI Input Parameters</h3>
          </div>

          {/* Commodity Dropdown / Search */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#404941] flex items-center justify-between">
              <span>Commodity / Crop ({allCommodities.length})</span>
              {commodityStats && (
                <span className="text-[11px] text-[#16532d] font-medium">
                  {commodityStats.quotes} quote{commodityStats.quotes !== 1 ? 's' : ''} in feed
                </span>
              )}
            </label>
            <div className="relative">
              <select
                value={selectedCommodity}
                onChange={(e) => {
                  setSelectedCommodity(e.target.value);
                  setSelectedMarket('');
                  setSelectedVariety('');
                }}
                className="w-full bg-[#f1f4ef] border border-[#c0c9be] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#191c1a] focus:ring-2 focus:ring-[#16532d] focus:outline-none cursor-pointer"
              >
                {filteredCommodities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {/* Quick search input to filter dropdown */}
            <div className="relative mt-0.5">
              <Search className="w-3.5 h-3.5 text-[#717970] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={commoditySearch}
                onChange={(e) => setCommoditySearch(e.target.value)}
                placeholder="Search 55 commodities (e.g., Rice, Chili, Mango)..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#f7faf5] border border-[#c0c9be]/50 rounded-lg text-xs text-[#191c1a] placeholder:text-[#717970] focus:outline-none focus:border-[#16532d]"
              />
            </div>
          </div>

          {/* State Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#404941]">State / Geography</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedMarket('');
              }}
              className="w-full bg-[#f1f4ef] border border-[#c0c9be] rounded-xl px-3 py-2.5 text-sm text-[#191c1a] focus:ring-2 focus:ring-[#16532d] focus:outline-none cursor-pointer"
            >
              {allStates.map((st) => (
                <option key={st} value={st}>
                  {st} {geoHierarchy[st as keyof typeof geoHierarchy]?.factor ? `(Index: ×${geoHierarchy[st as keyof typeof geoHierarchy].factor})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Market / APMC Mandi Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#404941] flex items-center justify-between">
              <span>Specific Mandi</span>
              <span className="text-[10.5px] text-[#717970]">
                {availableMarkets.length} in {selectedState}
              </span>
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full bg-[#f1f4ef] border border-[#c0c9be] rounded-xl px-3 py-2.5 text-sm text-[#191c1a] focus:ring-2 focus:ring-[#16532d] focus:outline-none cursor-pointer"
            >
              <option value="">State Average (General APMC)</option>
              {availableMarkets.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Quality Grade & Variety Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#404941]">Quality Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full bg-[#f1f4ef] border border-[#c0c9be] rounded-xl px-3 py-2.5 text-sm text-[#191c1a] focus:ring-2 focus:ring-[#16532d] focus:outline-none cursor-pointer"
              >
                {allGrades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#404941]">Cultivar / Variety</label>
              <select
                value={selectedVariety}
                onChange={(e) => setSelectedVariety(e.target.value)}
                className="w-full bg-[#f1f4ef] border border-[#c0c9be] rounded-xl px-3 py-2.5 text-sm text-[#191c1a] focus:ring-2 focus:ring-[#16532d] focus:outline-none cursor-pointer"
              >
                <option value="">Standard Cultivar</option>
                {availableVarieties.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Consignment Quantity Slider */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#c0c9be]/40">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#404941]">Lot Quantity</label>
              <span className="font-mono text-sm font-bold text-[#16532d]">
                {quantityKg.toLocaleString('en-IN')} kg ({Math.round(quantityKg / 100)} Qtl)
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="20000"
              step="100"
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              className="w-full accent-[#16532d] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#717970]">
              <span>200 kg (2 Qtl)</span>
              <span>10,000 kg (100 Qtl)</span>
              <span>20,000 kg (200 Qtl)</span>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              setSelectedCommodity('Onion');
              setSelectedState(allStates[0] || 'Maharashtra');
              setSelectedMarket('');
              setSelectedGrade('Grade A');
              setSelectedVariety('');
              setQuantityKg(2500);
            }}
            className="text-xs text-[#717970] hover:text-[#191c1a] flex items-center justify-center gap-1 mt-1 py-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset all inputs to default
          </button>
        </div>

        {/* Right Column: AI Predictions & Multi-Tab Analytics */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Hero Card */}
          <div className="bg-white rounded-3xl border border-[#c0c9be]/70 p-5 sm:p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#16532d] bg-[#d5f5dc] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  AI Predicted Clearing Rate
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#191c1a] mt-1">
                  {prediction.commodity} · {prediction.state}
                </h3>
                <span className="text-xs text-[#717970]">
                  Grade: {prediction.grade} · Market: {prediction.market} · Variety: {prediction.variety}
                </span>
              </div>

              {/* Confidence Score Pill */}
              <div
                className={`flex flex-col items-end px-3 py-1.5 rounded-xl border text-right ${
                  prediction.confidenceLevel === 'High'
                    ? 'bg-[#e8f5e9] border-[#81c784] text-[#1b5e20]'
                    : prediction.confidenceLevel === 'Moderate'
                    ? 'bg-[#fff8e1] border-[#ffe082] text-[#e65100]'
                    : 'bg-[#ffebee] border-[#ffcdd2] text-[#b71c1c]'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider">AI Confidence</span>
                <span className="text-base font-black font-mono">{prediction.confidenceScore}%</span>
              </div>
            </div>

            {/* Price Numbers Banner */}
            <div className="bg-gradient-to-br from-[#003b1b] to-[#124224] rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#88c695] font-semibold">
                  Predicted Modal Price
                </div>
                <div className="text-3xl sm:text-4xl font-black font-metric-xl tracking-tight text-white mt-0.5 flex items-baseline gap-1.5">
                  ₹{prediction.predictedModalPrice.toLocaleString('en-IN')}
                  <span className="text-base font-normal text-[#b2f1be]">/ Quintal</span>
                </div>
                <div className="text-xs text-[#b2f1be] font-mono mt-1">
                  ≈ ₹{prediction.pricePerKg}/kg · Range ₹{prediction.predictedMinPrice.toLocaleString('en-IN')} – ₹{prediction.predictedMaxPrice.toLocaleString('en-IN')}
                </div>
              </div>

              {prediction.totalLotValuation && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 w-full sm:w-auto text-left sm:text-right">
                  <div className="text-[10.5px] uppercase tracking-wider text-[#88c695] font-semibold">
                    Total Lot Value ({quantityKg.toLocaleString('en-IN')} kg)
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
                    ₹{prediction.totalLotValuation.toLocaleString('en-IN')}
                  </div>
                </div>
              )}
            </div>

            {/* Negotiation Corridor (Floor - Target - Premium) */}
            <div className="bg-[#f7faf5] rounded-2xl border border-[#c0c9be]/50 p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#191c1a] flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#16532d]" />
                  AI Negotiation Corridor ({prediction.negotiationCorridor.spreadPercent}% Spread)
                </span>
                <span className="text-[11px] text-[#717970]">
                  Based on observed within-market dispersion
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                {/* Floor */}
                <div className="bg-[#fff0ee] border border-[#ffcdd2] rounded-xl p-2.5 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a]">
                    Fair Floor (Min)
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-[#ba1a1a] mt-0.5">
                    ₹{prediction.negotiationCorridor.floorRate.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#ba1a1a]/80 mt-0.5">Do not sell below</span>
                </div>

                {/* Fair / Target */}
                <div className="bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl p-2.5 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16532d]">
                    Fair Clearing Rate
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-[#16532d] mt-0.5">
                    ₹{prediction.negotiationCorridor.fairRate.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#16532d]/80 mt-0.5">AI Modal Target</span>
                </div>

                {/* Premium */}
                <div className="bg-[#e3f2fd] border border-[#90caf9] rounded-xl p-2.5 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#002b7b]">
                    Premium Ceiling
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-[#002b7b] mt-0.5">
                    ₹{prediction.negotiationCorridor.premiumRate.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#002b7b]/80 mt-0.5">Direct buyer rate</span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex">
                <div className="bg-[#ba1a1a] w-1/3" />
                <div className="bg-[#16532d] w-1/3" />
                <div className="bg-[#002b7b] w-1/3" />
              </div>
            </div>

            {/* Adopt / Apply to Active Lot Action */}
            {onApplyToLot && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleApplyToLot}
                  className="px-4 py-2.5 rounded-xl bg-[#16532d] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#003b1b] active:scale-98 transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#b2f1be]" />
                  Adopt This AI Benchmark for My Active Lot
                </button>
                {appliedNotice && (
                  <span className="text-xs text-[#16532d] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#16532d]" /> Benchmark applied to active scenario!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#c0c9be]/60 pb-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'attributions', label: 'AI Explainability (Factors)' },
              { id: 'arbitrage', label: `Arbitrage Radar (${prediction.arbitrage?.otherMarkets.length || 0})` },
              { id: 'quotes', label: `Data.csv Quotes (${prediction.quotes.length})` },
              { id: 'telemetry', label: 'Model Metrics & Limits' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#16532d] text-white'
                    : 'text-[#404941] hover:bg-[#f1f4ef] hover:text-[#191c1a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content 1: AI Explainability (Factor Attributions) */}
          {activeTab === 'attributions' && (
            <div className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#191c1a] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#16532d]" />
                  How the AI Computed This Price
                </h4>
                <span className="text-[11px] text-[#717970]">Additive Log-Linear Decomposition</span>
              </div>

              <div className="flex flex-col gap-2">
                {prediction.attributions.map((attr, i) => (
                  <div
                    key={attr.name + i}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#c0c9be]/40 bg-[#f7faf5]"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#191c1a] truncate">{attr.name}</span>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.2 rounded-md bg-white border border-[#c0c9be]/60 text-[#404941]">
                          {attr.factor}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#717970] mt-0.5">{attr.description}</span>
                    </div>

                    <div className="flex flex-col items-end flex-shrink-0">
                      <span
                        className={`text-xs font-bold font-mono ${
                          attr.factor === 'baseline'
                            ? 'text-[#191c1a]'
                            : attr.impactRupees >= 0
                            ? 'text-[#16532d]'
                            : 'text-[#ba1a1a]'
                        }`}
                      >
                        {attr.factor === 'baseline' ? '' : attr.impactRupees >= 0 ? '+' : ''}
                        ₹{attr.impactRupees.toLocaleString('en-IN')}
                      </span>
                      {attr.multiplier !== 1.0 && (
                        <span className="text-[10px] text-[#717970] font-mono">
                          ×{attr.multiplier.toFixed(2)} ({attr.percentageImpact > 0 ? '+' : ''}
                          {attr.percentageImpact}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content 2: Cross-Market Arbitrage Radar */}
          {activeTab === 'arbitrage' && (
            <div className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#191c1a] flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-[#16532d]" />
                  Cross-Mandi Arbitrage Opportunities for {prediction.commodity}
                </h4>
                {prediction.arbitrage && (
                  <span className="text-xs font-bold text-[#16532d]">
                    Max Spread: ₹{prediction.arbitrage.maxSpread.toLocaleString('en-IN')}/Qtl ({prediction.arbitrage.spreadPercent}%)
                  </span>
                )}
              </div>

              {prediction.arbitrage ? (
                <div className="flex flex-col gap-2">
                  <div className="p-3 bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#16532d]">Highest Observed Rate</span>
                      <div className="text-sm font-bold text-[#191c1a]">{prediction.arbitrage.bestMarket.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black font-mono text-[#16532d]">
                        ₹{prediction.arbitrage.bestMarket.price.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-[#16532d]">Top Mandi Quote</span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#404941] mt-1">Other APMC Markets Trading This Crop:</span>
                  <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
                    {prediction.arbitrage.otherMarkets.map((m, idx) => (
                      <div
                        key={m.market + idx}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-[#c0c9be]/40 bg-[#f7faf5] text-xs"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#191c1a]">{m.market}</span>
                          <span className="text-[10.5px] text-[#717970]">{m.state} · {m.district}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold font-mono text-[#191c1a]">₹{m.modalPrice.toLocaleString('en-IN')}</span>
                          <span
                            className={`font-semibold text-[10.5px] ${
                              m.isHigher ? 'text-[#16532d]' : 'text-[#ba1a1a]'
                            }`}
                          >
                            {m.isHigher ? '+' : ''}₹{m.priceDiff.toLocaleString('en-IN')} ({m.percentageDiff > 0 ? '+' : ''}{m.percentageDiff}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-[#717970] bg-[#f1f4ef] rounded-xl">
                  Only one mandi recorded quotes for {prediction.commodity} in Data.csv. Cross-market arbitrage requires multiple quotes.
                </div>
              )}
            </div>
          )}

          {/* Tab Content 3: Data.csv Quotes Explorer */}
          {activeTab === 'quotes' && (
            <div className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#191c1a] flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#16532d]" />
                  Actual Training Quotes for {prediction.commodity} in Data.csv
                </h4>
                <span className="text-xs text-[#717970]">{prediction.quotes.length} record(s)</span>
              </div>

              {prediction.quotes.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                  {prediction.quotes.map((q, idx) => (
                    <div
                      key={q.market + idx}
                      className="p-2.5 rounded-xl border border-[#c0c9be]/50 bg-[#f7faf5] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[#191c1a] truncate">{q.market}</span>
                        <span className="text-[11px] text-[#717970]">
                          {q.state} ({q.district}) · Variety: {q.variety} · Grade: {q.grade}
                        </span>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0 font-mono">
                        <span className="font-bold text-[#16532d] text-sm">₹{q.modal.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-[#717970]">
                          ₹{q.min.toLocaleString('en-IN')} – ₹{q.max.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-[#717970] bg-[#f1f4ef] rounded-xl">
                  No direct quotes for {prediction.commodity} in the snapshot feed. AI prediction is using calibrated national benchmarks.
                </div>
              )}
            </div>
          )}

          {/* Tab Content 4: Model Telemetry & Transparency */}
          {activeTab === 'telemetry' && (
            <div className="bg-white rounded-2xl border border-[#c0c9be]/60 p-4 flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16532d]" />
                <h4 className="font-bold text-sm text-[#191c1a]">AI Model Architecture & Validation Audit</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                <div className="bg-[#f1f4ef] rounded-lg p-2">
                  <span className="text-[10px] text-[#717970] block">In-Sample R²</span>
                  <span className="font-bold font-mono text-sm text-[#191c1a]">{telemetry.inSampleR2}</span>
                </div>
                <div className="bg-[#f1f4ef] rounded-lg p-2">
                  <span className="text-[10px] text-[#717970] block">5-Fold CV MAPE</span>
                  <span className="font-bold font-mono text-sm text-[#191c1a]">{telemetry.kFoldMape}%</span>
                </div>
                <div className="bg-[#f1f4ef] rounded-lg p-2">
                  <span className="text-[10px] text-[#717970] block">LOOCV MAPE</span>
                  <span className="font-bold font-mono text-sm text-[#191c1a]">{telemetry.leaveOneOutMape}%</span>
                </div>
                <div className="bg-[#f1f4ef] rounded-lg p-2">
                  <span className="text-[10px] text-[#717970] block">CV Mean Error</span>
                  <span className="font-bold font-mono text-sm text-[#191c1a]">₹{telemetry.kFoldMae}/Qtl</span>
                </div>
              </div>

              <div className="bg-[#fff8e1] border border-[#ffe082] rounded-xl p-3 flex items-start gap-2 text-[#e65100]">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold">Dataset Transparency & Scope</span>
                  <p className="text-[11px] leading-relaxed text-[#795548]">
                    The training set contains 192 quotes across 55 commodities and 35 markets from a single arrival date ({telemetry.snapshotDate}). Because all quotes share one timestamp, this model predicts cross-sectional spatial and quality equilibrium, not temporal price movements. Use these figures as robust reference negotiation corridors.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
