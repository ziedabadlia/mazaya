import { auth } from "@/auth/index";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TenantTable } from "./_components/tenant-table";
import { Tenant } from "@prisma/client";

export default async function TenantsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const tenants = await db.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true } },
    },
  });

  const pending = tenants.filter((t: Tenant) => t.status === "PENDING");
  const rest = tenants.filter((t: Tenant) => t.status !== "PENDING");
  const sorted = [...pending, ...rest];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-bold text-txt-primary'>إدارة المطاعم</h1>
        <p className='text-sm text-txt-secondary'>
          مراجعة وتفعيل حسابات المطاعم المسجلة
        </p>
      </div>

      {/* Summary badges */}
      <div className='flex flex-wrap gap-3'>
        {[
          {
            label: "الكل",
            count: tenants.length,
            style: "border-border bg-surface-2 text-txt-secondary",
          },
          {
            label: "قيد المراجعة",
            count: pending.length,
            style: "border-gold/20 bg-gold/10 text-gold",
          },
          {
            label: "نشط",
            count: tenants.filter((t: Tenant) => t.status === "ACTIVE").length,
            style:
              "border-status-success/20 bg-status-success-bg text-status-success",
          },
          {
            label: "موقوف",
            count: tenants.filter((t: Tenant) => t.status === "SUSPENDED").length,
            style:
              "border-status-danger/20 bg-status-danger-bg text-status-danger",
          },
        ].map((badge) => (
          <div
            key={badge.label}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${badge.style}`}
          >
            <span>{badge.label}</span>
            <span className='rounded-full bg-current/10 px-1.5'>
              {badge.count}
            </span>
          </div>
        ))}
      </div>

      <TenantTable tenants={sorted} />
    </div>
  );
}
