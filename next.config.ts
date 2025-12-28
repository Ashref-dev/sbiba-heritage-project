import path from "path";
import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

import "./env.mjs";

const nextConfig: NextConfig = {
  transpilePackages: ["@shadergradient/react"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@shadergradient/react": path.resolve(
        process.cwd(),
        "node_modules/@shadergradient/react/dist/index.mjs",
      ),
    };
    return config;
  },
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
        hostname: "s3.ashref.tn",
      },
      {
        protocol: "https",
        hostname: "nkwazi.s3.eu-west-2.amazonaws.com",
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
