import axiosInstance from '@/lib/axios'
import { User } from '@/types/user'

export async function login(user: string, password: string): Promise<void> {
  await axiosInstance.post('/api/v1/login', { user, password })
}

export async function getMe(): Promise<User> {
  const response = await axiosInstance.get<User>('/api/v1/me')
  return response.data
}