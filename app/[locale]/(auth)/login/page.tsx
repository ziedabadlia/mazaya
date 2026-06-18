import { LoginCard } from "./_components/login-card";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LoginCard locale={locale} />;
}
