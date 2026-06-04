import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
}

function apply(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

const initial: Theme = (localStorage.getItem('theme') as Theme) ?? 'light'
apply(initial)

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initial,
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    apply(theme)
    set({ theme })
  },
  toggle: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
}))
