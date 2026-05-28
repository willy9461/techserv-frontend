export type UserRole =
  | 'cliente'
  | 'tecnico'
  | 'supervisor'
  | 'administrador'
  | 'area_administrativa'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  company_id: string | null
  phone: string | null
  is_active: boolean
  created_at: string
}