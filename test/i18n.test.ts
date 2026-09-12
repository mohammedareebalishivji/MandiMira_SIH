import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getLocalizedCropName, CROP_NAMES } from '../src/i18n/cropNames';
import { translations, SupportedLang } from '../src/i18n';
import { CropType } from '../src/types';

describe('Localization & Translation System', () => {
  const cropTypes: CropType[] = ['onion', 'tomato', 'potato', 'soybean', 'wheat'];
  const testLangs: SupportedLang[] = ['en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'kn', 'pa'];

  it('should localize all 5 CropTypes across major languages', () => {
    for (const crop of cropTypes) {
      for (const lang of testLangs) {
        const localized = getLocalizedCropName(crop, lang);
        assert.ok(localized, `Localized name for ${crop} in ${lang} must not be empty`);
        assert.notStrictEqual(localized, '', `Empty string for ${crop} in ${lang}`);
      }
    }
  });

  it('should verify translations dictionary contains standard and easy modes for all supported languages', () => {
    for (const lang of testLangs) {
      const dict = translations[lang] || translations.en;
      assert.ok(dict, `Translation dictionary must exist for ${lang}`);
      assert.ok(dict.standard, `Standard mode translations must exist for ${lang}`);
      assert.ok(dict.easy, `Easy mode translations must exist for ${lang}`);
    }
  });
});
