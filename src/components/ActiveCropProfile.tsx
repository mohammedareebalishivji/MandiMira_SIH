import React from 'react';
import { ShieldCheck, Warehouse, AlertTriangle, Edit3 } from 'lucide-react';
import { FarmerLot } from '../types';
import { Translations, SupportedLang } from '../i18n';

interface ActiveCropProfileProps {
  lot: FarmerLot;
  t: Translations;
  currentLang: SupportedLang;
  onEditLot: () => void;
}

export const ActiveCropProfile: React.FC<ActiveCropProfileProps> = ({
  lot,
  t,
  currentLang,
  onEditLot
}) => {
  const cropEmoji =
    lot.cropType === 'onion' ? '🧅' : lot.cropType === 'tomato' ? '🍅' : '🥔';

  return (
    <section className="bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-3 border border-[#c0c9be]/40">
      {/* Greeting Row */}
      <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
        <div className="min-w-0 flex-1">
          <h1 className="font-headline-sm text-[#191c1a] font-bold tracking-tight text-base sm:text-lg">
            {t.greeting}
          </h1>
          <p className="font-body-sm text-[#404941] font-medium text-xs mt-0.5 truncate">
            {lot.farmerName} • {lot.location} ({lot.district})
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#ecefea] px-2 py-1 rounded-full border border-[#c0c9be]/40 flex-shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16532d]" />
          <span className="font-label-sm text-[#404941] text-[11px] font-medium">
            {t.geoVerified}
          </span>
        </div>
      </div>

      {/* Active Lot Card */}
      <div className="bg-[#f1f4ef] rounded-lg p-3 flex flex-col gap-2 border border-[#c0c9be]/30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-[#ffdcc3] flex items-center justify-center text-[#904d00] font-bold text-xl flex-shrink-0 shadow-2xs">
              {cropEmoji}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-label-md text-[#191c1a] font-bold truncate text-sm">
                {currentLang === 'en'
                  ? lot.cropNameEn
                  : `${lot.cropNameLocal} (${lot.cropNameEn})`}
              </h2>
              <p className="font-label-sm text-[#404941] truncate text-xs">
                Lot: {lot.id} • {lot.grade} • {lot.harvestDateDaysAgo === 0 ? 'Picked Today' : `Harvested ${lot.harvestDateDaysAgo}d ago`}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="font-metric-lg text-[#003b1b] font-bold text-base">
              {lot.quantityKg}{' '}
              <span className="font-label-sm text-[#404941] font-normal text-xs">kg</span>
            </span>
          </div>
        </div>

        {/* Storage & Rate Sub-grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-white rounded-md p-2 flex flex-col border border-[#c0c9be]/30 min-w-0">
            <span className="font-label-sm text-[#404941] truncate text-[11px]">{t.onFarmStorage}</span>
            <span className="font-body-sm font-bold flex items-center gap-1 mt-1 truncate text-[#003b1b] text-xs">
              {lot.storageAvailable ? (
                <Warehouse className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-[#ba1a1a] flex-shrink-0" />
              )}
              <span className="truncate">
                {lot.storageAvailable
                  ? lot.storageType === 'ventilated_chawl'
                    ? 'Kanda Chawl (Safe)'
                    : 'Shed Storage'
                  : 'No Storage'}
              </span>
            </span>
          </div>

          <div className="bg-white rounded-md p-2 flex flex-col border border-[#c0c9be]/30 min-w-0">
            <span className="font-label-sm text-[#404941] truncate text-[11px]">{t.todaysMandi}</span>
            <span className="font-metric-lg text-[#904d00] font-bold mt-1 text-sm truncate">
              ₹{lot.localMandiBenchmark.toLocaleString()}{' '}
              <span className="font-label-sm text-[#404941] font-normal text-[10px]">/ Qtl</span>
            </span>
          </div>
        </div>

        {/* Edit lot action */}
        <div className="flex justify-end pt-0.5">
          <button
            onClick={onEditLot}
            className="text-[11px] font-bold text-[#16532d] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Modify Lot Parameters</span>
          </button>
        </div>
      </div>
    </section>
  );
};
