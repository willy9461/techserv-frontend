import api from '@/lib/axios'
import type {
  Ticket,
  TicketListItem,
  CreateTicketPayload,
  UpdateTicketStatusPayload,
  MiTicket,
} from '@/types/ticket'

// ─── Supervisor / Admin ───────────────────────────────────────────────────────

export async function getTickets(): Promise<TicketListItem[]> {
  const { data } = await api.get<TicketListItem[]>('/tickets')
  return data
}

export async function getTicketById(id: string): Promise<Ticket> {
  const { data } = await api.get<Ticket>(`/tickets/${id}`)
  return data
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  const { data } = await api.post<Ticket>('/tickets', payload)
  return data
}

export async function updateTicketStatus(
  id: string,
  payload: UpdateTicketStatusPayload,
): Promise<Ticket> {
  const { data } = await api.patch<Ticket>(`/tickets/${id}`, { estado: payload.estado })
  return data
}

// ─── Cliente (mis tickets) ────────────────────────────────────────────────────

export async function getMisTickets(): Promise<MiTicket[]> {
  const { data } = await api.get<MiTicket[]>('/tickets/mis-tickets')
  return data
}