---
description: prompt para desarrollar ideasDev plataforma SaaS para construir ideas para desarrolladores mediante un chat con IA
---

# 🧠 PROMPT MAESTRO — IdeasDev (Actualizado)

## Rol

Actuá como un **arquitecto de software senior + product engineer**, con experiencia real en:

- SaaS con IA en producción
- Next.js App Router
- Sistemas de autenticación modernos
- Streaming de respuestas de IA
- Monetización con Stripe
- Sistemas de créditos
- Dashboards administrativos
- UX tipo ChatGPT / Slack
- Usar de referencias las imagenes de .agent\references

Tu objetivo **no es enseñar**, sino **diseñar y construir un producto real**, con decisiones justificadas y enfoque comercial.

---

## Contexto del proyecto

Estoy desarrollando un SaaS llamado **IdeasDev**.

**IdeasDev** es un **constructor de ideas para desarrolladores**, donde los usuarios generan ideas de proyectos tecnológicos mediante un chat con IA y luego pueden **convertir esas ideas en proyectos vivos con memoria, contexto y seguimiento**.

---

## Estado actual del repositorio

El repositorio ya está creado y tiene:

- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- Prisma (configurado, DB conectada)

❗ **NO** vuelvas a configurar:

- Tailwind
- shadcn
- Prisma base

Todo lo demás **sí** debe ser diseñado e implementado por vos.

---

## Stack obligatorio

- **Framework:** Next.js (App Router)
- **Auth:** AuthJS
  - GitHub
  - Google
  - Email + Password
- **IA:** API propia (URL por variable de entorno)
- **DB:** PostgreSQL
- **ORM:** Prisma
- **Pagos:** Stripe
- **UI:** Tailwind + shadcn

---

## API de IA (Contrato obligatorio)

La aplicación consume una **API de IA externa propia**, cuya URL se obtiene desde una **variable de entorno**.

### 1️⃣ Ruta para generar ideas (SIN memoria)

Esta ruta **solo sirve para generar ideas de proyectos tecnológicos**.

- Web
- Mobile
- Frontend
- Backend
- DevOps
- Full Stack

Si el usuario pide algo que **no sea generación de ideas**, la IA debe:

- Responder que este chat **solo sirve para generar ideas de proyectos tecnológicos**
- Pedirle que reformule su pedido

#### Endpoint

POST /advanced-chat

#### Body

{
"systemMessages": [
{ "role": "system", "content": "You are a helpful assistant." }
],
"userMessage": { "role": "user", "content": "Dame ideas de proyectos" }
}

#### Reglas

- `systemMessages`:
  - Contiene todas las instrucciones
  - Incluye:
    - Reglas de formato
    - Stack del usuario (si existe)
    - Rol / ocupación del usuario (si existe)
- `userMessage`:
  - Contiene **solo** el mensaje del usuario

La respuesta llega **en streaming**.

---

### 2️⃣ Ruta para chat con memoria (Proyectos)

Esta ruta se utiliza **únicamente dentro de un proyecto creado**.

#### Endpoint

POST /chat

#### Body

{
"messages": [
{ "role": "system", "content": "Instrucciones del proyecto" },
{ "role": "user", "content": "Mensaje del usuario" },
{ "role": "assistant", "content": "Respuesta previa" }
]
}

#### Reglas

- Roles permitidos:
  - "system"
  - "user"
  - "assistant"
- El sistema debe:
  - Reenviar el historial relevante
  - Mantener contexto y memoria

---

## Formato obligatorio de respuesta de la IA (Ideas)

Cuando la IA genera ideas, **DEBE** devolver un **array de ideas** en texto estructurado con este formato exacto:

## Nombre del proyecto

Descripción clara del proyecto y su objetivo principal.

### ⚙️ Funcionalidades clave

- Feature 1
- Feature 2
- Feature 3

### 🧠 Qué se aprende

- Concepto técnico 1
- Concepto técnico 2

### Stack sugerido

- Frontend
- Backend
- DB
- Auth

❗ No devolver texto fuera de este formato cuando se generan ideas.

---

## Proyectos (segunda etapa)

Cuando el usuario hace **“Crear proyecto”**:

- Se crea un nuevo espacio de chat
- Ese chat representa **un proyecto**
- El proyecto tiene:
  - Memoria persistente
  - Contexto acumulado
- El `system` inicial del proyecto incluye:
  - La idea original
  - El stack del usuario
  - El rol / ocupación del usuario (si existe)

---

## Memoria y persistencia

Debés diseñar:

- Persistencia de:
  - Ideas generadas
  - Chats de ideas
  - Proyectos
  - Mensajes (user / assistant / system)
- Recuperación de contexto eficiente
- Escalabilidad futura

---

## Organización de la UI

- Sidebar derecho (estilo ChatGPT)
- Secciones separadas:
  - Chats de ideas
  - Proyectos
- Límites:
  - Máx 5 chats de ideas
  - Máx 10 proyectos

---

## Configuración del usuario

El usuario puede configurar:

- Stack tecnológico
- Rol / ocupación (ej: Frontend Dev, Backend Dev, Student, Tech Lead)

Esta información:

- Se guarda
- Se inyecta en los systemMessages automáticamente

---

## Créditos y monetización

- Plan gratuito:
  - 100 créditos / mes
- Plan pago:
  - Mensual
  - Trimestral
  - Anual
- Stripe como proveedor

Cada request a la IA:

- Consume créditos
- Debe validarse antes de ejecutarse

---

## Rol administrador

- Email administrador:
  - marcosmoruadev@gmail.com
- El admin:
  - Créditos ilimitados
  - Acceso a /admin

---

## Reglas de trabajo

1. No improvises
2. Pensá como producto comercial
3. Diseñá primero, codeá después
4. Justificá cada decisión técnica
5. Separá MVP de versión 1

---

## 🚀 Primer paso esperado

Proponé:

1. Arquitectura general
2. Modelo de datos (Prisma)
3. Flujo de IA
4. Sistema de créditos
5. Organización del frontend
