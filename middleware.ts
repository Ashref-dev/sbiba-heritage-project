import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// This middleware uses only the Edge-compatible configuration
// It does NOT include the Email provider with nodemailer
export const middleware = NextAuth(authConfig).auth;

// See https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};