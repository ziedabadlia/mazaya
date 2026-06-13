import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { authConfig } from "./config";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Fetch user context AND their relation status from Prisma in a single query
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            tenant: {
              select: { status: true }
            }
          }
        });

        if (!user || !user.password) return null;
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        // Return values to build the secure session cookie including the status
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          tenantId: user.tenantId,
          branchId: user.branchId,
          role: user.role,
          tenantStatus: user.tenant?.status || "PENDING",
        };
      },
    }),
  ],
});