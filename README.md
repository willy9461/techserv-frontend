# TechServ Frontend
 
Aplicación web responsive para la gestión de servicios técnicos. Construida con Next.js, TypeScript y Tailwind CSS.
 
## Stack
 
- **Framework**: Next.js (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Auth**: JWT vía cookies (AuthX) + protección de rutas por rol
- **HTTP Client**: Axios
- **Estado global**: Zustand
- **Testing**: Jest + Playwright
- **Linting**: ESLint + Prettier
## Inicio rápido
 
```bash
cp .env.example .env.local
pnpm install
pnpm run dev
```
 
La app estará disponible en `http://localhost:3000`.
 
> Nota: el login requiere conexión al backend de producción o uno corriendo localmente; el backend desplegado no acepta CORS desde `localhost` en todos los casos.
 
## Variables de entorno
 
```env
NEXT_PUBLIC_API_URL=https://techserv-test.marcelojurado.com.ar/api/v1
```
 
## Estructura del proyecto
 
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   └── (dashboard)/
│       ├── layout.tsx          # Sidebar + Topbar, responsive con menú hamburguesa
│       ├── dashboard/          # KPIs y resumen (admin/supervisor)
│       ├── tickets/            # Lista, detalle [id], crear (nuevo)
│       ├── tecnicos/           # Listado de técnicos (admin/supervisor)
│       ├── agenda/             # Vista semanal por fecha_visita
│       ├── reportes/           # Estadísticas de tickets
│       ├── facturacion/        # Listado de facturas (mock, pendiente backend)
│       ├── equipos/            # Equipos del cliente logueado
│       ├── configuracion/      # Gestión de usuarios (solo admin)
│       └── mis-tickets/        # Vista de tickets para cliente
├── components/
│   └── shared/
│       └── TicketCard.tsx      # EstadoBadge, UrgenciaBadge, TicketCard, TicketRow
├── api/                        # Llamadas al backend FastAPI
│   ├── users.ts                # login, register, getMe, getTecnicos, getUsuarios, crearUsuario, updateUsuario
│   ├── tickets.ts               # CRUD tickets
│   └── equipos.ts              # CRUD equipos
├── lib/
│   └── axios.ts                 # Instancia Axios con interceptor JWT
├── store/
│   └── authStore.ts             # Zustand con persist; guarda cookie de rol al hacer login/logout
├── types/
│   ├── user.ts
│   └── ticket.ts
└── proxy.ts                      # Middleware (Next.js 16): protección de rutas por rol vía cookie
```
 
## Rutas principales
 
| Ruta | Roles con acceso | Descripción |
|------|---------------|-------------|
| `/login`, `/register` | Público | Autenticación |
| `/dashboard` | Administrador, Supervisor | Panel de control con KPIs |
| `/tickets` | Administrador, Supervisor, Técnico, Cliente | Listado y filtros de tickets (cliente ve solo los suyos) |
| `/tickets/[id]` | Según rol | Detalle del ticket, cambiar estado, asignar técnico |
| `/tickets/nuevo` | Administrador, Supervisor, Técnico, Cliente | Formulario de creación (crea equipo + ticket) |
| `/tecnicos` | Administrador, Supervisor | Listado de técnicos |
| `/agenda` | Administrador, Supervisor, Técnico | Vista semanal por fecha de visita |
| `/reportes` | Administrador, Supervisor, Área Administrativa | Estadísticas y distribución de tickets |
| `/facturacion` | Administrador, Área Administrativa | Listado de facturas |
| `/equipos` | Cliente | Equipos del cliente logueado |
| `/configuracion` | Administrador | Gestión de usuarios: cambiar rol, activar/desactivar, crear admin/supervisor/área administrativa |
 
## Roles y acceso
 
```ts
type UserRole = 'cliente' | 'tecnico' | 'supervisor' | 'administrador' | 'area_administrativa'
```
 
La protección de rutas corre en `src/proxy.ts` (proxy/middleware de Next.js 16). Al hacer login se guarda una cookie `techserv-role` con el rol del usuario; el proxy la lee en cada request y redirige si el rol no tiene acceso a la ruta solicitada. La cookie se borra al hacer logout.
 
El sidebar (`src/app/(dashboard)/layout.tsx`) filtra los ítems visibles según el mismo campo `role`.
 
## Scripts disponibles
 
| Comando | Descripción |
|---------|-------------|
| `pnpm run dev` | Servidor de desarrollo con hot reload |
| `pnpm run build` | Build de producción |
| `pnpm run start` | Servidor de producción |
| `pnpm run lint` | ESLint sobre todo el proyecto |
 
## Convenciones
 
- Componentes en PascalCase. Hooks y utils en camelCase.
- No usar `any` en TypeScript.
- Estilos exclusivamente en Tailwind. Sin CSS modules ni estilos inline salvo excepciones.
- Commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, etc.
- **Antes de reemplazar un archivo completo, siempre revisar su contenido real y actualizado primero** (`cat archivo`) — nunca asumir la versión desde memoria o contexto previo, para no pisar trabajo de otros.
## Flujo de trabajo Git
 
```
main    ← rama de producción, deploy automático en Vercel
  └── dev     ← rama de integración del equipo
        ├── feature/nombre-feature
        ├── fix/nombre-bug
        └── docs/nombre-doc
```
 
El equipo trabaja todo por terminal, sin Pull Requests en la UI de GitHub (evita inconsistencias de squash/rebase entre ramas):
 
```bash
# Crear rama de trabajo
git checkout dev
git pull origin dev
git checkout -b feature/nombre-feature
 
# Commitear y pushear la rama
git add -A
git commit -m "mensaje"
git push origin feature/nombre-feature
 
# Mergear a dev
git checkout dev
git pull origin dev
git merge feature/nombre-feature
git push origin dev
 
# Mergear dev a main
git checkout main
git pull origin main
git merge dev
git push origin main
 
# Volver a dev y limpiar la rama
git checkout dev
git branch -d feature/nombre-feature
git push origin --delete feature/nombre-feature
```
 
Si dos personas trabajan en paralelo, siempre hacer `git pull origin dev` antes de mergear, para traer los cambios del otro primero y resolver conflictos ahí si aparecen.
 
## Deploy
 
El frontend se despliega en **Vercel** con integración directa al repositorio de GitHub.
 
- La rama `main` despliega automáticamente a producción.
- Los pushes a otras ramas generan deploys de preview.
- Las variables de entorno se configuran desde el panel de Vercel.
## Documentación de diseño
 
- [Wireframes (Figma)](https://drive.google.com/drive/folders/1k94CRt3PumfIB9U8PiGSbh-NkpkmCpie)
- [Diagramas UML](https://docs.google.com/document/d/1ypTljLovHSMfdoDLhP0YonUIwRrEGDe_X8YTj35BDqE)
 