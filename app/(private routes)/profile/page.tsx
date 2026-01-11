'use client'

import ProfileAvatar from '@/components/ProfileAvatar/ProfileAvatar'
import ProfileEditForm from '@/components/ProfileEditForm/ProfileEditForm'
import { useAuthStore } from '@/store/auth.store'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'

export default function ProfilePage() {
  useProtectedRoute()

  const { user } = useAuthStore()

  if (!user) {
    return null
  }

  return (
    <main>
      <ProfileAvatar />
      <ProfileEditForm />
    </main>
  )
}
