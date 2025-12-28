import "@/styles/globals.css";

import { type Metadata } from "next";
import {
  fontGeist,
  fontHeading,
  fontPlayfair,
  fontSans,
  fontUrban,
} from "@/assets/fonts";
import { auth } from "@/auth";
import { Toaster } from "sonner";

import { prisma } from "@/lib/db";
import { ToastProvider } from "@/components/ui/toast";
import Footer from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export const metadata: Metadata = {
  title: "Sbiba Heritage Project",
  description:
    "Explore the rich heritage of Sbiba - where ancient Roman and Berber civilizations converge. Discover archaeological treasures, cultural traditions, and the fascinating history of this historic North African crossroads.",
  openGraph: {
    type: "website",
    title: "Sbiba Heritage Project",
    description:
      "Discover the enchanting blend of Roman heritage and Berber culture in the heart of Kasserine. Explore archaeological treasures and cultural traditions in this historic North African crossroads.",
    url: "https://sbiba-heritage.tn",
    siteName: "Sbiba Heritage Project",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Sbiba Heritage Project - Ancient Roman and Berber Heritage",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sbiba Heritage Project",
    description:
      "Discover the enchanting blend of Roman heritage and Berber culture in the heart of Kasserine",
    images: ["/og.jpg"],
    creator: "@sbibaheritage",
  },
  icons: [
    {
      rel: "icon",
      url: "/favicon-96x96.png",
      sizes: "96x96",
      type: "image/png",
    },
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "shortcut icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
  ],
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const user = session?.user;

  let userdb: { points: number } | null = null;

  if (user) {
    userdb = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
    });
  }

  const points = userdb?.points;

  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${fontSans.variable} ${fontUrban.variable} ${fontHeading.variable} ${fontGeist.variable} ${fontPlayfair.variable} light`}
    >
      <body>
        <ToastProvider>
          <Header user={user} points={points} />
          {children}
          <Toaster position="bottom-center" richColors />
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
