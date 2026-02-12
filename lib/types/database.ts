import {
  User,
  IdeaChat,
  Project,
  Message,
  Subscription,
  CreditTransaction,
} from "@prisma/client";

// ============================================
// Extended Types with Relations
// ============================================

export type UserWithRelations = User & {
  ideaChats?: IdeaChat[];
  projects?: Project[];
  subscription?: Subscription | null;
  creditTransactions?: CreditTransaction[];
};

export type IdeaChatWithMessages = IdeaChat & {
  messages: Message[];
  user?: User;
};

export type ProjectWithMessages = Project & {
  messages: Message[];
  user?: User;
};

// ============================================
// Enums and Constants
// ============================================

export type MessageRole = "system" | "user" | "assistant";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "incomplete"
  | "trialing"
  | "incomplete_expired"
  | "unpaid";

export type CreditTransactionType =
  | "consumption" // Consumo de créditos por uso de IA
  | "monthly_reset" // Recarga mensual automática
  | "purchase" // Compra de créditos
  | "subscription" // Créditos por suscripción
  | "admin_adjustment"; // Ajuste manual por admin

export type UserRole =
  | "Frontend Dev"
  | "Backend Dev"
  | "Full Stack"
  | "Student"
  | "Tech Lead"
  | "DevOps"
  | "Mobile Dev"
  | "Other";

// ============================================
// API Response Types
// ============================================

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface IdeaGenerationRequest {
  systemMessages: ChatMessage[];
  userMessage: ChatMessage;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

// ============================================
// Credit System Types
// ============================================

export interface CreditBalance {
  available: number;
  isAdmin: boolean;
  resetAt: Date;
}

export interface CreditConsumption {
  success: boolean;
  remaining?: number;
  error?: string;
}
