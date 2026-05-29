'use client'

import { MiTicket, TicketEstado } from '@/types/ticket'
import { EstadoBadge, UrgenciaBadge } from '@/components/shared/TicketCard'
import Link from 'next/link'

const MOCK_TICKET_DETALLE: MiTicket & {
  timeline: { fecha: string; mensaje: string; estado: TicketEstado }[]
} = {
  id: 'TK-001',
  titulo: 'Aire acondicionado no enfría',
  descripcion: 'El equipo enciende pero no baja la temperatura. Ya probé limpiando los filtros y el problema persiste.',
  estado: 'en_proceso',
  urgencia: 'alta',
  createdAt: '2026-05-20T10:00:00Z',
  tecnico: { nombre: 'Carlos Méndez', especialidad: 'HVAC' },
  equipo: { tipo: 'hvac', marca: 'Carrier', modelo: 'XC21' },
  timeline: [
    { fecha: '2026-05-20T10:00:00Z', mensaje: 'Solicitud recibida.', estado: 'abierto' },
    { fecha: '2026-05-21T09:15:00Z', mensaje: 'Técnico Carlos Méndez asignado.', estado: 'en_diagnostico' },
    { fecha: '2026-05-22T14:30:00Z', mensaje: 'Diagnóstico iniciado. Se detectó falla en el compresor.', estado: 'en_proceso' },
  ],
}

const PASOS: { estado: TicketEstado; label: string }[] = [
  { estado: 'abierto', label: 'Recibido' },
  { estado: 'en_diagnostico', label: 'Diagnóstico' },
  { estado: 'en_proceso', label: 'En proceso' },
  { estado: 'resuelto', label: 'Resuelto' },
  { estado: 'cerrado', label: 'Cerrado' },
]

const ORDEN: TicketEstado[] = ['abierto', 'en_diagnostico', 'en_proceso', 'resuelto', 'cerrado']

export default function MiTicketDetallePage({ params }: { params: { id: string } }) {
  const ticket = MOCK_TICKET_DETALLE
  const pasoActual = ORDEN.indexOf(ticket.estado)

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <Link href="/mis-tickets" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          ← Mis solicitudes
        </Link>
        <div className="flex items-start justify-between mt-3 gap-4">
          <div>
            <span className="text-xs text-zinc-500 font-mono">{ticket.id}</span>
            <h1 className="text-xl font-medium text-white mt-0.5">{ticket.titulo}</h1>
          </div>
          <div className="flex gap-2 shrink-0">
            <UrgenciaBadge urgencia={ticket.urgencia} />
            <EstadoBadge estado={ticket.estado} />
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-4 h-px bg-zinc-700 mx-8" />
          {PASOS.map((paso, i) => {
            const completado = i <= pasoActual
            const actual = i === pasoActual
            return (
              <div key={paso.estado} className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  actual ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-zinc-900'
                  : completado ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {completado && !actual ? '✓' : i + 1}
                </div>
                <span className={`text-xs text-center ${actual ? 'text-blue-400 font-medium' : completado ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {paso.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Técnico asignado */}
      {ticket.tecnico && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-medium text-zinc-400 mb-3">Técnico asignado</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-sm font-medium text-blue-300">
              {ticket.tecnico.nombre.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{ticket.tecnico.nombre}</p>
              <p className="text-xs text-zinc-500">{ticket.tecnico.especialidad}</p>
            </div>
          </div>
        </div>
      )}

      {/* Equipo */}
      {ticket.equipo && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-medium text-zinc-400 mb-2">Equipo</h2>
          <p className="text-sm text-white">{ticket.equipo.marca} {ticket.equipo.modelo}</p>
          <p className="text-xs text-zinc-500 mt-0.5 capitalize">{ticket.equipo.tipo}</p>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-sm font-medium text-zinc-400 mb-4">Historial de actualizaciones</h2>
        <div className="flex flex-col gap-4">
          {ticket.timeline.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                {i < ticket.timeline.length - 1 && (
                  <div className="w-px flex-1 bg-zinc-700 mt-1" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm text-zinc-200">{item.mensaje}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(item.fecha).toLocaleDateString('es-AR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}