'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EstadoBadge, UrgenciaBadge } from '@/components/shared/TicketCard'
import { Ticket, ESTADO_ORDER, ESTADO_LABELS, TicketEstado } from '@/types/ticket'
import { getTicketById, updateTicketStatus } from '@/api/tickets'
import { getTecnicos } from '@/api/users'
import axiosInstance from '@/lib/axios'

// ─── Modal Cambiar Estado ─────────────────────────────────────────────────────

const TRANSICIONES: Record<TicketEstado, TicketEstado[]> = {
  abierto:        ['en_diagnostico'],
  en_diagnostico: ['en_proceso'],
  en_proceso:     ['resuelto'],
  resuelto:       [],
  cerrado:        [],
  cancelado:      [],
}

function CambiarEstadoModal({ ticket, onClose, onSuccess }: {
  ticket: Ticket
  onClose: () => void
  onSuccess: (nuevoEstado: TicketEstado) => void
}) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<TicketEstado | null>(null)
  const [nota, setNota] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const opciones = TRANSICIONES[ticket.estado] ?? []

  const handleConfirmar = async () => {
    if (!estadoSeleccionado) return
    setLoading(true)
    setError(null)
    try {
      await updateTicketStatus(ticket.id, { estado: estadoSeleccionado, nota })
      onSuccess(estadoSeleccionado)
    } catch {
      setError('No se pudo actualizar el estado. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-sm font-semibold text-white">Cambiar estado</h2>

        {opciones.length === 0 ? (
          <p className="text-sm text-zinc-500">Este ticket no puede cambiar de estado.</p>
        ) : (
          <>
            <div className="space-y-2">
              {opciones.map((e) => (
                <button
                  key={e}
                  onClick={() => setEstadoSeleccionado(e)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    estadoSeleccionado === e
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'
                  }`}
                >
                  {ESTADO_LABELS[e]}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Nota (opcional)</label>
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={2}
                placeholder="Agregá una nota sobre el cambio..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
          </>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancelar
          </button>
          {opciones.length > 0 && (
            <button
              onClick={handleConfirmar}
              disabled={!estadoSeleccionado || loading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? 'Guardando...' : 'Confirmar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Modal Asignar Técnico ────────────────────────────────────────────────────

interface TecnicoListItem {
  id: string
  full_name: string
  email: string
  phone?: string
}

function AsignarTecnicoModal({ ticketId, onClose, onSuccess }: {
  ticketId: string
  onClose: () => void
  onSuccess: (tecnico: TecnicoListItem) => void
}) {
  const [tecnicos, setTecnicos] = useState<TecnicoListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seleccionado, setSeleccionado] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    getTecnicos()
      .then(setTecnicos)
      .catch(() => setError('No se pudieron cargar los técnicos.'))
      .finally(() => setLoading(false))
  }, [])

  const handleConfirmar = async () => {
    if (!seleccionado) return
    setGuardando(true)
    setError(null)
    try {
      await axiosInstance.patch(`/tickets/${ticketId}`, { tecnico_id: seleccionado })
      const tecnico = tecnicos.find(t => t.id === seleccionado)
      if (tecnico) onSuccess(tecnico)
    } catch {
      setError('No se pudo asignar el técnico. Intentá de nuevo.')
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-sm font-semibold text-white">Asignar técnico</h2>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : tecnicos.length === 0 ? (
          <p className="text-sm text-zinc-500">No hay técnicos disponibles.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {tecnicos.map((t) => (
              <button
                key={t.id}
                onClick={() => setSeleccionado(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                  seleccionado === t.id
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'
                }`}
              >
                <p className="font-medium">{t.full_name}</p>
                <p className="text-xs opacity-70 mt-0.5">{t.email}</p>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancelar
          </button>
          {!loading && tecnicos.length > 0 && (
            <button
              onClick={handleConfirmar}
              disabled={!seleccionado || guardando}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {guardando ? 'Guardando...' : 'Confirmar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

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

// ─── Página principal ─────────────────────────────────────────────────────────

export default function TicketDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalEstado, setModalEstado] = useState(false)
  const [modalTecnico, setModalTecnico] = useState(false)

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
      {/* Modales */}
      {modalEstado && (
        <CambiarEstadoModal
          ticket={ticket}
          onClose={() => setModalEstado(false)}
          onSuccess={(nuevoEstado) => {
            setTicket((prev) => prev ? { ...prev, estado: nuevoEstado } : prev)
            setModalEstado(false)
          }}
        />
      )}
      {modalTecnico && (
        <AsignarTecnicoModal
          ticketId={ticket.id}
          onClose={() => setModalTecnico(false)}
          onSuccess={(tecnico) => {
            setTicket((prev) => prev ? {
              ...prev,
              tecnico: { id: tecnico.id, full_name: tecnico.full_name }
            } : prev)
            setModalTecnico(false)
          }}
        />
      )}

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
              {new Date(ticket.fecha_creacion ?? ticket.created_at ?? '').toLocaleDateString('es-AR', {
                day: '2-digit', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setModalTecnico(true)}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
          >
            Asignar técnico
          </button>
          <button
            onClick={() => setModalEstado(true)}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Cambiar estado
          </button>
        </div>
      </div>

      {/* Progreso */}
      <Section title="Progreso">
        <TicketProgress estado={ticket.estado} />
      </Section>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Section title="Descripción">
            <p className="text-sm text-zinc-300 leading-relaxed">{ticket.descripcion}</p>
          </Section>
          <Section title="Historial">
            <p className="text-sm text-zinc-500 italic">Historial disponible próximamente.</p>
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Cliente">
            {ticket.cliente ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-zinc-200">{ticket.cliente.full_name}</p>
                <p className="text-zinc-500">{ticket.cliente.email}</p>
                {ticket.cliente.phone && <p className="text-zinc-500">{ticket.cliente.phone}</p>}
                {ticket.cliente.direccion && <p className="text-zinc-500">{ticket.cliente.direccion}</p>}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic">Sin información del cliente.</p>
            )}
          </Section>

          <Section title="Técnico asignado">
            {ticket.tecnico ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-medium text-violet-300">
                    {ticket.tecnico.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-200">{ticket.tecnico.full_name}</p>
                    {ticket.tecnico.especialidad && <p className="text-zinc-500">{ticket.tecnico.especialidad}</p>}
                  </div>
                </div>
                {ticket.tecnico.zona && <p className="text-zinc-500">Zona: {ticket.tecnico.zona}</p>}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic">Sin técnico asignado</p>
            )}
          </Section>

          <Section title="Equipo">
            {ticket.equipo ? (
              <div className="space-y-1.5 text-sm">
                <p className="font-medium text-zinc-200">{ticket.equipo.marca} {ticket.equipo.modelo}</p>
                <p className="text-zinc-500">{ticket.equipo.tipo}</p>
                <p className="font-mono text-xs text-zinc-600">{ticket.equipo.numero_serie}</p>
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic">Sin información del equipo.</p>
            )}
          </Section>

          <Section title="Dirección">
            <p className="text-sm text-zinc-300">{ticket.direccion}</p>
          </Section>
        </div>
      </div>
    </div>
  )
}