import { ForgotPasswordCard } from "./_components/forgot-password-card";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className='h-[100dvh] overflow-hidden bg-white flex items-center justify-center p-3 sm:p-4'>
      <ForgotPasswordCard locale={locale} />
    </div>
  );
}
