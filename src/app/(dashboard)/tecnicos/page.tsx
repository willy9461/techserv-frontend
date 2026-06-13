'use client'

import { useState, useMemo } from 'react'
import { Tecnico } from '@/types/ticket'

const ESPECIALIDADES = ['Todos', 'HVAC', 'Informático', 'Electrodomésticos', 'Industrial']

const MOCK_TECNICOS: Tecnico[] = [
  {
    id: 'tec-001',
    full_name: 'Carlos Méndez',
    email: 'c.mendez@techserv.com',
    especialidad: 'HVAC',
    zona: 'CABA Norte',
    disponible: true,
  },
  {
    id: 'tec-002',
    full_name: 'Laura Giménez',
    email: 'l.gimenez@techserv.com',
    especialidad: 'Electrodomésticos',
    zona: 'GBA Oeste',
    disponible: false,
  },
  {
    id: 'tec-003',
    full_name: 'Martin Sciotti',
    email: 'm.sciotti@techserv.com',
    especialidad: 'Informático',
    zona: 'CABA Centro',
    disponible: false,
  },
  {
    id: 'tec-004',
    full_name: 'Roberto Paz',
    email: 'r.paz@techserv.com',
    especialidad: 'Industrial',
    zona: 'GBA Sur',
    disponible: true,
  },
  {
    id: 'tec-005',
    full_name: 'Ana Rodríguez',
    email: 'a.rodriguez@techserv.com',
    especialidad: 'HVAC',
    zona: 'CABA Sur',
    disponible: true,
  },
]

function TecnicoCard({ tecnico }: { tecnico: Tecnico }) {
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
          tecnico.disponible
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'bg-zinc-800 text-zinc-500'
        }`}>
          {tecnico.disponible ? 'Disponible' : 'Ocupado'}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
          <span>{tecnico.zona}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <span>{tecnico.especialidad}</span>
        </div>
      </div>
    </div>
  )
}

export default function TecnicosPage() {
  const [search, setSearch] = useState('')
  const [especialidadFiltro, setEspecialidadFiltro] = useState('Todos')
  const [soloDisponibles, setSoloDisponibles] = useState(false)

  const filtered = useMemo(() => {
    return MOCK_TECNICOS.filter(t => {
      const matchSearch =
        search === '' ||
        t.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (t.zona ?? '').toLowerCase().includes(search.toLowerCase())
      const matchEspecialidad =
        especialidadFiltro === 'Todos' || t.especialidad === especialidadFiltro
      const matchDisponible = !soloDisponibles || t.disponible
      return matchSearch && matchEspecialidad && matchDisponible
    })
  }, [search, especialidadFiltro, soloDisponibles])

  const disponibles = MOCK_TECNICOS.filter(t => t.disponible).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Técnicos</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {disponibles} disponible{disponibles !== 1 ? 's' : ''} de {MOCK_TECNICOS.length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o zona..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        <select
          value={especialidadFiltro}
          onChange={e => setEspecialidadFiltro(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors"
        >
          {ESPECIALIDADES.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <button
          onClick={() => setSoloDisponibles(p => !p)}
          className={`px-3 py-2 rounded-lg text-sm transition-colors border ${
            soloDisponibles
              ? 'bg-emerald-500/15 border-emerald-600 text-emerald-400'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          Solo disponibles
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-sm">No se encontraron técnicos con esos filtros.</p>
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