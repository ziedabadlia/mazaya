import { LoginCard } from "./_components/login-card";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className='min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4'>
      <LoginCard locale={locale} />
    </div>
  );
}
