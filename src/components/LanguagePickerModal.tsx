import React, { useState, useMemo } from 'react';
import { Globe, Search, Check, X, Sparkles } from 'lucide-react';
import { SupportedLang } from '../i18n';
import { ALL_SCHEDULED_LANGUAGES, BhashiniLanguageInfo } from '../services/bhashiniService';

interface LanguagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLang;
  onSelectLanguage: (lang: SupportedLang) => void;
}

export const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLanguage
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ALL_SCHEDULED_LANGUAGES;
    return ALL_SCHEDULED_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.region.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-2xl border border-[#c0c9be]/50 flex flex-col gap-3 max-h-[88vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c0c9be]/30 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#16532d] text-white flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline-sm font-bold text-[#191c1a] text-base leading-tight">
                {currentLang === 'mr'
                  ? 'भाषा निवडा / Select Language'
                  : currentLang === 'en'
                  ? 'Select Language'
                  : 'भाषा निवडा / भाषा चुनें (Select Language)'}
              </h3>
              <p className="font-label-sm text-[#404941] text-xs">
                {currentLang === 'mr'
                  ? 'सर्व २२ भारतीय भाषा (मराठीसह) + इंग्रजी'
                  : 'All 22 Scheduled Indian Languages (including Marathi) + English'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ecefea] flex items-center justify-center text-[#404941] hover:text-black cursor-pointer transition-colors"
            title="Close language selector"
            id="closeLangModalBtn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bhashini Badge */}
        <div className="bg-[#f7faf5] border border-[#16532d]/25 rounded-xl p-2.5 text-xs text-[#003b1b] flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#b2f1be] flex items-center justify-center flex-shrink-0 text-[#003b1b]">
            <Sparkles className="w-3.5 h-3.5 text-[#16532d]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[11px] leading-tight">
              Bhashini Language Mission (NLTM, MeitY, Govt. of India)
            </span>
            <span className="text-[10px] text-[#404941] leading-tight">
              Instant AI translation across all 22 official languages of India
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#717970]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'mr'
                ? 'भाषा शोधा (उदा. मराठी, हिंदी, तमिळ, बंगाली)...'
                : currentLang === 'en'
                ? 'Search language (e.g. Marathi, Tamil, Bengali)...'
                : 'भाषा शोधा / भाषा खोजें / Search (उदा. मराठी, தமிழ்)...'
            }
            className="w-full bg-[#f1f4ef] border border-[#c0c9be]/40 rounded-xl pl-9 pr-3 py-2 text-xs text-[#191c1a] placeholder:text-[#717970] focus:outline-hidden focus:border-[#16532d] focus:bg-white transition-all"
            autoFocus
          />
        </div>

        {/* Language Grid / List */}
        <div className="overflow-y-auto pr-1 flex flex-col gap-1.5 max-h-[50vh] divide-y divide-[#ecefea]">
          {filteredLanguages.map((lang: BhashiniLanguageInfo) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#b2f1be]/40 border border-[#16532d]/40 shadow-xs'
                    : 'hover:bg-[#f1f4ef] border border-transparent'
                }`}
                id={`langOption_${lang.code}`}
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#191c1a] text-sm leading-snug">
                      {lang.nativeName}
                    </span>
                    <span className="text-xs text-[#404941] font-medium">
                      ({lang.name})
                    </span>
                    {lang.code === 'mr' && (
                      <span className="text-[9px] font-semibold bg-[#16532d]/10 text-[#16532d] px-1.5 py-0.5 rounded-full border border-[#16532d]/20">
                        महाराष्ट्र
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#717970] truncate">
                    {lang.region}
                  </span>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-[#16532d] text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-[#717970] uppercase px-1.5 py-0.5 bg-[#ecefea] rounded">
                    {lang.code}
                  </span>
                )}
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="text-center py-6 text-xs text-[#717970]">
              No language found matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
