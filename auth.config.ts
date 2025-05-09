import { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { env } from "@/env.mjs";

// This config is used in Edge environments (like middleware)
// It should NOT include nodemailer/Email provider
export default {
  providers: [
    // Google({
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,

    // }),
   
  ],
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
} satisfies NextAuthConfig;
