import axios from 'axios'

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
})

api.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status >= 500) {
      console.error('Server error')
    }
    return Promise.reject(error)
  }
)