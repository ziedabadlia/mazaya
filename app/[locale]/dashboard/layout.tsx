import { auth } from "@/auth/index";
import { redirect } from "next/navigation";
import { dashboardNavItems } from "@/config/dashboard-nav";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = session.user.role;
  const permittedNavItems = dashboardNavItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    /*
     * FIX: removed the hardcoded dir="rtl" that was overriding the
     * dir set on <html> by the root locale layout. Direction is now
     * inherited from <html dir="rtl|ltr"> which is set correctly per
     * locale in app/[locale]/layout.tsx.
     */
    <div className='flex h-screen w-full flex-col bg-surface-0 md:flex-row'>
      <DashboardSidebar items={permittedNavItems} user={session.user} />

      <div className='flex flex-1 flex-col overflow-hidden'>
        <DashboardHeader />
        <main className='flex-1 overflow-y-auto p-4 md:p-8 bg-surface-0'>
          {children}
        </main>
      </div>
    </div>
  );
}
