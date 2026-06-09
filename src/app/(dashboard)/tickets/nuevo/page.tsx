'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TicketUrgencia, TipoEquipo, URGENCIA_LABELS, TIPO_EQUIPO_LABELS } from '@/types/ticket'
import { createTicket } from '@/api/tickets'

interface FormState {
  titulo: string
  descripcion: string
  urgencia: TicketUrgencia
  equipo_tipo: TipoEquipo
  equipo_marca: string
  equipo_modelo: string
  equipo_nro_serie: string
  dir_calle: string
  dir_altura: string
  dir_piso_depto: string
  dir_localidad: string
}

const INITIAL: FormState = {
  titulo: '',
  descripcion: '',
  urgencia: 'media',
  equipo_tipo: 'electrodomestico',
  equipo_marca: '',
  equipo_modelo: '',
  equipo_nro_serie: '',
  dir_calle: '',
  dir_altura: '',
  dir_piso_depto: '',
  dir_localidad: '',
}

function buildDireccion(form: FormState): string {
  const parts = [
    `${form.dir_calle} ${form.dir_altura}`.trim(),
    form.dir_piso_depto || null,
    form.dir_localidad,
  ].filter(Boolean)
  return parts.join(', ')
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function Input({ value, onChange, placeholder, required }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
    />
  )
}

function Select<T extends string>({ value, onChange, options }: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

const URGENCIA_CONFIG: { value: TicketUrgencia; label: string; color: string; desc: string }[] = [
  { value: 'baja',  label: 'Baja',  color: 'border-zinc-600 text-zinc-400',   desc: 'Sin impacto operativo inmediato' },
  { value: 'media', label: 'Media', color: 'border-amber-600 text-amber-400', desc: 'Afecta operación parcialmente' },
  { value: 'alta',  label: 'Alta',  color: 'border-red-600 text-red-400',     desc: 'Equipo fuera de servicio' },
]

function UrgenciaSelector({ value, onChange }: {
  value: TicketUrgencia
  onChange: (v: TicketUrgencia) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {URGENCIA_CONFIG.map((u) => (
        <button
          key={u.value}
          type="button"
          onClick={() => onChange(u.value)}
          className={`p-3 rounded-lg border text-left transition-all ${
            value === u.value
              ? `${u.color} bg-zinc-800`
              : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900/50'
          }`}
        >
          <p className="text-sm font-medium">{u.label}</p>
          <p className="text-xs opacity-70 mt-0.5">{u.desc}</p>
        </button>
      ))}
    </div>
  )
}

export default function NuevoTicketPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof FormState) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }))

  const direccionCompleta = buildDireccion(form)
  const formValido = form.titulo && form.dir_calle && form.dir_altura && form.dir_localidad

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createTicket({
        titulo: form.titulo,
        descripcion: form.descripcion,
        urgencia: form.urgencia,
        direccion: direccionCompleta,
        equipo_nuevo: {
          tipo: form.equipo_tipo,
          marca: form.equipo_marca,
          modelo: form.equipo_modelo,
          nro_serie: form.equipo_nro_serie,
        },
      })
      setSuccess(true)
      setTimeout(() => router.push('/tickets'), 1500)
    } catch {
      setError('No se pudo crear el ticket. Intentá de nuevo.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <p className="text-zinc-300 text-sm">Ticket creado. Redirigiendo...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/tickets">
          <button className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-white">Nuevo ticket</h1>
          <p className="text-sm text-zinc-500">Completá los datos para registrar la solicitud</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Solicitud */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Solicitud</h2>
          <div>
            <Label required>Título</Label>
            <Input
              value={form.titulo}
              onChange={set('titulo')}
              placeholder="Ej: Aire acondicionado no enfría"
              required
            />
          </div>
          <div>
            <Label required>Descripción del problema</Label>
            <Textarea
              value={form.descripcion}
              onChange={set('descripcion')}
              placeholder="Describí el problema con el mayor detalle posible..."
            />
          </div>
          <div>
            <Label required>Urgencia</Label>
            <UrgenciaSelector
              value={form.urgencia}
              onChange={(v) => setForm((p) => ({ ...p, urgencia: v }))}
            />
          </div>
        </div>

        {/* Equipo */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Equipo</h2>
          <div>
            <Label required>Tipo de equipo</Label>
            <Select<TipoEquipo>
              value={form.equipo_tipo}
              onChange={(v) => setForm((p) => ({ ...p, equipo_tipo: v }))}
              options={Object.entries(TIPO_EQUIPO_LABELS).map(([value, label]) => ({
                value: value as TipoEquipo,
                label,
              }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Marca</Label>
              <Input value={form.equipo_marca} onChange={set('equipo_marca')} placeholder="Ej: Samsung" />
            </div>
            <div>
              <Label>Modelo</Label>
              <Input value={form.equipo_modelo} onChange={set('equipo_modelo')} placeholder="Ej: WF45R6100AW" />
            </div>
          </div>
          <div>
            <Label>N° de serie</Label>
            <Input value={form.equipo_nro_serie} onChange={set('equipo_nro_serie')} placeholder="Ej: SN-2023-00421" />
          </div>
        </div>

        {/* Dirección */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-4">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Dirección de intervención</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label required>Calle</Label>
              <Input value={form.dir_calle} onChange={set('dir_calle')} placeholder="Ej: Av. Corrientes" required />
            </div>
            <div>
              <Label required>Altura</Label>
              <Input value={form.dir_altura} onChange={set('dir_altura')} placeholder="Ej: 1234" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Piso / Depto</Label>
              <Input value={form.dir_piso_depto} onChange={set('dir_piso_depto')} placeholder="Ej: 3B" />
            </div>
            <div>
              <Label required>Localidad</Label>
              <Input value={form.dir_localidad} onChange={set('dir_localidad')} placeholder="Ej: CABA" required />
            </div>
          </div>
          {direccionCompleta && (
            <p className="text-xs text-zinc-500">
              Vista previa: <span className="text-zinc-300">{direccionCompleta}</span>
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pb-4">
          <Link href="/tickets">
            <button type="button" className="px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              Cancelar
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading || !formValido}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Guardando...
              </>
            ) : (
              'Crear ticket'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}