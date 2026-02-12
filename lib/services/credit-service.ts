import prisma from "@/lib/prisma";
import type {
  CreditBalance,
  CreditConsumption,
  CreditTransactionType,
} from "@/lib/types/database";

// ============================================
// Constants
// ============================================

const FREE_TIER_CREDITS = 10;
const PAID_TIER_CREDITS = 100;

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
  type: CreditTransactionType,
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
  type: CreditTransactionType,
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
// Monthly Reset
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
      ? PAID_TIER_CREDITS
      : FREE_TIER_CREDITS;

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
      credits: FREE_TIER_CREDITS,
      creditsResetAt: nextResetDate,
    },
  });

  await createCreditTransaction(
    userId,
    FREE_TIER_CREDITS,
    "monthly_reset",
    "Initial credits for new user",
  );
}

// ============================================
// Credit History
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
