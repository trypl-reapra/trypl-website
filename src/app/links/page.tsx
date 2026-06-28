import type { Metadata } from "next";
import LinksContent from "@/components/pages/LinksContent";

export const metadata: Metadata = {
  title: "リンク集",
  description:
    "TrypL の公式リンク集。各種SNS・募集一覧・会員登録への入口をまとめた、TrypLの母艦ページ。",
  alternates: { canonical: "/links" },
};

export default function LinksPage() {
  return <LinksContent />;
}
