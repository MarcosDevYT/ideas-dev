"use server";

import { auth } from "@/auth";
import { getCreditHistory, addCredits } from "@/lib/services/credit-service";
import { isCurrentUserAdmin } from "@/lib/middleware/credit-middleware";
import { getCreditBalance } from "@/lib/services/credit-service";

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

    return {
      success: true,
      data: { newBalance },
    };
  } catch (error) {
    console.error("Error adding credits:", error);
    return { error: "Failed to add credits" };
  }
}
