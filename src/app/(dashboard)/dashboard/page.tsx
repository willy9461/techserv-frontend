'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EstadoBadge, UrgenciaBadge } from '@/components/shared/TicketCard'
import { TicketListItem } from '@/types/ticket'
import { getTickets } from '@/api/tickets'

// ── Mock técnicos ─────────────────────────────────────────────────────────────

const MOCK_TECNICOS = [
  { id: 't1', nombre: 'Martin Sciotti',    iniciales: 'MS', zona: 'CABA Centro',  disponible: false, ticketsActivos: 2 },
  { id: 't2', nombre: 'Marcelo Jurado',    iniciales: 'MJ', zona: 'CABA Norte',   disponible: false, ticketsActivos: 1 },
  { id: 't3', nombre: 'Alejandro Volponi', iniciales: 'AV', zona: 'GBA Oeste',    disponible: false, ticketsActivos: 1 },
  { id: 't4', nombre: 'Julio Maine',       iniciales: 'JM', zona: 'CABA Sur',     disponible: true,  ticketsActivos: 0 },
]

// ── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({ label, value, sub, accent }: {
  label: string
  value: string | number
  sub?: string
  accent?: 'blue' | 'amber' | 'emerald' | 'violet'
}) {
  const accentClass = {
    blue:    'text-blue-400',
    amber:   'text-amber-400',
    emerald: 'text-emerald-400',
    violet:  'text-violet-400',
  }[accent ?? 'blue']

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">{label}</p>
      <p className={`text-3xl font-semibold tabular-nums ${accentClass}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [tickets, setTickets] = useState<TicketListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTickets()
      .then(setTickets)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const ticketsAbiertos = tickets.filter(t => t.estado === 'abierto').length
  const ticketsEnProceso = tickets.filter(t => t.estado === 'en_proceso').length
  const ticketsResueltos = tickets.filter(t => t.estado === 'resuelto').length
  const sinAsignar = tickets.filter(t => !t.tecnico_nombre).length
  const recientes = tickets.slice(0, 5)

  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-white">Panel de control</h1>
        <p className="text-sm text-zinc-500 mt-0.5 capitalize">{today}</p>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <KPICard
            label="Tickets abiertos"
            value={ticketsAbiertos}
            sub={`${sinAsignar} sin asignar`}
            accent="blue"
          />
          <KPICard
            label="En proceso"
            value={ticketsEnProceso}
            sub="técnicos en campo"
            accent="amber"
          />
          <KPICard
            label="Resueltos"
            value={ticketsResueltos}
            sub="total acumulado"
            accent="emerald"
          />
          <KPICard
            label="Total tickets"
            value={tickets.length}
            sub="en el sistema"
            accent="violet"
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Tickets recientes */}
        <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-200">Tickets recientes</h2>
            <Link href="/tickets">
              <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Ver todos →
              </span>
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {loading ? (
              <div className="px-5 py-8 text-center">
                <div className="w-5 h-5 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin mx-auto" />
              </div>
            ) : recientes.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-zinc-500">
                No hay tickets registrados.
              </div>
            ) : (
              recientes.map((t) => (
                <Link key={t.id} href={`/tickets/${t.id}`}>
                  <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200 truncate">{t.titulo}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{t.cliente_nombre}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {t.tecnico_nombre ? (
                        <span className="text-xs text-zinc-500">{t.tecnico_nombre}</span>
                      ) : (
                        <span className="text-xs text-amber-500 font-medium">Sin asignar</span>
                      )}
                      <UrgenciaBadge urgencia={t.urgencia} />
                      <EstadoBadge estado={t.estado} />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="px-5 py-3 border-t border-zinc-800">
            <Link href="/tickets/nuevo">
              <button className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Nuevo ticket
              </button>
            </Link>
          </div>
        </div>

        {/* Técnicos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-200">Técnicos</h2>
            <Link href="/tecnicos">
              <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Ver todos →
              </span>
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {MOCK_TECNICOS.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">
                    {t.iniciales}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${t.disponible ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{t.nombre}</p>
                  <p className="text-xs text-zinc-500">{t.zona}</p>
                </div>
                <div className="shrink-0 text-right">
                  {t.ticketsActivos > 0 ? (
                    <span className="text-xs font-medium text-amber-400">{t.ticketsActivos} activo{t.ticketsActivos > 1 ? 's' : ''}</span>
                  ) : (
                    <span className="text-xs text-emerald-400">Libre</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}