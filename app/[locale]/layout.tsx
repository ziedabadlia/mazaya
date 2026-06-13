import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import "@/app/globals.css";

// Load fonts for both languages
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoKufi = Noto_Kufi_Arabic({ subsets: ["arabic"], variable: "--font-noto-kufi" });

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Fetch the dictionary for the current language
  const messages = await getMessages();

  // Dynamically set RTL/LTR direction
  const direction = locale === "ar" ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? notoKufi.variable : inter.variable;

  return (
    <html lang={locale} dir={direction}>
      <body className={`${fontClass} font-sans bg-gray-50 text-gray-900 antialiased`}>
        {/* Wrap the app with the dictionary so Client Components can access translations */}
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}