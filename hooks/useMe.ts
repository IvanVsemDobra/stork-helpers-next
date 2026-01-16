'use client'

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { User } from '@/types/user'
import { useAuthStore } from '@/store/auth.store'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useMe() {
  const setUser = useAuthStore(s => s.setUser)

  const query = useQuery<User | null>({
    queryKey: ['me'],

    // 🔑 КЛЮЧОВИЙ МОМЕНТ
    enabled: Boolean(API_URL),

    queryFn: async () => {
      const res = await fetch(`${API_URL}/users/me`, {
        credentials: 'include',
      })

      if (!res.ok) return null
      const json = await res.json()
      return json?.user ?? json
    },

    staleTime: Infinity,
    retry: false,
  })

  useEffect(() => {
    if (!query.isFetched) return

    if (query.isSuccess) {
      setUser(query.data)
    } else {
      setUser(null)
    }
  }, [query.isFetched, query.isSuccess, query.data, setUser])

  return query
}
