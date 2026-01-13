import { api } from './api'
import { AxiosError } from 'axios'
import type { User } from '@/types/user'

interface ApiError {
  message: string
}

export const updateUser = async (data: Partial<User>): Promise<User> => {
  try {
    // Відправляємо дані як є, бо форми вже працюють з полем theme
    const res = await api.patch<User>('/users/me', data)
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    const message = axiosError.response?.data?.message || 'Помилка оновлення профілю'
    throw new Error(message)
  }
}

export const updateUserAvatar = async (file: File): Promise<User> => {
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

export const sendVerificationEmail = async (email: string): Promise<void> => {
  try {
    await api.post('/users/verify', { email })
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    throw new Error(axiosError.response?.data?.message || 'Помилка верифікації')
  }
}

export const updateProfile = updateUser
