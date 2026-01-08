import type { User } from '@/store/auth.store'
import type { UserRegister, UserLogin } from '@/types/auth'
import { api } from '@/services/api'

export const register = async (creds: UserRegister) => {
    const { data } = await api.post<User>('/auth/register', creds)
    return data
}

export const login = async (creds: UserLogin) => {
    const { data } = await api.post<User>('/auth/login', creds)
    return data
}

export const logout = async () => {
    await api.post('/auth/logout')
}

export const AuthService = {
    register,
    login,
    logout,
}
