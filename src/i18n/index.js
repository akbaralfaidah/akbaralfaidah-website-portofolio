import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import idTranslation from './locales/id.json';
import enTranslation from './locales/en.json';

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'id';
  try {
    const saved = window.localStorage.getItem('lang');
    if (saved === 'id' || saved === 'en') return saved;
  } catch {
    // Ignore storage restriction
  }
  return 'id';
}

i18n.use(initReactI18next).init({
  resources: {
    id: { translation: idTranslation },
    en: { translation: enTranslation }
  },
  lng: getInitialLanguage(),
  fallbackLng: 'id',
  interpolation: { escapeValue: false }
});

export default i18n;
