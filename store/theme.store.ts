import { create } from 'zustand'

export type ThemeType = 'boy' | 'girl' | 'neutral'

interface ThemeState {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
}

export const useThemeStore = create<ThemeState>(set => ({
  theme: 'neutral',
  setTheme: theme => set({ theme }),
}))
