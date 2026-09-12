import re
import json
import sys
from complete_languages import EXTRA_KEYS
from nine_languages import NINE_LANGS

ALL_KEYS = [
    'appName', 'subtitle', 'judgeDemo', 'easyMode', 'simulate', 'offline',
    'onlineStatus', 'offlineStatus', 'sihEvaluation', 'testScenarios',
    'scenario1', 'scenario2', 'scenario3', 'greeting', 'location',
    'geoVerified', 'onFarmStorage', 'todaysMandi', 'sellingDecision',
    'confidence', 'sellTodayNet', 'spotPrice', 'mathDifferenceGain',
    'whyThis', 'compareMandis', 'whatIfTitle', 'whatIfSubtitle',
    'testVariables', 'storageToggle', 'rainToggle', 'cashToggle',
    'decisionFormulaTitle', 'decisionFormulaSubtitle', 'whereToSell',
    'bestNetRealization', 'headlineWarning', 'leverageTitle',
    'leverageSubtitle', 'mandiBenchmark', 'fairFarmgateBand',
    'hardFloorWarning', 'shareWhatsApp', 'aggregatedSelling',
    'popUpPoolTitle', 'bulkBonus', 'poolProgress', 'joinPoolBtn',
    'verifiedBuyers', 'acceptOfferBtn', 'quickEntry', 'speakToEnter',
    'recentDispatch', 'dbtSettled', 'disclaimerTitle', 'disclaimerText',
    'navHome', 'navDecision', 'navMarkets', 'navBuyers', 'navLedger',
    'holdAction', 'sellNowAction', 'joinPoolAction', 'factorPriceTrend',
    'factorWeather', 'factorStorage', 'factorSpoilage', 'modifyLot',
    'digitalLedger', 'directSettlements', 'totalRealized', 'settledVolume',
    'settledInvoices', 'recordNewSale'
]

# Read original i18n/index.ts
with open('src/i18n/index.ts', 'r', encoding='utf-8') as f:
    orig = f.read()

