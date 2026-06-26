import { Suspense } from "react";
import { auth } from "@/auth/index";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { OwnerAccountsContainer } from "./_components/owner-accounts-container";

export default async function OwnerAccountsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const t = await getTranslations("OwnerAccounts");

  return (
    <div className='flex flex-col h-full'>
      <div className='mb-6 flex flex-col gap-1'>
        <h2 className='text-2xl font-bold text-txt-primary'>{t("title")}</h2>
        <p className='text-sm text-txt-secondary'>{t("description")}</p>
      </div>

      {/*
       * useSearchParams() inside OwnerAccountsContainer requires the
       * component tree to be wrapped in <Suspense>. Without this Next.js
       * throws at build time in production. The fallback keeps the layout
       * stable while the client bundle hydrates.
       */}
      <Suspense
        fallback={
          <div className='flex-1 rounded-xl bg-surface-1 p-5 border border-border animate-pulse'>
            <div className='h-10 w-80 rounded-full bg-surface-3 mb-6' />
            <div className='h-10 w-full rounded-full bg-surface-3 mb-6' />
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='h-14 w-full rounded-lg bg-surface-3' />
              ))}
            </div>
          </div>
        }
      >
        <OwnerAccountsContainer />
      </Suspense>
    </div>
  );
}
