# IdeasDev 🚀

IdeasDev es un **SaaS para desarrolladores** enfocado en la **generación y evolución de ideas de proyectos tecnológicos mediante IA**.  
El objetivo del producto es ayudar a developers a pasar de una idea vaga a un **proyecto accionable**, con contexto, memoria y acompañamiento continuo.

---

## 🧠 ¿Qué es IdeasDev?

IdeasDev funciona como un **constructor de ideas**:

- El usuario conversa con una IA
- La IA genera **ideas de proyectos tecnológicos estructuradas**
- Cada idea puede convertirse en un **proyecto vivo**
- Cada proyecto tiene su propio chat con memoria
- El usuario puede profundizar, planificar y evolucionar la idea

No es solo un chat: es una **herramienta de ideación y ejecución** para desarrolladores.

---

## 🎯 Público objetivo

- Desarrolladores frontend, backend o full stack
- Estudiantes de programación
- Devs que quieren practicar nuevas tecnologías
- Profesionales que buscan ideas para side projects, startups o portfolios

---

## ⚙️ Funcionalidades principales

### 💬 Chat de Ideas (sin memoria)

- Generación de ideas de proyectos tecnológicos
- Enfoque en:
  - Web
  - Mobile
  - Frontend
  - Backend
  - DevOps
  - Full Stack
- Respuestas estructuradas y parseables
- Streaming de respuestas en tiempo real

### 🚀 Proyectos (chat con memoria)

- Convertir una idea en un proyecto
- Chat persistente con contexto
- Memoria por proyecto
- Seguimiento de decisiones y evolución

### 🧩 Configuración del usuario

- Stack tecnológico preferido
- Rol / ocupación (Frontend Dev, Backend Dev, Student, etc.)
- Esta información se usa como contexto para la IA

### 📂 Organización estilo ChatGPT

- Sidebar con:
  - Chats de ideas
  - Proyectos creados
- Navegación fluida sin redirecciones duras

---

## 🔐 Autenticación

- GitHub
- Google
- Email y contraseña

Implementado con **Auth JS**.

---

## 🤖 Inteligencia Artificial

IdeasDev consume una **API de IA propia**, mediante dos rutas principales:

### Generación de ideas (sin memoria)

```
POST /advanced-chat
```

- Genera exclusivamente ideas de proyectos tecnológicos
- Usa instrucciones estrictas de formato
- No mantiene memoria

### Chat con memoria (proyectos)

```
POST /chat
```

- Mantiene historial de mensajes
- Soporta roles:
  - system
  - user
  - assistant
- Se utiliza dentro de proyectos

Las respuestas se reciben mediante **streaming**.

---

## 💳 Créditos y monetización

- Plan gratuito:
  - 100 créditos por mes
- Planes pagos:
  - Mensual
  - Trimestral
  - Anual
- Pagos gestionados con **Stripe**
- Cada request a la IA consume créditos

---

## 👑 Administración

- Panel de administración (`/admin`)
- Métricas disponibles:
  - Nuevos usuarios
  - Suscripciones activas
  - Uso diario de la API
  - Ingresos
- El administrador tiene créditos ilimitados

---

## 🧱 Stack tecnológico

- **Framework:** Next.js (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **Auth:** Auth JS
- **DB:** PostgreSQL
- **ORM:** Prisma
- **Pagos:** Stripe
- **IA:** API externa propia (streaming)

---

## 🏗️ Estado del proyecto

IdeasDev está siendo construido como un **producto SaaS real**, priorizando:

- Escalabilidad
- Mantenibilidad
- Buenas prácticas
- Experiencia de usuario fluida

---

## 📌 Visión

IdeasDev busca convertirse en:

> “El lugar donde los desarrolladores transforman ideas en proyectos reales.”

---

## 📄 Licencia

Proyecto privado – uso interno.