# Parse existing translations for 14 languages: en, hi, mr, bn, te, ta, gu, kn, ml, pa, or, as, ur, ne
existing_langs = ['en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'ur', 'ne']

parsed = {}

for l in existing_langs:
    m = re.search(rf'const {l}Standard: Translations = \{{(.*?)\}};', orig, re.DOTALL)
    if not m:
        print(f"Error: {l}Standard not found!")
        sys.exit(1)
    body = m.group(1)
    d = {}
    for line in body.split('\n'):
        line = line.strip()
        if not line or line.startswith('//') or line.startswith('...'):
            continue
        km = re.match(r"(\w+)\s*:\s*('(?:\\.|[^'])*'|\"(?:\\.|[^\"])*\")\s*,?", line)
        if km:
            k = km.group(1)
            v = km.group(2)
            # unquote
            if v.startswith("'") and v.endswith("'"):
                v = v[1:-1].replace("\\'", "'")
            elif v.startswith('"') and v.endswith('"'):
                v = v[1:-1].replace('\\"', '"')
            d[k] = v
    # Merge with EXTRA_KEYS
    if l in EXTRA_KEYS:
        d.update(EXTRA_KEYS[l])
    parsed[l] = d

# For Telugu, ensure teStandard subtitle is 'మండి నిర్ణయ కేంద్రం' and geoVerified fits cleanly
parsed['te']['subtitle'] = 'మండి నిర్ణయ కేంద్రం'

# Add the 9 languages from NINE_LANGS
for l, data in NINE_LANGS.items():
    parsed[l] = data

# Check that every single language has all keys!
all_23_langs = existing_langs + list(NINE_LANGS.keys())
print(f"Checking all {len(all_23_langs)} languages...")

for l in all_23_langs:
    missing = set(ALL_KEYS) - set(parsed[l].keys())
    if missing:
        print(f"Warning: {l} is missing keys: {missing}")
        # fallback to en for any strictly missing
        for mk in missing:
            parsed[l][mk] = parsed['en'][mk]

print("All 23 languages verified.")

# Generate new src/i18n/index.ts
out = []
out.append("export type SupportedLang =")
for l in all_23_langs:
    out.append(f"  | '{l}'")
out.append(";\n")

out.append("export interface Translations {")
for k in ALL_KEYS:
    out.append(f"  {k}: string;")
out.append("}\n")

# Language comments map
lang_names = {
    'en': 'English',
    'hi': 'Hindi (हिन्दी)',
    'mr': 'Marathi (मराठी)',
    'bn': 'Bengali (বাংলা)',
    'te': 'Telugu (తెలుగు)',
    'ta': 'Tamil (தமிழ்)',
    'gu': 'Gujarati (ગુજરાતી)',
    'kn': 'Kannada (ಕನ್ನಡ)',
    'ml': 'Malayalam (മലയാളം)',
    'pa': 'Punjabi (ਪੰਜਾਬੀ)',
    'or': 'Odia (ଓଡ଼ିଆ)',
    'as': 'Assamese (অসমীয়া)',
    'ur': 'Urdu (اردو)',
    'ne': 'Nepali (नेपाली)',
    'sa': 'Sanskrit (संस्कृतम्)',
    'mai': 'Maithili (मैथिली)',
    'ks': 'Kashmiri (كٲشُر / कॉशुर)',
    'gom': 'Konkani (कोंकणी)',
    'sd': 'Sindhi (سنڌي / सिन्धी)',
    'doi': 'Dogri (डोगरी)',
    'brx': 'Bodo (बर\')',
    'mni': 'Manipuri (মৈতৈলোন্)',
    'sat': 'Santali (ᱥᱟᱱᱛᱟᱲᱤ)'
}

for l in all_23_langs:
    out.append(f"// {lang_names.get(l, l)}")
    out.append(f"const {l}Standard: Translations = {{")
    for k in ALL_KEYS:
        val = parsed[l][k].replace("'", "\\'")
        out.append(f"  {k}: '{val}',")
    out.append("};\n")

# Easy mode variants
out.append("// Easy Mode Dictionaries")
out.append("const enEasy: Translations = {")
out.append("  ...enStandard,")
out.append("  subtitle: 'Simple View',")
out.append("  easyMode: 'Simple Mode',")
out.append("  whatIfSubtitle: 'Simple projected earnings',")
out.append("  headlineWarning: 'High mandi prices may not include transport costs.',")
out.append("  hardFloorWarning: 'Do not sell below this fair rate.',")
out.append("};\n")

out.append("const hiEasy: Translations = {")
out.append("  ...hiStandard,")
out.append("  subtitle: 'सरल दृश्य',")
out.append("  easyMode: 'सरल मोड',")
out.append("  whatIfSubtitle: 'दिन के अनुसार सीधा मुनाफा देखें',")
out.append("  headlineWarning: 'दिखाया गया बड़ा भाव पूरा आपके हाथ नहीं आता।',")
out.append("  hardFloorWarning: 'इस न्यूनतम भाव से नीचे न बेचें।',")
out.append("};\n")

out.append("const mrEasy: Translations = {")
out.append("  ...mrStandard,")
out.append("  subtitle: 'सरल दृश्य',")
out.append("  easyMode: 'सरल मोड',")
out.append("  whatIfSubtitle: 'दिवसानुसार मिळणारा निव्वळ नफा पहा',")
out.append("  headlineWarning: 'मोठा भाव पाहून फसू नका. वाहतूक खर्च वजा करून प्रत्यक्ष नफा पहा.',")
out.append("  hardFloorWarning: 'या किमान भावापेक्षा कमी दरात विकू नका.',")
out.append("};\n")

# Export translations record
out.append("export const translations: Record<SupportedLang, { standard: Translations; easy: Translations }> = {")
for l in all_23_langs:
    if l == 'en':
        out.append("  en: { standard: enStandard, easy: enEasy },")
    elif l == 'hi':
        out.append("  hi: { standard: hiStandard, easy: hiEasy },")
    elif l == 'mr':
        out.append("  mr: { standard: mrStandard, easy: mrEasy },")
    else:
        out.append(f"  {l}: {{ standard: {l}Standard, easy: {{ ...{l}Standard, subtitle: '{parsed[l]['easyMode']}' }} }},")
out.append("};\n")

final_content = "\n".join(out)
with open('src/i18n/index.ts', 'w', encoding='utf-8') as f:
    f.write(final_content)

print(f"Successfully wrote updated src/i18n/index.ts with {len(all_23_langs)} languages!")
