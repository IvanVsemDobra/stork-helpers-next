import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export const useProtectedRoute = () => {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])
}