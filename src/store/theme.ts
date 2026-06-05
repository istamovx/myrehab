import { create } from 'zustand'

type Theme = 'light' | 'dark'
export type Accent = 'blue' | 'violet' | 'emerald' | 'orange'
export type LayoutMode = 'default' | 'mini' | 'hover' | 'hidden'

interface AccentVars {
  fg: string
  bgTint: string
  solid: string
  textPrimary: string
  textSecondary: string
  border: string
  tint200: string
}

// High-quality accent presets, tuned per light/dark mode.
export const ACCENTS: Record<Accent, { label: string; swatch: string; light: AccentVars; dark: AccentVars }> = {
  blue: {
    label: "Ko'k",
    swatch: '#155EEF',
    light: { fg: '#155EEF', bgTint: '#EFF4FF', solid: '#155EEF', textPrimary: '#155EEF', textSecondary: '#0040C1', border: '#84ADFF', tint200: '#B2CCFF' },
    dark:  { fg: '#528BFF', bgTint: '#102A56', solid: '#2970FF', textPrimary: '#84ADFF', textSecondary: '#B2CCFF', border: '#1849A9', tint200: '#1849A9' },
  },
  violet: {
    label: 'Siyohrang',
    swatch: '#6938EF',
    light: { fg: '#6938EF', bgTint: '#F4F3FF', solid: '#6938EF', textPrimary: '#5925DC', textSecondary: '#4A1FB8', border: '#BDB4FE', tint200: '#D9D6FE' },
    dark:  { fg: '#9B8AFB', bgTint: '#2E1C66', solid: '#7A5AF8', textPrimary: '#BDB4FE', textSecondary: '#D9D6FE', border: '#4A1FB8', tint200: '#4A1FB8' },
  },
  emerald: {
    label: 'Zumrad',
    swatch: '#099250',
    light: { fg: '#099250', bgTint: '#ECFDF3', solid: '#099250', textPrimary: '#087443', textSecondary: '#05603A', border: '#75E0A7', tint200: '#A6F4C5' },
    dark:  { fg: '#3CCB7F', bgTint: '#053321', solid: '#099250', textPrimary: '#75E0A7', textSecondary: '#A6F4C5', border: '#085D3A', tint200: '#085D3A' },
  },
  orange: {
    label: "To'q sariq",
    swatch: '#E04F16',
    light: { fg: '#E04F16', bgTint: '#FEF6EE', solid: '#E04F16', textPrimary: '#B93815', textSecondary: '#932F19', border: '#F7B27A', tint200: '#F9DBAF' },
    dark:  { fg: '#F38744', bgTint: '#4E1D09', solid: '#E04F16', textPrimary: '#F7B27A', textSecondary: '#F9DBAF', border: '#932F19', tint200: '#932F19' },
  },
}

interface ThemeStore {
  theme: Theme
  accent: Accent
  layout: LayoutMode
  toggle: () => void
  setTheme: (t: Theme) => void
  setAccent: (a: Accent) => void
  setLayout: (l: LayoutMode) => void
  reset: () => void
}

const DEFAULTS = { theme: 'light' as Theme, accent: 'blue' as Accent, layout: 'default' as LayoutMode }

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

function applyAccent(accent: Accent, theme: Theme) {
  const v = ACCENTS[accent][theme]
  const root = document.documentElement
  root.style.setProperty('--fg-brand-primary', v.fg)
  root.style.setProperty('--bg-brand-primary', v.bgTint)
  root.style.setProperty('--bg-brand-solid', v.solid)
  root.style.setProperty('--text-brand-primary', v.textPrimary)
  root.style.setProperty('--text-brand-secondary', v.textSecondary)
  root.style.setProperty('--border-brand', v.border)
  root.style.setProperty('--blue-200', v.tint200)
}

const initialTheme: Theme = (localStorage.getItem('theme') as Theme) ?? DEFAULTS.theme
const initialAccent: Accent = (localStorage.getItem('accent') as Accent) ?? DEFAULTS.accent
const initialLayout: LayoutMode = (localStorage.getItem('layout') as LayoutMode) ?? DEFAULTS.layout
applyTheme(initialTheme)
applyAccent(initialAccent, initialTheme)

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initialTheme,
  accent: initialAccent,
  layout: initialLayout,
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    applyTheme(theme)
    applyAccent(get().accent, theme)
    set({ theme })
  },
  toggle: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
  setAccent: (accent) => {
    localStorage.setItem('accent', accent)
    applyAccent(accent, get().theme)
    set({ accent })
  },
  setLayout: (layout) => {
    localStorage.setItem('layout', layout)
    set({ layout })
  },
  reset: () => {
    localStorage.setItem('theme', DEFAULTS.theme)
    localStorage.setItem('accent', DEFAULTS.accent)
    localStorage.setItem('layout', DEFAULTS.layout)
    applyTheme(DEFAULTS.theme)
    applyAccent(DEFAULTS.accent, DEFAULTS.theme)
    set({ ...DEFAULTS })
  },
}))
