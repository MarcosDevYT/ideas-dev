"use server";

import { polar } from "@/lib/polar";
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
