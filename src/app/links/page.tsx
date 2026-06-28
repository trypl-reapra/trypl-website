import type { Metadata } from "next";
import LinksContent from "@/components/pages/LinksContent";

export const metadata: Metadata = {
  title: "リンク集",
  description:
    "TrypL の公式リンク集。各種SNS・募集一覧・参加フォームへの入口をまとめた、TrypLの母艦ページ。",
};

export default function LinksPage() {
  return <LinksContent />;
}
