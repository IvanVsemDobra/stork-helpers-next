import axios from 'axios'
import { apiClient } from '@/lib/apiClient'

let isRefreshing = false
let queue: (() => void)[] = []

export const protectedApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

protectedApi.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        try {
          await apiClient.post('/auth/refresh')
          queue.forEach(cb => cb())
          queue = []
        } finally {
          isRefreshing = false
        }
      }

      return new Promise(resolve => {
        queue.push(() => resolve(protectedApi(original)))
      })
    }

    return Promise.reject(error)
  }
)