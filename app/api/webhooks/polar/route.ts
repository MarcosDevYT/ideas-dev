import { NextRequest, NextResponse } from "next/server";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import prisma from "@/lib/prisma";

const isDev = process.env.NODE_ENV !== "production";
const WEBHOOK_SECRET = isDev
  ? process.env.POLAR_SANDBOX_WEBHOOK_SECRET || ""
  : process.env.POLAR_PRODUCTION_WEBHOOK_SECRET || "";

// ─────────────────────────────────────────────────────────────────────────────
// Handler Principal
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error(`POLAR_WEBHOOK_SECRET no está configurado para el entorno ${isDev ? 'sandbox' : 'production'}`);
    return NextResponse.json(
      { error: "Webhook secret no configurado" },
      { status: 500 },
    );
  }

  // Leer el cuerpo como texto para validar la firma
  const body = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event;
  try {
    event = validateEvent(body, headers, WEBHOOK_SECRET);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      console.error("Firma de webhook inválida:", error.message);
      return NextResponse.json({ error: "Firma inválida" }, { status: 403 });
    }
    console.error("Error al parsear evento de webhook:", error);
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  console.log(`[Polar Webhook] Evento recibido: ${event.type}`);

  try {
    switch (event.type) {
      // ──────────────────────────────────────────────────────────────────
      // Suscripción activa (primer pago procesado correctamente)
      // ──────────────────────────────────────────────────────────────────
      case "subscription.active": {
        const sub = event.data;
        const userId = sub.metadata?.userId as string | undefined;
        const user = await findUser(userId, sub.customer.email);

        if (!user) {
          console.warn(
            `[Polar] Usuario no encontrado para suscripción ${sub.id}`,
          );
          break;
        }

        // 2) Buscar el plan en nuestra BD
        const plan = await prisma.plan.findUnique({
          where: { polarProductId: sub.productId },
        });

        const planCredits =
          plan?.credits || getPlanCreditsFallback(sub.product.name);
        const planId = plan?.id;

        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            polarCustomerId: sub.customerId,
            polarSubscriptionId: sub.id,
            polarPriceId: sub.productId,
            status: sub.status,
            currentPeriodEnd: sub.currentPeriodEnd,
            planId: planId,
            polarEnvironment: isDev ? "sandbox" : "production",
          },
          create: {
            userId: user.id,
            polarCustomerId: sub.customerId,
            polarSubscriptionId: sub.id,
            polarPriceId: sub.productId,
            status: sub.status,
            currentPeriodEnd: sub.currentPeriodEnd,
            planId: planId,
            polarEnvironment: isDev ? "sandbox" : "production",
          },
        });

        const nextReset = new Date();
        nextReset.setMonth(nextReset.getMonth() + 1);

        await prisma.user.update({
          where: { id: user.id },
          data: { planCredits, creditsResetAt: nextReset },
        });

        await prisma.creditTransaction.create({
          data: {
            userId: user.id,
            amount: planCredits,
            type: "monthly_reset",
            description: `Suscripción activada: ${sub.product.name} — ${planCredits} créditos`,
          },
        });

        console.log(
          `[Polar] Suscripción ${sub.id} activada — ${planCredits} créditos para user ${user.id}`,
        );
        break;
      }

      // ──────────────────────────────────────────────────────────────────
      // Suscripción actualizada (nuevos períodos, cambio de estado)
      // ──────────────────────────────────────────────────────────────────
      case "subscription.updated": {
        const sub = event.data;
        const userId = sub.metadata?.userId as string | undefined;
        const user = await findUser(userId, sub.customer.email);
        if (!user) break;

        await prisma.subscription.updateMany({
          where: { userId: user.id },
          data: {
            status: sub.status,
            currentPeriodEnd: sub.currentPeriodEnd,
            polarEnvironment: isDev ? "sandbox" : "production",
          },
        });

        console.log(
          `[Polar] Suscripción ${sub.id} actualizada — status: ${sub.status}`,
        );
        break;
      }

      // ──────────────────────────────────────────────────────────────────
      // Suscripción cancelada
      // ──────────────────────────────────────────────────────────────────
      case "subscription.canceled": {
        const sub = event.data;
        const userId = sub.metadata?.userId as string | undefined;
        const user = await findUser(userId, sub.customer.email);
        if (!user) break;

        await prisma.subscription.updateMany({
          where: { userId: user.id },
          data: { status: "canceled" },
        });

        console.log(
          `[Polar] Suscripción ${sub.id} cancelada para user ${user.id}`,
        );
        break;
      }

      // ──────────────────────────────────────────────────────────────────
      // Orden pagada (compra única de créditos extra)
      // ──────────────────────────────────────────────────────────────────
      case "order.paid": {
        const order = event.data;

        // Ignorar renovaciones de suscripción
        if (order.subscriptionId) {
          console.log(
            `[Polar] Order ${order.id} es renovación de suscripción — ignorado`,
          );
          break;
        }

        // Necesitamos el producto para identificar los créditos
        if (!order.product) {
          console.warn(`[Polar] Order ${order.id} sin producto — ignorado`);
          break;
        }

        const userId = order.metadata?.userId as string | undefined;
        const user = await findUser(userId, order.customer.email);

        if (!user) {
          console.warn(`[Polar] Usuario no encontrado para orden ${order.id}`);
          break;
        }

        // Buscar plan en DB para obtener los créditos definidos dinámicamente
        const plan = await prisma.plan.findUnique({
          where: { polarProductId: order.product.id },
        });

        const extraCredits =
          plan?.credits || getExtraCreditsFallback(order.product.name);

        if (extraCredits > 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: { extraCredits: { increment: extraCredits } },
          });

          await prisma.creditTransaction.create({
            data: {
              userId: user.id,
              amount: extraCredits,
              type: "PURCHASE",
              description: `Compra de créditos: ${order.product.name}`,
            },
          });

          console.log(
            `[Polar] Order ${order.id} — ${extraCredits} créditos extra para user ${user.id}`,
          );
        }
        break;
      }

      default:
        console.log(`[Polar] Evento ignorado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[Polar] Error procesando evento ${event.type}:`, error);
    return NextResponse.json(
      { error: "Error interno procesando el evento" },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Busca un usuario por userId (metadata) o email.
 */
async function findUser(userId?: string, email?: string | null) {
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) return user;
  }
  if (email) {
    return prisma.user.findUnique({ where: { email } });
  }
  return null;
}

/**
 * Devuelve los créditos mensuales de un plan de suscripción por nombre (FALLBACK de Legacy).
 * Solo se usa si por algún motivo no se guardó el plan en base de datos.
 */
function getPlanCreditsFallback(productName: string): number {
  const name = productName.toLowerCase();
  if (name.includes("premium")) return 1000;
  if (name.includes("pro")) return 500;
  if (
    name.includes("básico") ||
    name.includes("basico") ||
    name.includes("basic")
  )
    return 250;
  return 50;
}

/**
 * Devuelve los créditos extra de un paquete por nombre (FALLBACK de Legacy).
 */
function getExtraCreditsFallback(productName: string): number {
  const name = productName.toLowerCase();
  if (name.includes("empresarial") || name.includes("enterprise")) return 500;
  if (name.includes("premium")) return 250;
  if (
    name.includes("estándar") ||
    name.includes("estandar") ||
    name.includes("standard")
  )
    return 100;
  if (
    name.includes("básico") ||
    name.includes("basico") ||
    name.includes("basic")
  )
    return 50;
  return 0;
}
