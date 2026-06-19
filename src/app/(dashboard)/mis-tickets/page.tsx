'use client'

import { useEffect, useState } from 'react'
import { TicketListItem, TicketEstado } from '@/types/ticket'
import { EstadoBadge, UrgenciaBadge } from '@/components/shared/TicketCard'
import { getTickets } from '@/api/tickets'
import Link from 'next/link'

const FILTROS: { label: string; value: TicketEstado | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Abiertos', value: 'abierto' },
  { label: 'En proceso', value: 'en_proceso' },
  { label: 'Resueltos', value: 'resuelto' },
]

export default function MisTicketsPage() {
  const [tickets, setTickets] = useState<TicketListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<TicketEstado | 'todos'>('todos')

  useEffect(() => {
    getTickets()
      .then(setTickets)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filtro === 'todos'
    ? tickets
    : tickets.filter(t => t.estado === filtro)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-white mb-1">Mis solicitudes</h1>
        <p className="text-sm text-zinc-400">Seguí el estado de tus pedidos de asistencia técnica.</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTROS.map(f => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filtro === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          No tenés solicitudes en este estado.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(ticket => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs text-zinc-500 font-mono">{ticket.id.slice(0, 8).toUpperCase()}</span>
                  <h2 className="text-base font-medium text-white mt-0.5">{ticket.titulo}</h2>
                </div>
                <div className="flex gap-2 shrink-0">
                  <UrgenciaBadge urgencia={ticket.urgencia} />
                  <EstadoBadge estado={ticket.estado} />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div className="flex gap-4">
                  <span>{ticket.equipo?.tipo}</span>
                  {ticket.tecnico?.full_name ? (
                    <span>Técnico: <span className="text-zinc-300">{ticket.tecnico.full_name}</span></span>
                  ) : (
                    <span className="text-amber-500">Sin asignar</span>
                  )}
                </div>
                <span>{ticket.fecha_creacion ? new Date(ticket.fecha_creacion).toLocaleDateString('es-AR') : '—'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Nueva solicitud */}
      <div className="mt-8 text-center">
        <Link
          href="/tickets/nuevo"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
        >
          + Nueva solicitud
        </Link>
      </div>
    </div>
  )
}