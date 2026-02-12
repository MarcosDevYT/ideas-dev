"use server";

import { auth, signIn } from "@/auth";
import { sendEmailVerification, sendResetPasswordEmail } from "@/lib/mail";

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/zodSchemas/authSchema";
import { nanoid } from "nanoid";
import { AuthError } from "next-auth";
import { z } from "zod";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Función para hacer el login con los datos del formulario utilizando next-auth
 * @param values - Datos del formulario
 * @returns - Resultado del login
 */
export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    // Haacemos el login con los datos del formulario utilizando next-auth
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "Error 500" };
  }
};

/**
 * Función para registrar un usuario
 * @param values - Datos del formulario
 * @returns - Resultado del registro
 */
export const registerAction = async (
  values: z.infer<typeof registerSchema>,
) => {
  try {
    // Parseamos los datos y verificamos si son válidos con zod
    const { success, data } = registerSchema.safeParse(values);

    if (!success) {
      return {
        error: "Datos inválidos",
      };
    }

    // Verificamos si el usuario ya existe
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    // Si el usuario ya existe, devolver un error
    if (user) {
      return {
        error: "El usuario ya existe",
      };
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: passwordHash,
      },
    });

    // Initialize credits for the new user
    const { initializeUserCredits } =
      await import("@/lib/services/credit-service");
    await initializeUserCredits(newUser.id);

    // Hacemos el login con los datos del formulario utilizando next-auth
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.log(error);

    // Si hay un error, lo mostramos al usuario
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "Error 500" };
  }
};

/**
 * Función para enviar un correo de restablecimiento de contraseña
 * @param values - Datos del formulario
 * @returns Resultado de la acción
 */
export const forgotPasswordAction = async (
  values: z.infer<typeof forgotPasswordSchema>,
) => {
  try {
    const validated = forgotPasswordSchema.safeParse(values);
    if (!validated.success) {
      return { error: "Datos inválidos" };
    }

    const { email } = validated.data;

    // Verificamos que el usuario exista
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "No existe un usuario con ese email" };
    }

    // Eliminamos tokens anteriores
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Creamos el nuevo token
    const token = nanoid();
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    // Enviamos el email con el token
    const response = await sendResetPasswordEmail(email, token);

    if (!response.success) {
      return { error: "No se pudo enviar el correo" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en forgotPasswordAction:", error);
    return { error: "Error inesperado, intenta más tarde" };
  }
};

/**
 * Función para verificar el token de restablecimiento de contraseña
 * @param token - Token de verificación
 * @returns Resultado de la acción
 */
export const verifyResetPasswordTokenAction = async (token: string) => {
  try {
    // Buscamos el token en la base de datos
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    // Si el token no existe, devolvemos un error
    if (!passwordResetToken) {
      return { error: "Token inválido" };
    }

    // Si el token ha expirado, devolvemos un error
    if (passwordResetToken.expires < new Date()) {
      return { error: "Token expirado" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en verifyResetPasswordTokenAction:", error);
    return { error: "Error inesperado, intenta más tarde" };
  }
};

/**
 * Función para restablecer la contraseña de un usuario
 * @param token - Token de verificación
 * @param password - Nueva contraseña
 * @returns Resultado de la acción
 */
export const resetPasswordAction = async (
  values: z.infer<typeof resetPasswordSchema>,
) => {
  try {
    // Parseamos los datos y verificamos si son válidos con zod
    const validated = resetPasswordSchema.safeParse(values);
    if (!validated.success) {
      return { error: "Datos inválidos" };
    }

    // Desestructuramos los datos
    const { password, confirmPassword } = validated.data;

    // Verificamos si las contraseñas coinciden
    if (password !== confirmPassword) {
      return { error: "Las contraseñas no coinciden" };
    }

    // Buscamos el token en la base de datos
    const token = await prisma.passwordResetToken.findUnique({
      where: {
        token: values.token,
      },
    });

    // Si el token no existe, devolvemos un error
    if (!token) {
      return { error: "Token inválido" };
    }

    // Si el token ha expirado, devolvemos un error
    if (token.expires < new Date()) {
      return { error: "Token expirado" };
    }

    // Buscamos el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: token.userId },
    });

    if (!user) {
      return { error: "Usuario no encontrado" };
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizamos la contraseña del usuario
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Eliminamos el token
    await prisma.passwordResetToken.delete({
      where: { id: token.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error en resetPasswordAction:", error);
    return { error: "Error al restablecer la contraseña" };
  }
};

/**
 * Función para obtener el estado de verificación de email del usuario
 * @returns Estado de verificación de email del usuario
 */
export async function getEmailVerificationStatus() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { emailVerified: true },
  });

  if (user?.emailVerified) {
    return true;
  } else {
    return false;
  }
}

/**
 * Función para verificar el email de un usuario
 * @param email - Email del usuario
 * @returns Resultado de la acción
 */
export const sendVerifyEmailAction = async (email: string) => {
  try {
    // Verificamos que el usuario exista
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user?.email) {
      return { error: "No existe un usuario con ese email" };
    }

    // Verificamos si el email ya esta verificado
    if (!user.emailVerified) {
      const verifyTokenExists = await prisma.verificationToken.findFirst({
        where: {
          identifier: user.email,
        },
      });

      // Si existe un token, lo eliminamos
      if (verifyTokenExists?.identifier) {
        await prisma.verificationToken.deleteMany({
          where: {
            identifier: user.email,
          },
        });
      }

      // Si no existe un token, lo creamos
      const token = await nanoid();

      // Y lo guardamos en la base de datos
      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      // Enviamos el email de verificación
      const response = await sendEmailVerification(user.email, token);

      if (!response.success) {
        return { error: "Error al enviar el email de verificación" };
      }

      // Si el email se envía correctamente, devolvemos un error para que el usuario verifique su email
      return { success: "Por favor, verifica tu email para continuar" };
    }
  } catch (error) {
    console.error("Error en sendVerifyEmailAction:", error);
    return { error: "Error inesperado, intenta más tarde" };
  }
};

export const existEmailAndTokenAction = async (
  email: string,
  token: string,
) => {
  try {
    // Verificamos que el usuario exista
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user?.email) {
      return { error: "No existe un usuario con ese email" };
    }

    // Buscamos el token en la base de datos
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
      },
    });

    // Si el token no existe, devolvemos un error
    if (!verificationToken) {
      return { error: "Token inválido" };
    }

    // Si el token ha expirado, devolvemos un error
    if (verificationToken.expires < new Date()) {
      return { error: "Token expirado" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en existEmailAndTokenAction:", error);
    return { error: "Error al verificar el email" };
  }
};

/** * Función para verificar el email de un usuario
 * @param email - Email del usuario
 * @param token - Token de verificación
 * @returns Resultado de la acción
 */
export const verifyEmailAction = async (email: string, token: string) => {
  try {
    // Verificamos que el usuario exista
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user?.email) {
      return { error: "No existe un usuario con ese email" };
    }

    // Buscamos el token en la base de datos
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
      },
    });

    // Si el token no existe, devolvemos un error
    if (!verificationToken) {
      return { error: "Token inválido" };
    }

    // Si el token ha expirado, devolvemos un error
    if (verificationToken.expires < new Date()) {
      return { error: "Token expirado" };
    }

    // Actualizamos el estado de verificación del email del usuario
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Eliminamos el token
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error en verifyEmailAction:", error);
    return { error: "Error al verificar el email" };
  }
};
