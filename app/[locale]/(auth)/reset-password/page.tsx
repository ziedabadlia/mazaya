import { ResetPasswordCard } from "./_components/reset-password-card";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;

  return <ResetPasswordCard locale={locale} token={token ?? null} />;
}
