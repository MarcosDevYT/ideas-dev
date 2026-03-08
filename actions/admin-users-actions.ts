"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getCachedData, invalidateCacheKey } from "@/actions/cache/redis-cache";

function isAdmin(email: string | null | undefined) {
  return email === process.env.ADMIN_EMAIL;
}

export async function getAdminUsersAction() {
  try {
    const session = await auth();
    if (!isAdmin(session?.user?.email)) {
      return { success: false, error: "No autorizado" };
    }

    const users = await getCachedData(
      "admin:users",
      async () => {
        return await prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            subscription: true,
            _count: {
              select: {
                projects: true,
                ideaChats: true,
              },
            },
          },
          take: 200, // Limite conservador para pre-rendering/carga inicial
        });
      },
      300, // 5 minutos - suficiente para panel de admin
    );

    return { success: true, users };
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function updateUserCreditsAction(
  userId: string,
  amount: number,
  isAddition: boolean,
  reason: string = "Ajuste manual del administrador",
) {
  try {
    const session = await auth();
    if (!isAdmin(session?.user?.email)) {
      return { success: false, error: "No autorizado" };
    }

    if (!amount || amount <= 0) {
      return { success: false, error: "La cantidad debe ser mayor a 0" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    const valueToApply = isAddition ? amount : -amount;

    // Ejecutar actualización de balance y registro de transacción juntos
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          extraCredits: {
            increment: valueToApply,
          },
        },
      }),
      prisma.creditTransaction.create({
        data: {
          userId,
          amount: valueToApply,
          type: "ADMIN_ADJUSTMENT",
          description: reason,
        },
      }),
    ]);

    await invalidateCacheKey("admin:users");
    return { success: true, message: "Créditos actualizados correctamente" };
  } catch (error) {
    console.error("Error updating user credits:", error);
    return { success: false, error: "Error al actualizar los créditos" };
  }
}
