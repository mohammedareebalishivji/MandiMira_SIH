/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ShieldAlert, User, X, LogOut, ShieldCheck, Sprout } from 'lucide-react';
import { Header } from './components/Header';
import { OnlineBanner } from './components/OnlineBanner';
import { ActiveCropProfile } from './components/ActiveCropProfile';
import { HeroDecisionCard } from './components/HeroDecisionCard';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { MarketComparison } from './components/MarketComparison';
import { LeverageMode } from './components/LeverageMode';
import { BuyerMatchingPool } from './components/BuyerMatchingPool';
import { VoiceAndLotModal } from './components/VoiceAndLotModal';
import { LogisticsAndSettlementModal } from './components/LogisticsAndSettlementModal';
import { JudgeDemoModal } from './components/JudgeDemoModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { SalesLedgerView } from './components/SalesLedgerView';
import { LanguagePickerModal } from './components/LanguagePickerModal';

// Role & feature surfaces
import { LoginScreen } from './components/LoginScreen';
import { RoleNav, MoreGrid, NAV_ICONS } from './components/RoleNav';
import { MarketIntelligenceAI } from './components/MarketIntelligenceAI';
import { QualityGradingPanel } from './components/QualityGradingPanel';
import { ArrivalVolumePanel } from './components/ArrivalVolumePanel';
import { TransportStoragePanel } from './components/TransportStoragePanel';
import { PaymentTrackingPanel } from './components/PaymentTrackingPanel';
import { GrievanceCenter } from './components/GrievanceCenter';
import { VerificationRegistry } from './components/VerificationRegistry';
import { BuyerDemandBoard } from './components/BuyerDemandBoard';
import { SupplyBoard } from './components/SupplyBoard';
import { ImpactOutcomes } from './components/ImpactOutcomes';
import { PriceModelPanel } from './components/PriceModelPanel';
import { AIPricePredictor } from './components/AIPricePredictor';
import { BiddingCenter } from './components/BiddingCenter';
import { FarmerAuctionWidget } from './components/FarmerAuctionWidget';
import { FpoDashboard } from './components/roles/FpoDashboard';
import { MiddlemanDashboard } from './components/roles/MiddlemanDashboard';
import { BuyerDashboard } from './components/roles/BuyerDashboard';
import { TransporterDashboard } from './components/roles/TransporterDashboard';
import { WarehouseDashboard } from './components/roles/WarehouseDashboard';
import { OfficerDashboard } from './components/roles/OfficerDashboard';

import {
  FarmerLot, BuyerOffer, PopUpPool, TransactionRecord, MandiItem,
  UserSession, PaymentTrackRecord, BuyerDemand
} from './types';
import { translations, SupportedLang } from './i18n';
import { initialScenarios, defaultMandis, defaultBuyers, defaultPool, initialTransactions } from './data/mockData';
import { calculateSellingDecision } from './services/decisionEngine';
import { getRole } from './data/roles';
import { TABS, TabId, ROLE_NAV } from './data/navigation';
import { ALL_SCHEDULED_LANGUAGES } from './services/bhashiniService';
import { api } from './api';
import { isSupabaseConfigured } from './lib/supabase';

