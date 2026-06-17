import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "@/app/globals.css";

// Load fonts for both languages
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexArabic = IBM_Plex_Sans_Arabic({ 
  subsets: ["arabic"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic" 
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = await getMessages();

  const direction = locale === "ar" ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? ibmPlexArabic.variable : inter.variable;

  return (
    <html lang={locale} dir={direction}>
      <body className={`${fontClass} font-sans bg-gray-50 text-gray-900 antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}