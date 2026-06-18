import { RegisterCard } from "./_components/register-card";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <RegisterCard locale={locale} />;
}
