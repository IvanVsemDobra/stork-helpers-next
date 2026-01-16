'use client'

import { create } from 'zustand'
import type { User } from '../types/user'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  hydrated: boolean
  setUser: (user: User | null) => void
  // clearAuth: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  hydrated: false,

  setUser: user =>
    set({
      user,
      isAuthenticated: !!user,
      hydrated: true,
    }),
}))
