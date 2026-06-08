'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EstadoBadge, UrgenciaBadge } from '@/components/shared/TicketCard'
import { Ticket, ESTADO_ORDER, ESTADO_LABELS, TIPO_EQUIPO_LABELS } from '@/types/ticket'
import { getTicketById } from '@/api/tickets'

function TimelineItem({ item, last }: { item: { fecha: string; actor: string; accion: string; tipo: string }; last: boolean }) {
  const dotColor =
    item.tipo === 'sistema'      ? 'bg-zinc-600' :
    item.tipo === 'asignacion'   ? 'bg-blue-500' :
    item.tipo === 'diagnostico'  ? 'bg-amber-500' :
    item.tipo === 'intervencion' ? 'bg-violet-500' :
                                   'bg-emerald-500'

  const fecha = new Date(item.fecha).toLocaleString('es-AR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${dotColor}`} />
        {!last && <div className="w-px flex-1 bg-zinc-800 mt-1" />}
      </div>
      <div className="pb-5">
        <p className="text-sm text-zinc-200">{item.accion}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{item.actor} · {fecha}</p>
      </div>
    </div>
  )
}

function TicketProgress({ estado }: { estado: string }) {
  const currentIdx = ESTADO_ORDER.indexOf(estado as never)
  return (
    <div className="flex items-center gap-0">
      {ESTADO_ORDER.map((e, i) => {
        const done = i <= currentIdx
        const current = i === currentIdx
        return (
          <div key={e} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
                current ? 'bg-blue-500 ring-2 ring-blue-500/30' : done ? 'bg-blue-700' : 'bg-zinc-700'
              }`} />
              <span className={`text-xs whitespace-nowrap ${done ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {ESTADO_LABELS[e]}
              </span>
            </div>
            {i < ESTADO_ORDER.length - 1 && (
              <div className={`h-px flex-1 mx-1 mb-4 ${i < currentIdx ? 'bg-blue-700' : 'bg-zinc-800'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  )
}

export default function TicketDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTicketById(id)
      .then(setTicket)
      .catch(() => setError('No se pudo cargar el ticket.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-sm text-zinc-400">{error ?? 'Ticket no encontrado.'}</p>
        <Link href="/tickets" className="text-xs text-blue-400 hover:text-blue-300 underline">
          Volver a tickets
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/tickets" className="hover:text-zinc-300 transition-colors">Tickets</Link>
        <span>›</span>
        <span className="text-zinc-300 font-mono">#{ticket.id.slice(0, 8).toUpperCase()}</span>
      </div>

      {/* Título + acciones */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">{ticket.titulo}</h1>
          <div className="flex items-center gap-3 mt-2">
            <EstadoBadge estado={ticket.estado} />
            <UrgenciaBadge urgencia={ticket.urgencia} />
            <span className="text-xs text-zinc-500">
              {new Date(ticket.created_at).toLocaleDateString('es-AR', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors">
            Asignar técnico
          </button>
          <button className="px-3 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors">
            Cambiar estado
          </button>
        </div>
      </div>

      {/* Progreso */}
      <Section title="Progreso">
        <TicketProgress estado={ticket.estado} />
      </Section>

      <div className="grid grid-cols-3 gap-4">
        {/* Columna izquierda */}
        <div className="col-span-2 space-y-4">
          <Section title="Descripción">
            <p className="text-sm text-zinc-300 leading-relaxed">{ticket.descripcion}</p>
          </Section>

          {/* Timeline: se conecta cuando backend exponga el historial de acciones */}
          <Section title="Historial">
            <p className="text-sm text-zinc-500 italic">Historial disponible próximamente.</p>
          </Section>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          <Section title="Cliente">
            <div className="space-y-2 text-sm">
              <p className="font-medium text-zinc-200">{ticket.cliente.nombre}</p>
              <p className="text-zinc-500">{ticket.cliente.email}</p>
              {ticket.cliente.telefono && <p className="text-zinc-500">{ticket.cliente.telefono}</p>}
              <p className="text-zinc-500">{ticket.cliente.direccion}</p>
            </div>
          </Section>

          <Section title="Técnico asignado">
            {ticket.tecnico ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-medium text-violet-300">
                    {ticket.tecnico.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-200">{ticket.tecnico.nombre}</p>
                    <p className="text-zinc-500">{ticket.tecnico.especialidad}</p>
                  </div>
                </div>
                <p className="text-zinc-500">Zona: {ticket.tecnico.zona}</p>
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic">Sin técnico asignado</p>
            )}
          </Section>

          <Section title="Equipo">
            <div className="space-y-1.5 text-sm">
              <p className="font-medium text-zinc-200">{ticket.equipo.marca} {ticket.equipo.modelo}</p>
              <p className="text-zinc-500">{TIPO_EQUIPO_LABELS[ticket.equipo.tipo]}</p>
              <p className="font-mono text-xs text-zinc-600">{ticket.equipo.nro_serie}</p>
            </div>
          </Section>

          <Section title="Dirección">
            <p className="text-sm text-zinc-300">{ticket.direccion}</p>
          </Section>
        </div>
      </div>
    </div>
  )
}