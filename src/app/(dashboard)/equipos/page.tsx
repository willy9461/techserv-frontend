'use client'

import { useEffect, useState } from 'react'
import { getEquipos, Equipo } from '@/api/equipos'
import Link from 'next/link'

export default function MisEquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    getEquipos()
      .then(setEquipos)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = equipos.filter(e =>
    `${e.marca} ${e.modelo} ${e.numero_serie}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-white mb-1">Equipos</h1>
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

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          No se encontraron equipos.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map(equipo => (
            <div
              key={equipo.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {equipo.marca} {equipo.modelo}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">{equipo.tipo}</p>
                  <p className="text-xs text-zinc-600 font-mono mt-1">{equipo.numero_serie}</p>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <p className="text-xs text-zinc-600">Sin intervenciones registradas.</p>
              </div>

              <Link
                href="/tickets/nuevo"
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