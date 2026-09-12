import { SupplyLot, BuyerDemand, UserRole, QualityGrade, CropType } from '../types';
import { supplyLots as initialSupplyLots, buyerDemands as initialBuyerDemands } from '../data/marketData';

const SUPPLY_STORAGE_KEY = 'mandimitra_supply_lots';
const DEMAND_STORAGE_KEY = 'mandimitra_buyer_demands';

type SupplyListener = (lots: SupplyLot[]) => void;
type DemandListener = (demands: BuyerDemand[]) => void;

class StockService {
  private supplyLots: SupplyLot[] = [];
  private buyerDemands: BuyerDemand[] = [];
  private supplyListeners: Set<SupplyListener> = new Set();
  private demandListeners: Set<DemandListener> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') {
      this.supplyLots = JSON.parse(JSON.stringify(initialSupplyLots));
      this.buyerDemands = JSON.parse(JSON.stringify(initialBuyerDemands));
      return;
    }

    try {
      const storedSupply = localStorage.getItem(SUPPLY_STORAGE_KEY);
      this.supplyLots = storedSupply ? JSON.parse(storedSupply) : JSON.parse(JSON.stringify(initialSupplyLots));
    } catch {
      this.supplyLots = JSON.parse(JSON.stringify(initialSupplyLots));
    }

    try {
      const storedDemand = localStorage.getItem(DEMAND_STORAGE_KEY);
      this.buyerDemands = storedDemand ? JSON.parse(storedDemand) : JSON.parse(JSON.stringify(initialBuyerDemands));
    } catch {
      this.buyerDemands = JSON.parse(JSON.stringify(initialBuyerDemands));
    }
  }

  private persistSupply() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SUPPLY_STORAGE_KEY, JSON.stringify(this.supplyLots));
      } catch (e) {
        console.warn('[StockService] Failed to persist supply lots', e);
      }
    }
    const copy = this.getSupplyLots();
    this.supplyListeners.forEach((fn) => {
      try {
        fn(copy);
      } catch (e) {
        console.error('[StockService] Supply listener error', e);
      }
    });
  }

  private persistDemand() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(DEMAND_STORAGE_KEY, JSON.stringify(this.buyerDemands));
      } catch (e) {
        console.warn('[StockService] Failed to persist demands', e);
      }
    }
    const copy = this.getBuyerDemands();
    this.demandListeners.forEach((fn) => {
      try {
        fn(copy);
      } catch (e) {
        console.error('[StockService] Demand listener error', e);
      }
    });
  }

  subscribeSupply(listener: SupplyListener): () => void {
    this.supplyListeners.add(listener);
    listener(this.getSupplyLots());
    return () => {
      this.supplyListeners.delete(listener);
    };
  }

  subscribeDemands(listener: DemandListener): () => void {
    this.demandListeners.add(listener);
    listener(this.getBuyerDemands());
    return () => {
      this.demandListeners.delete(listener);
    };
  }

  getSupplyLots(): SupplyLot[] {
    return JSON.parse(JSON.stringify(this.supplyLots));
  }

  getBuyerDemands(): BuyerDemand[] {
    return JSON.parse(JSON.stringify(this.buyerDemands));
  }

  /**
   * Farmer posts available stock to the supply board
   */
  addSupplyLot(input: {
    sellerName: string;
    sellerRole: UserRole;
    village: string;
    cropNameEn: string;
    cropType: CropType;
    quantityKg: number;
    grade: QualityGrade;
    askPricePerQtl: number;
    harvestedDaysAgo?: number;
    verified?: boolean;
    trustScore?: number;
    photosCount?: number;
    contactPhone?: string;
    storageType?: string;
    variety?: string;
    notes?: string;
    availableFrom?: string;
  }): SupplyLot {
    const id = `sl-${Date.now().toString().slice(-6)}`;
    const newLot: SupplyLot = {
      id,
      sellerName: input.sellerName,
      sellerRole: input.sellerRole,
      village: input.village,
      cropNameEn: input.cropNameEn,
      cropType: input.cropType,
      quantityKg: input.quantityKg,
      grade: input.grade,
      askPricePerQtl: Math.round(input.askPricePerQtl),
      harvestedDaysAgo: input.harvestedDaysAgo ?? 0,
      verified: input.verified ?? true,
      trustScore: input.trustScore ?? 80,
      photosCount: input.photosCount ?? 2,
      contactPhone: input.contactPhone,
      storageType: input.storageType || 'Ventilated storage',
      variety: input.variety,
      notes: input.notes,
      availableFrom: input.availableFrom || 'Immediate',
      status: 'AVAILABLE',
      createdAt: new Date().toISOString()
    };

    this.supplyLots.unshift(newLot);
    this.persistSupply();
    return newLot;
  }

  deleteSupplyLot(id: string): boolean {
    const idx = this.supplyLots.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    this.supplyLots.splice(idx, 1);
    this.persistSupply();
    return true;
  }

  updateSupplyLotStatus(id: string, status: SupplyLot['status']): boolean {
    const lot = this.supplyLots.find((l) => l.id === id);
    if (!lot) return false;
    lot.status = status;
    this.persistSupply();
    return true;
  }

  /**
   * Middleman or Buyer posts a stock request / procurement order
   */
  addBuyerDemand(input: {
    buyerId: string;
    buyerName: string;
    buyerRole?: UserRole;
    buyerOrg?: string;
    buyerPhone?: string;
    buyerType?: BuyerDemand['buyerType'];
    cropNameEn: string;
    cropType: CropType;
    requiredQtl: number;
    gradeRequired: QualityGrade;
    pricePerQtl: number;
    deliveryWindow: string;
    deliveryLocation: string;
    paymentTerms?: string;
    qualitySpecs?: BuyerDemand['qualitySpecs'];
    notes?: string;
    verified?: boolean;
  }): BuyerDemand {
    const id = `dm-${Date.now().toString().slice(-6)}`;
    const newDemand: BuyerDemand = {
      id,
      buyerId: input.buyerId,
      buyerName: input.buyerName,
      buyerRole: input.buyerRole || 'middleman',
      buyerPhone: input.buyerPhone,
      buyerType: input.buyerType || (input.buyerRole === 'middleman' ? 'Middleman / Trader' : 'Corporate Processor'),
      cropNameEn: input.cropNameEn,
      cropType: input.cropType,
      requiredQtl: Math.round(input.requiredQtl),
      committedQtl: 0,
      gradeRequired: input.gradeRequired,
      pricePerQtl: Math.round(input.pricePerQtl),
      deliveryWindow: input.deliveryWindow || 'Next 3 days',
      deliveryLocation: input.deliveryLocation || 'Nashik APMC Yard',
      paymentTerms: input.paymentTerms || 'Instant DBT on digital weighment',
      qualitySpecs: input.qualitySpecs || [],
      notes: input.notes,
      status: 'open',
      verified: input.verified ?? true,
      postedAgo: 'Just now',
      createdAt: new Date().toISOString()
    };

    this.buyerDemands.unshift(newDemand);
    this.persistDemand();
    return newDemand;
  }

  /**
   * Farmer fulfills part or all of a middleman's stock request
   */
  fulfillDemand(
    demandId: string,
    quantityQtl: number,
    _farmerName?: string
  ): { success: boolean; demand?: BuyerDemand; error?: string } {
    const demand = this.buyerDemands.find((d) => d.id === demandId);
    if (!demand) {
      return { success: false, error: 'Stock request not found' };
    }
    if (demand.status === 'closed') {
      return { success: false, error: 'This stock request has already been closed' };
    }

    const availableToFill = demand.requiredQtl - demand.committedQtl;
    const toAdd = Math.min(availableToFill, quantityQtl);
    demand.committedQtl += toAdd;

    if (demand.committedQtl >= demand.requiredQtl) {
      demand.status = 'closed';
    } else {
      demand.status = 'partially_filled';
    }

    this.persistDemand();
    return { success: true, demand: JSON.parse(JSON.stringify(demand)) };
  }

  deleteBuyerDemand(id: string): boolean {
    const idx = this.buyerDemands.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    this.buyerDemands.splice(idx, 1);
    this.persistDemand();
    return true;
  }

  resetToDefaults() {
    this.supplyLots = JSON.parse(JSON.stringify(initialSupplyLots));
    this.buyerDemands = JSON.parse(JSON.stringify(initialBuyerDemands));
    this.persistSupply();
    this.persistDemand();
  }
}

export const stockService = new StockService();
