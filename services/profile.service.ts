import { api } from './api'
import { User } from '@/store/auth.store'

/**
 * Оновлення даних профілю (ім'я, email, тема, дата пологів)
 * Ендпоінт: /users (згідно з твоїм кодом)
 */
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  // Ми використовуємо await, щоб переконатися, що запит завершився
  const res = await api.patch<User>('/users', data)
  return res.data
}

/**
 * Завантаження аватара
 * Ендпоінт: /users/avatar
 */
export const uploadAvatar = async (file: File): Promise<User> => {
  const formData = new FormData()
  formData.append('avatar', file)

  const res = await api.patch<User>('/users/avatar', formData, {
    headers: {
      // Важливо вказати multipart/form-data для завантаження файлів
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}

/**
 * Додатково: отримання поточних даних користувача (якщо потрібно)
 */
export const getProfile = async (): Promise<User> => {
  const res = await api.get<User>('/users/me')
  return res.data
}
