import { api } from './api'
import { User } from '@/store/auth.store'
import { AxiosError } from 'axios'

interface ApiError {
  message: string
}

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  try {
    const res = await api.patch<User>('/users', data)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    const message = axiosError.response?.data?.message || 'Помилка оновлення профілю'
    throw new Error(message)
  }
}

export const uploadAvatar = async (file: File): Promise<User> => {
  const formData = new FormData()
  formData.append('avatar', file)

  try {
    const res = await api.patch<User>('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Не вдалося завантажити фото')
  }
}
