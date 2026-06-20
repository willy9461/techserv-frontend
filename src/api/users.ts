import axiosInstance from '@/lib/axios'
import { User } from '@/types/user'

interface LoginResponse {
  access_token: string
  refresh_token: string
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
  phone: string
}

interface RegisterResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  const response = await axiosInstance.post<RegisterResponse>('/auth/register', data)
  return response.data
}

export interface TecnicoAPI {
  id: string
  full_name: string
  email: string
  phone?: string
  role?: string
  is_active?: boolean
}

export interface ClienteAPI {
  id: string
  full_name: string
  email: string
  phone?: string
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

export async function getUsuarios(): Promise<User[]> {
  const { data } = await axiosInstance.get<User[]>('/users')
  return data
}

export async function updateUsuario(id: string, payload: Partial<Pick<User, 'role' | 'is_active'>>): Promise<User> {
  const { data } = await axiosInstance.patch<User>(`/users/${id}`, payload)
  return data
}

export interface CrearUsuarioPayload {
  email: string
  full_name: string
  phone: string
  password: string
  role: 'administrador' | 'supervisor' | 'area_administrativa'
}

export async function crearUsuario(payload: CrearUsuarioPayload): Promise<User> {
  const { data } = await axiosInstance.post<User>('/users', payload)
  return data
}