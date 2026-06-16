'use client'

import { useState, useMemo, useEffect } from 'react'
import { getTecnicos, TecnicoAPI } from '@/api/users'


function TecnicoCard({ tecnico }: { tecnico: TecnicoAPI }) {
  const initials = tecnico.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-sm font-medium text-violet-300 shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{tecnico.full_name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{tecnico.email}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
          tecnico.is_active
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'bg-zinc-800 text-zinc-500'
        }`}>
          {tecnico.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-zinc-500">
        {tecnico.phone && (
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/>
            </svg>
            <span>{tecnico.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <span>{tecnico.role}</span>
        </div>
      </div>
    </div>
  )
}

export default function TecnicosPage() {
  const [tecnicos, setTecnicos] = useState<TecnicoAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [soloActivos, setSoloActivos] = useState(false)

  useEffect(() => {
    getTecnicos()
      .then(setTecnicos)
      .catch(() => setError('No se pudieron cargar los técnicos.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return tecnicos.filter(t => {
      const matchSearch =
        search === '' ||
        t.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (t.phone ?? '').toLowerCase().includes(search.toLowerCase())
      const matchActivo = !soloActivos || t.is_active
      return matchSearch && matchActivo
    })
  }, [tecnicos, search, soloActivos])

  const activos = tecnicos.filter(t => t.is_active).length

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
          onClick={() => {
            setError(null)
            setLoading(true)
            getTecnicos()
              .then(setTecnicos)
              .catch(() => setError('No se pudieron cargar los técnicos.'))
              .finally(() => setLoading(false))
          }}
          className="text-xs text-blue-400 hover:text-blue-300 underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Técnicos</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {activos} activo{activos !== 1 ? 's' : ''} de {tecnicos.length}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        <button
          onClick={() => setSoloActivos(p => !p)}
          className={`px-3 py-2 rounded-lg text-sm transition-colors border ${
            soloActivos
              ? 'bg-emerald-500/15 border-emerald-600 text-emerald-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          Solo activos
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-sm">
            {tecnicos.length === 0
              ? 'No hay técnicos registrados en el sistema.'
              : 'No se encontraron técnicos con esos filtros.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(tecnico => (
            <TecnicoCard key={tecnico.id} tecnico={tecnico} />
          ))}
        </div>
      )}
    </div>
  )
}