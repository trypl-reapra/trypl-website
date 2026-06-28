import type { Metadata } from "next";
import EventsContent from "@/components/pages/EventsContent";
import { listPublicEvents } from "@/lib/store";

export const metadata: Metadata = {
  title: "イベント",
  description:
    "TrypL のイベント情報。説明会・座談会・ワークショップなど、社会と接続する最初の一歩を。開催予定の日時・場所・申込はこちら。",
  alternates: { canonical: "/events" },
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const upcoming = await listPublicEvents();
  return <EventsContent upcoming={upcoming} />;
}
