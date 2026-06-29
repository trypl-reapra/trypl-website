import type { Metadata } from "next";
import AboutContent from "@/components/pages/AboutContent";

export const metadata: Metadata = {
  title: "TrypLとは",
  description:
    "TrypL（トリプル）は、REAPRA発の若年層向けインターンシップコミュニティ。名前に込めた3つのL、REAPRAとの関係、ビジョン、運営チームを紹介します。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
