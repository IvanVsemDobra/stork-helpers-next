'use client'

import { useEffect, useId } from 'react'
import { useAuthStore } from '@/store/auth.store'

let googleInitialized = false

export function GoogleButton() {
  const setUser = useAuthStore(s => s.setUser)
  const buttonId = useId()

  useEffect(() => {
    if (!window.google) return

    if (!googleInitialized) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async res => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ credential: res.credential }),
            })

            if (!response.ok) {
              console.error('Google auth failed')
              return
            }

            const data = await response.json()
            setUser(data.user)
          } catch (e) {
            console.error(e)
          }
        },
      })

      googleInitialized = true
    }

    window.google.accounts.id.renderButton(document.getElementById(buttonId)!, {
      theme: 'outline',
      size: 'large',
      width: 280,
    })
  }, [setUser, buttonId])

  return <div id={buttonId} />
}
