import { SupportedLang, Translations, translations } from '../i18n';

export interface BhashiniLanguageInfo {
  code: SupportedLang;
  name: string;
  nativeName: string;
  region: string;
  speechCode: string;
}

export const ALL_SCHEDULED_LANGUAGES: BhashiniLanguageInfo[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'North / Central India', speechCode: 'hi-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra', speechCode: 'mr-IN' },
  { code: 'en', name: 'English', nativeName: 'English', region: 'Pan-India', speechCode: 'en-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal / Tripura', speechCode: 'bn-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh / Telangana', speechCode: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu / Puducherry', speechCode: 'ta-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat', speechCode: 'gu-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka', speechCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala', speechCode: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab / Haryana', speechCode: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha', speechCode: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam', speechCode: 'as-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'Pan-India', speechCode: 'ur-IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'Sikkim / North Bengal', speechCode: 'ne-NP' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', region: 'Bihar / Jharkhand', speechCode: 'mai-IN' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', region: 'Classical', speechCode: 'sa-IN' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / کٲشُر', region: 'Jammu & Kashmir', speechCode: 'ks-IN' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', region: 'Goa / Coastal Karnataka', speechCode: 'kok-IN' },
  { code: 'sd', name: 'Sindhi', nativeName: 'सिंधी / سنڌي', region: 'Pan-India / Gujarat', speechCode: 'sd-IN' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', region: 'Jammu', speechCode: 'doi-IN' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर\'', region: 'Bodoland / Assam', speechCode: 'brx-IN' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', region: 'Manipur', speechCode: 'mni-IN' },
  { code: 'sat', name: 'Santali', nativeName: 'संताली / ᱥᱟᱱᱛᱟᱲᱤ', region: 'Jharkhand / Odisha', speechCode: 'sat-IN' }
];

// In-memory + LocalStorage Cache for Bhashini pipeline results
const CACHE_PREFIX = 'mandimitra_bhashini_';

export function getCachedTranslation(key: string, lang: SupportedLang): string | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${lang}_${key}`);
    return cached;
  } catch {
    return null;
  }
}

export function setCachedTranslation(key: string, lang: SupportedLang, value: string): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${lang}_${key}`, value);
  } catch {
    // ignore storage quota errors
  }
}

export interface BhashiniASRConfig {
  sourceLanguage: SupportedLang;
  serviceId: string;
}

/**
 * Bhashini ASR & NMT Pipeline Service
 * MeitY / Digital India Bhashini National Language Translation Mission integration
 */
export const bhashiniService = {
  /**
   * Get speech recognition code for Web Speech API fallback or Bhashini ASR endpoint
   */
  getSpeechLanguageCode(lang: SupportedLang): string {
    const found = ALL_SCHEDULED_LANGUAGES.find((l) => l.code === lang);
    return found ? found.speechCode : 'hi-IN';
  },

  /**
   * Get human readable name for language
   */
  getLanguageName(lang: SupportedLang): string {
    const found = ALL_SCHEDULED_LANGUAGES.find((l) => l.code === lang);
    return found ? `${found.nativeName} (${found.name})` : lang;
  },

  /**
   * Translates dynamic farmer text via Bhashini pipeline or local linguistic model
   */
  async translateText(text: string, targetLang: SupportedLang, sourceLang: SupportedLang = 'en'): Promise<string> {
    if (targetLang === sourceLang || !text.trim()) {
      return text;
    }

    const cached = getCachedTranslation(text, targetLang);
    if (cached) return cached;

    // Check if translation exists in pre-seeded dictionary
    const langDict = translations[targetLang]?.standard;
    if (langDict) {
      const match = Object.entries(translations.en.standard).find(([_, v]) => v.toLowerCase() === text.toLowerCase());
      if (match) {
        const translatedVal = (langDict as any)[match[0]];
        if (translatedVal) {
          setCachedTranslation(text, targetLang, translatedVal);
          return translatedVal;
        }
      }
    }

    // Attempt Bhashini ULCA endpoint if API key exists in environment
    const bhashiniKey = (import.meta as any).env?.VITE_BHASHINI_API_KEY;
    if (bhashiniKey) {
      try {
        const res = await fetch('https://dhruva-api.bhashini.gov.in/services/inference/pipeline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': bhashiniKey
          },
          body: JSON.stringify({
            pipelineTasks: [
              {
                taskType: 'translation',
                config: {
                  language: {
                    sourceLanguage: sourceLang,
                    targetLanguage: targetLang
                  }
                }
              }
            ],
            inputData: {
              input: [{ source: text }]
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const translated = data?.pipelineResponse?.[0]?.output?.[0]?.target;
          if (translated) {
            setCachedTranslation(text, targetLang, translated);
            return translated;
          }
        }
      } catch (e) {
        console.warn('Bhashini live API fallback to local linguistic dictionary:', e);
      }
    }

    // Default fallback: return original text
    return text;
  }
};
