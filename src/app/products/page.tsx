import type { Metadata } from "next";
import ProductsContent from "@/components/pages/ProductsContent";

export const metadata: Metadata = {
  title: "プロダクト",
  description:
    "TrypL が提供しているものの一覧。熟達タイプ診断・会員コミュニティ・インターンシップ・イベントの4つの入口を、それぞれ何ができるかとあわせて紹介します。",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return <ProductsContent />;
}
