/**
 * Utilidades para manejo de créditos del usuario
 */

import prisma from "@/lib/prisma";

/**
 * Verifica si el usuario tiene suficientes créditos
 * Los administradores tienen créditos ilimitados
 */
export async function hasEnoughCredits(
  userId: string,
  amount: number = 1,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, isAdmin: true },
  });

  if (!user) return false;
  if (user.isAdmin) return true; // Admin tiene créditos ilimitados

  return user.credits >= amount;
}

/**
 * Consume créditos del usuario y registra la transacción
 * Los administradores no consumen créditos
 */
export async function consumeCredits(
  userId: string,
  amount: number,
  description: string,
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  if (user?.isAdmin) return; // Admin no consume créditos

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: amount } },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        type: "CONSUMPTION",
        description,
      },
    }),
  ]);
}

/**
 * Verifica si el usuario puede crear un nuevo chat de ideas
 * Límite: 5 chats de ideas (excepto admin)
 */
export async function canCreateIdeaChat(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  if (user?.isAdmin) return true; // Admin sin límite

  const count = await prisma.ideaChat.count({
    where: { userId },
  });

  return count < 5;
}

/**
 * Verifica si el usuario puede crear un nuevo proyecto
 * Límite: 10 proyectos (excepto admin)
 */
export async function canCreateProject(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isAdmin: true,
      _count: {
        select: { projects: true },
      },
    },
  });

  if (!user) return false;
  if (user.isAdmin) return true; // Admin sin límite

  return user._count.projects < 10;
}

/**
 * Obtiene los créditos disponibles del usuario
 */
export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, isAdmin: true },
  });

  if (!user) return 0;
  if (user.isAdmin) return Infinity; // Admin tiene créditos ilimitados

  return user.credits;
}

/**
 * Agrega créditos al usuario y registra la transacción
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: string,
  description: string,
): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
      },
    }),
  ]);
}

/**
 * Obtiene estadísticas de créditos del usuario
 */
export async function getCreditStats(userId: string): Promise<{
  totalConsumed: number;
  totalPurchased: number;
  lastPurchase: Date | null;
}> {
  const transactions = await prisma.creditTransaction.findMany({
    where: { userId },
    select: {
      amount: true,
      type: true,
      createdAt: true,
    },
  });

  const totalConsumed = transactions
    .filter((t) => t.type === "CONSUMPTION")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalPurchased = transactions
    .filter((t) => t.type === "PURCHASE")
    .reduce((sum, t) => sum + t.amount, 0);

  const lastPurchaseTransaction = transactions
    .filter((t) => t.type === "PURCHASE")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

  return {
    totalConsumed,
    totalPurchased,
    lastPurchase: lastPurchaseTransaction?.createdAt || null,
  };
}
