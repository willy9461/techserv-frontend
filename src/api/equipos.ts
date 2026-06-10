import axiosInstance from '@/lib/axios'

export interface Equipo {
  id: string
  tipo: string
  marca: string
  modelo: string
  numero_serie: string
  cliente_id: string
  fecha_creacion: string
}

export interface CreateEquipoPayload {
  tipo: string
  marca: string
  modelo: string
  numero_serie: string
}

export async function getEquipos(): Promise<Equipo[]> {
  const { data } = await axiosInstance.get<Equipo[]>('/equipos')
  return data
}

export async function createEquipo(payload: CreateEquipoPayload): Promise<Equipo> {
  const { data } = await axiosInstance.post<Equipo>('/equipos', payload)
  return data
}