"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth/index";
import { revalidatePath } from "next/cache";

async function guardSuperAdmin() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function updateTenantStatus(
  tenantId: string,
  status: "ACTIVE" | "SUSPENDED" | "PENDING",
) {
  await guardSuperAdmin();

  const updateData: Record<string, unknown> = { status };

  // Set approvedAt the first time a tenant is activated
  if (status === "ACTIVE") {
    const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
    if (tenant && !tenant.approvedAt) {
      updateData.approvedAt = new Date();
    }
  }

  await db.tenant.update({
    where: { id: tenantId },
    data: updateData,
  });

  // FIX: revalidate the admin page so RSC cache is busted after mutations
  revalidatePath("/dashboard/admin/owner-accounts");
}

export async function deleteTenant(tenantId: string) {
  await guardSuperAdmin();

  /*
   * FIX: The Prisma schema has `onDelete: Cascade` on all relations that
   * descend from Tenant (users, branches, categories, orders, etc.).
   * Manually deleting users first before deleting the tenant was causing
   * double-delete errors because Prisma's cascade would try to delete them
   * again. A single `db.tenant.delete` is sufficient and correct.
   */
  await db.tenant.delete({
    where: { id: tenantId },
  });

  revalidatePath("/dashboard/admin/owner-accounts");
}
