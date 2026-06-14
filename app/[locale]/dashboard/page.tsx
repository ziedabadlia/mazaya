import { auth } from "@/auth/index";
import { redirect } from "next/navigation";

// Later, we will import our isolated feature component here:
// import { AnalyticsOverview } from "@/features/analytics/components/analytics-overview";

export default async function DashboardIndexPage() {
  const session = await auth();

  // Failsafe: No session means back to login
  if (!session?.user) {
    redirect("/login");
  }

  const { role, name } = session.user;

  // 1. Route strictly scoped roles directly to their isolated feature workspaces
  if (role === "CASHIER") {
    redirect("/dashboard/pos");
  }

  if (role === "KITCHEN_STAFF") {
    redirect("/dashboard/kitchen");
  }

  // 2. Owners and Branch Managers stay here to view the Analytics Feature
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900">
          مرحباً بك، {name}
        </h1>
        <p className="text-gray-500">
          إليك نظرة عامة على أداء {role === "OWNER" ? "مطاعمك" : "الفرع"} اليوم.
        </p>
      </div>

      {/* This is where we will inject the isolated feature component.
        <AnalyticsOverview tenantId={session.user.tenantId} /> 
      */}
      
      {/* Temporary Placeholder until we build the Analytics feature */}
      <div className="flex h-96 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
        <span className="text-gray-400 font-medium text-lg">
          [Analytics Feature Module Will Render Here]
        </span>
      </div>
    </div>
  );
}