# Sistema de Autenticación Reutilizable

Este es un sistema de autenticación básico y reutilizable construido con:

- **Next.js 16+**
- **Auth.js (v5)**
- **Prisma ORM**
- **TailwindCSS**
- **Shadcn UI**

Incluye autenticación con:

- Credentials (Email/Password)
- Google OAuth
- Verificación de Email (Nodemailer)
- Recuperación de contraseña

## Requisitos Previos

Necesitás tener cuentas y credenciales para:

1.  **Google Cloud Console**: Para obtener el `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET` (OAuth).
2.  **Base de Datos**: Puede ser NeonDB (PostgreSQL serverless) o Supabase.
3.  **Gmail/SMTP**: Para el envío de correos (Nodemailer).

## Configuración Inicial

1.  **Clonar el repositorio e instalar dependencias:**

    ```bash
    npm install
    # o
    pnpm install
    ```

2.  **Configurar Variables de Entorno:**

    Copia el archivo `.env.example` a `.env` y completalo con tus datos:

    ```bash
    cp .env.example .env
    ```

    - Genera el `AUTH_SECRET` ejecutando:
      ```bash
      npx auth secret
      ```
    - Completa la `DATABASE_URL` con tu cadena de conexión de Neon o Supabase.
    - Agrega las credenciales de Google y Nodemailer.

3.  **Configurar la Base de Datos:**

    Una vez configuradas las variables, inicializa la base de datos con Prisma:

    ```bash
    # Generar el cliente de Prisma
    npx prisma generate
    # o
    pnpx prisma generate

    # Ejecutar la migración inicial
    npx prisma migrate dev --name user-schema
    # o
    pnpx prisma migrate dev --name user-schema
    ```

4.  **Ejecutar el Proyecto:**

    ```bash
    npm run dev
    # o
    pnpm dev
    ```

## Estructura de Rutas de Autenticación

Las rutas de autenticación se encuentran en `app/(auth)`:

- `/login`: Inicio de sesión.
- `/register`: Registro de nuevos usuarios.
- `/forgot-password`: Solicitud de recuperación de contraseña.
- `/reset-password`: Formulario de cambio de contraseña.
- `/verify-email`: Confirmación de correo electrónico.
