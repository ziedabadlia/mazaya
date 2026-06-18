import Image from "next/image";

interface AuthCardProps {
  /** Current locale, drives dir="rtl/ltr" on the card */
  locale: string;
  /** Card heading (title) */
  title: string;
  /** Subtitle / description shown below the title */
  subtitle?: string;
  /** Error message to display in the red banner — pass null/undefined to hide */
  error?: string | null;
  /** Success message to display in the green banner — pass null/undefined to hide */
  successMessage?: string | null;
  children: React.ReactNode;
}

/**
 * Shared card shell used by every auth page.
 *
 * Styled to blend seamlessly with the white AuthLayout background —
 * no shadow, no border, no contrasting card bg. The visual separation
 * comes purely from the content inside, keeping the page feeling open.
 *
 * Extracts the three repeated pieces found in every auth card:
 *   1. Logo
 *   2. Title + subtitle heading block
 *   3. Error / success alert banners
 */
export function AuthCard({
  locale,
  title,
  subtitle,
  error,
  successMessage,
  children,
}: AuthCardProps) {
  const isRtl = locale === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className='w-full max-w-[400px] px-6 py-8 sm:px-8 sm:py-10'
    >
      {/* ── Logo ── */}
      <div className='flex justify-center mb-6'>
        <Image
          src='/logo.svg'
          alt='Mazaya'
          width={80}
          height={40}
          className='object-contain'
          priority
        />
      </div>

      {/* ── Heading ── */}
      <div className='mb-4 sm:mb-6 text-center'>
        <h1 className='text-lg sm:text-[22px] font-bold text-gray-900 leading-tight mb-1'>
          {title}
        </h1>
        {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className='mb-3 sm:mb-4 px-4 py-2.5 sm:py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center'>
          {error}
        </div>
      )}

      {/* ── Success banner ── */}
      {successMessage && (
        <div className='mb-3 sm:mb-4 px-4 py-2.5 sm:py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center'>
          {successMessage}
        </div>
      )}

      {/* ── Page-specific content ── */}
      {children}
    </div>
  );
}
