import React, { useState } from 'react';
import { Truck, ArrowRight } from 'lucide-react';
import { MandiItem, FarmerLot } from '../types';
import { Translations, SupportedLang } from '../i18n';

interface MarketComparisonProps {
  mandis: MandiItem[];
  lot: FarmerLot;
  t: Translations;
  currentLang: SupportedLang;
  onSelectMandiForDispatch: (mandi: MandiItem) => void;
}

export const MarketComparison: React.FC<MarketComparisonProps> = ({
  mandis,
  lot,
  t,
  currentLang,
  onSelectMandiForDispatch
}) => {
  const [vehicleType, setVehicleType] = useState<'tata_ace' | 'pickup' | 'tractor'>('pickup');

  // Rate multiplier based on vehicle
  const vehicleCostFactor = vehicleType === 'tata_ace' ? 0.9 : vehicleType === 'pickup' ? 1.0 : 1.25;
  const qtl = lot.quantityKg / 100;

  return (
    <section id="mandiCompareSection" className="bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-3 border border-[#c0c9be]/40">
      {/* Title */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="font-label-sm text-[#003b1b] font-bold uppercase tracking-wider text-[10px]">
            {t.whereToSell}
          </span>
          <h3 className="font-headline-sm text-[#191c1a] font-bold text-base">
            {t.bestNetRealization}
          </h3>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] flex-shrink-0">
          <Truck className="w-5 h-5 text-[#16532d]" />
        </div>
      </div>

      <p className="font-body-sm text-[#404941] text-xs leading-relaxed">
        {t.headlineWarning}
      </p>

      {/* Vehicle Type Selector (Interactive Sensitivity) */}
      <div className="bg-[#f1f4ef] rounded-lg p-2 flex items-center justify-between gap-1.5 flex-wrap border border-[#c0c9be]/30 text-xs">
        <span className="font-bold text-[#404941] flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-[#16532d]" />
          <span>Vehicle:</span>
        </span>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setVehicleType('tata_ace')}
            className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              vehicleType === 'tata_ace' ? 'bg-[#16532d] text-white shadow-xs' : 'bg-white text-[#404941] hover:bg-[#e0e3df]'
            }`}
          >
            Chhota Hathi
          </button>
          <button
            onClick={() => setVehicleType('pickup')}
            className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              vehicleType === 'pickup' ? 'bg-[#16532d] text-white shadow-xs' : 'bg-white text-[#404941] hover:bg-[#e0e3df]'
            }`}
          >
            Bolero Pickup
          </button>
          <button
            onClick={() => setVehicleType('tractor')}
            className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              vehicleType === 'tractor' ? 'bg-[#16532d] text-white shadow-xs' : 'bg-white text-[#404941] hover:bg-[#e0e3df]'
            }`}
          >
            Tractor
          </button>
        </div>
      </div>

      {/* Mandi Cards List */}
      <div className="flex flex-col gap-2.5">
        {mandis.map((mandi) => {
          const adjTransport = Math.round(mandi.transportCostPerQtl * vehicleCostFactor);
          const adjNet = mandi.grossPricePerQtl - adjTransport;
          const totalInPocket = Math.round(qtl * adjNet);

          return (
            <div
              key={mandi.id}
              className={`rounded-xl p-3 flex flex-col gap-2 transition-all border ${
                mandi.isRecommended
                  ? 'bg-[#f1f4ef] border-[#16532d]/40 shadow-xs'
                  : 'bg-white border-[#c0c9be]/40'
              }`}
            >
              {/* Header: Name, Distance, Net price */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-headline-sm text-[#191c1a] font-bold text-sm">
                      {currentLang === 'hi'
                        ? mandi.hindiName
                        : currentLang === 'mr'
                        ? mandi.marathiName
                        : mandi.name}
                    </span>
                    {mandi.isRecommended && (
                      <span className="px-2 py-0.5 rounded-full bg-[#16532d] text-white font-label-sm font-bold text-[10px]">
                        BEST RETURN
                      </span>
                    )}
                    {mandi.isTrap && (
                      <span className="px-2 py-0.5 rounded-full bg-[#e0e3df] text-[#ba1a1a] font-label-sm font-bold text-[10px]">
                        High Headline Trap
                      </span>
                    )}
                  </div>
                  <span className="font-label-sm text-[#404941] text-xs">
                    {mandi.distanceKm} km away • {mandi.travelTime} {mandi.route}
                  </span>
                </div>

                <div className="text-right flex-shrink-0">
                  <span
                    className={`font-metric-xl font-black text-lg ${
                      mandi.isRecommended ? 'text-[#003b1b]' : 'text-[#191c1a]'
                    }`}
                  >
                    ₹{adjNet.toLocaleString()}
                  </span>
                  <span
                    className={`block font-label-sm font-bold leading-none text-[10px] ${
                      mandi.isRecommended
                        ? 'text-[#003b1b]'
                        : mandi.isTrap
                        ? 'text-[#ba1a1a]'
                        : 'text-[#404941]'
                    }`}
                  >
                    {mandi.isTrap ? '(-₹100 less in hand!)' : 'Net / Qtl'}
                  </span>
                </div>
              </div>

              {/* Breakdown Bar */}
              <div className="bg-white rounded-lg p-2 flex items-center justify-between font-label-sm border border-[#c0c9be]/30 flex-wrap gap-1 text-xs">
                <span className="text-[#404941]">
                  Gross: <strong className={mandi.isTrap ? 'text-[#904d00]' : 'text-[#191c1a]'}>₹{mandi.grossPricePerQtl}/q</strong>
                </span>
                <span className="text-[#ba1a1a] font-bold">
                  Freight: -₹{adjTransport}/q
                </span>
                <span className="text-[#003b1b] font-bold">
                  Arrivals: {mandi.arrivalsTotalQtl.toLocaleString()}q ({mandi.arrivalTrend})
                </span>
              </div>

              {/* Total payout row & select button */}
              <div className="flex items-center justify-between pt-1 border-t border-[#c0c9be]/30 text-xs gap-2">
                <span className="text-[#404941] truncate">
                  In-hand cash ({lot.quantityKg}kg): <strong className="text-[#003b1b] font-metric-lg text-sm">₹{totalInPocket.toLocaleString()}</strong>
                </span>
                <button
                  onClick={() => onSelectMandiForDispatch(mandi)}
                  className="px-2.5 py-1 rounded-md bg-[#16532d] text-white font-bold hover:bg-[#003b1b] transition-colors cursor-pointer flex items-center gap-1 flex-shrink-0 text-xs"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
