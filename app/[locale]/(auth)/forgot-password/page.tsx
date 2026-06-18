import { ForgotPasswordCard } from "./_components/forgot-password-card";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ForgotPasswordCard locale={locale} />;
}
