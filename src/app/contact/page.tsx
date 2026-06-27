import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Container, Section } from "@/components/ui";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "TrypL へのお問い合わせ。参加・取材・連携など、お気軽にご連絡ください。",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact · お問い合わせ"
        title={["話してみよう。"]}
        lead="参加のご相談、取材・メディア、企業や大学との連携など。どんなことでも、お気軽にどうぞ。"
      />

      <Section tone="light" topPad={false}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <h2 className="font-jp text-2xl font-bold tracking-tight">
                直接のご連絡も歓迎です
              </h2>
              <p className="mt-5 leading-relaxed text-mute">
                フォームのほか、メールでも受け付けています。内容に応じて、担当より折り返しご連絡します。
              </p>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-6 inline-block font-medium"
              >
                {site.email}
              </a>
              <p className="mt-10 text-sm leading-relaxed text-mute">
                ※ いただいた内容は運営の管理画面で確認し、対応に利用します。
              </p>
            </div>

            <div className="rounded-3xl border border-line bg-fog p-6 sm:p-9">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
