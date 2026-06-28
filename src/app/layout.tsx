import type { Metadata } from "next";
import { Inter, Space_Grotesk, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import ScrollReset from "@/components/layout/ScrollReset";
import Analytics from "@/components/layout/Analytics";
import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { site } from "@/data/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-zen",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "TrypL（トリプル）— 社会とつながり、やりながら学ぶ。",
    template: "%s — TrypL",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "TrypL",
    "トリプル",
    "REAPRA",
    "インターン",
    "学生コミュニティ",
    "九州大学",
    "実践",
    "社会と共創する熟達",
  ],
  authors: [{ name: "TrypL" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: site.name,
    title: "TrypL（トリプル）— 社会とつながり、やりながら学ぶ。",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "TrypL（トリプル）",
    description: site.description,
  },
  // プレースホルダー段階では検索インデックスを抑止。
  // 正式公開時に { index: true, follow: true } へ変更してください。
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${spaceGrotesk.variable} ${zenKaku.variable} antialiased`}
    >
      <body className="min-h-dvh bg-paper">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          本文へスキップ
        </a>
        <SessionProvider>
          <LocaleProvider>
            <SmoothScroll>
              <ScrollReset />
              <Analytics />
              <ScrollProgress />
              <Nav />
              <main id="main">{children}</main>
              <Footer />
            </SmoothScroll>
          </LocaleProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
