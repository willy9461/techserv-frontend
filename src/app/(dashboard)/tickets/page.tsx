'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { TicketCard, TicketRow } from '@/components/shared/TicketCard'
import {
  TicketListItem,
  TicketEstado,
  TicketUrgencia,
  ESTADO_LABELS,
  URGENCIA_LABELS,
} from '@/types/ticket'
import { getTickets } from '@/api/tickets'

const ESTADOS: TicketEstado[] = ['abierto', 'en_diagnostico', 'en_proceso', 'resuelto']
const URGENCIAS: TicketUrgencia[] = ['alta', 'media', 'baja']
type ViewMode = 'cards' | 'table'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
const [estadoFiltro, setEstadoFiltro] = useState<TicketEstado | 'todos'>('todos')
  const [urgenciaFiltro, setUrgenciaFiltro] = useState<TicketUrgencia | 'todos'>('todos')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')

  useEffect(() => {
    getTickets()
      .then(setTickets)
      .catch(() => setError('No se pudieron cargar los tickets.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        search === '' ||
        t.titulo.toLowerCase().includes(search.toLowerCase()) ||
        (t.cliente?.full_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        t.id.includes(search.toLowerCase())
const matchEstado = estadoFiltro === 'todos' ? t.estado !== 'resuelto' : t.estado === estadoFiltro
      const matchUrgencia = urgenciaFiltro === 'todos' || t.urgencia === urgenciaFiltro
      return matchSearch && matchEstado && matchUrgencia
    })
  }, [tickets, search, estadoFiltro, urgenciaFiltro])

  const countByEstado = useMemo(() => {
    const counts: Partial<Record<TicketEstado, number>> = {}
    tickets.forEach((t) => {
      counts[t.estado] = (counts[t.estado] ?? 0) + 1
    })
    return counts
  }, [tickets])

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
          onClick={() => { setError(null); setLoading(true); getTickets().then(setTickets).catch(() => setError('No se pudieron cargar los tickets.')).finally(() => setLoading(false)) }}
          className="text-xs text-blue-400 hover:text-blue-300 underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Tickets</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/tickets/nuevo">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nuevo ticket
          </button>
        </Link>
      </div>

      {/* Filtros por estado */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setEstadoFiltro('todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            estadoFiltro === 'todos'
              ? 'bg-zinc-700 text-zinc-100'
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          Todos · {tickets.length}
        </button>
        {ESTADOS.map((e) => {
          const count = countByEstado[e] ?? 0
          if (count === 0) return null
          return (
            <button
              key={e}
              onClick={() => setEstadoFiltro(e === estadoFiltro ? 'todos' : e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                estadoFiltro === e
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {ESTADO_LABELS[e]} · {count}
            </button>
          )
        })}
      </div>

      {/* Búsqueda + urgencia + toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por título, cliente o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        <select
          value={urgenciaFiltro}
          onChange={(e) => setUrgenciaFiltro(e.target.value as TicketUrgencia | 'todos')}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors"
        >
          <option value="todos">Urgencia: todas</option>
          {URGENCIAS.map((u) => (
            <option key={u} value={u}>{URGENCIA_LABELS[u]}</option>
          ))}
        </select>

        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-2 transition-colors ${viewMode === 'cards' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 transition-colors ${viewMode === 'table' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-sm">No se encontraron tickets con esos filtros.</p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid gap-3">
          {filtered.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                {['ID', 'Título', 'Cliente', 'Técnico', 'Estado', 'Urgencia', 'Fecha'].map((h) => (
                  <th key={h} className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}