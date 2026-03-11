import { Subscription } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      emailVerified: Date | null;
      // User configuration
      role?: string | null;
      stack: string[];
      // Credits
      planCredits: number;
      extraCredits: number;
      credits: number;
      isAdmin: boolean;
      // Statistics
      ideaChatsCount: number;
      projectsCount: number;
      // Subscription
      subscription?: (Subscription & { plan?: { name: string } | null }) | null;
      // Authenticated with local password
      hasPassword?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    sub: string;
    emailVerified?: Date | null;
    // User configuration
    role?: string | null;
    stack?: string[];
    // Credits
    planCredits?: number;
    extraCredits?: number;
    credits?: number;
    isAdmin?: boolean;
    projectsCount?: number;
    // Statistics
    ideaChatsCount?: number;
    // Subscription
    subscription?: (Subscription & { plan?: { name: string } | null }) | null;
    // Password
    hasPassword?: boolean;
  }
}
