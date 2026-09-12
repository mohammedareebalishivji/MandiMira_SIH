import { CropType } from '../types';
import { SupportedLang } from './index';

export interface LocalizedCrop {
  name: string;
  variety: string;
}

export const CROP_NAMES: Record<CropType, Record<SupportedLang, LocalizedCrop>> = {
  onion: {
    en: { name: 'Onion', variety: 'Nashik Red Onion' },
    hi: { name: 'प्याज', variety: 'नासिक लाल प्याज' },
    mr: { name: 'कांदा', variety: 'नाशिक लाल कांदा' },
    bn: { name: 'পেঁয়াজ', variety: 'নাসিক লাল পেঁয়াজ' },
    te: { name: 'ఉల్లిపాయ', variety: 'నాసిక్ ఎరుపు ఉల్లిపాయ' },
    ta: { name: 'வெங்காயம்', variety: 'நாசிக் சிவப்பு வெங்காயம்' },
    gu: { name: 'ડુંગળી', variety: 'નાસિક લાલ ડુંગળી' },
    kn: { name: 'ಈರುಳ್ಳಿ', variety: 'ನಾಸಿಕ್ ಕೆಂಪು ಈರುಳ್ಳಿ' },
    ml: { name: 'ഉള്ളി', variety: 'നാസിക് ചുവന്ന ഉള്ളി' },
    pa: { name: 'ਪਿਆਜ਼', variety: 'ਨਾਸਿਕ ਲਾਲ ਪਿਆਜ਼' },
    or: { name: 'ପିଆଜ', variety: 'ନାସିକ ଲାଲ ପିଆଜ' },
    as: { name: 'পিয়াঁজ', variety: 'নাচিক ৰঙা পিয়াঁজ' },
    ur: { name: 'پیاز', variety: 'ناسک لال پیاز' },
    ne: { name: 'प्याज', variety: 'नासिक रातो प्याज' },
    sa: { name: 'पलाण्डुः', variety: 'नासिक रक्तपलाण्डुः' },
    mai: { name: 'पियाज', variety: 'नासिक लाल पियाज' },
    ks: { name: 'گنڈٕ', variety: 'ناسک وۄזُل گنڈٕ' },
    gom: { name: 'कांदो', variety: 'नाशिक तांबडो कांदो' },
    sd: { name: 'بصر', variety: 'ناسک ڳاڙهو بصر' },
    doi: { name: 'प्याज', variety: 'नासिक लाल प्याज' },
    brx: { name: 'पियाज', variety: 'नासिक गोजा पियाज' },
    mni: { name: 'তিলহৌ', variety: 'নাসিক অঙাংবা তিলহৌ' },
    sat: { name: 'ᱯᱮᱭᱟᱸᱡᱽ', variety: 'ᱱᱟᱥᱤᱠ ᱟᱨᱟᱜ ᱯᱮᱭᱟᱸᱡᱽ' }
  },
  tomato: {
    en: { name: 'Tomato', variety: 'Hybrid Table Tomato' },
    hi: { name: 'टमाटर', variety: 'हाइब्रिड टमाटर' },
    mr: { name: 'टोमॅटो', variety: 'हायब्रिड टेबल टोमॅटो' },
    bn: { name: 'টমেটো', variety: 'হাইব্রিড টেবিল টমেটো' },
    te: { name: 'టమోటా', variety: 'హైబ్రిడ్ టేబుల్ టమోటా' },
    ta: { name: 'தக்காளி', variety: 'ஹைப்ரிட் தக்காளி' },
    gu: { name: 'ટામેટાં', variety: 'હાઇબ્રિડ ટામેટાં' },
    kn: { name: 'ಟೊಮೆಟೊ', variety: 'ಹೈಬ್ರಿಡ್ ಟೊಮೆಟೊ' },
    ml: { name: 'തക്കാളി', variety: 'ഹൈബ്രിഡ് തക്കാളി' },
    pa: { name: 'ਟਮਾਟਰ', variety: 'ਹਾਈਬ੍ਰਿਡ ਟਮਾਟਰ' },
    or: { name: 'ଟମାଟୋ', variety: 'ହାଇବ୍ରିଡ୍ ଟମାଟୋ' },
    as: { name: 'বিলাহী', variety: 'হাইব্ৰিড বিলাহী' },
    ur: { name: 'ٹماٹر', variety: 'ہائبرڈ ٹماٹر' },
    ne: { name: 'गोलभेँडा', variety: 'हाइब्रिड गोलभेँडा' },
    sa: { name: 'रक्ताङ्गकम्', variety: 'मिश्रित रक्ताङ्गकम्' },
    mai: { name: 'टमाटर', variety: 'हाइब्रिड टमाटर' },
    ks: { name: 'ٹماٹر', variety: 'ہائبرڈ ٹماٹر' },
    gom: { name: 'टोमॅटो', variety: 'हायब्रीड टोमॅटो' },
    sd: { name: 'ٽماٽو', variety: 'هائبرڊ ٽماٽو' },
    doi: { name: 'टमाटार', variety: 'हाइब्रिड टमाटार' },
    brx: { name: 'थामाथिर', variety: 'हाइब्रिड थामाथिर' },
    mni: { name: 'খোমনাম তিলহৌ', variety: 'হাইব্রিদ খোমনাম তিলহৌ' },
    sat: { name: 'ᱵᱤᱞᱟᱹᱛᱤ', variety: 'ᱦᱟᱭᱵᱽᱨᱤᱰ ᱵᱤᱞᱟᱹᱛᱤ' }
  },
  potato: {
    en: { name: 'Potato', variety: 'Jyoti Grade A Potato' },
    hi: { name: 'आलू', variety: 'ज्योति ग्रेड ए आलू' },
    mr: { name: 'बटाटा', variety: 'ज्योती ग्रेड ए बटाटा' },
    bn: { name: 'আলু', variety: 'জ্যোতি গ্রেড এ আলু' },
    te: { name: 'బంగాళాదుంప', variety: 'జ్యోతి గ్రేడ్ ఎ బంగాళాదుంప' },
    ta: { name: 'உருளைக்கிழங்கு', variety: 'ஜோதி கிரேடு ஏ உருளைக்கிழங்கு' },
    gu: { name: 'બટાકા', variety: 'જ્યોતિ ગ્રેડ એ બટાકા' },
    kn: { name: 'ಆಲೂಗಡ್ಡೆ', variety: 'ಜ್ಯೋತಿ ಗ್ರೇಡ್ ಎ ಆಲೂಗಡ್ಡೆ' },
    ml: { name: 'ഉരുളക്കിഴങ്ങ്', variety: 'ജ്യോതി ഗ്രേഡ് എ ഉരുളക്കിഴങ്ങ്' },
    pa: { name: 'ਆਲੂ', variety: 'ਜਯੋਤੀ ਗ੍ਰੇਡ ਏ ਆਲੂ' },
    or: { name: 'ଆଳୁ', variety: 'ଜ୍ୟୋତି ଗ୍ରେଡ୍ ଏ ଆଳୁ' },
    as: { name: 'আলু', variety: 'জ্যোতি গ্ৰেড এ আলু' },
    ur: { name: 'آلو', variety: 'جیوتی گریڈ اے آلو' },
    ne: { name: 'आलु', variety: 'ज्योति ग्रेड ए आलु' },
    sa: { name: 'आलुकम्', variety: 'ज्योति श्रेण्य आलुकम्' },
    mai: { name: 'आलू', variety: 'ज्योति ग्रेड ए आलू' },
    ks: { name: 'اولو', variety: 'جیوتی گریڈ اے اولو' },
    gom: { name: 'बटाट', variety: 'ज्योती वर्ग ए बटाट' },
    sd: { name: 'پٽاٽو', variety: 'جيوٽي گريڊ اي پٽاٽو' },
    doi: { name: 'आलू', variety: 'ज्योति ग्रेड ए आलू' },
    brx: { name: 'थासों', variety: 'ज्योति रोखोम ए थासों' },
    mni: { name: 'আলু', variety: 'জ্যোতি গ্রেদ এ আলু' },
    sat: { name: 'ᱟᱹᱞᱩ', variety: 'ᱡᱽᱭᱳᱛᱤ ᱜᱽᱨᱮᱰ ᱮ ᱟᱹᱞᱩ' }
  }
};

export function getLocalizedCropName(cropType: CropType, lang: SupportedLang): string {
  const crop = CROP_NAMES[cropType]?.[lang] || CROP_NAMES[cropType]?.['en'];
  return crop?.variety || crop?.name || cropType;
}
