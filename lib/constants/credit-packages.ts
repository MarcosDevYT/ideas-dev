/**
 * Definición de paquetes de créditos y tipos relacionados
 */

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
    credits: 100,
    price: 5,
    description: "Perfecto para empezar",
  },
  STANDARD: {
    id: "STANDARD",
    name: "Estándar",
    credits: 500,
    price: 20,
    description: "Para uso regular",
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "Premium",
    credits: 1000,
    price: 35,
    popular: true,
    description: "Mejor relación calidad-precio",
  },
  ENTERPRISE: {
    id: "ENTERPRISE",
    name: "Empresarial",
    credits: 5000,
    price: 150,
    description: "Para equipos y proyectos grandes",
  },
};

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
  return TRANSACTION_TYPES[type as TransactionType] || type;
}

/**
 * Obtiene el icono para un tipo de transacción
 */
export function getTransactionIcon(type: string): string {
  switch (type) {
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
