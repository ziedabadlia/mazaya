import { LoginCard } from "./_components/login-card";
import { AnimatedMeshBackground } from "@/components/ui/animated-mesh-background";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <AnimatedMeshBackground />
      <LoginCard locale={locale} />
    </div>
  );
}