import React, { useState } from 'react';
import { Truck, X, CheckCheck, Landmark, Loader2, ShieldCheck, Receipt } from 'lucide-react';
import { BuyerOffer, FarmerLot, PopUpPool, TransactionRecord } from '../types';

interface LogisticsAndSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyer: BuyerOffer | null;
  pool: PopUpPool | null;
  lot: FarmerLot;
  onCompleteSale: (newTxn: TransactionRecord) => void;
}

export const LogisticsAndSettlementModal: React.FC<LogisticsAndSettlementModalProps> = ({
  isOpen,
  onClose,
  buyer,
  pool,
  lot,
  onCompleteSale
}) => {
  const [stage, setStage] = useState<'confirm' | 'logistics' | 'payment'>('confirm');
  const [weighingDone, setWeighingDone] = useState(false);

  if (!isOpen) return null;

  const targetName = buyer ? buyer.buyerName : pool ? pool.buyerName : 'Selected Mandi Logistics';
  const effectiveRate = buyer
    ? buyer.offerPricePerQtl
    : pool
    ? lot.localMandiBenchmark + pool.bulkPremiumPerQtl
    : lot.localMandiBenchmark;

  const qtl = lot.quantityKg / 100;
  const grossAmount = Math.round(qtl * effectiveRate);
  const netPayout = grossAmount;

  const handleSimulateLogistics = () => {
    setStage('logistics');
    setTimeout(() => {
      setWeighingDone(true);
    }, 1800);
  };

  const handleFinishAndSettle = () => {
    const newTxn: TransactionRecord = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      lotId: lot.id,
      cropName: `${lot.cropNameEn} (${lot.variety})`,
      quantityKg: lot.quantityKg,
      ratePerQtl: effectiveRate,
      grossAmount,
      netPayout,
      buyerName: targetName,
      date: 'Today (Live Dispatch)',
      status: 'DBT Settled',
      bankRef: `MAHB000${Math.floor(1000 + Math.random() * 9000)}`,
      mode: 'Same-Day DBT Immediate'
    };

    onCompleteSale(newTxn);
    setStage('payment');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-xl border border-[#c0c9be]/50 flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c0c9be]/40 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Truck className="w-5 h-5 text-[#16532d] flex-shrink-0" />
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-base truncate">
              {stage === 'confirm'
                ? 'Confirm Farmgate Pickup'
                : stage === 'logistics'
                ? 'Live Logistics & Weighing'
                : 'DBT Payment Settled!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STAGE 1: CONFIRM BOOKING */}
        {stage === 'confirm' && (
          <div className="flex flex-col gap-3 pt-1">
            <div className="bg-[#f1f4ef] rounded-xl p-3 flex flex-col gap-2 border border-[#c0c9be]/30">
              <div className="flex justify-between items-center gap-2">
                <span className="font-bold text-[#191c1a] text-sm truncate">{targetName}</span>
                <span className="bg-[#b2f1be] text-[#00210c] text-[11px] px-2 py-0.5 rounded font-bold flex-shrink-0">
                  Verified Contract
                </span>
              </div>
              <div className="text-xs text-[#404941] space-y-1">
                <div>Crop: <strong>{lot.cropNameEn} ({lot.grade})</strong></div>
                <div>Committed Lot: <strong>{lot.quantityKg} kg ({qtl} Qtl)</strong></div>
                <div>Locked Rate: <strong className="text-[#003b1b]">₹{effectiveRate}/qtl</strong></div>
                <div>Estimated Payout: <strong className="text-[#003b1b] text-base font-metric-lg font-bold">₹{netPayout.toLocaleString()}</strong></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-2.5 border border-[#c0c9be]/40 text-xs flex flex-col gap-1.5">
              <div className="font-bold text-[#191c1a]">Farmgate Pickup Details:</div>
              <div className="text-[#404941]">📍 Location: {lot.location}, Taluka Niphad, Nashik</div>
              <div className="text-[#404941]">⏰ Expected Arrival: Tomorrow morning, 08:30 AM</div>
              <div className="text-[#404941]">⚖️ Weighing: Digital certified scale onboard vehicle</div>
            </div>

            <button
              onClick={handleSimulateLogistics}
              className="min-h-[44px] rounded-lg bg-[#16532d] text-white font-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all cursor-pointer hover:bg-[#003b1b] text-xs"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Confirm & Dispatch Vehicle</span>
            </button>
          </div>
        )}

        {/* STAGE 2: LIVE LOGISTICS & WEIGHING */}
        {stage === 'logistics' && (
          <div className="flex flex-col gap-3 pt-1">
            <div className="bg-[#f7faf5] border border-[#16532d]/30 rounded-xl p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-[#003b1b] text-xs">Vehicle Assigned: MH-15-EG-4401</span>
                <span className="bg-[#fe932c] text-[#663500] px-2 py-0.5 rounded text-[11px] font-bold">
                  Driver: Eknath S.
                </span>
              </div>

              {/* Progress Steps Timeline */}
              <div className="flex flex-col gap-3 pl-2 border-l-2 border-[#16532d] mt-2 text-xs">
                <div className="relative pl-3">
                  <div className="absolute -left-[13px] top-0 w-3 h-3 rounded-full bg-[#16532d]" />
                  <div className="font-bold text-[#191c1a]">Pickup Scheduled</div>
                  <div className="text-[#404941]">Order verified on APMC gateway</div>
                </div>

                <div className="relative pl-3">
                  <div className="absolute -left-[13px] top-0 w-3 h-3 rounded-full bg-[#16532d]" />
                  <div className="font-bold text-[#191c1a]">Vehicle Reached Farmgate</div>
                  <div className="text-[#404941]">Electronic weighing apparatus deployed</div>
                </div>

                <div className="relative pl-3">
                  <div className={`absolute -left-[13px] top-0 w-3 h-3 rounded-full ${weighingDone ? 'bg-[#16532d]' : 'bg-[#fe932c] animate-ping'}`} />
                  <div className="font-bold text-[#191c1a]">Digital Weight Calibration</div>
                  <div className="text-[#404941]">
                    {weighingDone
                      ? `✅ Verified Net: ${lot.quantityKg} kg (Zero deduction, Grade A standard)`
                      : 'Weighing in progress...'}
                  </div>
                </div>
              </div>
            </div>

            {weighingDone ? (
              <button
                onClick={handleFinishAndSettle}
                className="min-h-[44px] rounded-lg bg-[#003b1b] text-white font-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all cursor-pointer text-xs"
              >
                <Landmark className="w-4 h-4" />
                <span>Approve Slip & Trigger Same-Day DBT</span>
              </button>
            ) : (
              <div className="p-3 text-center text-xs text-[#404941] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 text-[#16532d] animate-spin" />
                <span>Verifying electronic weighbridge sensor readings...</span>
              </div>
            )}
          </div>
        )}

        {/* STAGE 3: PAYMENT SETTLED */}
        {stage === 'payment' && (
          <div className="flex flex-col gap-3 pt-1 text-center items-center">
            <div className="w-14 h-14 rounded-full bg-[#b2f1be] text-[#003b1b] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#003b1b]" />
            </div>

            <h4 className="font-headline-sm font-bold text-[#003b1b] text-base">
              ₹{netPayout.toLocaleString()} Credited Successfully!
            </h4>
            <p className="text-xs text-[#404941]">
              Payment transferred via RBI Direct Benefit Transfer (DBT) to Bank of Maharashtra A/C ending in ****4902.
            </p>

            <div className="bg-[#f1f4ef] rounded-xl p-3 w-full text-left text-xs space-y-1.5 border border-[#c0c9be]/40">
              <div className="flex justify-between">
                <span className="text-[#404941]">Transaction UTR:</span>
                <span className="font-mono font-bold text-[#191c1a]">UTIBR000{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#404941]">Buyer:</span>
                <span className="font-bold text-[#191c1a]">{targetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#404941]">Quantity:</span>
                <span className="font-bold text-[#191c1a]">{lot.quantityKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#404941]">Agreed Rate:</span>
                <span className="font-bold text-[#191c1a]">₹{effectiveRate}/qtl</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full min-h-[44px] rounded-lg bg-[#16532d] text-white font-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all cursor-pointer hover:bg-[#003b1b] text-xs"
            >
              <Receipt className="w-4 h-4" />
              <span>View in Sales Ledger</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
