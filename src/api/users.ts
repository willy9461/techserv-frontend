import axiosInstance from '@/lib/axios'
import { User } from '@/types/user'

interface LoginResponse {
  access_token: string
  token_type: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>('/api/v1/auth/login', { email, password })
  return response.data
}

export async function getMe(token: string): Promise<User> {
  const response = await axiosInstance.get<User>('/api/v1/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}