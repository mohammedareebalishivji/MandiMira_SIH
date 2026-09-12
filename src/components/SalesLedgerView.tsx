import React, { useState } from 'react';
import { Receipt, PlusCircle, ChevronRight, ShieldCheck, X } from 'lucide-react';
import { TransactionRecord } from '../types';

interface SalesLedgerViewProps {
  transactions: TransactionRecord[];
  onNewLotClick: () => void;
}

export const SalesLedgerView: React.FC<SalesLedgerViewProps> = ({
  transactions,
  onNewLotClick
}) => {
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null);

  const totalEarnings = transactions.reduce((sum, t) => sum + t.netPayout, 0);
  const totalVolumeKg = transactions.reduce((sum, t) => sum + t.quantityKg, 0);

  return (
    <div className="flex flex-col gap-3">
      {/* Header Stat Overview */}
      <section className="bg-white rounded-xl p-3.5 shadow-xs border border-[#c0c9be]/40 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="font-label-sm text-[#003b1b] font-bold uppercase tracking-wider text-[10px]">
              Farmer Digital Ledger
            </span>
            <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
              Direct Bank Settlements
            </h3>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#ecefea] flex items-center justify-center text-[#16532d] flex-shrink-0">
            <Receipt className="w-5 h-5 text-[#16532d]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-[#f1f4ef] rounded-lg p-2.5 border border-[#c0c9be]/30 min-w-0">
            <span className="font-label-sm text-[#404941] block text-xs">Total Realized Cash</span>
            <span className="font-metric-xl text-[#003b1b] font-bold block mt-0.5 text-lg truncate">
              ₹{totalEarnings.toLocaleString()}
            </span>
          </div>

          <div className="bg-[#f1f4ef] rounded-lg p-2.5 border border-[#c0c9be]/30 min-w-0">
            <span className="font-label-sm text-[#404941] block text-xs">Settled Volume</span>
            <span className="font-metric-xl text-[#191c1a] font-bold block mt-0.5 text-lg truncate">
              {totalVolumeKg.toLocaleString()} <span className="text-xs font-normal">kg</span>
            </span>
          </div>
        </div>
      </section>

      {/* Transaction List */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1 gap-2">
          <span className="font-label-sm text-[#404941] font-bold uppercase tracking-wider text-[11px]">
            Settled Invoices ({transactions.length})
          </span>
          <button
            onClick={onNewLotClick}
            className="text-xs font-bold text-[#16532d] flex items-center gap-1 hover:underline cursor-pointer flex-shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record New Sale</span>
          </button>
        </div>

        {transactions.map((txn) => (
          <div
            key={txn.id}
            onClick={() => setSelectedTxn(txn)}
            className="bg-white rounded-xl p-3 border border-[#c0c9be]/40 shadow-2xs flex flex-col gap-2 hover:border-[#16532d] transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-headline-sm text-[#191c1a] font-bold text-sm truncate">
                  {txn.cropName}
                </span>
                <span className="font-label-sm text-[#404941] text-xs truncate">
                  Lot: {txn.lotId} • {txn.quantityKg} kg @ ₹{txn.ratePerQtl}/q
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-metric-lg text-[#003b1b] font-bold text-sm">
                  ₹{txn.netPayout.toLocaleString()}
                </span>
                <span className="block text-[10px] text-[#16532d] font-bold">
                  ● {txn.status}
                </span>
              </div>
            </div>

            <div className="bg-[#f7faf5] rounded-lg p-2 flex items-center justify-between text-xs text-[#404941] border border-[#c0c9be]/30 gap-1 flex-wrap">
              <span className="truncate">Buyer: <strong>{txn.buyerName}</strong></span>
              <span className="font-mono text-[11px]">{txn.bankRef}</span>
              <span className="text-[#003b1b] font-bold text-[11px] flex items-center gap-0.5 ml-auto">
                <span>E-Slip</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* E-Receipt Modal when clicked */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-xl border border-[#c0c9be]/50 flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#c0c9be]/40 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-5 h-5 text-[#16532d] flex-shrink-0" />
                <h3 className="font-headline-sm font-bold text-[#191c1a] text-base truncate">
                  Official DBT Settlement Slip
                </h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="w-8 h-8 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#f7faf5] rounded-xl p-3 border border-[#16532d]/20 text-xs space-y-2">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-[#404941]">Payment Reference:</span>
                <span className="font-mono font-bold">{selectedTxn.bankRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#404941]">Commodity:</span>
                <span className="font-bold">{selectedTxn.cropName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#404941]">Weighed Volume:</span>
                <span className="font-bold">{selectedTxn.quantityKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#404941]">Settlement Rate:</span>
                <span className="font-bold">₹{selectedTxn.ratePerQtl} / Quintal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#404941]">Buyer Company:</span>
                <span className="font-bold">{selectedTxn.buyerName}</span>
              </div>
              <div className="flex justify-between border-t border-[#c0c9be]/40 pt-1.5 text-[#003b1b] font-bold text-sm">
                <span>Amount Credited:</span>
                <span>₹{selectedTxn.netPayout.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center p-2 bg-[#ecefea] rounded-lg text-[11px] text-[#404941] text-center">
              Verified by APMC Electronic National Agricultural Market (e-NAM) Gateway
            </div>

            <button
              onClick={() => setSelectedTxn(null)}
              className="min-h-[44px] rounded-lg bg-[#16532d] text-white font-bold text-xs cursor-pointer hover:bg-[#003b1b]"
            >
              Close Slip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
