import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Test MyShop",
  description:
    "Shopee clone 2026 built with Next.js 15, PostgreSQL, Prisma, and Tailwind CSS.",
  metadataBase: new URL("https://myshop.example"),
  openGraph: {
    title: "Test MyShop",
    description: "Shopee clone 2026 built with Next.js 15.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
