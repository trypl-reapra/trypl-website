import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import PageHeader from "@/components/PageHeader";
import LegalDoc from "@/components/LegalDoc";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "TrypL（トリプル）のプライバシーポリシー。取得する情報・利用目的・第三者提供・国外移転・開示請求・お問い合わせ窓口について。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal · プライバシーポリシー"
        title={["プライバシーポリシー"]}
        lead="TrypL が取得する個人情報の取扱いについて定めています。"
      />
      <Section tone="light" topPad={false}>
        <Container>
          <LegalDoc markdown={privacyPolicy} />
        </Container>
      </Section>
    </>
  );
}
