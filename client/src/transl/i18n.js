import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Додайте цей імпорт

import translationEN from '../locales/en/translation.json';
import translationUK from '../locales/uk/translation.json';
import translationDE from '../locales/de/translation.json';


const resources = {
  en: {
    translation: translationEN
  },
  uk: {
    translation: translationUK
  },
  de: {
    translation: translationDE
  }
};

i18n
  .use(LanguageDetector) // Додайте цей рядок
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Опціонально налаштуйте методи визначення мови
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  });

export default i18n;
