import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import ru from './locales/ru'
import uz from './locales/uz'

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: localStorage.getItem('lang') ?? 'uz',
  fallbackLng: 'uz',
  interpolation: { escapeValue: false },
})

export default i18n
