# IdeasDev 🚀

**IdeasDev** es una plataforma SaaS para desarrolladores que combina IA con gestión de proyectos e ideas. Generá proyectos tecnológicos con contexto continuo, gestioná tus ideas con chats con memoria, y potenciá tu flujo de trabajo con herramientas de IA integradas.

---

## ✨ Funcionalidades Principales

### 💬 Chat con IA y Memoria

- **Chat de Ideas** (`/chat/ideas/[id]`): Chats libres con IA para explorar y refinar ideas de proyectos
- **Chat de Proyectos** (`/chat/proyectos/[id]`): Cada proyecto tiene su propio chat con contexto persistente, historial de mensajes y generación de resumen IA
- **Sidebar inteligente**: Listado de proyectos e ideas con pin, renombrado y eliminación

### 🗂️ Gestión de Proyectos

- Creación, edición y eliminación de proyectos
- **Generación automática de tareas** de desarrollo con IA (con streaming)
- **Generación de recursos** (links, docs, herramientas) con IA (con streaming)
- **Resumen IA** del proyecto generado a pedido
- Pin de proyectos para acceso rápido

### 💳 Sistema de Créditos

- Créditos mensuales renovables según el plan del usuario
- Compra de créditos extra como compra única
- Historial de transacciones con tipos y descripciones
- Panel de créditos con balance actual y detalles del plan
- Modal "Out of Credits" para guiar al usuario a recargar o cambiar plan

### 🔑 Autenticación Completa

- Email + Contraseña con verificación de email
- Google OAuth y GitHub OAuth
- Recuperación de contraseña por email (Nodemailer)
- Cambio de contraseña (solo para usuarios con credenciales, no OAuth)
- Portal de cliente de Polar.sh (gestión de suscripción y facturas)
- Flag `hasPassword` para diferenciar usuarios OAuth de usuarios con credenciales

### 💰 Suscripciones y Pagos con Polar.sh

- Planes de suscripción recurrentes (FREE, BASIC, PRO, PREMIUM)
- Paquetes de créditos de compra única
- Checkout gestionado por Polar.sh (Merchant of Record)
- Webhooks para procesar pagos y actualizar suscripciones en tiempo real
- Páginas de checkout `/checkout/success` y `/checkout/error`

### 👤 Perfil de Usuario

- Cambio de nombre y preferencias de personalización
- Cambio de contraseña (solo usuarios con credenciales)
- Acceso al Portal de Cliente de Polar.sh para gestionar suscripción
- Reporte de bugs integrado

### 🛡️ Panel de Administración (`/admin`)

