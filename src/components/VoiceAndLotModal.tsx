import React, { useState, useEffect } from 'react';
import {
  Mic,
  AudioWaveform,
  SlidersHorizontal,
  Sprout,
  X,
  Warehouse,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Receipt
} from 'lucide-react';
import { FarmerLot, CropType, QualityGrade } from '../types';
import { Translations, SupportedLang } from '../i18n';
import { bhashiniService } from '../services/bhashiniService';

interface VoiceAndLotModalProps {
  t: Translations;
  currentLang?: SupportedLang;
  onLotCreatedOrUpdated: (newLot: FarmerLot) => void;
  onOpenLedger: () => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  currentLot: FarmerLot;
}

export const VoiceAndLotModal: React.FC<VoiceAndLotModalProps> = ({
  t,
  currentLang = 'hi',
  onLotCreatedOrUpdated,
  onOpenLedger,
  isModalOpen,
  onCloseModal,
  currentLot
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [voiceNotice, setVoiceNotice] = useState<string>('');

  // Wizard form state
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FarmerLot>(currentLot);

  useEffect(() => {
    setFormData(currentLot);
  }, [currentLot]);

  // Real Speech Recognition handler with Bhashini locale matching
  const handleStartVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Browser speech not active. Simulating voice entry in your selected language...');
      const sampleText = currentLang === 'en'
        ? '750 kg onion with ventilated chawl storage available'
        : '७५० किलो कांदा, कांदा चाळ साठवणूक उपलब्ध आहे (750kg onion with chawl storage)';
      simulateSpeech(sampleText);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      const activeLang = (currentLang || 'hi') as SupportedLang;
      recognition.lang = bhashiniService.getSpeechLanguageCode(activeLang);

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice(`Bhashini Voice ASR listening in ${bhashiniService.getLanguageName(activeLang)}... Say crop, weight, and storage.`);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        parseVoiceInput(text);
      };

      recognition.onerror = (err: any) => {
        setIsListening(false);
        setVoiceNotice(`Speech notice: ${err.error || 'Check microphone'}. Loading sample phrase.`);
        simulateSpeech('750 kg onion with kanda chawl storage');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      simulateSpeech('750 kg onion with kanda chawl storage');
    }
  };

  const simulateSpeech = (samplePhrase: string) => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setTranscript(samplePhrase);
      parseVoiceInput(samplePhrase);
    }, 1200);
  };

  const parseVoiceInput = (text: string) => {
    const lower = text.toLowerCase();
    let crop: CropType = formData.cropType;
    let cropNameEn = formData.cropNameEn;
    let cropNameLocal = formData.cropNameLocal;
    let qty = formData.quantityKg;
    let storage = formData.storageAvailable;

    if (lower.includes('onion') || lower.includes('कांदा') || lower.includes('प्याज') || lower.includes('ullipaya') || lower.includes('vengayam')) {
      crop = 'onion';
      cropNameEn = 'Nashik Red Onion';
      cropNameLocal = 'नाशिक लाल कांदा';
    } else if (lower.includes('tomato') || lower.includes('टोमॅटो') || lower.includes('टमाटर') || lower.includes('tamata') || lower.includes('thakkali')) {
      crop = 'tomato';
      cropNameEn = 'Tomato Vaishali';
      cropNameLocal = 'टोमॅटो वैशाली';
    } else if (lower.includes('potato') || lower.includes('बटाटा') || lower.includes('आलू') || lower.includes('aaloo') || lower.includes('urulaikizhangu')) {
      crop = 'potato';
      cropNameEn = 'Potato Jyoti';
      cropNameLocal = 'बटाटा कुफरी';
    }

    const numbers = text.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      qty = parseInt(numbers[0], 10);
    }

    if (lower.includes('chawl') || lower.includes('चाळ') || lower.includes('storage') || lower.includes('साठवणूक') || lower.includes('गोदाम') || lower.includes('godown')) {
      storage = true;
    } else if (lower.includes('no storage') || lower.includes('नाही') || lower.includes('nill')) {
      storage = false;
    }

    const updatedLot: FarmerLot = {
      ...formData,
      cropType: crop,
      cropNameEn,
      cropNameLocal,
      quantityKg: qty,
      storageAvailable: storage,
      id: `MH-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setFormData(updatedLot);
    onLotCreatedOrUpdated(updatedLot);
    setVoiceNotice(`✅ Detected & Updated: ${cropNameEn}, ${qty} kg, Storage: ${storage ? 'Yes' : 'No'}`);
  };

  const handleSaveWizard = () => {
    onLotCreatedOrUpdated(formData);
    onCloseModal();
  };

  return (
    <>
      {/* Quick Entry In-Page Section */}
      <section className="bg-white rounded-xl p-3.5 shadow-xs flex flex-col gap-3 border border-[#c0c9be]/40">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="font-label-sm text-[#003b1b] font-bold uppercase tracking-wider text-[10px]">
              {t.quickEntry}
            </span>
            <h3 className="font-headline-sm text-[#191c1a] font-bold text-base">
              Add New Harvest Lot
            </h3>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#ecefea] flex items-center justify-center text-[#003b1b] flex-shrink-0">
            <Mic className="w-5 h-5 text-[#003b1b]" />
          </div>
        </div>

        {/* Giant Voice Action Bar */}
        <div className="bg-[#f1f4ef] rounded-xl p-3 flex items-center justify-between gap-3 border border-[#c0c9be]/30">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label-md text-[#191c1a] font-bold text-sm truncate">
              {t.speakToEnter}
            </span>
            <span className="font-label-sm text-[#404941] truncate text-xs">
              {currentLang === 'en'
                ? 'Say: "750 kg onion with storage"'
                : 'Say: "500 किलो कांदा साठवणूक आहे"'}
            </span>
          </div>

          <button
            onClick={handleStartVoice}
            id="voiceRecordBtn"
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform cursor-pointer flex-shrink-0 ${
              isListening
                ? 'bg-[#ba1a1a] text-white animate-pulse scale-105'
                : 'bg-[#16532d] text-white hover:bg-[#003b1b] active:scale-95'
            }`}
            title="Press to speak in your local language"
          >
            {isListening ? (
              <AudioWaveform className="w-6 h-6 animate-pulse" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Voice Feedback notification if active */}
        {(transcript || voiceNotice) && (
          <div className="bg-[#f7faf5] border border-[#16532d]/30 rounded-lg p-2.5 text-xs text-[#003b1b] flex items-center justify-between gap-2">
            <span className="truncate flex-1">{transcript ? `"${transcript}"` : voiceNotice}</span>
            <button
              onClick={() => {
                setTranscript('');
                setVoiceNotice('');
              }}
              className="text-[#717970] text-[10px] font-bold cursor-pointer hover:underline flex-shrink-0"
            >
              Clear
            </button>
          </div>
        )}

        {/* Manual Form Trigger Button */}
        <button
          onClick={() => {
            setStep(1);
            if (isModalOpen) onCloseModal();
          }}
          onClickCapture={() => setStep(1)}
          className="text-xs font-bold text-[#16532d] flex items-center justify-center gap-1.5 py-1 hover:underline cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Or configure lot manually (6-step guided wizard)</span>
        </button>

        {/* Recent Digital Ledger Snippet */}
        <div
          onClick={onOpenLedger}
          className="bg-[#ecefea] rounded-lg p-2.5 flex flex-col gap-1.5 border border-[#c0c9be]/40 cursor-pointer hover:bg-[#e0e3df] transition-colors"
          title="Click to view full digital sales ledger"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-label-sm text-[#404941] font-bold flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-[#16532d]" />
              <span>{t.recentDispatch}</span>
            </span>
            <span className="font-label-sm text-[#003b1b] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#16532d]" /> {t.dbtSettled}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-body-sm text-[#191c1a] font-bold truncate">
              🍅 Tomato 500 kg → FreshBazaar
            </span>
            <span className="font-metric-lg text-[#003b1b] font-bold flex-shrink-0 ml-2">
              ₹14,200
            </span>
          </div>
          <span className="font-label-sm text-[#404941] text-[11px] truncate">
            Bank Ref: UTIBR0004921 • E-Receipt Generated
          </span>
        </div>
      </section>

      {/* Step-by-Step Manual Lot Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-xl border border-[#c0c9be]/50 flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#c0c9be]/40 pb-2">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-[#16532d]" />
                <h3 className="font-headline-sm font-bold text-[#191c1a] text-base">
                  Step-by-Step Farmer Lot Entry
                </h3>
              </div>
              <button
                onClick={onCloseModal}
                className="w-8 h-8 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="flex items-center justify-between text-xs text-[#404941] font-bold">
              <span>Step {step} of 6</span>
              <span>
                {step === 1
                  ? 'Crop Selection'
                  : step === 2
                  ? 'Quantity (kg)'
                  : step === 3
                  ? 'Quality Grade'
                  : step === 4
                  ? 'Harvest Date'
                  : step === 5
                  ? 'Storage Type'
                  : 'Cash Urgency'}
              </span>
            </div>
            <div className="w-full bg-[#e0e3df] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#16532d] h-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>

            {/* Step 1: Crop */}
            {step === 1 && (
              <div className="flex flex-col gap-2 pt-2">
                <label className="font-label-sm font-bold text-[#191c1a] text-xs">
                  {currentLang === 'en' ? 'Select Crop:' : 'Select Crop (पीक निवडा):'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        cropType: 'onion',
                        cropNameEn: 'Nashik Red Onion',
                        cropNameLocal: 'नाशिक लाल कांदा',
                        localMandiBenchmark: 3200
                      })
                    }
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      formData.cropType === 'onion'
                        ? 'border-[#16532d] bg-[#b2f1be]/30 font-bold'
                        : 'border-[#c0c9be]/40 bg-[#f1f4ef]'
                    }`}
                  >
                    <span className="text-3xl">🧅</span>
                    <span className="text-xs">Red Onion</span>
                    <span className="text-[10px] text-[#404941]">
                      {currentLang === 'en' ? 'Onion' : 'कांदा'}
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        cropType: 'tomato',
                        cropNameEn: 'Tomato Vaishali',
                        cropNameLocal: 'टोमॅटो वैशाली',
                        localMandiBenchmark: 1450
                      })
                    }
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      formData.cropType === 'tomato'
                        ? 'border-[#16532d] bg-[#b2f1be]/30 font-bold'
                        : 'border-[#c0c9be]/40 bg-[#f1f4ef]'
                    }`}
                  >
                    <span className="text-3xl">🍅</span>
                    <span className="text-xs">Tomato</span>
                    <span className="text-[10px] text-[#404941]">
                      {currentLang === 'en' ? 'Tomato' : 'टोमॅटो'}
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        cropType: 'potato',
                        cropNameEn: 'Potato Jyoti',
                        cropNameLocal: 'बटाटा कुफरी',
                        localMandiBenchmark: 1800
                      })
                    }
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      formData.cropType === 'potato'
                        ? 'border-[#16532d] bg-[#b2f1be]/30 font-bold'
                        : 'border-[#c0c9be]/40 bg-[#f1f4ef]'
                    }`}
                  >
                    <span className="text-3xl">🥔</span>
                    <span className="text-xs">Potato</span>
                    <span className="text-[10px] text-[#404941]">
                      {currentLang === 'en' ? 'Potato' : 'बटाटा'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Quantity */}
            {step === 2 && (
              <div className="flex flex-col gap-2 pt-2">
                <label className="font-label-sm font-bold text-[#191c1a] text-xs">Total Harvest Weight in Kilograms:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.quantityKg}
                    onChange={(e) =>
                      setFormData({ ...formData, quantityKg: Math.max(10, Number(e.target.value)) })
                    }
                    className="flex-1 p-2.5 rounded-lg border border-[#c0c9be] text-lg font-bold font-mono"
                    min="10"
                    max="50000"
                  />
                  <span className="font-bold text-[#404941] text-xs">kg ({formData.quantityKg / 100} Qtl)</span>
                </div>
                <div className="flex gap-1.5 pt-1 flex-wrap">
                  {[180, 500, 750, 1500, 3000].map((q) => (
                    <button
                      key={q}
                      onClick={() => setFormData({ ...formData, quantityKg: q })}
                      className="px-2.5 py-1 bg-[#ecefea] rounded text-xs font-bold hover:bg-[#e0e3df] cursor-pointer"
                    >
                      {q}kg
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Quality Grade */}
            {step === 3 && (
              <div className="flex flex-col gap-2 pt-2">
                <label className="font-label-sm font-bold text-[#191c1a] text-xs">
                  {currentLang === 'en' ? 'Quality Grading:' : 'Quality Grading (प्रतवारी):'}
                </label>
                {(['Grade A', 'Grade B', 'Fair Average Quality (FAQ)'] as QualityGrade[]).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setFormData({ ...formData, grade })}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                      formData.grade === grade ? 'border-[#16532d] bg-[#b2f1be]/30 font-bold' : 'border-[#c0c9be]/40'
                    }`}
                  >
                    <span className="text-sm">{grade}</span>
                    <span className="text-xs text-[#404941]">
                      {grade === 'Grade A' ? 'Premium color & size' : grade === 'Grade B' ? 'Medium size' : 'Mixed size'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Harvest Date */}
            {step === 4 && (
              <div className="flex flex-col gap-2 pt-2">
                <label className="font-label-sm font-bold text-[#191c1a] text-xs">Harvest Date / Picking Time:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 2, 5].map((d) => (
                    <button
                      key={d}
                      onClick={() => setFormData({ ...formData, harvestDateDaysAgo: d })}
                      className={`p-3 rounded-lg border flex flex-col items-center cursor-pointer ${
                        formData.harvestDateDaysAgo === d
                          ? 'border-[#16532d] bg-[#b2f1be]/30 font-bold'
                          : 'border-[#c0c9be]/40'
                      }`}
                    >
                      <span className="text-base font-bold">{d === 0 ? 'Today' : `${d}d ago`}</span>
                      <span className="text-[10px] text-[#404941]">{d === 0 ? 'Freshly picked' : 'Cured'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Storage */}
            {step === 5 && (
              <div className="flex flex-col gap-2 pt-2">
                <label className="font-label-sm font-bold text-[#191c1a] text-xs">
                  {currentLang === 'en' ? 'On-Farm Storage Capability:' : 'On-Farm Storage Capability (साठवणूक):'}
                </label>
                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      storageAvailable: true,
                      storageType: 'ventilated_chawl'
                    })
                  }
                  className={`p-3 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                    formData.storageAvailable && formData.storageType === 'ventilated_chawl'
                      ? 'border-[#16532d] bg-[#b2f1be]/30 font-bold'
                      : 'border-[#c0c9be]/40'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">
                      {currentLang === 'en' ? 'Ventilated Kanda Chawl' : 'Ventilated Kanda Chawl (कांदा चाळ)'}
                    </div>
                    <div className="text-xs text-[#404941]">Wooden slatted structure with airflow</div>
                  </div>
                  <Warehouse className="w-5 h-5 text-[#16532d]" />
                </button>
                <button
                  onClick={() =>
                    setFormData({
                      ...formData,
                      storageAvailable: false,
                      storageType: 'field_open'
                    })
                  }
                  className={`p-3 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                    !formData.storageAvailable
                      ? 'border-[#ba1a1a] bg-[#ffdad6]/40 font-bold'
                      : 'border-[#c0c9be]/40'
                  }`}
                >
                  <div>
                    <div className="font-bold text-[#93000a] text-sm">
                      {currentLang === 'en' ? 'No Protected Storage (Open Field)' : 'No Protected Storage (खुला शेत)'}
                    </div>
                    <div className="text-xs text-[#404941]">Stored in open field or gunny bags</div>
                  </div>
                  <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
                </button>
              </div>
            )}

            {/* Step 6: Cash Urgency & Market Benchmark */}
            {step === 6 && (
              <div className="flex flex-col gap-3 pt-2">
                <div>
                  <label className="font-label-sm font-bold text-[#191c1a] text-xs">
                    {currentLang === 'en' ? 'Cash Urgency:' : 'Cash Urgency (पैशांची गरज):'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => setFormData({ ...formData, cashUrgency: 'can_wait' })}
                      className={`p-2.5 rounded-lg border text-center cursor-pointer text-xs ${
                        formData.cashUrgency === 'can_wait'
                          ? 'border-[#16532d] bg-[#b2f1be]/30 font-bold'
                          : 'border-[#c0c9be]/40'
                      }`}
                    >
                      Can Wait 5-7d
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, cashUrgency: 'urgent' })}
                      className={`p-2.5 rounded-lg border text-center cursor-pointer text-xs ${
                        formData.cashUrgency === 'urgent'
                          ? 'border-[#ba1a1a] bg-[#ffdad6]/40 font-bold'
                          : 'border-[#c0c9be]/40'
                      }`}
                    >
                      Need Urgent Cash
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-label-sm font-bold text-[#191c1a] text-xs">Local Mandi Benchmark (₹/Qtl):</label>
                  <input
                    type="number"
                    value={formData.localMandiBenchmark}
                    onChange={(e) =>
                      setFormData({ ...formData, localMandiBenchmark: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-lg border border-[#c0c9be] font-mono font-bold mt-1 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Wizard Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-[#c0c9be]/40">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 rounded-lg bg-[#ecefea] font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <span />
              )}

              {step < 6 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2 rounded-lg bg-[#16532d] text-white font-bold text-xs cursor-pointer hover:bg-[#003b1b] flex items-center gap-1"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSaveWizard}
                  className="px-5 py-2 rounded-lg bg-[#003b1b] text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Generate Selling Decision</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
