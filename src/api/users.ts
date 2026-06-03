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

interface RegisterData {
  email: string
  password: string
  full_name: string
  role: string
}

interface RegisterResponse {
  access_token: string
  token_type: string
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  const response = await axiosInstance.post<RegisterResponse>('/api/v1/auth/register', data)
  return response.data
}