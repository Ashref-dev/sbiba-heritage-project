import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";
import { renderMagicLinkEmail } from "@/lib/email";
import { getUserById } from "@/lib/user";

// Define UserRole enum since it's not in Prisma schema
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.role) {
          session.user.role = token.role;
        }

        session.user.name = token.name;
        session.user.image = token.picture;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = UserRole.USER; // Default to USER role since it's not in the database

      return token;
    },
  },
  providers: [
    ...authConfig.providers,
    Nodemailer({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: Number(env.EMAIL_SERVER_PORT),
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
        secure: Number(env.EMAIL_SERVER_PORT) === 465,
      },
      from: env.EMAIL_FROM,
      // Custom email generation using React Email
      async sendVerificationRequest({ identifier, url, provider }) {
        const transport = await getTransport(provider.server);

        // Await the HTML rendering
        const html = await renderMagicLinkEmail({
          actionUrl: url,
          firstName: identifier.split("@")[0],
          mailType: "login",
          siteName: "Sbiba Heritage Project",
        });

        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: "Sign in to Sbiba Heritage Project",
          html,
        });
      },
    }),
  ],
  debug: false,
});

// Helper function to create Nodemailer transport
async function getTransport(server) {
  const nodemailer = await import("nodemailer");
  return nodemailer.createTransport(server);
}
