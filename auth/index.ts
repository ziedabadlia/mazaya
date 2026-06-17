import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AdapterUser } from "@auth/core/adapters";
import { authConfig } from "./config";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

const baseAdapter = PrismaAdapter(db);

// ── ADAPTER OVERRIDE: createUser ──
// Our `User` model requires `tenantId` and `role` (NOT NULL), but the
// stock PrismaAdapter only knows about Auth.js's own fields (name, email,
// image, emailVerified). When a brand-new Google user signs in, Auth.js
// calls adapter.createUser() directly — there is no signIn-callback hook
// that runs *before* this insert, so provisioning the Tenant here, in the
// same call, is the only race-free place to do it. (Provisioning inside
// the `signIn` callback instead would run concurrently with the adapter's
// own createUser/linkAccount calls and surfaces as OAuthAccountNotLinked.)
//
// Note: the incoming `user` param is typed as our project's augmented
// AdapterUser (which includes tenantId/branchId/role/tenantStatus), but
// at runtime Auth.js has not populated those fields yet — that's exactly
// what this function is responsible for creating. Only `id`, `name`,
// `email`, `image`, `emailVerified` are meaningful on the incoming value.
const adapter = {
  ...baseAdapter,
  async createUser(user: AdapterUser): Promise<AdapterUser> {
    const name = user.name ?? user.email.split("@")[0];
    const baseSlug = slugify(name);

    const existingTenant = await db.tenant.findUnique({
      where: { slug: baseSlug },
    });
    const slug = existingTenant ? `${baseSlug}-${Date.now()}` : baseSlug;

    const created = await db.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name,
          slug,
          status: "PENDING",
        },
      });

      // Use the id Auth.js already generated for this user — it will
      // reuse this same id immediately after to link the Account row,
      // so persisting a different (Prisma-generated) id here would
      // silently break that link.
      return tx.user.create({
        data: {
          id: user.id,
          email: user.email,
          name,
          image: user.image ?? null,
          emailVerified: user.emailVerified ?? new Date(),
          role: "OWNER",
          tenantId: tenant.id,
          password: null,
        },
      });
    });

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      image: created.image,
      emailVerified: created.emailVerified,
      tenantId: created.tenantId,
      branchId: created.branchId,
      role: created.role,
      tenantStatus: "PENDING",
    };
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  // The Prisma adapter handles persisting OAuth accounts and sessions.
  // createUser is overridden above to provision a Tenant atomically;
  // everything else (linkAccount, getUserByAccount, sessions, etc.)
  // uses the stock Prisma adapter behavior.
  adapter,

  ...authConfig,

  // Override secret with environment variable; fallback for dev only.
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-change-in-production",
});
