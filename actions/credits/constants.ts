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
// Credit Packages
// ============================================

export type PackageId = "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE";

export interface CreditPackage {
  id: PackageId;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  description: string;
}

export const CREDIT_PACKAGES: Record<PackageId, CreditPackage> = {
  BASIC: {
    id: "BASIC",
    name: "Básico",
    credits: 50,
    price: 4,
    description: "Perfecto para empezar",
  },
  STANDARD: {
    id: "STANDARD",
    name: "Estándar",
    credits: 100,
    price: 7,
    description: "Para uso regular",
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "Premium",
    credits: 250,
    price: 15,
    popular: true,
    description: "Mejor relación calidad-precio",
  },
  ENTERPRISE: {
    id: "ENTERPRISE",
    name: "Empresarial",
    credits: 500,
    price: 25,
    description: "Para equipos y proyectos grandes",
  },
};

// ============================================
// Subscription Plans (NUEVO)
// ============================================

export type PlanId = "FREE" | "BASIC" | "PRO" | "PREMIUM";

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  price: string;
  credits: string;
  amount: number;
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: Record<PlanId, SubscriptionPlan> = {
  FREE: {
    id: "FREE",
    name: "Gratis",
    price: "$0",
    credits: "50 créditos/mes",
    amount: 50,
    features: [
      "Ideas ilimitadas (Chat sin memoria)",
      "Hasta 3 proyectos vivos",
      "Modelos de IA estándar",
    ],
  },
  BASIC: {
    id: "BASIC",
    name: "Básico",
    price: "$9",
    credits: "250 créditos/mes",
    amount: 250,
    features: [
      "Ideas ilimitadas",
      "Hasta 15 proyectos vivos",
      "Soporte estándar",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    price: "$19",
    credits: "500 créditos/mes",
    amount: 500,
    popular: true,
    features: [
      "Ideas ilimitadas",
      "100 proyectos vivos",
      "Contexto extendido con memoria larga",
      "Soporte prioritario",
    ],
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "Premium",
    price: "$29",
    credits: "1000 créditos/mes",
    amount: 1000,
    features: [
      "Ideas ilimitadas",
      "Proyectos vivos ilimitados",
      "Contexto extendido con memoria larga",
      "Soporte prioritario",
    ],
  },
};

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
