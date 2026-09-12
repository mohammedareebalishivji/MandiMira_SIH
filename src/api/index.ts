import { FarmerLot, DecisionResult, MandiItem, BuyerOffer, PopUpPool, TransactionRecord } from '../types';
import { calculateSellingDecision } from '../services/decisionEngine';
import { defaultMandis, defaultBuyers, defaultPool, initialTransactions } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TXN_TABLE = 'sales_transactions';

function mapRowToTransaction(row: Record<string, unknown>): TransactionRecord {
  return {
    id: row.id as string,
    lotId: row.lot_id as string,
    cropName: row.crop_name as string,
    quantityKg: row.quantity_kg as number,
    ratePerQtl: row.rate_per_qtl as number,
    grossAmount: row.gross_amount as number,
    netPayout: row.net_payout as number,
    buyerName: row.buyer_name as string,
    date: row.date as string,
    status: row.status as TransactionRecord['status'],
    bankRef: row.bank_ref as string,
    mode: row.mode as string,
  };
}

function mapTransactionToRow(t: TransactionRecord, ownerPhone?: string): Record<string, unknown> {
  return {
    id: t.id,
    lot_id: t.lotId,
    crop_name: t.cropName,
    quantity_kg: t.quantityKg,
    rate_per_qtl: t.ratePerQtl,
    gross_amount: t.grossAmount,
    net_payout: t.netPayout,
    buyer_name: t.buyerName,
    date: t.date,
    status: t.status,
    bank_ref: t.bankRef,
    mode: t.mode,
    owner_phone: ownerPhone ?? null,
  };
}

export const api = {
  recommendations: {
    get: async (lot: FarmerLot): Promise<DecisionResult> => {
      return calculateSellingDecision(lot);
    }
  },

  markets: {
    list: async (lot: FarmerLot): Promise<MandiItem[]> => {
      return defaultMandis.map((m) => {
        const net = m.grossPricePerQtl - m.transportCostPerQtl;
        return { ...m, netRealizationPerQtl: net };
      });
    }
  },

  buyers: {
    list: async (lot: FarmerLot): Promise<BuyerOffer[]> => {
      return defaultBuyers;
    },
    acceptOffer: async (buyerId: string, lotId: string): Promise<{ success: boolean; bookingId: string }> => {
      return {
        success: true,
        bookingId: `BK-${buyerId.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
      };
    }
  },

  pools: {
    getActive: async (): Promise<PopUpPool> => {
      return defaultPool;
    },
    join: async (poolId: string, addedKg: number): Promise<PopUpPool> => {
      const updated = {
        ...defaultPool,
        currentKg: Math.min(defaultPool.targetKg, defaultPool.currentKg + addedKg),
        contributorsCount: defaultPool.contributorsCount + 1
      };
      return updated;
    }
  },

  transactions: {
    list: async (): Promise<TransactionRecord[]> => {
      if (!isSupabaseConfigured) return initialTransactions;
      const { data, error } = await supabase
        .from(TXN_TABLE)
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        if (error) console.warn('[supabase] transactions.list:', error.message);
        return initialTransactions;
      }
      return (data as Record<string, unknown>[]).map(mapRowToTransaction);
    },
    create: async (txn: TransactionRecord, ownerPhone?: string): Promise<TransactionRecord> => {
      if (!isSupabaseConfigured) return txn;
      const { error } = await supabase.from(TXN_TABLE).insert(mapTransactionToRow(txn, ownerPhone));
      if (error) {
        console.warn('[supabase] transactions.create:', error.message);
        return txn;
      }
      return txn;
    }
  }
};
