import { api } from './api'

export type UpdateProfileDto = {
  name: string
  email: string
}

export const updateProfile = async (data: UpdateProfileDto) => {
  const res = await api.put('/profile', data)
  return res.data
}
