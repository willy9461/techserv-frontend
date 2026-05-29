'use client'

import Link from 'next/link'
import { EstadoBadge, UrgenciaBadge } from '@/components/shared/TicketCard'
import { TicketEstado, TicketUrgencia } from '@/types/ticket'

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_KPIS = {
  ticketsAbiertos: 8,
  ticketsEnProceso: 3,
  resueltosDeLaSemana: 12,
  tiempoPromedioHoras: 4.2,
}

const MOCK_TICKETS_RECIENTES = [
  { id: 'a1b2c3d4-0001', titulo: 'Aire acondicionado no enfría',      cliente: 'Lucía Fernández',        tecnico: null,          estado: 'abierto'        as TicketEstado, urgencia: 'alta'  as TicketUrgencia, hace: 'hace 2h' },
  { id: 'a1b2c3d4-0006', titulo: 'Red empresarial caída',             cliente: 'Empresa Textil Norteña', tecnico: 'A. Volponi',  estado: 'en_proceso'     as TicketEstado, urgencia: 'alta'  as TicketUrgencia, hace: 'hace 3h' },
  { id: 'a1b2c3d4-0002', titulo: 'Lavadora no centrifuga',            cliente: 'Carlos Méndez',          tecnico: 'M. Jurado',   estado: 'en_diagnostico' as TicketEstado, urgencia: 'media' as TicketUrgencia, hace: 'hace 5h' },
  { id: 'a1b2c3d4-0005', titulo: 'Heladera no congela',               cliente: 'Roberto Sosa',           tecnico: null,          estado: 'abierto'        as TicketEstado, urgencia: 'media' as TicketUrgencia, hace: 'hace 6h' },
  { id: 'a1b2c3d4-0003', titulo: 'PC no arranca',                     cliente: 'Estudio Jurídico Pérez', tecnico: 'M. Sciotti',  estado: 'en_proceso'     as TicketEstado, urgencia: 'alta'  as TicketUrgencia, hace: 'hace 1d' },
]

const MOCK_TECNICOS = [
  { id: 't1', nombre: 'Martin Sciotti',    iniciales: 'MS', especialidad: 'Informático',     zona: 'CABA Centro',  disponible: false, ticketsActivos: 2 },
  { id: 't2', nombre: 'Marcelo Jurado',    iniciales: 'MJ', especialidad: 'Electrodoméstico',zona: 'CABA Norte',   disponible: false, ticketsActivos: 1 },
  { id: 't3', nombre: 'Alejandro Volponi', iniciales: 'AV', especialidad: 'Redes',           zona: 'GBA Oeste',    disponible: false, ticketsActivos: 1 },
  { id: 't4', nombre: 'Julio Maine',       iniciales: 'JM', especialidad: 'HVAC',            zona: 'CABA Sur',     disponible: true,  ticketsActivos: 0 },
]

// ── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: 'blue' | 'amber' | 'emerald' | 'violet'
}) {
  const accentClass = {
    blue:    'text-blue-400',
    amber:   'text-amber-400',
    emerald: 'text-emerald-400',
    violet:  'text-violet-400',
  }[accent ?? 'blue']

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">{label}</p>
      <p className={`text-3xl font-semibold tabular-nums ${accentClass}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-1">{sub}</p>}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const sinAsignar = MOCK_TICKETS_RECIENTES.filter(t => !t.tecnico).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-white">Panel de control</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Viernes 29 de mayo, 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard
          label="Tickets abiertos"
          value={MOCK_KPIS.ticketsAbiertos}
          sub={`${sinAsignar} sin asignar`}
          accent="blue"
        />
        <KPICard
          label="En proceso"
          value={MOCK_KPIS.ticketsEnProceso}
          sub="técnicos en campo"
          accent="amber"
        />
        <KPICard
          label="Resueltos esta semana"
          value={MOCK_KPIS.resueltosDeLaSemana}
          sub="últimos 7 días"
          accent="emerald"
        />
        <KPICard
          label="Tiempo promedio"
          value={`${MOCK_KPIS.tiempoPromedioHoras}h`}
          sub="resolución por ticket"
          accent="violet"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Tickets recientes */}
        <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-200">Tickets recientes</h2>
            <Link href="/tickets">
              <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Ver todos →
              </span>
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {MOCK_TICKETS_RECIENTES.map((t) => (
              <Link key={t.id} href={`/tickets/${t.id}`}>
                <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{t.titulo}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{t.cliente}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {t.tecnico ? (
                      <span className="text-xs text-zinc-500">{t.tecnico}</span>
                    ) : (
                      <span className="text-xs text-amber-500 font-medium">Sin asignar</span>
                    )}
                    <UrgenciaBadge urgencia={t.urgencia} />
                    <EstadoBadge estado={t.estado} />
                    <span className="text-xs text-zinc-600 w-16 text-right">{t.hace}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-zinc-800">
            <Link href="/tickets/nuevo">
              <button className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Nuevo ticket
              </button>
            </Link>
          </div>
        </div>

        {/* Técnicos */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-200">Técnicos</h2>
            <Link href="/tecnicos">
              <span className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Ver todos →
              </span>
            </Link>
          </div>
          <div className="divide-y divide-zinc-800">
            {MOCK_TECNICOS.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">
                    {t.iniciales}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 ${t.disponible ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{t.nombre}</p>
                  <p className="text-xs text-zinc-500">{t.zona}</p>
                </div>
                <div className="shrink-0 text-right">
                  {t.ticketsActivos > 0 ? (
                    <span className="text-xs font-medium text-amber-400">{t.ticketsActivos} activo{t.ticketsActivos > 1 ? 's' : ''}</span>
                  ) : (
                    <span className="text-xs text-emerald-400">Libre</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}