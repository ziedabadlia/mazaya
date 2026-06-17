import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth/index";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  const where = {
    slug: { not: "mazaya-system" }, // exclude super admin tenant
    ...(status && status !== "ALL" ? { status: status as any } : {}),
    ...(search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" as any } },
        { slug: { contains: search, mode: "insensitive" as any } },
      ],
    } : {}),
  };

  const [tenants, total] = await Promise.all([
    db.tenant.findMany({
      where,
      orderBy: [
        { status: "asc" }, // PENDING first
        { createdAt: "desc" },
      ],
      include: { _count: { select: { users: true } } },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.tenant.count({ where }),
  ]);

  return NextResponse.json({ tenants, total, page, limit });
}