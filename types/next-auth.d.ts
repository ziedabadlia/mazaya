import NextAuth, { type DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    tenantId: string;
    branchId: string | null;
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      tenantId: string;
      branchId: string | null;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    tenantId: string;
    branchId: string | null;
    role: UserRole;
  }
}