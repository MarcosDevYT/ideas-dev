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
      });

      if (!existingUser) return token;

      token.emailVerified = existingUser.emailVerified;

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.emailVerified = token.emailVerified as Date | null;
      }

      return session;
    },
  },
});
