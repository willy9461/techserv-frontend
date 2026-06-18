'use client'

import { useEffect, useState } from 'react'
import { getTickets } from '@/api/tickets'
import { TicketListItem, TicketEstado, ESTADO_LABELS } from '@/types/ticket'

const ESTADOS: TicketEstado[] = ['abierto', 'en_diagnostico', 'en_proceso', 'resuelto']

const ESTADO_COLORS: Record<TicketEstado, string> = {
  abierto:        'bg-blue-500',
  en_diagnostico: 'bg-amber-500',
  en_proceso:     'bg-violet-500',
  resuelto:       'bg-emerald-500',
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-semibold text-white tabular-nums">{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
    </div>
  )
}

export default function ReportesPage() {
  const [tickets, setTickets] = useState<TicketListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTickets()
      .then(setTickets)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total = tickets.length
  const porEstado = ESTADOS.map(e => ({
    estado: e,
    label: ESTADO_LABELS[e],
    count: tickets.filter(t => t.estado === e).length,
    color: ESTADO_COLORS[e],
  }))

  const conTecnico = tickets.filter(t => t.tecnico_nombre).length
  const sinTecnico = tickets.filter(t => !t.tecnico_nombre).length

  const porUrgencia = {
    alta:  tickets.filter(t => t.urgencia === 'alta').length,
    media: tickets.filter(t => t.urgencia === 'media').length,
    baja:  tickets.filter(t => t.urgencia === 'baja').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-white">Reportes</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Resumen general del estado operativo</p>
      </div>

      {/* KPIs */}
      <div className="col-span-1 lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <StatCard label="Total tickets" value={total} />
        <StatCard label="Con técnico" value={conTecnico} sub={`${total > 0 ? Math.round(conTecnico / total * 100) : 0}% del total`} />
        <StatCard label="Sin asignar" value={sinTecnico} />
        <StatCard label="Urgencia alta" value={porUrgencia.alta} sub={`${total > 0 ? Math.round(porUrgencia.alta / total * 100) : 0}% del total`} />
      </div>

      {/* Distribución por estado */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Distribución por estado</h2>
        {total === 0 ? (
          <p className="text-sm text-zinc-500 italic">No hay tickets registrados.</p>
        ) : (
          <div className="space-y-3">
            {porEstado.map(({ estado, label, count, color }) => (
              <div key={estado} className="flex items-center gap-4">
                <span className="text-sm text-zinc-400 w-32 shrink-0">{label}</span>
                <div className="flex-1 bg-zinc-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${color} transition-all`}
                    style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm text-zinc-300 w-8 text-right tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Distribución por urgencia */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Distribución por urgencia</h2>
        {total === 0 ? (
          <p className="text-sm text-zinc-500 italic">No hay tickets registrados.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400 w-32 shrink-0">Alta</span>
              <div className="flex-1 bg-zinc-800 rounded-full h-2">
                <div className="h-2 rounded-full bg-red-500 transition-all" style={{ width: `${total > 0 ? (porUrgencia.alta / total) * 100 : 0}%` }} />
              </div>
              <span className="text-sm text-zinc-300 w-8 text-right tabular-nums">{porUrgencia.alta}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400 w-32 shrink-0">Media</span>
              <div className="flex-1 bg-zinc-800 rounded-full h-2">
                <div className="h-2 rounded-full bg-amber-500 transition-all" style={{ width: `${total > 0 ? (porUrgencia.media / total) * 100 : 0}%` }} />
              </div>
              <span className="text-sm text-zinc-300 w-8 text-right tabular-nums">{porUrgencia.media}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400 w-32 shrink-0">Baja</span>
              <div className="flex-1 bg-zinc-800 rounded-full h-2">
                <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${total > 0 ? (porUrgencia.baja / total) * 100 : 0}%` }} />
              </div>
              <span className="text-sm text-zinc-300 w-8 text-right tabular-nums">{porUrgencia.baja}</span>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-600 text-center">
        Reportes avanzados con exportación a PDF y Excel disponibles próximamente.
      </p>
    </div>
  )
}