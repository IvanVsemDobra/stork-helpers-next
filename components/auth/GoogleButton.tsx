'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'

export function GoogleButton() {
  const setUser = useAuthStore(s => s.setUser)
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!window.google || !buttonRef.current) return

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (res: { credential: string }) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ credential: res.credential }),
        })

        if (!response.ok) return

        const data = await response.json()
        setUser(data.user)
        router.push('/')
      },
    })

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 280,
    })
  }, [setUser])

  return <div ref={buttonRef} />
}
