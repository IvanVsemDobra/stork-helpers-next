import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme.store'

export const useTheme = () => {
  const theme = useThemeStore(state => state.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', theme)
  }, [theme])
}