export default function App() {
  // Session — null until the user picks a role and verifies their number
  const [session, setSession] = useState<UserSession | null>(null);

  // Localization & Mode State
  const [currentLang, setCurrentLang] = useState<SupportedLang>('en');
  const [isEasyMode, setIsEasyMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Active Scenario & Farmer Lot State
  const [currentScenario, setCurrentScenario] = useState<number>(1);
  const [lot, setLot] = useState<FarmerLot>(initialScenarios[1]);

  // Market & Buyers State
  const [mandis] = useState<MandiItem[]>(defaultMandis);
  const [buyers] = useState<BuyerOffer[]>(defaultBuyers);
  const [pool, setPool] = useState<PopUpPool>(defaultPool);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);

  React.useEffect(() => {
    if (!isSupabaseConfigured || !session) return;
    api.transactions.list().then(setTransactions).catch(() => {});
  }, [session]);

  // Cross-panel handoff: a stalled payment pre-fills the grievance form
  const [grievancePrefill, setGrievancePrefill] = useState<PaymentTrackRecord | null>(null);

  // Modal Control States
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState<boolean>(false);
  const [isLogisticsModalOpen, setIsLogisticsModalOpen] = useState<boolean>(false);
  const [selectedBuyerForLogistics, setSelectedBuyerForLogistics] = useState<BuyerOffer | null>(null);
  const [selectedPoolForLogistics, setSelectedPoolForLogistics] = useState<PopUpPool | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState<boolean>(false);

  // Computed Decision Intelligence (Instant re-calculation on any input update)
  const decision = useMemo(() => calculateSellingDecision(lot), [lot]);

  // Translations dictionary lookup
  const t = useMemo(() => {
    const langDict = translations[currentLang] || translations.en;
    return isEasyMode ? langDict.easy : langDict.standard;
  }, [currentLang, isEasyMode]);

  const languageName = useMemo(
    () => ALL_SCHEDULED_LANGUAGES.find((l) => l.code === currentLang)?.name ?? 'English',
    [currentLang]
  );

  const role = session ? getRole(session.role) : null;

  /* ---------------- Handlers ---------------- */

  const handleLogin = (s: UserSession) => {
    setSession(s);
    setActiveTab(ROLE_NAV[s.role].primary[0]);
  };

  const handleLogout = () => {
    setSession(null);
    setIsProfileModalOpen(false);
    setActiveTab('home');
  };

  const handleSelectScenario = (scenarioNum: number) => {
    setCurrentScenario(scenarioNum);
    if (initialScenarios[scenarioNum]) setLot({ ...initialScenarios[scenarioNum] });
  };

  const handleUpdateLotFactors = (updates: Partial<FarmerLot>) =>
    setLot((prev) => ({ ...prev, ...updates }));

  const handleJoinPool = (targetPool: PopUpPool) => {
    setSelectedPoolForLogistics(targetPool);
    setSelectedBuyerForLogistics(null);
    setIsLogisticsModalOpen(true);
  };

  const handleAcceptBuyerOffer = (buyer: BuyerOffer) => {
    setSelectedBuyerForLogistics(buyer);
    setSelectedPoolForLogistics(null);
    setIsLogisticsModalOpen(true);
  };

  const handleSelectMandiForDispatch = (mandi: MandiItem) => {
    const proxyBuyer: BuyerOffer = {
      id: mandi.id,
      buyerName: `${mandi.name} (Direct Gate Route)`,
      type: 'FPO Aggregator',
      rating: 4.8,
      matchScore: 95,
      matchReasons: ['Shortest travel time from your farm', 'High liquidity spot auction'],
      offerPricePerQtl: mandi.grossPricePerQtl,
      minQuantityKg: 100,
      paymentTerms: 'Same-Day DBT via APMC Gateway',
      pickupTimeline: 'Daily morning dispatch',
      weighingMethod: 'APMC certified digital weighbridge',
      verified: true
    };
    setSelectedBuyerForLogistics(proxyBuyer);
    setSelectedPoolForLogistics(null);
    setIsLogisticsModalOpen(true);
  };

  const handleCompleteSale = (newTxn: TransactionRecord) => {
    setTransactions((prev) => [newTxn, ...prev]);
    if (isSupabaseConfigured && session) {
      api.transactions.create(newTxn, session.phone).catch(() => {});
    }
    if (selectedPoolForLogistics) {
      setPool((prev) => ({
        ...prev,
        currentKg: Math.min(prev.targetKg, prev.currentKg + lot.quantityKg),
        contributorsCount: prev.contributorsCount + 1
      }));
    }
  };

  /** A stalled payment sends the user straight into a pre-filled dispute filing. */
  const handleRaiseGrievance = (record: PaymentTrackRecord) => {
    setGrievancePrefill(record);
    setActiveTab('grievance');
  };

  /** Responding to a demand order reuses the existing settlement flow. */
  const handleRespondToDemand = (d: BuyerDemand) => {
    handleAcceptBuyerOffer({
      id: d.id,
      buyerName: d.buyerName,
      type: d.buyerType,
      rating: 4.7,
      matchScore: 92,
      matchReasons: [`Wants ${d.gradeRequired}`, d.paymentTerms, d.deliveryWindow],
      offerPricePerQtl: d.pricePerQtl,
      minQuantityKg: 100,
      paymentTerms: d.paymentTerms,
      pickupTimeline: d.deliveryWindow,
      weighingMethod: 'Digital weighbridge at delivery point',
      verified: d.verified
    });
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------------- Login gate ---------------- */

  if (!session || !role) {
    return (
      <>
        <LoginScreen
          onLogin={handleLogin}
          currentLang={currentLang}
          onOpenLanguagePicker={() => setIsLanguagePickerOpen(true)}
        />
        <LanguagePickerModal
          isOpen={isLanguagePickerOpen}
          onClose={() => setIsLanguagePickerOpen(false)}
          currentLang={currentLang}
          onSelectLanguage={(lang) => {
            setCurrentLang(lang);
            setIsLanguagePickerOpen(false);
          }}
        />
      </>
    );
  }

  /* ---------------- Reusable sections ---------------- */

  const nearestMandiKm = mandis.reduce((min, m) => Math.min(min, m.distanceKm), 999);
  const RoleIcon = NAV_ICONS[role.icon] ?? Sprout;

  const disclaimer = (
    <footer className="p-3 bg-[#e6e9e4] rounded-xl text-center flex flex-col gap-1 text-[#404941] border border-[#c0c9be]/40">
      <div className="flex items-center justify-center gap-1.5 font-label-sm font-bold text-[#191c1a] text-xs">
        <ShieldAlert className="w-4 h-4 text-[#003b1b]" />
        <span>{t.disclaimerTitle}</span>
      </div>
      <p className="font-label-sm leading-tight text-[#404941] text-xs">{t.disclaimerText}</p>
    </footer>
  );

  const renderTab = () => {
    switch (activeTab) {
      /* ---- FARMER / FPO HOME: the integrated two-column view ---- */
      case 'home':
        if (session.role === 'fpo') {
          return <FpoDashboard session={session} onChangeTab={setActiveTab} t={t} />;
        }
        if (session.role === 'middleman') {
          return <MiddlemanDashboard session={session} onChangeTab={setActiveTab} t={t} />;
        }
        if (session.role === 'buyer') {
          return <BuyerDashboard session={session} onChangeTab={setActiveTab} t={t} />;
        }
        if (session.role === 'transporter') {
          return <TransporterDashboard session={session} onChangeTab={setActiveTab} t={t} />;
        }
        if (session.role === 'warehouse') {
          return <WarehouseDashboard session={session} onChangeTab={setActiveTab} t={t} />;
        }
        if (session.role === 'officer') {
          return <OfficerDashboard session={session} onChangeTab={setActiveTab} t={t} />;
        }

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 w-full items-start">
            <div className="lg:col-span-7 flex flex-col gap-4 w-full">
              <OnlineBanner
                t={t}
                currentScenario={currentScenario}
                onSelectScenario={handleSelectScenario}
                isOffline={isOffline}
                onToggleOffline={() => setIsOffline(!isOffline)}
              />
              <ActiveCropProfile
                lot={lot}
                t={t}
                currentLang={currentLang}
                onEditLot={() => setIsLotModalOpen(true)}
              />
              <HeroDecisionCard
                decision={decision}
                lot={lot}
                t={t}
                onWhyClick={() => scrollToSection('judgeExplanationDrawer')}
                onCompareClick={() => setActiveTab('markets')}
              />
              <MarketIntelligenceAI lot={lot} mandis={mandis} role={session.role} languageName={languageName} />
              <WhatIfSimulator decision={decision} lot={lot} t={t} onUpdateLotFactors={handleUpdateLotFactors} />
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4 w-full">
              <MarketComparison
                mandis={mandis}
                lot={lot}
                t={t}
                currentLang={currentLang}
                onSelectMandiForDispatch={handleSelectMandiForDispatch}
              />
              <LeverageMode lot={lot} t={t} onOpenShareModal={() => setIsWhatsAppModalOpen(true)} />
              <FarmerAuctionWidget
                lot={lot}
                session={session}
                onOpenBiddingTab={() => setActiveTab('bidding')}
                onOpenSourcingTab={() => setActiveTab('sourcing')}
              />
              <BuyerMatchingPool
                pool={pool}
                buyers={buyers}
                lot={lot}
                t={t}
                onJoinPool={handleJoinPool}
                onAcceptBuyerOffer={handleAcceptBuyerOffer}
              />
              <VoiceAndLotModal
                t={t}
                currentLang={currentLang}
                onLotCreatedOrUpdated={(newLot) => setLot(newLot)}
                onOpenLedger={() => setActiveTab('ledger')}
                isModalOpen={isLotModalOpen}
                onCloseModal={() => setIsLotModalOpen(false)}
                currentLot={lot}
              />
              {disclaimer}
            </div>
          </div>
        );

      case 'decision':
        return (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
            <HeroDecisionCard
              decision={decision}
              lot={lot}
              t={t}
              onWhyClick={() => scrollToSection('judgeExplanationDrawer')}
              onCompareClick={() => setActiveTab('markets')}
            />
            <MarketIntelligenceAI lot={lot} mandis={mandis} role={session.role} languageName={languageName} />
            <WhatIfSimulator decision={decision} lot={lot} t={t} onUpdateLotFactors={handleUpdateLotFactors} />
          </div>
        );

      case 'markets':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto w-full items-start">
            <div className="flex flex-col gap-4">
              <MarketComparison
                mandis={mandis}
                lot={lot}
                t={t}
                currentLang={currentLang}
                onSelectMandiForDispatch={handleSelectMandiForDispatch}
              />
              <LeverageMode lot={lot} t={t} onOpenShareModal={() => setIsWhatsAppModalOpen(true)} />
            </div>
            <div className="flex flex-col gap-4">
              <ArrivalVolumePanel />
              <PriceModelPanel lot={lot} onOpenAIPredictor={() => setActiveTab('pricedata')} />
            </div>
          </div>
        );

      case 'arrivals':
        return (
          <div className="max-w-3xl mx-auto w-full">
            <ArrivalVolumePanel />
          </div>
        );

      case 'quality':
        return (
          <div className="max-w-3xl mx-auto w-full">
            <QualityGradingPanel lot={lot} />
          </div>
        );

      case 'logistics':
        return (
          <div className="max-w-3xl mx-auto w-full">
            <TransportStoragePanel
              lot={lot}
              distanceKm={nearestMandiKm}
              mandis={mandis}
              role={session?.role}
              onNavigateToTab={setActiveTab}
            />
          </div>
        );

      case 'buyers':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto w-full items-start">
            <BuyerMatchingPool
              pool={pool}
              buyers={buyers}
              lot={lot}
              t={t}
              onJoinPool={handleJoinPool}
              onAcceptBuyerOffer={handleAcceptBuyerOffer}
            />
            <BuyerDemandBoard
              role={session.role}
              session={session}
              lot={lot}
              onRespond={handleRespondToDemand}
            />
          </div>
        );

      case 'demand':
        return (
          <div className="max-w-3xl mx-auto w-full">
            <BuyerDemandBoard
              role={session.role}
              session={session}
              lot={lot}
              onRespond={handleRespondToDemand}
            />
          </div>
        );

      case 'bidding':
        return (
          <BiddingCenter
            session={session}
            lot={lot}
            onAuctionAwarded={handleCompleteSale}
            onNavigateToTab={setActiveTab}
          />
        );

      case 'sourcing':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto w-full items-start">
            <SupplyBoard
              role={session.role}
              session={session}
              lot={lot}
              onOpenBidding={() => setActiveTab('bidding')}
            />
            <div className="flex flex-col gap-4">
              <BuyerDemandBoard
                role={session.role}
                session={session}
                lot={lot}
                onRespond={handleRespondToDemand}
              />
              <ArrivalVolumePanel />
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="max-w-3xl mx-auto w-full">
            <PaymentTrackingPanel onRaiseGrievance={handleRaiseGrievance} />
          </div>
        );

      case 'grievance':
        return (
          <div className="max-w-3xl mx-auto w-full">
            <GrievanceCenter
              session={session}
              prefillFrom={grievancePrefill}
              onClearPrefill={() => setGrievancePrefill(null)}
              languageName={languageName}
            />
          </div>
        );

      case 'trust':
        return (
          <div className="max-w-3xl mx-auto w-full">
            <VerificationRegistry />
          </div>
        );

      case 'ledger':
        return (
          <div className="max-w-4xl mx-auto w-full">
            <SalesLedgerView transactions={transactions} onNewLotClick={() => setIsLotModalOpen(true)} />
          </div>
        );

      case 'pricedata':
        return (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            <AIPricePredictor
              lot={lot}
              onApplyToLot={(newBenchmark, cropName, grade) => {
                setLot((prev) => ({
                  ...prev,
                  localMandiBenchmark: newBenchmark,
                  cropNameEn: cropName,
                  grade: (grade as any) || prev.grade
                }));
              }}
            />
            <div className="pt-2">
              <PriceModelPanel lot={lot} />
            </div>
          </div>
        );

      case 'impact':
        return (
          <div className="max-w-4xl mx-auto w-full">
            <ImpactOutcomes />
          </div>
        );

      case 'more':
        return (
          <div className="max-w-4xl mx-auto w-full">
            <MoreGrid role={session.role} onChangeTab={setActiveTab} />
          </div>
        );

      default:
        return null;
    }
  };

  const currentTabDef = TABS[activeTab];
  const openDisputeCount = 2;

  return (
    <div className="bg-[#f7faf5] font-sans text-[#191c1a] flex flex-col min-h-screen selection:bg-[#b2f1be]">
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenLanguagePicker={() => setIsLanguagePickerOpen(true)}
        isEasyMode={isEasyMode}
        onToggleEasyMode={() => setIsEasyMode(!isEasyMode)}
        onOpenJudgeDemo={() => setIsJudgeModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <main className="flex flex-col relative w-full pt-32 sm:pt-28 md:pt-24 pb-24 bg-[#f7faf5] min-h-screen">
        <div className="flex flex-col gap-4 w-full px-3 sm:px-6 lg:px-8 py-2 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto">
          {/* Role context bar — who you are signed in as, and where you are */}
          <div className="flex items-center justify-between gap-3 bg-white rounded-xl border border-[#c0c9be]/60 px-3 py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${role.accent}14` }}
              >
                <RoleIcon className="w-4.5 h-4.5" style={{ color: role.accent }} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-label-md text-[13px] text-[#191c1a] truncate">{session.displayName}</span>
                  {session.verified && <ShieldCheck className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />}
                </div>
                <span className="font-label-sm text-[10.5px] text-[#404941] truncate">
                  {role.label} · {currentTabDef.blurb}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-mono text-[13px] font-bold text-[#16532d] leading-none">{session.trustScore}</span>
                <span className="font-label-sm text-[8.5px] uppercase tracking-wider text-[#717970]">Trust</span>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out and switch role"
                className="w-9 h-9 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {renderTab()}
        </div>
      </main>

      <RoleNav
        role={session.role}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        ledgerCount={transactions.length}
        openDisputeCount={openDisputeCount}
      />

      <LanguagePickerModal
        isOpen={isLanguagePickerOpen}
        onClose={() => setIsLanguagePickerOpen(false)}
        currentLang={currentLang}
        onSelectLanguage={(lang) => {
          setCurrentLang(lang);
          setIsLanguagePickerOpen(false);
        }}
      />

      <JudgeDemoModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        onSelectScenario={handleSelectScenario}
        currentScenario={currentScenario}
      />

      <WhatsAppShareModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        lot={lot}
      />

      <LogisticsAndSettlementModal
        isOpen={isLogisticsModalOpen}
        onClose={() => setIsLogisticsModalOpen(false)}
        buyer={selectedBuyerForLogistics}
        pool={selectedPoolForLogistics}
        lot={lot}
        onCompleteSale={handleCompleteSale}
        onNavigateToLedger={() => setActiveTab('ledger')}
      />

      {/* Profile & session */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-xl border border-[#c0c9be]/50 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#c0c9be]/40 pb-2">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#16532d]" />
                <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
                  {role.label} Profile &amp; Settings
                </h3>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#f1f4ef] rounded-xl p-3 text-xs space-y-1.5 border border-[#c0c9be]/40">
              {[
                ['Name', session.displayName],
                ['Organisation', session.organisation],
                ['Mobile', `+91 ${session.phone}`],
                ['Location', session.location],
                ['Trust score', `${session.trustScore} / 100`],
                ['Member since', session.memberSince]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <span className="text-[#404941] flex-shrink-0">{k}:</span>
                  <span className="font-bold text-right">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-[#717970]">
                Enabled for this role
              </span>
              <div className="flex flex-wrap gap-1">
                {role.capabilities.map((c) => (
                  <span
                    key={c}
                    className="font-label-sm text-[10px] px-2 py-0.5 rounded-full bg-[#f1f4ef] text-[#404941] border border-[#c0c9be]/40"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs text-[#404941] bg-[#f7faf5] p-2.5 rounded-lg border border-[#16532d]/20">
              🛡️ All records synchronized with Govt e-NAM and APMC Niphad Mandi Gate System.
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 min-h-[44px] rounded-lg border border-[#ba1a1a] text-[#ba1a1a] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#ffdad6] cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="flex-1 min-h-[44px] rounded-lg bg-[#16532d] text-white font-bold text-xs cursor-pointer hover:bg-[#003b1b]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
