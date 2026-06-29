import type { Metadata } from "next";
import EventsContent from "@/components/pages/EventsContent";
import { listPublicEvents } from "@/lib/store";

export const metadata: Metadata = {
  title: "イベント",
  description:
    "TrypL のイベント情報。学生が社会と出会い、実践へと踏み出すためのイベントの開催予定・日時・場所・お申し込みはこちら。",
  alternates: { canonical: "/events" },
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const upcoming = await listPublicEvents();
  return <EventsContent upcoming={upcoming} />;
}
