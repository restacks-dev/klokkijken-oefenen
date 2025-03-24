import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import nlTranslations from './locales/nl.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';
import deTranslations from './locales/de.json';

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      nl: { translation: nlTranslations },
      fr: { translation: frTranslations },
      es: { translation: esTranslations },
      de: { translation: deTranslations },
    },
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false
    }
  });

// Set initial title
document.title = i18n.t('app.title');

// Update document title when language changes
i18n.on('languageChanged', () => {
  document.title = i18n.t('app.title');
});

export default i18n; 