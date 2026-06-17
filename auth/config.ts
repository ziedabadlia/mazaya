import type { NextAuthConfig } from "next-auth";
import type { TenantStatus, UserRole } from "@prisma/client";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: { tenant: true },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          tenantId: user.tenantId,
          branchId: user.branchId,
          role: user.role,
          tenantStatus: user.tenant.status,
        };
      },
    }),
  ],

  callbacks: {
    // ── SIGN-IN CALLBACK ──
    // Fires on every sign-in attempt. Tenant + Owner provisioning for new
    // Google users happens in the adapter's createUser() override (see
    // auth/index.ts) — NOT here. Doing it here would race the adapter:
    // by the time this callback runs, the adapter hasn't created the User
    // or linked the Account yet, so writing our own User row here causes
    // the adapter's own createUser/linkAccount calls to collide with it,
    // surfacing as OAuthAccountNotLinked even for brand-new emails.
    async signIn({ user, account }) {
      // Credentials sign-in: authorize() already validated everything
      if (account?.provider === "credentials") return true;

      // Google OAuth flow — only sync the profile image for users that
      // already exist. New-user provisioning is handled by the adapter.
      if (account?.provider === "google") {
        if (!user.email) return false;

        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser && user.image && existingUser.image !== user.image) {
            await db.user.update({
              where: { id: existingUser.id },
              data: { image: user.image },
            });
          }

          return true;
        } catch (error) {
          console.error("[Auth] Google signIn callback error:", error);
          return false;
        }
      }

      return true;
    },

    // ── JWT CALLBACK ──
    // Runs when a JWT is created or updated. We enrich the token with
    // our custom fields so they're available in the session.
    async jwt({ token, user, account, trigger }) {
      // Initial sign-in: `user` object is available
      if (user) {
        // For credentials, authorize() already returns our custom fields
        if (account?.provider === "credentials") {
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

        // For Google OAuth, look up our DB user to get the role/tenant
        if (account?.provider === "google" && user.email) {
          const dbUser = await db.user.findUnique({
            where: { email: user.email },
            include: { tenant: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.tenantId = dbUser.tenantId;
            token.branchId = dbUser.branchId ?? null;
            token.role = dbUser.role;
            token.tenantStatus = dbUser.tenant.status;
          }
        }
      }

      // On session refresh, re-fetch tenant status in case it changed
      // (e.g. admin activated the tenant while the user was logged in)
      if (trigger === "update" && token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          include: { tenant: true },
        });
        if (dbUser) {
          token.tenantStatus = dbUser.tenant.status;
          token.role = dbUser.role;
        }
      }

      return token;
    },

    // ── SESSION CALLBACK ──
    // Exposes our enriched token fields to the client-side session object.
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

  pages: {
    signIn: "/ar/login", // default locale; middleware will handle redirect
  },

  session: {
    strategy: "jwt",
  },
};
