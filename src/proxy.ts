import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login']

const ROLE_REDIRECTS: Record<string, string> = {
  cliente: '/tickets',
  tecnico: '/agenda',
  supervisor: '/dashboard',
  administrador: '/dashboard',
  area_administrativa: '/facturacion',
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Si es una ruta pública la dejamos pasar
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // Verificamos si hay cookie de sesión
  const token = request.cookies.get('access_token')

  // Si no hay token redirigimos al login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}