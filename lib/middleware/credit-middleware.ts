import { auth } from "@/auth";
import { getCreditBalance, hasCredits } from "@/lib/services/credit-service";
import { CREDIT_MESSAGES } from "@/lib/constants/credits";

// ============================================
// Credit Validation Middleware
// ============================================

/**
 * Validates that the current user has sufficient credits
 * Returns the user session if valid, throws error if not
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

/**
 * Get current user's credit balance
 * Throws error if not authenticated
 */
export async function getCurrentUserCredits() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getCreditBalance(session.user.id);
}

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
