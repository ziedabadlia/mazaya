import { TenantStatus, UserRole } from "@prisma/client";
import DefaultAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    tenantId: string;
    branchId: string | null;
    role: UserRole;
    tenantStatus: TenantStatus // <-- Explicit string union
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tenantId: string;
    branchId: string | null;
    role: UserRole;
    tenantStatus: TenantStatus // <-- Explicit string union
  }
}