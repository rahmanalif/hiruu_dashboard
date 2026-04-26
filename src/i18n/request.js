import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This will be used for both static and dynamic rendering
  let locale = await requestLocale;

  // Define supported locales
  const locales = ['en', 'el'];

  // Default to 'en' if the locale is not supported
  if (!locales.includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
