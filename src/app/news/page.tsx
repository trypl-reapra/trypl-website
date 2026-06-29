import type { Metadata } from "next";
import { listPublicPress } from "@/lib/store";
import NewsListContent from "@/components/pages/NewsListContent";

export const metadata: Metadata = {
  title: "ニュース",
  description:
    "TrypL のニュース。メディア掲載やプレスリリース、コミュニティからのお知らせをまとめています。",
  alternates: { canonical: "/news" },
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const items = await listPublicPress();
  return <NewsListContent items={items} />;
}
