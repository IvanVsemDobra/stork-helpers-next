'use client'
import { useRouter } from 'next/navigation'

export const useLogoutRedirect = (onCleanupAction: () => void) => {
  const router = useRouter()

  const handleConfirmClick = () => {
    onCleanupAction()
    router.push('/')
  }

  return { handleConfirmClick }
}