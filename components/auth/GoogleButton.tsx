'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function GoogleButton() {
  const setUser = useAuthStore(s => s.setUser)
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined' || !window.google || !buttonRef.current) return

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (res: { credential: string }) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ credential: res.credential }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Помилка Google авторизації')
          }

          const data = await response.json()

          if (data.user) {
            setUser(data.user)
            toast.success('Успішний вхід через Google')
            router.push('/')
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Невідома помилка'
          toast.error(message)
          console.error('Google Auth Error:', error)
        }
      },
    })

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 280,
    })
  }, [setUser, router])

  return <div ref={buttonRef} style={{ minHeight: '40px' }} />
}
