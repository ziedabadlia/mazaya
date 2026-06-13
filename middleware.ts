import { auth } from "@/auth/index";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always", 
});

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.includes("/dashboard");
  const isWaitingRoomRoute = pathname.includes("/waiting-room");

  // 1. Unauthenticated Security Gateway
  if (!isLoggedIn && isDashboardRoute) {
    const loginUrl = new URL("/login", req.nextUrl);
    return Response.redirect(loginUrl);
  }

  // 2. Provisioning & Operational Status Interception
  // If user is logged in, has a standard operational role, but tenant is pending approval
  if (isLoggedIn && isDashboardRoute && user?.role !== "SUPER_ADMIN") {
    // Assuming you attach tenantStatus to the session token in auth options configuration
    if (user?.tenantStatus === "PENDING") {
      const waitingRoomUrl = new URL("/waiting-room", req.nextUrl);
      return Response.redirect(waitingRoomUrl);
    }
  }

  // 3. Prevent users from manually visiting the waiting room if they are already active
  if (isLoggedIn && isWaitingRoomRoute && user?.tenantStatus === "ACTIVE") {
    const dashboardUrl = new URL("/dashboard", req.nextUrl);
    return Response.redirect(dashboardUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};