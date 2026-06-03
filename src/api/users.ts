import axiosInstance from '@/lib/axios'
import { User } from '@/types/user'

interface LoginResponse {
  access_token: string
  user: User
}

export async function login(user: string, password: string): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>('/api/v1/auth/login', { user, password })
  return response.data
}

export async function getMe(): Promise<User> {
  const response = await axiosInstance.get<User>('/api/v1/me')
  return response.data
}