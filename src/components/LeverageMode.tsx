import React from 'react';
import { Scale, Gavel, Share2 } from 'lucide-react';
import { FarmerLot } from '../types';
import { Translations } from '../i18n';

interface LeverageModeProps {
  lot: FarmerLot;
  t: Translations;
  onOpenShareModal: () => void;
}

export const LeverageMode: React.FC<LeverageModeProps> = ({
  lot,
  t,
  onOpenShareModal
}) => {
  const benchmark = lot.localMandiBenchmark;
  const bandMin = benchmark - 50;
  const bandMax = benchmark + 150;
  const hardFloor = benchmark - 20;

  return (
    <section className="bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-3 border border-[#c0c9be]/40">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#fe932c] text-[#2f1500] flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4 text-[#2f1500]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-headline-sm text-[#191c1a] font-bold text-base">
              {t.leverageTitle}
            </h3>
            <p className="font-label-sm text-[#404941] text-xs">
              {t.leverageSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Negotiation Box */}
      <div className="bg-[#f1f4ef] rounded-xl p-3 flex flex-col gap-2.5 border border-[#c0c9be]/30">
        <div className="flex items-center justify-between border-b border-[#c0c9be]/30 pb-2 gap-2">
          <span className="font-body-sm text-[#404941] text-xs">
            {t.mandiBenchmark}
          </span>
          <span className="font-metric-lg text-[#191c1a] font-bold text-sm">
            ₹{benchmark.toLocaleString()} / qtl
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#c0c9be]/30 pb-2 gap-2">
          <span className="font-body-sm text-[#404941] text-xs">
            {t.fairFarmgateBand}
          </span>
          <span className="font-metric-lg text-[#003b1b] font-bold text-sm">
            ₹{bandMin.toLocaleString()} – ₹{bandMax.toLocaleString()}
          </span>
        </div>

        <div className="bg-[#ffdad6] text-[#93000a] rounded-lg p-2.5 flex items-center gap-2 border border-[#ba1a1a]/30">
          <Gavel className="w-4 h-4 text-[#ba1a1a] flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm font-bold uppercase tracking-wider text-[10px]">
              {t.hardFloorWarning}
            </span>
            <span className="font-body-sm font-bold text-xs">
              Do NOT accept below ₹{hardFloor.toLocaleString()} / quintal today
            </span>
          </div>
        </div>
      </div>

      {/* WhatsApp Price Card Share Action */}
      <button
        onClick={onOpenShareModal}
        id="shareWhatsAppBtn"
        className="min-h-[44px] rounded-lg bg-[#16532d] text-white font-label-md font-bold flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer hover:bg-[#003b1b] text-xs"
      >
        <Share2 className="w-4 h-4 flex-shrink-0" />
        <span>{t.shareWhatsApp}</span>
      </button>
    </section>
  );
};
