import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { UserRole, TenantStatus } from "@prisma/client";

/**
 * Edge-safe NextAuth instance — used ONLY by middleware.ts
 * No PrismaAdapter, no bcrypt, no Node built-ins.
 * All it needs to do is read/validate the JWT cookie.
 */
export const { auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({ credentials: {} }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account?.provider === "credentials") {
        const u = user as typeof user & {
          tenantId: string;
          branchId: string | null;
          role: UserRole;
          tenantStatus: TenantStatus;
        };
        token.id = u.id!;
        token.tenantId = u.tenantId;
        token.branchId = u.branchId ?? null;
        token.role = u.role;
        token.tenantStatus = u.tenantStatus;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.tenantId = token.tenantId as string;
        session.user.branchId = (token.branchId as string | null) ?? null;
        session.user.role = token.role as UserRole;
        session.user.tenantStatus = token.tenantStatus as TenantStatus;
      }
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-change-in-production",
});
