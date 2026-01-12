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
    // Logout is handled client-side only
    // No backend endpoint needed
}

export const AuthService = {
    register,
    login,
    logout,
}
