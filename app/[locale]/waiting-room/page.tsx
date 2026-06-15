import { getTranslations } from "next-intl/server";
import { Clock } from "lucide-react";
import { auth, signOut } from "@/auth/index";
import { redirect } from "next/navigation";
import { AnimatedMeshBackground } from "@/components/ui/animated-mesh-background";

export default async function WaitingRoomPage() {
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
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8'>
      <AnimatedMeshBackground />

      <div className='relative z-10 w-full max-w-md'>
        {/* Top accent glow bar */}
        <div className='absolute -top-px start-6 end-6 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent' />

        <div className='space-y-7 rounded-xl border border-border bg-gradient-to-b from-surface-1 to-surface-1/60 p-8 shadow-2xl shadow-black/50 backdrop-blur-sm sm:p-9'>
          {/* Logo */}
          <div className='flex flex-col items-center space-y-5 text-center'>
            <div className='flex h-24 w-24 items-center justify-center'>
              <img
                src='/mazaya-logo.png'
                alt='Mazaya'
                className='h-full w-full object-contain drop-shadow-lg'
              />
            </div>

            {/* Animated clock badge */}
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/20'>
              <Clock className='h-7 w-7 animate-pulse text-gold' />
            </div>

            <div className='space-y-2'>
              <h1 className='text-2xl font-bold tracking-tight text-txt-primary'>
                {t("waiting_room_title")}
              </h1>
              <p className='text-sm leading-relaxed text-txt-secondary'>
                {t("waiting_room_desc")}
              </p>
              <p className='pt-1 text-xs font-medium text-txt-muted'>
                {t("waiting_room_support")}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className='h-px bg-border' />

          {/* User info */}
          {session?.user && (
            <div className='flex items-center justify-between rounded-lg border border-border bg-surface-2/60 px-4 py-3'>
              <div className='truncate pe-3'>
                <p className='text-xs text-txt-muted'>
                  {t("waiting_room_user_label")}
                </p>
                <p
                  className='truncate text-sm font-medium text-txt-primary'
                  dir='ltr'
                >
                  {session.user.email}
                </p>
              </div>
              <span className='inline-flex shrink-0 items-center rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold'>
                {statusLabel}
              </span>
            </div>
          )}

          {/* Logout */}
          <form action={handleLogout}>
            <button
              type='submit'
              className='flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-4 py-3 text-sm font-semibold text-txt-secondary transition-colors hover:border-status-danger/40 hover:bg-status-danger-bg hover:text-status-danger focus:outline-none focus:ring-2 focus:ring-status-danger/20'
            >
              {t("logout_button")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
