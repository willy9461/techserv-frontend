export type TicketEstado =
  | 'abierto'
  | 'en_diagnostico'
  | 'en_proceso'
  | 'resuelto'

export type TicketUrgencia = 'baja' | 'media' | 'alta'

export type TipoEquipo =
  | 'electrodomestico'
  | 'industrial'
  | 'hvac'
  | 'informatico'
  | 'otro'

export interface Tecnico {
  id: string
  full_name: string
  email?: string
  especialidad?: string
  zona?: string
  disponible?: boolean
  avatarUrl?: string
}

export interface Cliente {
  id: string
  full_name: string
  email: string
  phone?: string
  direccion?: string
}

export interface Equipo {
  id: string
  tipo: string
  marca: string
  modelo: string
  numero_serie: string
}

export interface Ticket {
  id: string
  titulo: string
  descripcion: string
  estado: TicketEstado
  urgencia: TicketUrgencia
  created_at?: string
  fecha_creacion?: string
  fecha_visita?: string | null
  closed_at?: string
  cliente?: Cliente
  tecnico?: Tecnico
  equipo?: Equipo
  direccion: string
}

export interface TicketListItem {
  id: string
  titulo: string
  estado: TicketEstado
  urgencia: TicketUrgencia
  fecha_creacion: string | null
  fecha_visita?: string | null
  cliente: { id: string; full_name: string } | null
  tecnico: { id: string; full_name: string } | null
  equipo: { id: string; tipo: string; marca: string; modelo: string; numero_serie: string } | null
}

export interface CreateTicketPayload {
  titulo: string
  descripcion: string
  urgencia: TicketUrgencia
  equipo_id: string
  direccion: string
}

export interface UpdateTicketStatusPayload {
  estado: TicketEstado
  nota?: string
}

// UI helpers
export const ESTADO_LABELS: Record<TicketEstado, string> = {
  abierto: 'Abierto',
  en_diagnostico: 'En diagnóstico',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
}

export const URGENCIA_LABELS: Record<TicketUrgencia, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
}

export const TIPO_EQUIPO_LABELS: Record<TipoEquipo, string> = {
  electrodomestico: 'Electrodoméstico',
  industrial: 'Industrial',
  hvac: 'HVAC',
  informatico: 'Informático',
  otro: 'Otro',
}

export const ESTADO_ORDER: TicketEstado[] = [
  'abierto',
  'en_diagnostico',
  'en_proceso',
  'resuelto',
]

// Vista cliente
export interface MiTicket {
  id: string
  titulo: string
  descripcion: string
  estado: TicketEstado
  urgencia: TicketUrgencia
  createdAt: string
  tecnico?: {
    nombre: string
    especialidad: string
  }
  equipo?: {
    tipo: TipoEquipo
    marca: string
    modelo: string
  }
}

export interface MiEquipo {
  id: string
  tipo: TipoEquipo
  marca: string
  modelo: string
  nro_serie: string
  ultimaIntervencion?: {
    fecha: string
    descripcion: string
    estado: TicketEstado
  }
}