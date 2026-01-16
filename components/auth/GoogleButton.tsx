'use client'

import { useEffect, useId } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from '@/store/auth.store'

type GoogleJwtPayload = {
  sub: string
  email: string
  name: string
  picture: string
}

let googleInitialized = false

export function GoogleButton() {
  const setUser = useAuthStore(s => s.setUser)
  const buttonId = useId()

  useEffect(() => {
    const google = window.google
    if (!google) return

    if (!googleInitialized) {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: res => {
          const payload = jwtDecode<GoogleJwtPayload>(res.credential)

          setUser({
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            avatar: payload.picture,
            hasCompletedOnboarding: false,
          })
        },
      })

      googleInitialized = true
    }

    google.accounts.id.renderButton(document.getElementById(buttonId), {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      width: 280,
    })
  }, [setUser, buttonId])

  return <div id={buttonId} />
}
