export type TicketEstado =
  | 'abierto'
  | 'en_diagnostico'
  | 'en_proceso'
  | 'resuelto'
  | 'cerrado'
  | 'cancelado'

export type TicketUrgencia = 'baja' | 'media' | 'alta'

export type TipoEquipo =
  | 'electrodomestico'
  | 'industrial'
  | 'hvac'
  | 'informatico'
  | 'otro'

export interface Tecnico {
  id: string
  nombre: string
  email: string
  especialidad: string
  zona: string
  disponible: boolean
  avatarUrl?: string
}

export interface Cliente {
  id: string
  nombre: string
  email: string
  telefono?: string
  direccion: string
}

export interface Equipo {
  id: string
  tipo: TipoEquipo
  marca: string
  modelo: string
  nro_serie: string
}

export interface Ticket {
  id: string
  titulo: string
  descripcion: string
  estado: TicketEstado
  urgencia: TicketUrgencia
  created_at: string
  closed_at?: string
  cliente: Cliente
  tecnico?: Tecnico
  equipo: Equipo
  direccion: string
}

export interface TicketListItem {
  id: string
  titulo: string
  estado: TicketEstado
  urgencia: TicketUrgencia
  created_at: string
  cliente_nombre: string
  tecnico_nombre?: string
  equipo_tipo: TipoEquipo
}

export interface CreateTicketPayload {
  titulo: string
  descripcion: string
  urgencia: TicketUrgencia
  equipo_id?: string
  equipo_nuevo?: {
    tipo: TipoEquipo
    marca: string
    modelo: string
    nro_serie: string
  }
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
  cerrado: 'Cerrado',
  cancelado: 'Cancelado',
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
  'cerrado',
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