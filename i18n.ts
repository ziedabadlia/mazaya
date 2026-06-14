import { getRequestConfig } from "next-intl/server";

export const locales = ["ar", "en"];
export const defaultLocale = "ar";

// Statically declare the translation file imports so Webpack doesn't guess paths
const messageLoaders: Record<string, () => Promise<{ default: any }>> = {
  ar: () => import("./messages/ar.json"),
  en: () => import("./messages/en.json"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate locale context alignment
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  // Fetch the concrete modules statically via dictionary mapping
  const loadMessages = messageLoaders[locale] || messageLoaders[defaultLocale];
  const messages = (await loadMessages()).default;

  return {
    locale,
    messages,
  };
});