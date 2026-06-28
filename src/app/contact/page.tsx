import type { Metadata } from "next";
import ContactContent from "@/components/pages/ContactContent";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "TrypL へのお問い合わせ。参加・取材・連携など、お気軽にご連絡ください。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactContent />;
}
