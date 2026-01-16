'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export const useProtectedRoute = () => {
  const { isAuthenticated, hydrated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!hydrated) return

    if (hydrated && !isAuthenticated && !pathname.startsWith('/auth')) {
      router.replace('/auth/login')
    }
  }, [hydrated, isAuthenticated, pathname, router])
}
