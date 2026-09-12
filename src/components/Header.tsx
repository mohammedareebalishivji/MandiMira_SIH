import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Sprout, ShieldCheck, User, Globe, ChevronDown, Check, Search, X, Sparkles } from 'lucide-react';
import { SupportedLang } from '../i18n';
import { ALL_SCHEDULED_LANGUAGES, BhashiniLanguageInfo } from '../services/bhashiniService';

interface HeaderProps {
  currentLang: SupportedLang;
  onLanguageChange: (lang: SupportedLang) => void;
  onOpenLanguagePicker?: () => void;
  isEasyMode: boolean;
  onToggleEasyMode: () => void;
  onOpenJudgeDemo: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenLanguagePicker,
  isEasyMode,
  onToggleEasyMode,
  onOpenJudgeDemo,
  onOpenProfile
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentLangObj = ALL_SCHEDULED_LANGUAGES.find((l) => l.code === currentLang);
  const isCustomLang = !['en', 'hi', 'mr'].includes(currentLang);

  // Filter languages in dropdown
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

  // Handle clicking outside to dismiss dropdown
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Escape key closes dropdown
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen]);

  const handleSelectLang = (code: SupportedLang) => {
    onLanguageChange(code);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    if (onOpenLanguagePicker) {
      // Optional callback support
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#f7faf5]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.05)] border-b border-[#c0c9be]/30 pt-safe">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex flex-col gap-2">
        {/* Top Row / Main Header Bar */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <img
              alt="MandiMitra Icon Logo"
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain flex-shrink-0"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VtO_RfVMaAs9zzAXS6ByvexAwr2km7HWwAlULXIADkzhHkIMYFetLijZEoQRn_G50Kx08mSF1SVIPBmSo4jBJrsvvGFkIcm4OvitVg6w91p8BaTo4i4GlNdg125krFDndpaQq08dXjWNUeBB8D0w36M83qp65zEHExRiuu6njJYf2GU9Hv8NlKzIVPZtqVrTvPjzhB4NIjvDp1bdI19edMUaY48HxQZnBn6nYhIsGXYSD3UoRcQ9xLqlYC"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-headline-sm text-[#003b1b] tracking-tight truncate font-bold text-base sm:text-lg leading-tight">
                  {currentLang === 'en' ? 'MandiMitra' : 'मंडीमित्र'}
                </span>
                <Sprout className="w-4 h-4 text-[#16532d] flex-shrink-0" />
              </div>
              <span className="font-label-sm text-[#404941] truncate text-[11px] sm:text-xs leading-tight">
                {currentLang === 'en'
                  ? (isEasyMode ? 'Easy View' : 'Mandi Decision Hub')
                  : (isEasyMode ? 'सरल दृश्य' : 'मंडी निर्णय केंद्र')}
              </span>
            </div>
          </div>

          {/* Action CTAs: Judge Demo & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={onOpenJudgeDemo}
              className="min-h-[36px] sm:min-h-[38px] px-2.5 sm:px-3 rounded-full bg-[#fe932c] text-[#2f1500] font-label-sm flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs font-bold cursor-pointer text-xs"
              title="Click to view SIH Judge walkthrough"
              id="judgeDemoBtn"
            >
              <ShieldCheck className="w-4 h-4 text-[#2f1500] flex-shrink-0" />
              <span className="whitespace-nowrap">Judge Demo</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#003b1b] flex items-center justify-center flex-shrink-0 text-white active:scale-95 transition-transform cursor-pointer"
              title="Farmer Profile & Settings"
              id="farmerProfileBtn"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Language Switcher & Easy Mode */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 flex-wrap">
          {/* Language Selector Capsule */}
          <div className="relative flex items-center bg-[#ecefea] rounded-full p-0.5 border border-[#c0c9be]/40 gap-0.5">
            {/* Quick English Button */}
            <button
              onClick={() => handleSelectLang('en')}
              className={`min-h-[28px] px-2 sm:px-2.5 rounded-full text-xs transition-all cursor-pointer ${
                currentLang === 'en'
                  ? 'bg-white text-[#003b1b] font-bold shadow-xs'
                  : 'text-[#404941] hover:text-[#191c1a]'
              }`}
              id="quickLangEn"
            >
              EN
            </button>

            {/* Quick Hindi Button */}
            <button
              onClick={() => handleSelectLang('hi')}
              className={`min-h-[28px] px-2 sm:px-2.5 rounded-full text-xs transition-all cursor-pointer ${
                currentLang === 'hi'
                  ? 'bg-white text-[#003b1b] font-bold shadow-xs'
                  : 'text-[#404941] hover:text-[#191c1a]'
              }`}
              id="quickLangHi"
            >
              हिंदी
            </button>

            {/* Quick Marathi Button */}
            <button
              onClick={() => handleSelectLang('mr')}
              className={`min-h-[28px] px-2 sm:px-2.5 rounded-full text-xs transition-all cursor-pointer ${
                currentLang === 'mr'
                  ? 'bg-white text-[#003b1b] font-bold shadow-xs'
                  : 'text-[#404941] hover:text-[#191c1a]'
              }`}
              id="quickLangMr"
            >
              मराठी
            </button>

            {/* Interactive 22 Scheduled Indian Languages Dropdown Button */}
            <button
              ref={buttonRef}
              onClick={handleToggleDropdown}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              className={`min-h-[28px] px-2 sm:px-2.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isCustomLang
                  ? 'bg-[#16532d] text-white shadow-xs'
                  : isDropdownOpen
                  ? 'bg-white text-[#003b1b] shadow-xs'
                  : 'text-[#003b1b] hover:bg-white/80'
              }`}
              title="All 22 Indian Languages (Bhashini National Language Mission)"
              id="allLanguagesBtn"
            >
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {isCustomLang && currentLangObj
                  ? currentLangObj.nativeName
                  : currentLang === 'mr'
                  ? '२२ भाषा'
                  : currentLang === 'en'
                  ? '22 Languages'
                  : '22 भाषा'}
              </span>
              <ChevronDown
                className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Container */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-[#c0c9be]/50 p-2.5 z-50 flex flex-col gap-2 max-h-[70vh] animate-in fade-in zoom-in-95 duration-150"
                role="listbox"
                id="languageDropdownList"
              >
                {/* Header with Title & Close */}
                <div className="flex items-center justify-between border-b border-[#c0c9be]/30 pb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#16532d]" />
                    <span className="font-bold text-[#191c1a] text-xs">
                      {currentLang === 'mr'
                        ? 'सर्व २२ भारतीय भाषा (मराठीसह) / All Languages'
                        : currentLang === 'en'
                        ? 'All 22 Scheduled Indian Languages (including Marathi)'
                        : '२२ भारतीय भाषा (मराठी सहित) / All Languages'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-6 h-6 rounded-full hover:bg-[#ecefea] flex items-center justify-center text-[#404941] cursor-pointer"
                    title="Close dropdown"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bhashini Info Banner */}
                <div className="bg-[#f7faf5] border border-[#16532d]/20 rounded-lg p-2 text-[10px] text-[#003b1b] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#16532d] flex-shrink-0" />
                  <span className="leading-tight">
                    {currentLang === 'mr'
                      ? 'भाषिणी राष्ट्रीय भाषा मिशन (NLTM) • मराठी आणि २२ भाषा'
                      : 'Bhashini NLTM (MeitY, Govt. of India) • मराठी, हिन्दी & 20 Languages'}
                  </span>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#717970]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      currentLang === 'mr'
                        ? 'भाषा शोधा (उदा. मराठी, हिंदी, बंगाली, तेलुगु)...'
                        : currentLang === 'en'
                        ? 'Search language (e.g. Marathi, Bengali, Telugu)...'
                        : 'भाषा शोधा / भाषा खोजें / Search (उदा. मराठी, தமிழ்)...'
                    }
                    className="w-full bg-[#f1f4ef] border border-[#c0c9be]/40 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-[#191c1a] placeholder:text-[#717970] focus:outline-hidden focus:border-[#16532d] focus:bg-white"
                    autoFocus
                  />
                </div>

                {/* Languages List */}
                <div className="overflow-y-auto pr-1 flex flex-col gap-1 max-h-[45vh] divide-y divide-[#ecefea]/60">
                  {filteredLanguages.map((lang: BhashiniLanguageInfo) => {
                    const isSelected = currentLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleSelectLang(lang.code)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#b2f1be]/50 text-[#00210c] font-bold border border-[#16532d]/30'
                            : 'hover:bg-[#f1f4ef] text-[#191c1a]'
                        }`}
                        role="option"
                        aria-selected={isSelected}
                        id={`headerLangOption_${lang.code}`}
                      >
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs leading-snug">
                              {lang.nativeName}
                            </span>
                            <span className="text-[11px] text-[#404941] font-medium">
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
                          <div className="w-5 h-5 rounded-full bg-[#16532d] text-white flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-[#717970] uppercase px-1 py-0.5 bg-[#ecefea] rounded">
                            {lang.code}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {filteredLanguages.length === 0 && (
                    <div className="text-center py-4 text-xs text-[#717970]">
                      No language found for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Easy Mode Toggle */}
          <button
            onClick={onToggleEasyMode}
            className={`min-h-[28px] px-2.5 rounded-full text-xs flex items-center gap-1.5 transition-all cursor-pointer border flex-shrink-0 ${
              isEasyMode
                ? 'bg-[#b2f1be] text-[#00210c] border-[#16532d] font-bold shadow-xs'
                : 'bg-[#e6e9e4] text-[#191c1a] border-[#c0c9be]/50 hover:bg-[#e0e3df]'
            }`}
            id="easyModeToggleBtn"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isEasyMode ? 'bg-[#16532d] animate-pulse' : 'bg-[#717970]'
              }`}
            />
            <span className="whitespace-nowrap">
              {currentLang === 'en'
                ? (isEasyMode ? 'Easy Mode (ON)' : 'Easy Mode')
                : (isEasyMode ? 'सरल मोड (ON)' : 'सरल मोड')}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
