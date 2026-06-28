import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import PageHeader from "@/components/PageHeader";
import LegalDoc from "@/components/LegalDoc";
import { communityRegulations } from "@/data/legal";

export const metadata: Metadata = {
  title: "コミュニティ・レギュレーション",
  description:
    "TrypL（トリプル）のコミュニティ・ガイドラインと会員規約。安心して挑戦できる場のための約束ごと。",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal · レギュレーション"
        title={["コミュニティ・", "レギュレーション"]}
        lead="TrypL の理念と、安心して挑戦できる場をつくるためのルールです。"
      />
      <Section tone="light" topPad={false}>
        <Container>
          <LegalDoc markdown={communityRegulations} />
        </Container>
      </Section>
    </>
  );
}