- **Dashboard** con métricas en tiempo real: revenue, usuarios nuevos, suscripciones activas, uso de IA
- **Gestión de Usuarios**: tabla con búsqueda, ajuste manual de créditos con razón de auditoría
- **Gestión de Planes**: crear y editar planes de suscripción y paquetes de créditos en Polar.sh
- **Bug Reports**: tabla de reportes con cambio de estado (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- Métricas de admin con caché Redis (TTL 10 min)

### ⚡ Optimización y Caché Redis

- Caché con `@upstash/redis` en las actions de mayor carga:
  - `user:{id}:projects` (TTL 1h) — invalidado en CRUD y toggle pin
  - `user:{id}:idea-chats` (TTL 1h) — invalidado en CRUD y al generar respuestas
  - `admin:users` (TTL 5 min) — invalidado al actualizar créditos
  - `admin:dashboard-stats` (TTL 10 min)

---

## 🛠️ Stack Tecnológico

| Categoría     | Tecnología                                 |
| ------------- | ------------------------------------------ |
| Framework     | Next.js 15 (App Router)                    |
| Lenguaje      | TypeScript                                 |
| Auth          | Auth.js v5 (NextAuth)                      |
| Base de datos | PostgreSQL (NeonDB)                        |
| ORM           | Prisma                                     |
| UI            | Tailwind CSS + shadcn/ui                   |
| Pagos         | Polar.sh                                   |
| Caché         | Upstash Redis                              |
| Email         | Nodemailer (Gmail SMTP)                    |
| IA            | API externa (`multiservice-ai.vercel.app`) |
| Fuentes       | Syne, Space Grotesk, JetBrains Mono        |

---

## 📁 Estructura de Rutas

```
app/
├── page.tsx                          # Landing page pública
├── (auth)/
│   ├── login/                        # Inicio de sesión
│   ├── register/                     # Registro
│   ├── forgot-password/              # Recuperación de contraseña
│   ├── reset-password/               # Nueva contraseña
│   └── verify-email/                 # Verificación de email
├── (chat)/
│   ├── chat/                         # Dashboard principal + sidebar
│   │   ├── ideas/[id]/               # Chat de idea individual
│   │   └── proyectos/[id]/           # Chat de proyecto individual
│   ├── credits/                      # Panel de créditos y transacciones
│   └── checkout/
│       ├── success/                  # Confirmación de pago exitoso
│       └── error/                    # Error en el pago
├── (admin)/
│   └── admin/
│       ├── page.tsx                  # Dashboard con métricas
│       ├── users/                    # Gestión de usuarios
│       ├── plans/                    # Gestión de planes y créditos
│       └── bugs/                    # Gestión de bug reports
├── legal/
│   ├── terminos/                     # Términos y Condiciones
│   └── privacidad/                   # Política de Privacidad
├── centro-de-ayuda/                  # Centro de Ayuda (FAQ)
└── api/
    ├── auth/                         # NextAuth handlers
    ├── credits/                      # Endpoint de créditos
    ├── projects/[projectId]/
    │   └── resources/stream/         # Streaming de recursos con IA
    └── webhooks/polar/               # Webhook de eventos Polar.sh
```

---

## ⚙️ Configuración

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/MarcosDevYT/ideas-dev.git
cd ideas-dev
pnpm install
```

### 2. Variables de Entorno

Copiá `.env.example` a `.env` y completá con tus datos:

```bash
cp .env.example .env
```

```env
# App
NEXT_PUBLIC_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="IdeasDev"

# Auth
AUTH_SECRET=""
AUTH_TRUST_HOST="http://localhost:3000"

# OAuth
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# Base de Datos (NeonDB u otro PostgreSQL)
DATABASE_URL=""

# Polar.sh (Pagos)
POLAR_ACCESS_TOKEN=""
POLAR_WEBHOOK_SECRET=""

# IA
AI_API_URL=""

# Admin
ADMIN_EMAIL=""

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# Email (Nodemailer)
EMAIL_SERVICE="gmail"
EMAIL_USER=""
EMAIL_PASS=""
SUPPORT_EMAIL=""
```

### 3. Base de Datos

```bash
# Generar el cliente de Prisma
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate dev
```

### 4. Ejecutar en desarrollo

```bash
pnpm dev
```

---

## 🔐 Autorización

- El panel `/admin` está protegido por middleware que verifica que el email del usuario sea igual a `ADMIN_EMAIL`.
- Las rutas `/chat/*` requieren sesión activa — redirigen a `/login` si no hay sesión.
- Los endpoints de API (`/api/projects/*`) validan sesión y propiedad de los recursos.

---

## 📄 Páginas Legales

Las páginas legales están en `/legal/` y `/centro-de-ayuda/`:

- **Términos y Condiciones** — Menciona a Polar.sh como Merchant of Record
- **Política de Privacidad** — Incluye sección sobre datos de pago compartidos con Polar.sh (Ley 25.326 Argentina)
- **Centro de Ayuda** — FAQ con preguntas sobre créditos, proyectos y gestión de suscripciones

---

## 👨‍💻 Autor

Desarrollado por **Marcos** ([@MarcosDevYT](https://github.com/MarcosDevYT))
