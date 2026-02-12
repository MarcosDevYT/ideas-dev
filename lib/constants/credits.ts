// ============================================
// Credit System Constants
// ============================================

export const CREDIT_COSTS = {
  IDEA_GENERATION: 1, // Cost per idea generation request
  PROJECT_MESSAGE: 1, // Cost per message in project chat
} as const;

export const CREDIT_LIMITS = {
  FREE_TIER: 10, // Monthly credits for free users
  PAID_TIER: 100, // Monthly credits for paid subscribers
  ADMIN: -1, // Unlimited for admins
} as const;

export const CREDIT_MESSAGES = {
  INSUFFICIENT:
    "You do not have enough credits. Please upgrade your plan or wait for your monthly reset.",
  CONSUMED: "Credit consumed successfully",
  RESET: "Your credits have been reset for this month",
  ADMIN_UNLIMITED: "You have unlimited credits as an administrator",
} as const;
