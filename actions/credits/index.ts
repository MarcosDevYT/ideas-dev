"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  getCreditBalance,
  getCreditHistory,
  getCreditStats,
  addCredits,
  isCurrentUserAdmin,
  enrichTransactionsWithTitles,
} from "./service";
import { revalidatePath } from "next/cache";

export type CreditsData = {
  credits: number;
  planCredits: number;
  extraCredits: number;
  isAdmin: boolean;
  stats: {
    totalConsumed: number;
    totalPurchased: number;
    lastPurchase: Date | null;
  };
  recentTransactions: Array<{
    id: string;
    amount: number;
    type: string;
    description: string | null;
    createdAt: Date;
  }>;
};

export type TransactionsData = {
  transactions: Array<{
    id: string;
    amount: number;
    type: string;
    description: string | null;
    createdAt: Date;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Server Action: Get simple user credits balance
 */
export async function getUserCreditsAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const balance = await getCreditBalance(session.user.id);

    return {
      success: true,
      data: balance.available,
    };
  } catch (error) {
    console.error("Error getting user credits:", error);
    return { error: "Failed to get user credits" };
  }
}

/**
 * Server Action: Obtiene datos completos de créditos del usuario
 * Incluye: balance, stats, transacciones recientes, y estado de admin
 */
export async function getCreditsDataAction(
  userId?: string,
): Promise<CreditsData> {
  try {
    const session = await auth();
    const targetUserId = userId || session?.user?.id;

    if (!targetUserId) {
      throw new Error("Unauthorized");
    }

    // Si pide datos de otro usuario, verificar si es admin (aunque por ahora asumimos que solo pide los suyos o es server component)
    if (userId && userId !== session?.user?.id) {
      const isAdmin = await isCurrentUserAdmin();
      if (!isAdmin) throw new Error("Unauthorized");
    }

    // Fetch paralelo de todos los datos necesarios
    const [credits, stats, recentTransactions, user] = await Promise.all([
      getCreditBalance(targetUserId),
      getCreditStats(targetUserId),
      prisma.creditTransaction.findMany({
        where: { userId: targetUserId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          amount: true,
          type: true,
          description: true,
          createdAt: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: targetUserId },
        select: { email: true },
      }),
    ]);

    const enrichedTransactions =
      await enrichTransactionsWithTitles(recentTransactions);

    return {
      credits: credits.available,
      planCredits: credits.planCredits,
      extraCredits: credits.extraCredits,
      isAdmin: user?.email === process.env.ADMIN_EMAIL,
      stats,
      recentTransactions: enrichedTransactions,
    };
  } catch (error) {
    console.error("Error al obtener datos de créditos:", error);
    throw new Error("Error al obtener información de créditos");
  }
}

/**
 * Server Action: Obtiene historial de transacciones con paginación
 */
export async function getTransactionsAction(params: {
  userId?: string;
  page?: number;
  limit?: number;
  type?: string;
}): Promise<TransactionsData> {
  try {
    const session = await auth();
    const userId = params.userId || session?.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { page = 1, limit = 20, type } = params;

    // Validar parámetros
    if (page < 1 || limit < 1 || limit > 100) {
      throw new Error("Parámetros inválidos");
    }

    // Construir filtro
    const where: { userId: string; type?: string } = { userId };
    if (type && type !== "all") {
      where.type = type;
    }

    // Fetch paralelo de total y transacciones
    const [total, transactions] = await Promise.all([
      prisma.creditTransaction.count({ where }),
      prisma.creditTransaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          amount: true,
          type: true,
          description: true,
          createdAt: true,
        },
      }),
    ]);

    const enrichedTransactions =
      await enrichTransactionsWithTitles(transactions);

    return {
      transactions: enrichedTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    throw new Error("Error al obtener historial de transacciones");
  }
}

/**
 * Server Action: Get simple credit history (non-paginated wrapper for compatibility)
 */
export async function getCreditHistoryAction(limit: number = 50) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const history = await getCreditHistory(session.user.id, limit);

    return {
      success: true,
      data: history,
    };
  } catch (error) {
    console.error("Error getting credit history:", error);
    return { error: "Failed to get credit history" };
  }
}

/**
 * Admin action: Add credits to a user
 */
export async function addCreditsToUserAction(
  userId: string,
  amount: number,
  description?: string,
) {
  try {
    const isAdmin = await isCurrentUserAdmin();

    if (!isAdmin) {
      return { error: "Unauthorized: Admin access required" };
    }

    const newBalance = await addCredits(
      userId,
      amount,
      "admin_adjustment",
      description,
    );

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

    return {
      success: true,
      data: { newBalance },
    };
  } catch (error) {
    console.error("Error adding credits:", error);
    return { error: "Failed to add credits" };
  }
}

/**
 * Server Action: Verifica autenticación y devuelve userId
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}
