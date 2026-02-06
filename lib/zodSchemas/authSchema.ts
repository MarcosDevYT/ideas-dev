import { z, string } from "zod"

export const loginSchema = z.object({
  email: string({ error: "El Email es requerido" })
    .min(1, "El Email es requerido")
    .email("El Email no es válido"),
  password: string({ error: "La Contraseña es requerida" })
    .min(1, "La Contraseña es requerida")
    .min(8, "La Contraseña debe tener más de 8 caracteres")
    .max(32, "La Contraseña debe tener menos de 32 caracteres"),
})

export const registerSchema = z.object({
  name: string({ error: "El Nombre es requerido" })
    .min(1, "El Nombre es requerido")
    .max(32, "El Nombre debe tener menos de 32 caracteres"),
  email: string({ error: "El Email es requerido" })
    .min(1, "El Email es requerido")
    .email("El Email no es válido")
    .max(255, "El Email debe tener menos de 100 caracteres"),
  password: string({ error: "La Contraseña es requerida" })
    .min(1, "La Contraseña es requerida")
    .min(8, "La Contraseña debe tener más de 8 caracteres")
    .max(32, "La Contraseña debe tener menos de 32 caracteres"),
})

export const forgotPasswordSchema = z.object({
  email: string({ error: "El Email es requerido" })
    .min(1, "El Email es requerido")
    .email("El Email no es válido"),
})

export const resetPasswordSchema = z.object({
  token: string({ error: "El Token es requerido" })
    .min(1, "El Token es requerido"),
    password: string({ error: "La Contraseña es requerida" })
      .min(1, "La Contraseña es requerida")
      .min(8, "La Contraseña debe tener más de 8 caracteres")
      .max(32, "La Contraseña debe tener menos de 32 caracteres"),
    confirmPassword: string({ error: "Confirma tu contraseña" })
      .min(1, "Confirma tu contraseña")
      .min(8, "La Confirmación de tu contraseña debe tener más de 8 caracteres")
      .max(32, "La Confirmación de tu contraseña debe tener menos de 32 caracteres")
})