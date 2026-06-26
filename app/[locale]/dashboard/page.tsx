import { auth } from "@/auth/index";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { TrendingUp, ShoppingBag, Users, UtensilsCrossed } from "lucide-react";

export default async function DashboardIndexPage() {
  const session = await auth();
  const t = await getTranslations("Dashboard");

  if (!session?.user) redirect("/login");

  const { role, name } = session.user;

  if (role === "CASHIER") redirect("/dashboard/pos");
  if (role === "KITCHEN_STAFF") redirect("/dashboard/kitchen");

  const stats = [
    {
      label: t("stat_revenue"),
      value: "٠ ر.س",
      icon: TrendingUp,
      change: "0%",
      positive: true,
    },
    {
      label: t("stat_orders"),
      value: "٠",
      icon: ShoppingBag,
      change: "0%",
      positive: true,
    },
    {
      label: t("stat_customers"),
      value: "٠",
      icon: Users,
      change: "0%",
      positive: true,
    },
    {
      label: t("stat_items"),
      value: "٠",
      icon: UtensilsCrossed,
      change: "0%",
      positive: true,
    },
  ];

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-bold text-txt-primary'>
          {t("welcome", { name: name ?? "" })}
        </h1>
        <p className='text-sm text-txt-secondary'>
          {role === "OWNER" ? t("overview_owner") : t("overview_branch")}
        </p>
      </div>

      {/* Stat Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className='rounded-xl border border-border bg-surface-1 p-5 space-y-4 transition-colors hover:border-brand/20 hover:bg-surface-1'
          >
            <div className='flex items-center justify-between'>
              <span className='text-xs font-medium text-txt-muted'>
                {stat.label}
              </span>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand'>
                <stat.icon className='h-4 w-4' />
              </div>
            </div>
            <div className='space-y-1'>
              <p className='text-2xl font-bold text-txt-primary'>
                {stat.value}
              </p>
              <p
                className={`text-xs font-medium ${stat.positive ? "text-status-success" : "text-status-danger"}`}
              >
                {stat.change} {t("stat_vs_yesterday")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Placeholder */}
      <div className='rounded-xl border border-border bg-surface-1 p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-sm font-semibold text-txt-primary'>
            {t("chart_title")}
          </h2>
          <span className='rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand'>
            {t("chart_badge")}
          </span>
        </div>
        <div className='flex h-56 items-center justify-center rounded-lg border border-dashed border-border'>
          <p className='text-sm text-txt-muted'>{t("chart_placeholder")}</p>
        </div>
      </div>
    </div>
  );
}
