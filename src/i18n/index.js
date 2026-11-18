import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import idTranslation from './locales/id.json';
import enTranslation from './locales/en.json';

const INDONESIA_TIMEZONES = new Set([
  'Asia/Jakarta',
  'Asia/Pontianak',
  'Asia/Makassar',
  'Asia/Jayapura',
  'Asia/Ujung_Pandang'
]);

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'id';

  // 1. Respect explicit query parameter (?lang=en or ?lang=id)
  try {
    const queryLang = new URLSearchParams(window.location.search).get('lang');
    if (queryLang === 'id' || queryLang === 'en') return queryLang;
  } catch {
    // Ignore malformed query string
  }

  // 2. Respect saved user preference from ID/EN switcher
  try {
    const saved = window.localStorage.getItem('lang');
    if (saved === 'id' || saved === 'en') return saved;
  } catch {
    // Ignore storage restriction
  }

  // 3. Auto-detect visitor browser locale
  const locales = [
    ...(Array.isArray(window.navigator?.languages) ? window.navigator.languages : []),
    window.navigator?.language
  ].filter(Boolean);

  if (locales.some((loc) => /^(id|in)(-|$)/i.test(String(loc)))) {
    return 'id';
  }

  // 4. Default to Indonesian for devices in Indonesian timezones (even with en-US OS UI)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && INDONESIA_TIMEZONES.has(tz)) {
      return 'id';
    }
  } catch {
    // Ignore timezone access error
  }

  // 5. Visitors outside Indonesia automatically receive English
  return locales.length > 0 ? 'en' : 'id';
}

const initialLanguage = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources: {
    id: { translation: idTranslation },
    en: { translation: enTranslation }
  },
  lng: initialLanguage,
  fallbackLng: 'id',
  interpolation: { escapeValue: false }
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLanguage;
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng === 'en' ? 'en' : 'id';
  });
}

export default i18n;
