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

// ============================================
// User Limits Policies
// ============================================

export const USER_LIMITS = {
  FREE: {
    MAX_PROJECTS: 3,
  },
  BASIC: {
    MAX_PROJECTS: 15,
  },
  PRO: {
    MAX_PROJECTS: 100,
  },
  PREMIUM: {
    MAX_PROJECTS: Infinity,
  },
} as const;

export const TRANSACTION_TYPES = {
  PURCHASE: "Compra",
  CONSUMPTION: "Consumo",
  MONTHLY_RESET: "Recarga Mensual",
  ADMIN_ADJUSTMENT: "Ajuste Admin",
} as const;

export type TransactionType = keyof typeof TRANSACTION_TYPES;

/**
 * Obtiene el nombre legible de un tipo de transacción
 */
export function getTransactionTypeName(type: string): string {
  const upperType = type.toUpperCase();
  return TRANSACTION_TYPES[upperType as TransactionType] || type;
}

/**
 * Obtiene el icono para un tipo de transacción
 */
export function getTransactionIcon(type: string): string {
  switch (type.toUpperCase()) {
    case "PURCHASE":
      return "💰";
    case "CONSUMPTION":
      return "💬";
    case "MONTHLY_RESET":
      return "🔄";
    case "ADMIN_ADJUSTMENT":
      return "🔧";
    default:
      return "📝";
  }
}
