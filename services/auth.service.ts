import type { User } from '@/types/user'
import type { UserRegister, UserLogin } from '@/types/auth'
import { api } from '@/services/api'
import { logout as logoutRequest } from '@/utils/logout'

export const register = async (creds: UserRegister) => {
  const { data } = await api.post<User>('/auth/register', creds)
  return data
}

export const login = async (creds: UserLogin) => {
  const { data } = await api.post<User>('/auth/login', creds)
  return data
}

export const logout = async () => {
  return logoutRequest()
}

export const AuthService = {
  register,
  login,
  logout,
}
