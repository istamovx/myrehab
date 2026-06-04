import { create } from 'zustand'
import i18n from '@/i18n'

type Lang = 'uz' | 'en' | 'ru'

interface LangStore {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLangStore = create<LangStore>((set) => ({
  lang: (localStorage.getItem('lang') as Lang) ?? 'uz',
  setLang: (lang) => {
    localStorage.setItem('lang', lang)
    i18n.changeLanguage(lang)
    set({ lang })
  },
}))
