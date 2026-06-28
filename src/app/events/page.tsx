import type { Metadata } from "next";
import EventsContent from "@/components/pages/EventsContent";

export const metadata: Metadata = {
  title: "イベント",
  description:
    "TrypL のイベント情報。説明会・座談会・ワークショップなど、社会と接続する最初の一歩を。",
};

export default function EventsPage() {
  return <EventsContent />;
}
