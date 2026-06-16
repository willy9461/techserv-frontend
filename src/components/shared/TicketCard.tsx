'use client'

import { TicketListItem, ESTADO_LABELS, TicketEstado, TicketUrgencia } from '@/types/ticket'
import Link from 'next/link'

const ESTADO_STYLES: Record<TicketEstado, { bg: string; text: string; dot: string }> = {
  abierto:        { bg: 'bg-blue-500/10',    text: 'text-blue-400',   dot: 'bg-blue-400' },
  en_diagnostico: { bg: 'bg-amber-500/10',   text: 'text-amber-400',  dot: 'bg-amber-400' },
  en_proceso:     { bg: 'bg-violet-500/10',  text: 'text-violet-400', dot: 'bg-violet-400' },
  resuelto:       { bg: 'bg-emerald-500/10', text: 'text-emerald-400',dot: 'bg-emerald-400' },
}

const URGENCIA_STYLES: Record<TicketUrgencia, { border: string; text: string; label: string }> = {
  baja:  { border: 'border-l-zinc-600',  text: 'text-zinc-400',  label: '↓ Baja' },
  media: { border: 'border-l-amber-500', text: 'text-amber-400', label: '→ Media' },
  alta:  { border: 'border-l-red-500',   text: 'text-red-400',   label: '↑ Alta' },
}

export function EstadoBadge({ estado }: { estado: TicketEstado }) {
  const s = ESTADO_STYLES[estado]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {ESTADO_LABELS[estado]}
    </span>
  )
}

export function UrgenciaBadge({ urgencia }: { urgencia: TicketUrgencia }) {
  const s = URGENCIA_STYLES[urgencia]
  return (
    <span className={`text-xs font-mono font-medium ${s.text}`}>
      {s.label}
    </span>
  )
}

interface TicketCardProps {
  ticket: TicketListItem
  className?: string
}

export function TicketCard({ ticket, className = '' }: TicketCardProps) {
  const urgencia = URGENCIA_STYLES[ticket.urgencia]
  const fecha = ticket.fecha_creacion
    ? new Date(ticket.fecha_creacion).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : null

  return (
    <Link href={`/tickets/${ticket.id}`}>
      <div className={`group relative bg-zinc-900 border border-zinc-800 border-l-4 ${urgencia.border} rounded-lg p-4 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all duration-150 cursor-pointer ${className}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-zinc-500 mb-0.5">#{ticket.id.slice(0, 8).toUpperCase()}</p>
            <h3 className="text-sm font-medium text-zinc-100 truncate group-hover:text-white transition-colors">
              {ticket.titulo}
            </h3>
          </div>
          <EstadoBadge estado={ticket.estado} />
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="truncate max-w-[120px]">{ticket.cliente_nombre}</span>
            {ticket.tecnico_nombre && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="truncate max-w-[120px]">{ticket.tecnico_nombre}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <UrgenciaBadge urgencia={ticket.urgencia} />
            {fecha && <span>{fecha}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

interface TicketRowProps {
  ticket: TicketListItem
}

export function TicketRow({ ticket }: TicketRowProps) {
  const fecha = ticket.fecha_creacion
    ? new Date(ticket.fecha_creacion).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short',
      })
    : '—'

  return (
    <Link href={`/tickets/${ticket.id}`}>
      <tr className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors cursor-pointer">
        <td className="py-3 px-4"><span className="font-mono text-xs text-zinc-400">#{ticket.id.slice(0, 8).toUpperCase()}</span></td>
        <td className="py-3 px-4"><span className="text-sm text-zinc-200">{ticket.titulo}</span></td>
        <td className="py-3 px-4"><span className="text-sm text-zinc-400">{ticket.cliente_nombre}</span></td>
        <td className="py-3 px-4"><span className="text-sm text-zinc-500">{ticket.tecnico_nombre ?? '—'}</span></td>
        <td className="py-3 px-4"><EstadoBadge estado={ticket.estado} /></td>
        <td className="py-3 px-4"><UrgenciaBadge urgencia={ticket.urgencia} /></td>
        <td className="py-3 px-4"><span className="text-xs text-zinc-500">{fecha}</span></td>
      </tr>
    </Link>
  )
}