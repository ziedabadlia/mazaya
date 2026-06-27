import { auth } from "@/auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const protectedRoutes = [
  "/dashboard",
  "/pos",
  "/kitchen",
  "/branches",
  "/menu",
  "/staff",
  "/settings",
];
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export default auth(function middleware(req: NextAuthRequest) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";

  const isProtected = protectedRoutes.some((r) =>
    pathnameWithoutLocale.startsWith(r),
  );
  const isAuthRoute = authRoutes.some((r) =>
    pathnameWithoutLocale.startsWith(r),
  );
  const isWaitingRoom = pathnameWithoutLocale.startsWith("/waiting-room");

  const locale = pathname.split("/")[1] || defaultLocale;

  // 1. Guest root redirect (force to English login)
  const isRoot = pathnameWithoutLocale === "/" || pathnameWithoutLocale === "" || pathname === "/en" || pathname === "/ar";
  if (!session && isRoot) {
    return NextResponse.redirect(new URL("/en/login", req.url));
  }

  // 1. Unauthenticated — redirect to login
  if (isProtected && !session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // 2. Authenticated but tenant PENDING — waiting room
  if (session && isProtected && session.user?.tenantStatus === "PENDING") {
    return NextResponse.redirect(new URL(`/${locale}/waiting-room`, req.url));
  }

  // 3. Authenticated + ACTIVE — block waiting room access
  if (session && isWaitingRoom && session.user?.tenantStatus === "ACTIVE") {
    if (session.user?.role === "SUPER_ADMIN") {
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard/admin/owner-accounts`, req.url),
      );
    }
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  // 4. Root dashboard redirect for Super Admin
  if (
    session &&
    pathnameWithoutLocale === "/dashboard" &&
    session.user?.role === "SUPER_ADMIN"
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/dashboard/admin/owner-accounts`, req.url),
    );
  }

  // 5. Already logged in — block auth pages
  if (session && isAuthRoute) {
    if (session.user?.tenantStatus === "PENDING") {
      return NextResponse.redirect(new URL(`/${locale}/waiting-room`, req.url));
    }
    if (session.user?.role === "SUPER_ADMIN") {
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard/admin/owner-accounts`, req.url),
      );
    }
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }


  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
