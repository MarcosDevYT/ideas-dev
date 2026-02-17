import prisma from "@/lib/prisma";
import type { CreditBalance, CreditConsumption } from "@/lib/types/database";
import { CREDIT_LIMITS, CREDIT_MESSAGES } from "./constants";
import { auth } from "@/auth";

// ============================================
// Credit Balance Management
// ============================================

/**
 * Get the current credit balance for a user
 */
export async function getCreditBalance(userId: string): Promise<CreditBalance> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      credits: true,
      isAdmin: true,
      creditsResetAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if credits need to be reset (monthly)
  const now = new Date();
  if (user.creditsResetAt && user.creditsResetAt <= now && !user.isAdmin) {
    await resetMonthlyCredits(userId);

    // Fetch updated credits
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, isAdmin: true, creditsResetAt: true },
    });

    return {
      available: updatedUser?.credits ?? 0,
      isAdmin: updatedUser?.isAdmin ?? false,
      resetAt: updatedUser?.creditsResetAt ?? new Date(),
    };
  }

  return {
    available: user.credits,
    isAdmin: user.isAdmin,
    resetAt: user.creditsResetAt ?? new Date(),
  };
}

/**
 * Check if a user has sufficient credits
 */
export async function hasCredits(
  userId: string,
  amount: number = 1,
): Promise<boolean> {
  const balance = await getCreditBalance(userId);

  // Admins have unlimited credits
  if (balance.isAdmin) {
    return true;
  }

  return balance.available >= amount;
}

// ============================================
// Credit Consumption
// ============================================

/**
 * Consume credits for AI usage
 */
export async function consumeCredits(
  userId: string,
  amount: number = 1,
  description?: string,
): Promise<CreditConsumption> {
  const balance = await getCreditBalance(userId);

  // Admins have unlimited credits
  if (balance.isAdmin) {
    // Still log the transaction for analytics
    await createCreditTransaction(userId, amount, "consumption", description);
    return { success: true, remaining: -1 }; // -1 indicates unlimited
  }

  // Check if user has enough credits
  if (balance.available < amount) {
    return {
      success: false,
      error: "Insufficient credits",
    };
  }

  // Consume credits in a transaction
  try {
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: amount } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId,
          amount: -amount,
          type: "consumption",
          description: description ?? "AI usage",
        },
      }),
    ]);

    return {
      success: true,
      remaining: updatedUser.credits,
    };
  } catch (error) {
    console.error("Error consuming credits:", error);
    return {
      success: false,
      error: "Failed to consume credits",
    };
  }
}

// ============================================
// Credit Transactions
// ============================================

/**
 * Create a credit transaction record
 */
export async function createCreditTransaction(
  userId: string,
  amount: number,
  type: string,
  description?: string,
): Promise<void> {
  await prisma.creditTransaction.create({
    data: {
      userId,
      amount,
      type,
      description,
    },
  });
}

/**
 * Add credits to a user (for purchases, subscriptions, admin adjustments)
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: string,
  description?: string,
): Promise<number> {
  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        type,
        description: description ?? `Added ${amount} credits`,
      },
    }),
  ]);

  return updatedUser.credits;
}

// ============================================
// Monthly Reset & Initialization
// ============================================

/**
 * Reset monthly credits for a user
 */
export async function resetMonthlyCredits(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Admins don't need resets
  if (user.isAdmin) {
    return;
  }

  // Determine credit amount based on subscription
  const creditAmount =
    user.subscription?.status === "active"
      ? CREDIT_LIMITS.PAID_TIER
      : CREDIT_LIMITS.FREE_TIER;

  // Calculate next reset date (1 month from now)
  const nextResetDate = new Date();
  nextResetDate.setMonth(nextResetDate.getMonth() + 1);

  // Reset credits
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        credits: creditAmount,
        creditsResetAt: nextResetDate,
      },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount: creditAmount,
        type: "monthly_reset",
        description: `Monthly credit reset: ${creditAmount} credits`,
      },
    }),
  ]);
}

/**
 * Initialize credits for a new user
 */
export async function initializeUserCredits(userId: string): Promise<void> {
  const nextResetDate = new Date();
  nextResetDate.setMonth(nextResetDate.getMonth() + 1);

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: CREDIT_LIMITS.FREE_TIER,
      creditsResetAt: nextResetDate,
    },
  });

  await createCreditTransaction(
    userId,
    CREDIT_LIMITS.FREE_TIER,
    "monthly_reset",
    "Initial credits for new user",
  );
}

// ============================================
// Credit History & Stats
// ============================================

/**
 * Get credit transaction history for a user
 */
export async function getCreditHistory(userId: string, limit: number = 50) {
  return prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
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
    .filter((t) => t.type === "consumption" || t.type === "CONSUMPTION")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalPurchased = transactions
    .filter((t) => t.type === "purchase" || t.type === "PURCHASE")
    .reduce((sum, t) => sum + t.amount, 0);

  const lastPurchaseTransaction = transactions
    .filter((t) => t.type === "purchase" || t.type === "PURCHASE")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

  return {
    totalConsumed,
    totalPurchased,
    lastPurchase: lastPurchaseTransaction?.createdAt || null,
  };
}

// ============================================
// Limits & Permissions
// ============================================

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

// ============================================
// Admin & Utils
// ============================================

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const session = await auth();

  if (!session?.user?.id) {
    return false;
  }

  const balance = await getCreditBalance(session.user.id);
  return balance.isAdmin;
}

// ============================================
// Middleware Validation Helper
// ============================================

/**
 * Validates that the current user has sufficient credits
 * Returns the user session if valid, throws error if not
 * (Migrated from credit-middleware.ts)
 */
export async function validateCredits(requiredAmount: number = 1) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const balance = await getCreditBalance(session.user.id);

  // Admins have unlimited credits
  if (balance.isAdmin) {
    return { session, balance, isAdmin: true };
  }

  // Check if user has enough credits
  const hasSufficientCredits = await hasCredits(
    session.user.id,
    requiredAmount,
  );

  if (!hasSufficientCredits) {
    throw new Error(CREDIT_MESSAGES.INSUFFICIENT);
  }

  return { session, balance, isAdmin: false };
}
