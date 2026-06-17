import { RegisterCard } from "./_components/register-card";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className='min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4'>
      <RegisterCard locale={locale} />
    </div>
  );
}
