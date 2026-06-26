import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/index";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "desc"; // desc = newest first
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  /**
   * dateType controls which date field is used for range filtering:
   *   "submission" → createdAt  (when the owner submitted their registration)
   *   "approval"   → approvedAt (when a super-admin activated the account)
   */
  const dateType = searchParams.get("dateType") || "submission";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  // ── Date filter ──────────────────────────────────────────────────────────
  // The field to filter on is determined by dateType.
  // We always filter on a single field — no OR across both dates — because
  // the user has explicitly chosen which date they care about.
  let dateFilter = {};
  if (dateFrom || dateTo) {
    const field = dateType === "approval" ? "approvedAt" : "createdAt";
    const range: Record<string, Date> = {};
    if (dateFrom) range.gte = new Date(dateFrom);
    if (dateTo) {
      // Include the entire end day by going to 23:59:59.999
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      range.lte = end;
    }
    dateFilter = { [field]: range };
  }

  const where = {
    slug: { not: "mazaya-system" }, // exclude super admin tenant
    ...(status !== "ALL" ? { status: status as any } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as any } },
            {
              users: {
                some: {
                  role: "OWNER" as any,
                  OR: [
                    {
                      name: { contains: search, mode: "insensitive" as any },
                    },
                    {
                      email: { contains: search, mode: "insensitive" as any },
                    },
                  ],
                },
              },
            },
          ],
        }
      : {}),
    ...dateFilter,
  };

  const [tenants, total, pendingCount, activeCount, suspendedCount, allCount] =
    await Promise.all([
      db.tenant.findMany({
        where,
        orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
        include: {
          users: {
            where: { role: "OWNER" as any },
            select: { id: true, name: true, email: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.tenant.count({ where }),
      db.tenant.count({
        where: { slug: { not: "mazaya-system" }, status: "PENDING" },
      }),
      db.tenant.count({
        where: { slug: { not: "mazaya-system" }, status: "ACTIVE" },
      }),
      db.tenant.count({
        where: { slug: { not: "mazaya-system" }, status: "SUSPENDED" },
      }),
      db.tenant.count({ where: { slug: { not: "mazaya-system" } } }),
    ]);

  return NextResponse.json({
    tenants,
    total,
    page,
    limit,
    counts: {
      ALL: allCount,
      PENDING: pendingCount,
      ACTIVE: activeCount,
      SUSPENDED: suspendedCount,
    },
  });
}
