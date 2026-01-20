'use client'

import styles from './ProfilePage.module.css'
import { ProfileAvatar } from '@/components/ProfileAvatar/ProfileAvatar'
import { ProfileEditForm } from '@/components/ProfileEditForm/ProfileEditForm'
import { useAuthStore } from '@/store/auth.store'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  useProtectedRoute()
  const { user } = useAuthStore()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('emailVerified') === 'true') {
      toast.success('Email успішно підтверджено 🎉')
    }
  }, [searchParams])

  if (!user) return null

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <ProfileAvatar />
        <ProfileEditForm />
      </div>
    </main>
  )
}