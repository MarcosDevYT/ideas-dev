"use server";

import { polar } from "@/lib/polar";
import { auth } from "@/auth";

export async function getPolarProductsAction() {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const products = await polar.products.list({
      limit: 100,
    });

    // items is an array of Product objects
    const items = products.result?.items || [];

    // Separamos en base a is_recurring
    const subscriptions = items.filter((p) => p.isRecurring);
    const creditPackages = items.filter((p) => !p.isRecurring);

    return { success: true, subscriptions, creditPackages };
  } catch (error: any) {
    console.error("[Polar] Error al obtener productos:");
    console.error("  status:", error?.status);
    console.error("  message:", error?.message);
    console.error("  body:", JSON.stringify(error?.body || error, null, 2));
    return { success: false, error: "Error de conexión con Polar" };
  }
}

import prisma from "@/lib/prisma";

export async function createSubscriptionPlanAction(data: {
  name: string;
  description: string;
  priceAmount: number; // en centavos
  planCredits: number;
  isPopular?: boolean;
  features?: string[];
}) {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const product = await polar.products.create({
      name: data.name,
      description: data.description,
      prices: [
        {
          priceAmount: data.priceAmount,
          priceCurrency: "usd",
          amountType: "fixed",
        },
      ],
      recurringInterval: "month",
    });

    // Guardar en nuestra base de datos
    const dbPlan = await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.priceAmount / 100,
        credits: data.planCredits,
        isRecurring: true,
        polarProductId: product.id,
        isPopular: data.isPopular || false,
        features: data.features || [],
      },
    });

    return { success: true, data: product, dbPlan };
  } catch (error: unknown) {
    console.error("[Polar] Error al crear suscripción:", error);
    return {
      success: false,
      error: "No se pudo crear el plan de suscripción.",
    };
  }
}

export async function createCreditPackageAction(data: {
  name: string;
  description: string;
  priceAmount: number; // en centavos
  extraCredits: number;
  features?: string[];
  isPopular?: boolean;
}) {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const product = await polar.products.create({
      name: data.name,
      description: data.description,
      prices: [
        {
          priceAmount: data.priceAmount,
          priceCurrency: "usd",
          amountType: "fixed",
        },
      ],
    });

    // Guardar en nuestra base de datos
    const dbPlan = await prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.priceAmount / 100,
        credits: data.extraCredits,
        isRecurring: false,
        polarProductId: product.id,
        features: data.features || [],
        isPopular: data.isPopular || false,
      },
    });

    return { success: true, data: product, dbPlan };
  } catch (error: any) {
    console.error("[Polar] Error al crear paquete de créditos:", error);
    console.error("  body:", JSON.stringify(error?.body || error, null, 2));
    return {
      success: false,
      error: "No se pudo crear el paquete de créditos.",
    };
  }
}

export async function getDbPlansAction() {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "No autorizado" };
  }

  try {
    const plans = await prisma.plan.findMany({
      orderBy: { price: "asc" },
    });

    const subscriptions = plans.filter((p) => p.isRecurring);
    const creditPackages = plans.filter((p) => !p.isRecurring);

    return { success: true, subscriptions, creditPackages };
  } catch (error) {
    console.error("Error al obtener planes de DB:", error);
    return { success: false, error: "Error al obtener planes" };
  }
}

export async function getPublicPlansAction() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { price: "asc" },
    });

    const subscriptions = plans.filter((p) => p.isRecurring);
    const creditPackages = plans.filter((p) => !p.isRecurring);

    return { success: true, subscriptions, creditPackages };
  } catch (error) {
    console.error("Error al obtener planes públicos:", error);
    return { success: false, error: "Error al obtener planes" };
  }
}

export async function updatePlanAction(data: {
  id: string; // ID en nuestra Base de datos
  polarProductId: string;
  name: string;
  description: string;
  features?: string[];
  isPopular?: boolean;
  priceAmount?: number; // centavos (Polar los precios a veces son inmutables o se agregan nuevos, por ende, es complejo actualizar precios de suscripciones existentes)
}) {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return { success: false, error: "No autorizado" };
  }

  try {
    // 1. Actualizar el Metadata en Polar (Nombre y Descripción son mutables)
    // Según la documentación provista, podemos usar polar.products.update()
    await polar.products.update({
      id: data.polarProductId,
      productUpdate: {
        name: data.name,
        description: data.description,
      },
    });

    // 2. Actualizar en nuestra Base de Datos local
    const dbPlan = await prisma.plan.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        features: data.features || [],
        isPopular: data.isPopular || false,
        // Nota: No actualizamos el price de Polar aquí para evitar asincronía catastrófica con las suscripciones activas.
      },
    });

    return { success: true, plan: dbPlan };
  } catch (error: unknown) {
    console.error("[Polar] Error al editar producto:", error);
    return {
      success: false,
      error: "No se pudo actualizar el plan.",
    };
  }
}
