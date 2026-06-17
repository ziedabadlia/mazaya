"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth/index";

async function guardSuperAdmin() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function activateTenant(tenantId: string) {
  await guardSuperAdmin();
  await db.tenant.update({
    where: { id: tenantId },
    data: { status: "ACTIVE" },
  });
  revalidatePath("/dashboard/admin/tenants");
}

export async function suspendTenant(tenantId: string) {
  await guardSuperAdmin();
  await db.tenant.update({
    where: { id: tenantId },
    data: { status: "SUSPENDED" },
  });
  revalidatePath("/dashboard/admin/tenants");
}
