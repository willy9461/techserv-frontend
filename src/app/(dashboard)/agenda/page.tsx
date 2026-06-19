'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  TicketListItem,
  TicketEstado,
  TicketUrgencia,
  ESTADO_LABELS,
  URGENCIA_LABELS,
} from '@/types/ticket'
import { getTickets } from '@/api/tickets'

type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'

const DIAS: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const DIA_INDEX: Record<number, DayOfWeek> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  0: 'Domingo',
}

const URGENCIA_COLORS: Record<TicketUrgencia, string> = {
  alta: 'border-l-red-500',
  media: 'border-l-yellow-500',
  baja: 'border-l-green-500',
}

const URGENCIA_BADGE: Record<TicketUrgencia, string> = {
  alta: 'bg-red-500/10 text-red-400',
  media: 'bg-yellow-500/10 text-yellow-400',
  baja: 'bg-green-500/10 text-green-400',
}

const ESTADO_BADGE: Record<TicketEstado, string> = {
  abierto: 'bg-blue-500/10 text-blue-400',
  en_diagnostico: 'bg-purple-500/10 text-purple-400',
  en_proceso: 'bg-yellow-500/10 text-yellow-400',
  resuelto: 'bg-green-500/10 text-green-400',
}

export default function AgendaPage() {
  const [tickets, setTickets] = useState<TicketListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [diaSeleccionado, setDiaSeleccionado] = useState<DayOfWeek>('Lunes')

  useEffect(() => {
    getTickets()
      .then(setTickets)
      .catch(() => setError('No se pudieron cargar los tickets.'))
      .finally(() => setLoading(false))
  }, [])

  const ticketsPorDia = useMemo(() => {
    const map: Partial<Record<DayOfWeek, TicketListItem[]>> = {}
    tickets.forEach((t) => {
      const fecha = t.fecha_visita ? new Date(t.fecha_visita) : null
      if (!fecha) return
      if (t.estado === 'resuelto') return
      const dia = DIA_INDEX[fecha.getDay()]
      if (!map[dia]) map[dia] = []
      map[dia]!.push(t)
    })
    return map
  }, [tickets])

  const ticketsDelDia = ticketsPorDia[diaSeleccionado] ?? []

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-sm text-zinc-400">{error}</p>
        <button
          onClick={() => {
            setError(null)
            setLoading(true)
            getTickets()
              .then(setTickets)
              .catch(() => setError('No se pudieron cargar los tickets.'))
              .finally(() => setLoading(false))
          }}
          className="text-xs text-blue-400 hover:text-blue-300 underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-white">Agenda semanal</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          {ticketsDelDia.length} turno{ticketsDelDia.length !== 1 ? 's' : ''} para el {diaSeleccionado}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {DIAS.map((dia) => {
          const count = ticketsPorDia[dia]?.length ?? 0
          return (
            <button
              key={dia}
              onClick={() => setDiaSeleccionado(dia)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                diaSeleccionado === dia
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {dia}
              {count > 0 && (
                <span className={`ml-2 text-xs ${diaSeleccionado === dia ? 'text-blue-200' : 'text-zinc-600'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {ticketsDelDia.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-sm">No hay turnos para el {diaSeleccionado}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ticketsDelDia.map((ticket) => (
            <Link href={`/tickets/${ticket.id}`} key={ticket.id}>
              <div className={`bg-zinc-900 border border-zinc-800 border-l-4 ${URGENCIA_COLORS[ticket.urgencia]} rounded-lg p-4 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all cursor-pointer`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-center min-w-[48px]">
                      <p className="text-lg font-bold text-white">
                        {new Date(ticket.fecha_visita!).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">{ticket.titulo}</p>
                      <p className="text-xs text-zinc-400">{ticket.cliente?.full_name}</p>
                      {ticket.tecnico?.full_name && (
                        <p className="text-xs text-zinc-500">Técnico: {ticket.tecnico.full_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${URGENCIA_BADGE[ticket.urgencia]}`}>
                      {URGENCIA_LABELS[ticket.urgencia]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_BADGE[ticket.estado]}`}>
                      {ESTADO_LABELS[ticket.estado]}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}