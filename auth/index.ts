import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Provide a fallback secret for development so the auth library initializes
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "dev-secret",
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { db } = await import("@/lib/db");
        const bcryptModule = await import("bcrypt");
        const bcrypt = bcryptModule.default ?? bcryptModule;

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