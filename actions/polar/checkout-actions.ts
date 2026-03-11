"use server";

import { polar, polarSandbox, polarProduction } from "@/lib/polar";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function createCheckoutSessionAction(productId: string) {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return { success: false, error: "Debes iniciar sesión para comprar." };
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkout = await polar.checkouts.create({
      products: [productId],
      customerEmail: session.user.email,
      customerName: session.user.name || undefined,
      metadata: {
        userId: session.user.id,
      },
      successUrl: `${appUrl}/checkout/success?checkout_id={CHECKOUT_ID}`,
    });

    return { success: true, url: checkout.url };
  } catch (error) {
    console.error("Error al crear sesión de checkout:", error);
    return {
      success: false,
      error: "Ocurrió un error al preparar el pago. Inténtalo de nuevo.",
    };
  }
}

export async function cancelSubscriptionAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Debes iniciar sesión." };
  }

  try {
    // Buscar la suscripción activa del usuario
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    });

    if (!subscription || !subscription.polarSubscriptionId || subscription.status === "canceled") {
      return { success: false, error: "No tienes una suscripción activa para cancelar." };
    }

    const targetPolar = subscription.polarEnvironment === "production" ? polarProduction : polarSandbox;

    // Cancelar en Polar inmediatamente
    if (subscription.polarSubscriptionId) {
      await targetPolar.subscriptions.update({
        id: subscription.polarSubscriptionId,
        subscriptionUpdate: {
          cancelAtPeriodEnd: false // cancelación inmediata según petición
        }
      });
    }

    // Obtener el plan gratuito para asignarlo
    const freePlan = await prisma.plan.findFirst({
      where: { price: 0 }
    });
    const freeCredits = freePlan ? freePlan.credits : 50;

    // Actualizar suscripción localmente
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "canceled",
        planId: freePlan ? freePlan.id : null,
      }
    });

    // Resetear los beneficios del usuario inmediatamente
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        planCredits: freeCredits,
        creditsResetAt: new Date()
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error al cancelar suscripción:", error);
    return {
      success: false,
      error: "Hubo un error al cancelar la suscripción. " + (error?.message || ""),
    };
  }
}
