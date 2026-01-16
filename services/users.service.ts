import { api } from '@/app/api/client'
import type { User } from '@/types/user'

export const updateProfile = async (data: Partial<User>): Promise<{ message: string }> => {
  const res = await api.patch('/users/me', data)
  return res.data
}

export const updateTheme = async (theme: string): Promise<{ theme: string }> => {
  const res = await api.patch('/users/theme', { theme })
  return res.data
}

export const updateUserAvatar = async (file: File): Promise<{ avatar: string }> => {
  const formData = new FormData()
  formData.append('avatar', file)
  const res = await api.patch('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const sendVerificationEmail = async (email: string): Promise<void> => {
  await api.post('/users/verify', { email })
}