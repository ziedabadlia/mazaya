import { getTranslations } from "next-intl/server";
import { Clock } from "lucide-react";
import { auth, signOut } from "@/auth/index";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";

export default async function WaitingRoomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations("Auth");

  if (session?.user?.tenantStatus === "ACTIVE") {
    redirect("/dashboard");
  }

  const statusLabel =
    session?.user?.tenantStatus === "PENDING"
      ? t("status_pending")
      : session?.user?.tenantStatus === "SUSPENDED"
        ? t("status_suspended")
        : session?.user?.tenantStatus;

  async function handleLogout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <AuthCard locale={locale} title={t("waiting_room_title")}>
      {/* Clock badge */}
      <div className='flex justify-center mb-5'>
        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-green-50 ring-1 ring-green-100'>
          <Clock className='h-7 w-7 animate-pulse text-[#22c55e]' />
        </div>
      </div>

      {/* Description */}
      <div className='mb-6 text-center space-y-2'>
        <p className='text-sm text-gray-500 leading-relaxed'>
          {t("waiting_room_desc")}
        </p>
        <p className='text-xs font-medium text-gray-400 pt-1'>
          {t("waiting_room_support")}
        </p>
      </div>

      {/* Divider */}
      <div className='border-t border-gray-200 mb-5' />

      {/* User info */}
      {session?.user && (
        <div className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 mb-5'>
          <div className='truncate pe-3'>
            <p className='text-xs text-gray-400'>
              {t("waiting_room_user_label")}
            </p>
            <p className='truncate text-sm font-medium text-gray-900' dir='ltr'>
              {session.user.email}
            </p>
          </div>
          <span className='inline-flex shrink-0 items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-[#16a34a]'>
            {statusLabel}
          </span>
        </div>
      )}

      {/* Logout */}
      <form action={handleLogout}>
        <button
          type='submit'
          className='w-full h-10 rounded-lg border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 active:bg-red-100 text-sm font-semibold text-gray-600 transition-colors flex items-center justify-center gap-2'
        >
          {t("logout_button")}
        </button>
      </form>
    </AuthCard>
  );
}
