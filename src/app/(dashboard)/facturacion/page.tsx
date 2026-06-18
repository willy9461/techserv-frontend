'use client'

import { useState } from 'react'

type EstadoFactura = 'pendiente' | 'emitida' | 'cobrada'

interface Factura {
  id: string
  nro: string
  cliente: string
  ticket: string
  monto: number
  estado: EstadoFactura
  fecha: string
}

const MOCK_FACTURAS: Factura[] = [
  { id: 'f1', nro: 'FC-0001', cliente: 'Lucía Fernández',        ticket: 'Aire acondicionado no enfría', monto: 15000, estado: 'cobrada',   fecha: '2026-05-15' },
  { id: 'f2', nro: 'FC-0002', cliente: 'Estudio Jurídico Pérez', ticket: 'PC no arranca',                monto: 8500,  estado: 'emitida',   fecha: '2026-05-22' },
  { id: 'f3', nro: 'FC-0003', cliente: 'Frigorífico del Sur',    ticket: 'Mantenimiento compresor',      monto: 42000, estado: 'cobrada',   fecha: '2026-05-28' },
  { id: 'f4', nro: 'FC-0004', cliente: 'Roberto Sosa',           ticket: 'Heladera no congela',          monto: 12000, estado: 'pendiente', fecha: '2026-06-01' },
  { id: 'f5', nro: 'FC-0005', cliente: 'Empresa Textil Norteña', ticket: 'Red empresarial caída',        monto: 25000, estado: 'emitida',   fecha: '2026-06-05' },
]

const ESTADO_STYLES: Record<EstadoFactura, string> = {
  pendiente: 'bg-amber-500/10 text-amber-400',
  emitida:   'bg-blue-500/10 text-blue-400',
  cobrada:   'bg-emerald-500/10 text-emerald-400',
}

const ESTADO_LABELS: Record<EstadoFactura, string> = {
  pendiente: 'Pendiente',
  emitida:   'Emitida',
  cobrada:   'Cobrada',
}

export default function FacturacionPage() {
  const [filtro, setFiltro] = useState<EstadoFactura | 'todas'>('todas')

  const filtered = filtro === 'todas'
    ? MOCK_FACTURAS
    : MOCK_FACTURAS.filter(f => f.estado === filtro)

  const totalCobrado = MOCK_FACTURAS
    .filter(f => f.estado === 'cobrada')
    .reduce((acc, f) => acc + f.monto, 0)

  const totalPendiente = MOCK_FACTURAS
    .filter(f => f.estado !== 'cobrada')
    .reduce((acc, f) => acc + f.monto, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-white">Facturación</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Gestión de comprobantes y cobros</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Total cobrado</p>
          <p className="text-3xl font-semibold text-emerald-400 tabular-nums">
            ${totalCobrado.toLocaleString('es-AR')}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Pendiente de cobro</p>
          <p className="text-3xl font-semibold text-amber-400 tabular-nums">
            ${totalPendiente.toLocaleString('es-AR')}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Total facturas</p>
          <p className="text-3xl font-semibold text-white tabular-nums">{MOCK_FACTURAS.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {(['todas', 'pendiente', 'emitida', 'cobrada'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filtro === f
                ? 'bg-zinc-700 text-zinc-100'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {f === 'todas' ? 'Todas' : ESTADO_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Tabla desktop */}
      <div className="hidden sm:block bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800">
              {['N° Factura', 'Cliente', 'Ticket', 'Monto', 'Estado', 'Fecha'].map(h => (
                <th key={h} className="py-3 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-zinc-500">
                  No hay facturas en este estado.
                </td>
              </tr>
            ) : (
              filtered.map(f => (
                <tr key={f.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-mono text-zinc-300">{f.nro}</td>
                  <td className="py-3 px-4 text-sm text-zinc-300">{f.cliente}</td>
                  <td className="py-3 px-4 text-sm text-zinc-500 max-w-[200px] truncate">{f.ticket}</td>
                  <td className="py-3 px-4 text-sm text-zinc-300 tabular-nums">${f.monto.toLocaleString('es-AR')}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_STYLES[f.estado]}`}>
                      {ESTADO_LABELS[f.estado]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-500">{f.fecha}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-zinc-500 py-8">No hay facturas en este estado.</p>
        ) : (
          filtered.map(f => (
            <div key={f.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-zinc-300">{f.nro}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_STYLES[f.estado]}`}>
                  {ESTADO_LABELS[f.estado]}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{f.cliente}</p>
                <p className="text-xs text-zinc-500 mt-0.5 truncate">{f.ticket}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-300 font-medium tabular-nums">${f.monto.toLocaleString('es-AR')}</span>
                <span className="text-zinc-500 text-xs">{f.fecha}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-zinc-600 text-center">
        Integración con facturación electrónica ARCA disponible próximamente.
      </p>
    </div>
  )
}