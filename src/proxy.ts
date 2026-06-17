import { NextResponse, type NextRequest } from 'next/server'

// Rutas permitidas por rol
const ROLE_ROUTES: Record<string, string[]> = {
  cliente:            ['/tickets', '/equipos'],
  tecnico:            ['/tickets', '/agenda'],
  supervisor:         ['/dashboard', '/tickets', '/tecnicos', '/agenda', '/reportes'],
  administrador:      ['/dashboard', '/tickets', '/tecnicos', '/agenda', '/reportes', '/facturacion', '/configuracion'],
  area_administrativa:['/reportes', '/facturacion'],
}

// Ruta de inicio por rol
const ROLE_HOME: Record<string, string> = {
  cliente:            '/tickets',
  tecnico:            '/agenda',
  supervisor:         '/dashboard',
  administrador:      '/dashboard',
  area_administrativa:'/facturacion',
}

function getRoleFromCookie(request: NextRequest): string | null {
  return request.cookies.get('techserv-role')?.value ?? null
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas — siempre dejar pasar
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return NextResponse.next()
  }

  const role = getRoleFromCookie(request)

  // Sin cookie → redirigir al login
  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verificar si el rol tiene acceso a la ruta solicitada
  const allowedRoutes = ROLE_ROUTES[role] ?? []
  const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

  if (!hasAccess) {
    // Redirigir a la home del rol
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? '/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}