"use server";

import prisma from "@/lib/prisma";
import { polarSandbox, polarProduction } from "@/lib/polar";
import { auth } from "@/auth";

export async function clonePlanAction(planId: string) {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      return { success: false, error: "Plan no encontrado" };
    }

    const isCurrentlySandbox = existingPlan.polarEnvironment === "sandbox";
    const targetEnv = isCurrentlySandbox ? "production" : "sandbox";
    const targetPolar = isCurrentlySandbox ? polarProduction : polarSandbox;

    const isFree = existingPlan.price === 0;
    const priceToApi = isFree ? 0 : Math.max(Math.round(existingPlan.price * 100), 50);

    let productId: string | null = null;

    if (!isFree) {
      const productPayload: any = {
        name: `${existingPlan.name} (${targetEnv.toUpperCase()})`,
        description: existingPlan.description || undefined,
        prices: [
          {
            priceAmount: priceToApi,
            priceCurrency: "usd",
            amountType: "fixed",
          },
        ],
      };

      if (existingPlan.isRecurring) {
        productPayload.recurringInterval = "month";
      }

      // Crear el producto en el Polar del entorno destino
      const newProduct = await targetPolar.products.create(productPayload);
      productId = newProduct.id;
    }

    // Guardar el clon en nuestra DB
    const newDbPlan = await prisma.plan.create({
      data: {
        name: `${existingPlan.name} (${targetEnv.toUpperCase()})`,
        description: existingPlan.description,
        price: existingPlan.price,
        credits: existingPlan.credits,
        isRecurring: existingPlan.isRecurring,
        polarProductId: productId,
        polarEnvironment: targetEnv,
        isPopular: existingPlan.isPopular,
        features: existingPlan.features,
      },
    });

    return { success: true, plan: newDbPlan };
  } catch (error: unknown) {
    console.error("[ClonePlan] Error al clonar plan:", error);
    return {
      success: false,
      error: "Error interno al clonar el plan: " + (error as Error).message,
    };
  }
}
