# TechServ Frontend

Aplicación web responsive para la gestión de servicios técnicos. Construida con Next.js, TypeScript y Tailwind CSS.

## Stack

- **Framework**: Next.js (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Auth**: Supabase Auth
- **HTTP Client**: Axios
- **Estado global**: Zustand
- **Formularios**: React Hook Form + Zod
- **Notificaciones push**: Firebase Cloud Messaging
- **Mapas**: Google Maps JavaScript API
- **Testing**: Jest + Playwright
- **Linting**: ESLint + Prettier

## Inicio rápido

```bash
cp .env.example .env.local
pnpm install
pnpm run dev
```

La app estará disponible en `http://localhost:3000`.

## Variables de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## Estructura del proyecto

```
src/
├── app/                        # Rutas (App Router)
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Layout con sidebar
│   │   ├── dashboard/
│   │   ├── tickets/
│   │   ├── agenda/
│   │   ├── reportes/
│   │   └── facturacion/
│   └── layout.tsx
├── components/
│   ├── ui/                     # Componentes base (Button, Input, Badge, etc.)
│   ├── layout/                 # Sidebar, Navbar
│   └── shared/                 # TicketCard, StatusBadge, etc.
├── api/                        # Llamadas al backend FastAPI
│   ├── users.ts
│   ├── tickets.ts
│   ├── intervenciones.ts
│   ├── facturas.ts
│   └── garantias.ts
├── hooks/
│   ├── useAuth.ts
│   └── useTickets.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Cliente browser
│   │   └── server.ts           # Cliente server (SSR)
│   ├── axios.ts                # Instancia Axios con interceptor JWT
│   └── firebase.ts             # Inicialización FCM
├── store/
│   ├── authStore.ts            # Zustand: sesión de usuario
│   └── ticketStore.ts
├── types/
│   ├── user.ts
│   ├── ticket.ts
│   ├── intervencion.ts
│   ├── factura.ts
│   └── garantia.ts
└── middleware.ts               # Protección de rutas por rol
```

## Rutas principales

| Ruta | Rol requerido | Descripción |
|------|---------------|-------------|
| `/login` | Público | Autenticación con email/contraseña |
| `/dashboard` | Supervisor / Admin | Panel de control con KPIs |
| `/tickets` | Todos | Listado y filtros de tickets |
| `/tickets/[id]` | Todos | Detalle del ticket |
| `/tickets/nuevo` | Cliente / Supervisor | Formulario de creación |
| `/agenda` | Técnico / Supervisor | Vista semanal de agenda y rutas |
| `/reportes` | Supervisor / Admin | Dashboard con KPIs y exportación |
| `/facturacion` | Área Administrativa | Listado y emisión de facturas |

## Roles y acceso

El acceso a rutas se controla por el campo `rol` del usuario autenticado:

```ts
type UserRole = 'cliente' | 'tecnico' | 'supervisor' | 'administrador' | 'area_administrativa'
```

El middleware de Next.js (`middleware.ts`) protege todas las rutas bajo `/(dashboard)` y redirige al login si no hay sesión activa.

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm run dev` | Servidor de desarrollo con hot reload |
| `pnpm run build` | Build de producción |
| `pnpm run start` | Servidor de producción |
| `pnpm run lint` | ESLint sobre todo el proyecto |
| `pnpm test` | Tests unitarios con Jest |
| `pnpm run test:e2e` | Tests end-to-end con Playwright |

## Convenciones

- Componentes en PascalCase. Hooks y utils en camelCase.
- Cada componente tiene su propio archivo. No mezclar lógica de negocio con presentación.
- No usar `any` en TypeScript.
- Estilos exclusivamente en Tailwind. Sin CSS modules ni estilos inline salvo excepciones.
- Commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, etc.

## Flujo de trabajo Git

```
main    ← protegida, solo código revisado (PR obligatorio)
  └── dev     ← rama de integración del equipo
        ├── feature/nombre-feature
        ├── fix/nombre-bug
        └── docs/nombre-doc
```

Nadie commitea directo a `main` ni a `dev`. Cada tarea tiene su propia rama.

## Deploy

El frontend se despliega en **Vercel** con integración directa al repositorio de GitHub.

- La rama `main` despliega automáticamente a producción.
- Las pull requests generan previews con URL única para revisión.
- Las variables de entorno se configuran desde el panel de Vercel.

## Documentación de diseño

- [Wireframes (Figma)](https://drive.google.com/drive/folders/1k94CRt3PumfIB9U8PiGSbh-NkpkmCpie)
- [Diagramas UML](https://docs.google.com/document/d/1ypTljLovHSMfdoDLhP0YonUIwRrEGDe_X8YTj35BDqE)