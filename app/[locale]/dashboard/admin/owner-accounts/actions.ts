"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth/index";

async function guardSuperAdmin() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function updateTenantStatus(tenantId: string, status: "ACTIVE" | "SUSPENDED" | "PENDING") {
  await guardSuperAdmin();
  
  const updateData: any = { status };
  
  // If activating, set approvedAt if not already set
  if (status === "ACTIVE") {
    const tenant = await db.tenant.findUnique({ where: { id: tenantId }});
    if (tenant && !(tenant as any).approvedAt) {
      updateData.approvedAt = new Date();
    }
  }

  await db.tenant.update({
    where: { id: tenantId },
    data: updateData,
  });
}

export async function deleteTenant(tenantId: string) {
  await guardSuperAdmin();

  // Get all users associated with this tenant 
  const users = await db.user.findMany({ where: { tenantId } });
  
  // Hard delete users first if they only belong to this tenant (cascade fallback)
  for (const user of users) {
    if (user.role === "OWNER" || user.role === "BRANCH_MANAGER" || user.role === "KITCHEN_STAFF" || user.role === "CASHIER") {
      await db.user.delete({ where: { id: user.id } });
    }
  }

  // Delete the tenant itself
  await db.tenant.delete({
    where: { id: tenantId },
  });
}
