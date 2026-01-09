import { api } from './api'
import { User } from '@/store/auth.store'

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const res = await api.patch('/users', data)
  return res.data
}

export const uploadAvatar = async (file: File): Promise<User> => {
  const formData = new FormData()
  formData.append('avatar', file)
  const res = await api.patch('/users/avatar', formData)
  return res.data
}
