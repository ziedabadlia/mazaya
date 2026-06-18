import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
     * White full-screen background. position:relative so the switcher's
     * absolute position is scoped to this container.
     */
    <div className='relative min-h-screen bg-white flex items-center justify-center p-4'>
      {/*
       * Language switcher — always physically top-right.
       * top-4 / left-4 are physical properties, not logical, so they
       * never flip in RTL. The switcher itself also carries dir="ltr"
       * so its internal layout is always left-to-right.
       */}
      <div className='absolute top-4 left-4 z-50'>
        <LanguageSwitcher />
      </div>

      {children}
    </div>
  );
}
