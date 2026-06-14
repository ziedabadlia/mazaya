import { RegisterCard } from "./_components/register-card";

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-0 px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient gold glow accents */}
      <div className="pointer-events-none absolute -top-40 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 end-0 h-80 w-80 rounded-full bg-gold-dim/10 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(201,146,42,0.08)_1px,transparent_0)] [background-size:32px_32px] opacity-30" />

      <RegisterCard locale={locale} />
    </div>
  );
}