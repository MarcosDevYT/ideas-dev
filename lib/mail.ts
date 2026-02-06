import { baseUrl } from "./baseUrl";
import nodemailer from "nodemailer";
import { verifyEmailTemplate } from "./email-templates/verify-email";
import { resetPasswordTemplate } from "./email-templates/reset-password";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // ej: "gmail"
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_PASS, // contraseña o app password
  },
});

// 🔹 Email de verificación
export const sendEmailVerification = async (email: string, token: string) => {
  const verifyLink = `${baseUrl}/verify-email?email=${email}&token=${token}`;

  const html = verifyEmailTemplate(verifyLink);

  try {
    await transporter.sendMail({
      from: `"Ideas Dev" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verifica tu email en IdeasDev",
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Error al enviar email:", error);
    return { error: "Error al enviar email" };
  }
};

// 🔹 Email de restablecer contraseña
export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const html = resetPasswordTemplate(resetLink);

  try {
    await transporter.sendMail({
      from: `"Ideas Dev" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Restablece tu contraseña en IdeasDev",
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Error al enviar email:", error);
    return { error: "Error al enviar email" };
  }
};
