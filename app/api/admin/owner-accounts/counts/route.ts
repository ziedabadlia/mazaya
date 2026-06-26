import { NextResponse } from "next/server";
import { auth } from "@/auth/index";
import { db } from "@/lib/db";

/**
 * GET /api/admin/owner-accounts/counts
 *
 * Returns the total counts for each status — always unfiltered so the chips
 * reflect the true state of the database, not whatever filter the admin has
 * currently applied. This endpoint is fetched independently from the table
 * data so the chips never flicker when filter params change.
 */
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = { slug: { not: "mazaya-system" } };

  const [all, pending, active, suspended] = await Promise.all([
    db.tenant.count({ where: base }),
    db.tenant.count({ where: { ...base, status: "PENDING" } }),
    db.tenant.count({ where: { ...base, status: "ACTIVE" } }),
    db.tenant.count({ where: { ...base, status: "SUSPENDED" } }),
  ]);

  return NextResponse.json({
    ALL: all,
    PENDING: pending,
    ACTIVE: active,
    SUSPENDED: suspended,
  });
}
