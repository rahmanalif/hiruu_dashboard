import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'el'],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Don't show the locale in the URL for the default language
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|el)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
