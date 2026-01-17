import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/user'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (userData: Partial<User> | User | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (userData) =>
        set((state) => {
          if (userData === null) {
            return { user: null, isAuthenticated: false }
          }

          const newUser = state.user 
            ? { ...state.user, ...userData } 
            : (userData as User)

          return {
            user: newUser,
            isAuthenticated: !!newUser,
          }
        }),

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