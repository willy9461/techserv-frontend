'use client'

import { useState } from 'react'
import { MiTicket, TicketEstado } from '@/types/ticket'
import { EstadoBadge, UrgenciaBadge } from '@/components/shared/TicketCard'
import Link from 'next/link'

const MOCK_MIS_TICKETS: MiTicket[] = [
  {
    id: 'TK-001',
    titulo: 'Aire acondicionado no enfría',
    descripcion: 'El equipo enciende pero no baja la temperatura.',
    estado: 'en_proceso',
    urgencia: 'alta',
    createdAt: '2026-05-20T10:00:00Z',
    tecnico: { nombre: 'Carlos Méndez', especialidad: 'HVAC' },
    equipo: { tipo: 'hvac', marca: 'Carrier', modelo: 'XC21' },
  },
  {
    id: 'TK-002',
    titulo: 'PC no enciende',
    descripcion: 'Al presionar el botón de encendido no hay respuesta.',
    estado: 'abierto',
    urgencia: 'media',
    createdAt: '2026-05-25T09:30:00Z',
    equipo: { tipo: 'informatico', marca: 'Dell', modelo: 'OptiPlex 7090' },
  },
  {
    id: 'TK-003',
    titulo: 'Heladera no congela',
    descripcion: 'El freezer perdió temperatura progresivamente.',
    estado: 'resuelto',
    urgencia: 'baja',
    createdAt: '2026-05-10T14:00:00Z',
    tecnico: { nombre: 'Laura Giménez', especialidad: 'Electrodomésticos' },
    equipo: { tipo: 'electrodomestico', marca: 'Whirlpool', modelo: 'WRB543' },
  },
]

const FILTROS: { label: string; value: TicketEstado | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Abiertos', value: 'abierto' },
  { label: 'En proceso', value: 'en_proceso' },
  { label: 'Resueltos', value: 'resuelto' },
  { label: 'Cerrados', value: 'cerrado' },
]

export default function MisTicketsPage() {
  const [filtro, setFiltro] = useState<TicketEstado | 'todos'>('todos')

  const tickets = filtro === 'todos'
    ? MOCK_MIS_TICKETS
    : MOCK_MIS_TICKETS.filter(t => t.estado === filtro)

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
      {tickets.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          No tenés solicitudes en este estado.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tickets.map(ticket => (
            <Link
              key={ticket.id}
              href={`/mis-tickets/${ticket.id}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs text-zinc-500 font-mono">{ticket.id}</span>
                  <h2 className="text-base font-medium text-white mt-0.5">{ticket.titulo}</h2>
                </div>
                <div className="flex gap-2 shrink-0">
                  <UrgenciaBadge urgencia={ticket.urgencia} />
                  <EstadoBadge estado={ticket.estado} />
                </div>
              </div>

              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{ticket.descripcion}</p>

              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div className="flex gap-4">
                  {ticket.equipo && (
                    <span>{ticket.equipo.marca} {ticket.equipo.modelo}</span>
                  )}
                  {ticket.tecnico && (
                    <span>Técnico: <span className="text-zinc-300">{ticket.tecnico.nombre}</span></span>
                  )}
                </div>
                <span>{new Date(ticket.createdAt).toLocaleDateString('es-AR')}</span>
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