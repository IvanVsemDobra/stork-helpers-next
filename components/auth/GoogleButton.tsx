// 'use client'

// import { useEffect, useRef } from 'react'
// import { useAuthStore } from '@/store/auth.store'
// import { useRouter } from 'next/navigation'

// export function GoogleButton() {
//   console.log('GOOGLE CLIENT ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

//   const setUser = useAuthStore(s => s.setUser)
//   const buttonRef = useRef<HTMLDivElement | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     if (!window.google || !buttonRef.current) return

//     window.google.accounts.id.initialize({
//       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//       callback: async (res: { credential: string }) => {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           credentials: 'include',
//           body: JSON.stringify({ credential: res.credential }),
//         })

//         if (!response.ok) return

//         const data = await response.json()
//         setUser(data.user)
//         router.push('/')
//       },
//     })

//     window.google.accounts.id.renderButton(buttonRef.current, {
//       theme: 'outline',
//       size: 'large',
//       width: 280,
//     })
//   }, [setUser])

//   return <div ref={buttonRef} />
// }
'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import css from './GoogleButton.module.css'

type GoogleButtonProps = {
  mode: 'login' | 'register'
}

export function GoogleButton({ mode }: GoogleButtonProps) {
  const setUser = useAuthStore(s => s.setUser)
  const router = useRouter()

  useEffect(() => {
    if (!window.google) return

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (res: { credential: string }) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ credential: res.credential }),
          }
        )

        if (!response.ok) return

        const data = await response.json()
        setUser(data.user)
        router.push('/')
      },
    })
  }, [setUser, router])

  const handleGoogleLogin = () => {
     if (!window.google) return
    window.google.accounts.id.prompt()
  }

    const label =
    mode === 'login'
      ? 'Увійти через Google'
      : 'Зареєструватися через Google'

  return (
    <button
      type="button"
      className={css.google_button}
      onClick={handleGoogleLogin}
    >
      <img src="/icons/google.svg" alt="Google" />
      <span>{label}</span>
    </button>
  )
}
