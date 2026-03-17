import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Levitex — Trade Assets That Move Freely",
  description:
    "A lighter, faster way to explore decentralized liquidity. Experience the next generation of DeFi trading with Levitex.",
  keywords: [
    "DEX",
    "decentralized exchange",
    "DeFi",
    "swap",
    "liquidity",
    "Web3",
    "Levitex",
  ],
  authors: [{ name: "Levitex Team" }],
  openGraph: {
    title: "Levitex — Trade Assets That Move Freely",
    description: "A lighter, faster way to explore decentralized liquidity.",
    url: "https://levitex-core.vercel.app/", // Giả định URL
    siteName: "Levitex Protocol",
    images: [
      {
        url: "/og-image.png", // Cần chuẩn bị ảnh này sau
        width: 1200,
        height: 630,
        alt: "Levitex Protocol - Next Gen DEX",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Levitex — Trade Assets That Move Freely",
    description: "A lighter, faster way to explore decentralized liquidity.",
    images: ["/og-image.png"],
    creator: "@Levitex",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
