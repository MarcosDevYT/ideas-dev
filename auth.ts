import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./lib/zodSchemas/authSchema";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      authorize: async (credentials) => {
        const { success, data } = loginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Credenciales inválidas");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado");
        }

        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          role: true,
          stack: true,
          planCredits: true,
          extraCredits: true,
          subscription: true,
          _count: {
            select: {
              ideaChats: true,
              projects: true,
            },
          },
        },
      });

      if (!existingUser) return token;

      // Basic fields
      token.email = existingUser.email;
      token.emailVerified = existingUser.emailVerified;

      // User configuration
      token.role = existingUser.role;
      token.stack = existingUser.stack;

      // Credits (Calculated virtual field)
      token.planCredits = existingUser.planCredits;
      token.extraCredits = existingUser.extraCredits;
      token.credits =
        (existingUser.planCredits || 0) + (existingUser.extraCredits || 0);

      // Admin check (Virtual field based on email)
      token.isAdmin = existingUser.email === process.env.ADMIN_EMAIL;

      // Statistics
      token.ideaChatsCount = existingUser._count.ideaChats;
      token.projectsCount = existingUser._count.projects;

      // Subscription
      token.subscription = existingUser.subscription;

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.emailVerified = token.emailVerified as Date | null;

        // User configuration
        session.user.role = token.role as string | null | undefined;
        session.user.stack = (token.stack as string[]) || [];

        // Credits
        session.user.planCredits = (token.planCredits as number) || 0;
        session.user.extraCredits = (token.extraCredits as number) || 0;
        session.user.credits = (token.credits as number) || 0;
        session.user.isAdmin = (token.isAdmin as boolean) || false;

        // Statistics
        session.user.ideaChatsCount = (token.ideaChatsCount as number) || 0;
        session.user.projectsCount = (token.projectsCount as number) || 0;

        // Subscription
        session.user.subscription = token.subscription as any;
      }

      return session;
    },
  },
});
