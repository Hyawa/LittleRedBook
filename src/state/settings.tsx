import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getNativeSystemBars, syncSystemBars } from '@/lib/systemBars'

export type ReadingTheme = 'paper' | 'light' | 'dark'

export interface ReadingSettings {
  theme: ReadingTheme
  fontSize: number
}

const STORAGE_KEY = 'citacoes:settings:v1'
const MIN_FONT = 16
const MAX_FONT = 26

export const DEFAULT_SETTINGS: ReadingSettings = {
  theme: 'paper',
  fontSize: 19,
}

export function parseSettings(raw: string | null): ReadingSettings {
  if (!raw) return DEFAULT_SETTINGS
  try {
    const data = JSON.parse(raw) as Partial<ReadingSettings>
    const theme: ReadingTheme =
      data.theme === 'dark' || data.theme === 'light' || data.theme === 'paper'
        ? data.theme
        : 'paper'
    const size =
      typeof data.fontSize === 'number' && Number.isFinite(data.fontSize)
        ? Math.min(MAX_FONT, Math.max(MIN_FONT, Math.round(data.fontSize)))
        : DEFAULT_SETTINGS.fontSize
    return { theme, fontSize: size }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function applySettings(settings: ReadingSettings) {
  const root = document.documentElement
  root.classList.toggle('dark', settings.theme === 'dark')
  root.dataset.theme = settings.theme
  root.style.setProperty('--reader-size', `${settings.fontSize}px`)

  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  )
  if (meta) {
    meta.content = settings.theme === 'dark' ? '#16110f' : '#8e1118'
  }
}

interface SettingsContextValue {
  settings: ReadingSettings
  setTheme: (theme: ReadingTheme) => void
  setFontSize: (size: number) => void
  increaseFont: () => void
  decreaseFont: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function readInitialSettings(): ReadingSettings {
  try {
    return parseSettings(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReadingSettings>(readInitialSettings)

  useEffect(() => {
    applySettings(settings)
    void syncSystemBars(getNativeSystemBars(), settings.theme === 'dark')
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* armazenamento indisponível */
    }
  }, [settings])

  const setTheme = useCallback((theme: ReadingTheme) => {
    setSettings((current) => ({ ...current, theme }))
  }, [])

  const setFontSize = useCallback((size: number) => {
    setSettings((current) => ({
      ...current,
      fontSize: Math.min(MAX_FONT, Math.max(MIN_FONT, Math.round(size))),
    }))
  }, [])

  const increaseFont = useCallback(() => {
    setSettings((current) => ({
      ...current,
      fontSize: Math.min(MAX_FONT, current.fontSize + 1),
    }))
  }, [])

  const decreaseFont = useCallback(() => {
    setSettings((current) => ({
      ...current,
      fontSize: Math.max(MIN_FONT, current.fontSize - 1),
    }))
  }, [])

  const value = useMemo(
    () => ({
      settings,
      setTheme,
      setFontSize,
      increaseFont,
      decreaseFont,
    }),
    [settings, setTheme, setFontSize, increaseFont, decreaseFont],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings deve ser usado dentro de SettingsProvider')
  }
  return context
}
