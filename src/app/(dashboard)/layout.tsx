"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useAuthStore from "@/store/authStore";
import { UserRole } from "@/types/user";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Inicio",
    roles: ['administrador', 'supervisor'] as UserRole[],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/tickets",
    label: "Tickets",
    roles: ['administrador', 'supervisor', 'tecnico', 'cliente'] as UserRole[],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    href: "/tecnicos",
    label: "Técnicos",
    roles: ['administrador', 'supervisor'] as UserRole[],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="3" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
      </svg>
    ),
  },
  {
    href: "/agenda",
    label: "Agenda",
    roles: ['administrador', 'supervisor', 'tecnico'] as UserRole[],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/reportes",
    label: "Reportes",
    roles: ['administrador', 'supervisor', 'area_administrativa'] as UserRole[],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 4-4" />
      </svg>
    ),
  },
  {
    href: "/facturacion",
    label: "Facturación",
    roles: ['administrador', 'area_administrativa'] as UserRole[],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    href: "/equipos",
    label: "Mis equipos",
    roles: ['cliente'] as UserRole[],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
]

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  const { user } = useAuthStore();

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const roleLabels: Record<string, string> = {
    cliente: "Cliente",
    tecnico: "Técnico",
    supervisor: "Supervisor",
    administrador: "Administrador",
    area_administrativa: "Área Administrativa",
  };

  const itemsVisibles = user
    ? NAV_ITEMS.filter(item => item.roles.includes(user.role))
    : []

  const mostrarConfiguracion = user?.role === 'administrador'

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-56 bg-zinc-950 border-r border-zinc-800/60 flex flex-col z-30
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="h-14 flex items-center px-5 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white tracking-wide">TechServ</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {itemsVisibles.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? "bg-blue-500/15 text-blue-400 font-medium" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"}`}>
                  <span className={active ? "text-blue-400" : "text-zinc-500"}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 border-t border-zinc-800/60 pt-3">
          {mostrarConfiguracion && (
            <Link href="/configuracion" onClick={onClose}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${pathname.startsWith("/configuracion") ? "bg-blue-500/15 text-blue-400 font-medium" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
                Configuración
              </div>
            </Link>
          )}
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-300 font-medium shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-zinc-300 truncate">
                {user?.full_name ?? "Usuario"}
              </p>
              <p className="text-xs text-zinc-500">
                {user ? (roleLabels[user.role] ?? user.role) : ""}
              </p>
            </div>
            <button
              onClick={() => {
                useAuthStore.getState().clearAuth()
                window.location.href = '/login'
              }}
              className="shrink-0 p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              title="Cerrar sesión"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-14 border-b border-zinc-800/60 flex items-center justify-between px-4 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors lg:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1 className="text-sm font-medium text-zinc-200">TechServ</h1>
      </div>
      <button className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
      </button>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-56 flex flex-col min-h-screen">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}