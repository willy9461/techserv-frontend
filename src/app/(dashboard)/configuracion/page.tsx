'use client'

import { useEffect, useState } from 'react'
import { User } from '@/types/user'
import { getUsuarios, updateUsuario } from '@/api/users'

const ROL_LABELS: Record<string, string> = {
  cliente: 'Cliente',
  tecnico: 'Técnico',
  supervisor: 'Supervisor',
  administrador: 'Administrador',
  area_administrativa: 'Área Administrativa',
}



export default function ConfiguracionPage() {
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    getUsuarios()
      .then(setUsuarios)
      .catch(() => setError('No se pudieron cargar los usuarios.'))
      .finally(() => setLoading(false))
  }, [])

  async function toggleActivo(user: User) {
    setUpdating(user.id)
    try {
      const updated = await updateUsuario(user.id, { is_active: !user.is_active })
      setUsuarios(prev => prev.map(u => u.id === updated.id ? updated : u))
    } catch {
      // silencioso por ahora
    } finally {
      setUpdating(null)
    }
  }

  async function cambiarRol(user: User, nuevoRol: string) {
    setUpdating(user.id)
    try {
      const updated = await updateUsuario(user.id, { role: nuevoRol as User['role'] })
      setUsuarios(prev => prev.map(u => u.id === updated.id ? updated : u))
    } catch {
      // silencioso por ahora
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-white">Configuración</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Gestión de usuarios y parámetros del sistema.</p>
      </div>

      {/* Gestión de usuarios */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-200">Usuarios del sistema</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {loading ? '...' : `${usuarios.length} usuarios registrados`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="px-5 py-8 text-center text-sm text-zinc-500">{error}</div>
        ) : (
          <>
            {/* Tabla — solo desktop */}
            <table className="w-full hidden sm:table">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Usuario</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Rol</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Estado</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {usuarios.map(u => (
                  <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-zinc-200">{u.full_name}</p>
                      <p className="text-xs text-zinc-500">{u.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={u.role}
                        disabled={updating === u.id}
                        onChange={e => cambiarRol(u, e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 disabled:opacity-50"
                      >
                        {Object.entries(ROL_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                        {u.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleActivo(u)}
                        disabled={updating === u.id}
                        className="text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-50 transition-colors"
                      >
                        {updating === u.id ? 'Guardando...' : u.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cards — solo mobile */}
            <div className="sm:hidden divide-y divide-zinc-800">
              {usuarios.map(u => (
                <div key={u.id} className="px-5 py-4 space-y-3">
                  <div>
                    <p className="text-sm text-zinc-200">{u.full_name}</p>
                    <p className="text-xs text-zinc-500">{u.email}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={u.role}
                      disabled={updating === u.id}
                      onChange={e => cambiarRol(u, e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 disabled:opacity-50 flex-1"
                    >
                      {Object.entries(ROL_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${u.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      {u.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleActivo(u)}
                    disabled={updating === u.id}
                    className="text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-50 transition-colors"
                  >
                    {updating === u.id ? 'Guardando...' : u.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Parámetros del sistema */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-200">Parámetros del sistema</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Información general de la empresa.</p>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Nombre de la empresa</label>
            <input
              type="text"
              defaultValue="TechServ"
              disabled
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-400 w-full max-w-sm disabled:opacity-50"
            />
          </div>
          <p className="text-xs text-zinc-600">Los parámetros del sistema estarán disponibles en próximas versiones.</p>
        </div>
      </div>
    </div>
  )
}