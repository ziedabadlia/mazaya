import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { auth, signOut } from "@/auth/index";
import { redirect } from "next/navigation";

export default async function WaitingRoomPage() {
  const session = await auth();
  const t = useTranslations("Auth");

  // If they somehow bypass the middleware but are active, send them back to the dashboard
  if (session?.user?.tenantStatus === "ACTIVE") {
    redirect("/dashboard");
  }

  // Server action handler to allow them to securely log out from the waiting screen
  async function handleLogout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center">
        
        {/* Animated Icon Container */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
          <Clock className="h-8 w-8 animate-pulse" />
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("waiting_room_title")}
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t("waiting_room_desc")}
          </p>
          <p className="text-xs text-gray-400 font-medium pt-2">
            {t("waiting_room_support")}
          </p>
        </div>

        {/* Separation Rule */}
        <hr className="border-gray-100" />

        {/* Dynamic User Profile Detail */}
        {session?.user && (
          <div className="rounded-lg bg-gray-50 p-3 text-start flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs text-gray-400">المستخدم / User</p>
              <p className="text-sm font-medium text-gray-700 truncate">{session.user.email}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 border border-amber-200">
              {session.user.tenantStatus}
            </span>
          </div>
        )}

        {/* Action Button */}
        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            تسجيل الخروج / Sign Out
          </button>
        </form>

      </div>
    </div>
  );
}