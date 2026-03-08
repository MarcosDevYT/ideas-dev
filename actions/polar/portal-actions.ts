"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { polar } from "@/lib/polar";

export async function createCustomerPortalSessionAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Debes iniciar sesión." };
    }

    // Buscar en la base de datos si el usuario tiene un ID de cliente de Polar registrado
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { polarCustomerId: true },
    });

    if (!subscription || !subscription.polarCustomerId) {
      return {
        success: false,
        error:
          "No tienes un historial de facturación o suscripción activa para gestionar.",
      };
    }

    // Crear la sesión del Customer Portal
    // Basado en @polar-sh/sdk documentation para Customer Sessions (v0.46)
    const portalSession = await polar.customerSessions.create({
      customerId: subscription.polarCustomerId,
    });

    return { success: true, url: portalSession.customerPortalUrl };
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return {
      success: false,
      error: "Ocurrió un error al intentar acceder al portal de cliente.",
    };
  }
}
