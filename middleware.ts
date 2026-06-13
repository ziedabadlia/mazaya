import NextAuth from "next-auth";
import { authConfig } from "@/auth/config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isLoginRoute = nextUrl.pathname === "/login";

  // Redirect unauthenticated traffic back to login page
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Redirect logged-in users away from the login screen straight to dashboard
  if (isLoginRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Handle cross-role dashboard protections
  if (isLoggedIn && req.auth) {
    const userRole = req.auth.user.role;

    // Block non-owners from getting into deep owner metrics
    if (nextUrl.pathname.startsWith("/dashboard/owner") && userRole !== "OWNER") {
      return NextResponse.redirect(new URL("/dashboard/unauthorized", nextUrl));
    }

    // Block non-kitchen staff from sneaking into Kitchen Display interfaces
    if (nextUrl.pathname.startsWith("/dashboard/kitchen") && userRole !== "KITCHEN_STAFF" && userRole !== "OWNER") {
      return NextResponse.redirect(new URL("/dashboard/unauthorized", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  // Execute middleware guards on dashboards and auth loops, bypassing asset chunks
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};