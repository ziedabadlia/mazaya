import { auth } from "@/auth/index";
import { redirect } from "next/navigation";
import { dashboardNavItems } from "@/config/dashboard-nav";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Failsafe redirect if the middleware somehow allows an unauthenticated request
  if (!session?.user) {
    redirect("/login");
  }

  // Filter the navigation matrix based on the user's secure role
  const userRole = session.user.role;
  const permittedNavItems = dashboardNavItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 md:flex-row" dir="rtl">
      {/* Inject the filtered navigation tree into the client component.
        A Kitchen Staff member will literally never receive the code or links for the Owner settings.
      */}
      <DashboardSidebar items={permittedNavItems} user={session.user} />

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}