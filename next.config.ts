import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

import "./env.mjs";

const nextConfig: NextConfig = {
  output: "standalone",

  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "nkwazi.s3.eu-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "enlace-freelance.s3.eu-central-1.amazonaws.com",
      },
    ],
  },

  serverExternalPackages: [
    "@prisma/client",
    "@react-email/components",
    "@react-email/tailwind",
  ],
};

module.exports = withContentlayer(nextConfig);
