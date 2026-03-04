import prisma from "@/lib/prisma";
import type { CreditBalance, CreditConsumption } from "@/lib/types/database";
import { CREDIT_MESSAGES, SUBSCRIPTION_PLANS } from "./constants";
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
      planCredits: true,
      extraCredits: true,
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
      select: {
        planCredits: true,
        extraCredits: true,
        isAdmin: true,
        creditsResetAt: true,
      },
    });

    return {
      available:
        (updatedUser?.planCredits ?? 0) + (updatedUser?.extraCredits ?? 0),
      planCredits: updatedUser?.planCredits ?? 0,
      extraCredits: updatedUser?.extraCredits ?? 0,
      isAdmin: updatedUser?.isAdmin ?? false,
      resetAt: updatedUser?.creditsResetAt ?? new Date(),
    };
  }

  return {
    available: user.planCredits + user.extraCredits,
    planCredits: user.planCredits,
    extraCredits: user.extraCredits,
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
    let newPlanCredits = balance.planCredits;
    let newExtraCredits = balance.extraCredits;

    if (balance.planCredits >= amount) {
      newPlanCredits -= amount;
    } else {
      const remainingCost = amount - balance.planCredits;
      newPlanCredits = 0;
      newExtraCredits -= remainingCost;
    }

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { planCredits: newPlanCredits, extraCredits: newExtraCredits },
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
      remaining: updatedUser.planCredits + updatedUser.extraCredits,
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
      data: { extraCredits: { increment: amount } }, // Purchases & ad-hocs go to extraCredits
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

  return updatedUser.planCredits + updatedUser.extraCredits;
}

// ============================================
// Monthly Reset & Initialization
// ============================================

/**
 * Reset monthly credits for a user
 * @param forcePlanId Optional PlanId to override DB check (useful on immediate plan upgrade)
 */
export async function resetMonthlyCredits(
  userId: string,
  forcePlanId?: keyof typeof SUBSCRIPTION_PLANS,
): Promise<void> {
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
  let planId: keyof typeof SUBSCRIPTION_PLANS = forcePlanId || "FREE";

  if (!forcePlanId && user.subscription?.status === "active") {
    // Extract plan from stripe price ID (e.g., price_mock_premium -> PREMIUM)
    const priceId = user.subscription.stripePriceId || "";
    if (priceId.includes("basic")) planId = "BASIC";
    else if (priceId.includes("pro")) planId = "PRO";
    else if (priceId.includes("premium")) planId = "PREMIUM";
  }

  const creditAmount = SUBSCRIPTION_PLANS[planId]?.amount || 50;

  // Calculate next reset date (1 month from now)
  const nextResetDate = new Date();
  nextResetDate.setMonth(nextResetDate.getMonth() + 1);

  // Reset plan credits (extraCredits are UNTOUCHED)
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        planCredits: creditAmount,
        creditsResetAt: nextResetDate,
      },
    }),
    prisma.creditTransaction.create({
      data: {
        userId,
        amount: creditAmount,
        type: "monthly_reset",
        description: `Recarga de plan ${SUBSCRIPTION_PLANS[planId].name}: ${creditAmount} créditos`,
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

  const freeCredits = SUBSCRIPTION_PLANS.FREE.amount;

  await prisma.user.update({
    where: { id: userId },
    data: {
      planCredits: freeCredits,
      extraCredits: 0,
      creditsResetAt: nextResetDate,
    },
  });

  await createCreditTransaction(
    userId,
    freeCredits,
    "monthly_reset",
    "Créditos iniciales plan Gratis",
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

// ============================================
// UI Formatting Helpers
// ============================================

/**
 * Replace raw Chat IDs with their actual titles in transaction descriptions
 */
export async function enrichTransactionsWithTitles<
  T extends { description: string | null },
>(transactions: T[]): Promise<T[]> {
  const ideaChatIds = new Set<string>();
  const projectChatIds = new Set<string>();

  // Use optional chaining carefully since T might not be fully known, but we constrained it
  transactions.forEach((t) => {
    if (t.description?.startsWith("Idea Chat: ")) {
      ideaChatIds.add(t.description.replace("Idea Chat: ", "").trim());
    } else if (t.description?.startsWith("Project Chat: ")) {
      projectChatIds.add(t.description.replace("Project Chat: ", "").trim());
    }
  });

  const [ideaChats, projects] = await Promise.all([
    ideaChatIds.size > 0
      ? prisma.ideaChat.findMany({
          where: { id: { in: Array.from(ideaChatIds) } },
          select: { id: true, title: true },
        })
      : Promise.resolve([]),
    projectChatIds.size > 0
      ? prisma.project.findMany({
          where: { id: { in: Array.from(projectChatIds) } },
          select: { id: true, title: true },
        })
      : Promise.resolve([]),
  ]);

  const ideaMap = new Map(ideaChats.map((c) => [c.id, c.title]));
  const projectMap = new Map(projects.map((p) => [p.id, p.title]));

  return transactions.map((t) => {
    if (t.description?.startsWith("Idea Chat: ")) {
      const id = t.description.replace("Idea Chat: ", "").trim();
      const title = ideaMap.get(id);
      if (title) {
        return { ...t, description: `Chat de idea: ${title}` };
      }
    } else if (t.description?.startsWith("Project Chat: ")) {
      const id = t.description.replace("Project Chat: ", "").trim();
      const title = projectMap.get(id);
      if (title) {
        return { ...t, description: `Chat de proyecto: ${title}` };
      }
    }
    return t;
  });
}
