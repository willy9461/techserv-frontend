'use client'

import { useState } from 'react'
import { MiEquipo, TipoEquipo } from '@/types/ticket'
import { EstadoBadge } from '@/components/shared/TicketCard'
import Link from 'next/link'

const TIPO_LABELS: Record<TipoEquipo, string> = {
  electrodomestico: 'Electrodoméstico',
  industrial: 'Industrial',
  hvac: 'HVAC',
  informatico: 'Informático',
  otro: 'Otro',
}

const MOCK_MIS_EQUIPOS: MiEquipo[] = [
  {
    id: 'EQ-001',
    tipo: 'hvac',
    marca: 'Carrier',
    modelo: 'XC21',
    nro_serie: 'CAR-2021-00421',
    ultimaIntervencion: {
      fecha: '2026-05-22T14:30:00Z',
      descripcion: 'Falla en compresor detectada.',
      estado: 'en_proceso',
    },
  },
  {
    id: 'EQ-002',
    tipo: 'informatico',
    marca: 'Dell',
    modelo: 'OptiPlex 7090',
    nro_serie: 'DELL-7090-88231',
    ultimaIntervencion: {
      fecha: '2026-05-25T09:30:00Z',
      descripcion: 'PC no enciende al presionar el botón de encendido.',
      estado: 'abierto',
    },
  },
  {
    id: 'EQ-003',
    tipo: 'electrodomestico',
    marca: 'Whirlpool',
    modelo: 'WRB543',
    nro_serie: 'WHP-543-19872',
    ultimaIntervencion: {
      fecha: '2026-05-10T14:00:00Z',
      descripcion: 'Revisión de sistema de refrigeración. Problema resuelto.',
      estado: 'resuelto',
    },
  },
  {
    id: 'EQ-004',
    tipo: 'industrial',
    marca: 'Siemens',
    modelo: 'S7-1200',
    nro_serie: 'SIE-S7-44901',
  },
]

const TIPO_ICON: Record<TipoEquipo, string> = {
  hvac: '❄️',
  informatico: '💻',
  electrodomestico: '🏠',
  industrial: '⚙️',
  otro: '📦',
}

export default function MisEquiposPage() {
  const [busqueda, setBusqueda] = useState('')

  const equipos = MOCK_MIS_EQUIPOS.filter(e =>
    `${e.marca} ${e.modelo} ${e.nro_serie}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-white mb-1">Mis equipos</h1>
        <p className="text-sm text-zinc-400">Equipos registrados y su historial de intervenciones.</p>
      </div>

      {/* Búsqueda */}
      <input
        type="text"
        placeholder="Buscar por marca, modelo o número de serie..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 mb-6"
      />

      {equipos.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          No se encontraron equipos.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {equipos.map(equipo => (
            <div
              key={equipo.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4"
            >
              {/* Header equipo */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl shrink-0">
                  {TIPO_ICON[equipo.tipo]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {equipo.marca} {equipo.modelo}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{TIPO_LABELS[equipo.tipo]}</p>
                  <p className="text-xs text-zinc-600 font-mono mt-1">{equipo.nro_serie}</p>
                </div>
              </div>

              {/* Última intervención */}
              {equipo.ultimaIntervencion ? (
                <div className="border-t border-zinc-800 pt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-zinc-500">Última intervención</span>
                    <EstadoBadge estado={equipo.ultimaIntervencion.estado} />
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {equipo.ultimaIntervencion.descripcion}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {new Date(equipo.ultimaIntervencion.fecha).toLocaleDateString('es-AR', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              ) : (
                <div className="border-t border-zinc-800 pt-3">
                  <p className="text-xs text-zinc-600">Sin intervenciones registradas.</p>
                </div>
              )}

              {/* Acción */}
              <Link
                href={`/tickets/nuevo?equipo=${equipo.id}`}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                + Solicitar asistencia para este equipo
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}