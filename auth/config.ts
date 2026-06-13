import type { NextAuthConfig } from "next-auth";
import { TenantStatus, UserRole } from "@prisma/client";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tenantId = user.tenantId;
        token.branchId = user.branchId;
        token.role = user.role as UserRole;
        token.tenantStatus = user.tenantStatus as TenantStatus
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.tenantId = token.tenantId as string;
        session.user.branchId = token.branchId as string | null;
        session.user.role = token.role as UserRole;
        session.user.tenantStatus = token.tenantStatus as TenantStatus
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;