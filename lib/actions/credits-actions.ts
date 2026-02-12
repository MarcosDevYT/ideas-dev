"use server";

import { auth } from "@/auth";
import { getUserCredits, getCreditStats } from "@/lib/credits";
import prisma from "@/lib/prisma";

/**
 * Tipos para las respuestas de las server actions
 */
export type CreditsData = {
  credits: number;
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
 * Server Action: Obtiene datos completos de créditos del usuario
 * Incluye: balance, stats, transacciones recientes, y estado de admin
 */
export async function getCreditsDataAction(
  userId: string,
): Promise<CreditsData> {
  try {
    // Fetch paralelo de todos los datos necesarios
    const [credits, stats, recentTransactions, user] = await Promise.all([
      getUserCredits(userId),
      getCreditStats(userId),
      prisma.creditTransaction.findMany({
        where: { userId },
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
        where: { id: userId },
        select: { isAdmin: true },
      }),
    ]);

    return {
      credits,
      isAdmin: user?.isAdmin || false,
      stats,
      recentTransactions,
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
  userId: string;
  page?: number;
  limit?: number;
  type?: string;
}): Promise<TransactionsData> {
  try {
    const { userId, page = 1, limit = 20, type } = params;

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

    return {
      transactions,
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
 * Server Action: Verifica autenticación y devuelve userId
 * Útil para componentes que necesitan verificar auth antes de hacer fetching
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}
