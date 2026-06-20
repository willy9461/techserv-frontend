import axios from 'axios'
import useAuthStore from '@/store/authStore'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  if (config.headers && config.headers.Authorization) {
    return config
  }
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshQueue: Array<() => void> = []

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = useAuthStore.getState().refreshToken
    if (!refreshToken) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push(() => resolve(axiosInstance(originalRequest)))
      })
    }

    isRefreshing = true

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { refresh_token: refreshToken }
      )
      useAuthStore.getState().setTokens(data.access_token, data.refresh_token)
      isRefreshing = false
      refreshQueue.forEach((cb) => cb())
      refreshQueue = []
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`
      return axiosInstance(originalRequest)
    } catch (refreshError) {
      isRefreshing = false
      refreshQueue = []
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    }
  }
)

export default axiosInstance