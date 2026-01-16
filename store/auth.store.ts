import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/user'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (userData: Partial<User> | User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : (userData as User),
          isAuthenticated: true,
        })),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
