import axiosInstance from '@/lib/axios'
import { User } from '@/types/user'

interface LoginResponse {
  access_token: string
  token_type: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', { email, password })
  return response.data
}

export async function getMe(token: string): Promise<User> {
  const response = await axiosInstance.get<User>('/users/me', {
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
  const response = await axiosInstance.post<RegisterResponse>('/auth/register', data)
  return response.data
}

export interface TecnicoAPI {
  id: string
  nombre: string
  email: string
  especialidad: string
  zona: string
  disponible: boolean
}

export interface ClienteAPI {
  id: string
  nombre: string
  email: string
  telefono?: string
  direccion?: string
}

export async function getTecnicos(): Promise<TecnicoAPI[]> {
  const { data } = await axiosInstance.get<TecnicoAPI[]>('/users/tecnicos')
  return data
}

export async function getClientes(): Promise<ClienteAPI[]> {
  const { data } = await axiosInstance.get<ClienteAPI[]>('/users/clientes')
  return data
}