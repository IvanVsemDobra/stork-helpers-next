import { create } from 'zustand'

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  theme?: 'girl' | 'boy' | 'neutral'
  dueDate?: string
  hasCompletedOnboarding: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean

  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,

  setUser: user =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}))
