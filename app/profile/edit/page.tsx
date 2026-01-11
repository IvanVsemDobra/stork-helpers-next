'use client'

import ProfileEditForm from '@/components/ProfilePage/ProfileEditForm/ProfileEditForm'
import { useProtectedRoute } from '@/hooks/useProtectedRoute'

export default function ProfileEditPage() {
  useProtectedRoute()

  return <ProfileEditForm />
}
