import React, { useState } from 'react';
import { Share2, X, Check, Copy, Send } from 'lucide-react';
import { FarmerLot } from '../types';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: FarmerLot;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  lot
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const benchmark = lot.localMandiBenchmark;
  const bandMin = benchmark - 50;
  const bandMax = benchmark + 150;
  const hardFloor = benchmark - 20;

  const shareText = `🌾 *MANDIMITRA MARKET BENCHMARK & FLOOR*
👨‍🌾 Farmer: ${lot.farmerName} (${lot.location})
📦 Lot: ${lot.cropNameEn} (${lot.quantityKg} kg, ${lot.grade})
📊 Today's Mandi Spot: ₹${benchmark.toLocaleString()} / Quintal
⚖️ Fair Trader Farmgate Band: ₹${bandMin.toLocaleString()} – ₹${bandMax.toLocaleString()} / Quintal
🛑 *HARD NEGOTIATION FLOOR:* Do NOT accept below ₹${hardFloor.toLocaleString()} / Quintal today!
------------------------------------
🛡️ Verified with Agmarknet APMC arrivals & MandiMitra Decision Intelligence.`;

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
    }
  };

  const handleDirectWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    try {
      const win = window.open(url, '_blank');
      if (!win) {
        handleCopy();
      }
    } catch {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-xl border border-[#c0c9be]/50 flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c0c9be]/40 pb-2">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#25D366]" />
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
              WhatsApp Mandi Price Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#404941]">
          Send this verified benchmark card to local traders or village farmer groups to protect against price undercutting:
        </p>

        {/* WhatsApp Preview Bubble */}
        <div className="bg-[#EFEAE2] rounded-xl p-3 border border-[#c0c9be]/50 text-xs font-sans whitespace-pre-line text-[#111B21] leading-relaxed shadow-inner">
          {shareText}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCopy}
            className={`min-h-[44px] rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              copied
                ? 'bg-[#b2f1be] text-[#00210c] border border-[#16532d]'
                : 'bg-[#ecefea] text-[#191c1a] hover:bg-[#e0e3df]'
            }`}
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#16532d]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDirectWhatsApp}
            className="min-h-[44px] rounded-lg bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer hover:bg-[#1EBE5D]"
          >
            <Send className="w-4 h-4" />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
