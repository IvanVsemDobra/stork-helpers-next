'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { User } from '@/types/user'
import { useAuthStore } from '@/store/auth.store'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export function useMe() {
  const setUser = useAuthStore(s => s.setUser)
  const clearAuth = useAuthStore(s => s.clearAuth)

  const query = useQuery<User | null>({
    queryKey: ['me'],

    // ✅ виконуємо завжди 1 раз при старті
    enabled: true,

    queryFn: async () => {
      const res = await fetch(`${API_URL}/users/me`, {
        credentials: 'include',
      })

      if (res.status === 401) return null
      if (!res.ok) throw new Error('Failed to fetch /me')

      const json = await res.json()
      return json?.user ?? json
    },

    retry: false,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (!query.isFetched) return

    if (query.data) {
      setUser(query.data)
    } else {
      clearAuth()
    }
  }, [query.isFetched, query.data, setUser, clearAuth])

  return query
}
