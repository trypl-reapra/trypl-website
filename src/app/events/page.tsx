import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import JoinCTA from "@/components/home/JoinCTA";
import { Container, Section, Button, Eyebrow } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { events } from "@/data/site";

export const metadata: Metadata = {
  title: "イベント",
  description:
    "TrypL のイベント情報。説明会・座談会・ワークショップなど、社会と接続する最初の一歩を。最新の開催予定と参加申し込みは Luma から。",
};

const kinds = [
  {
    title: "説明会",
    body: "TrypL の世界観と、いま募集中の実践機会（インターン）を知る。はじめての方へ。",
  },
  {
    title: "座談会・対話の場",
    body: "現役メンバーや運営と本音で話す。「やってみたい」の解像度を上げていく。",
  },
  {
    title: "ワークショップ",
    body: "生成AIの実務活用など、現場で使えるスキルに手を動かしながら触れる。",
  },
];

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Events · イベント"
        title={["社会と出会う、", "最初の一歩を。"]}
        lead="説明会・座談会・ワークショップなど、TrypL ではさまざまなイベントを開催しています。最新の開催予定と参加申し込みは Luma からご確認ください。"
      />

      {/* Featured — Luma */}
      <Section tone="dark" topPad={false}>
        <Container>
          <div className="rounded-3xl border border-line-dark p-8 sm:p-12">
            <Eyebrow className="text-mute-dark">Upcoming · 開催予定</Eyebrow>
            <h2 className="mt-6 font-jp text-3xl font-bold tracking-tight text-paper sm:text-4xl">
              イベントカレンダー
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-mute-dark">
              開催予定の一覧・詳細・参加申し込みは、TrypL の Luma
              ページにまとめています。気になる回があれば、お気軽にご参加ください。
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={events.lumaUrl} variant="inverse" size="lg">
                Luma で予定を見る
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    d="M7 17L17 7M7 7h10v10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button href="/internships" variant="outline-invert" size="lg">
                募集を見る
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Kinds of events */}
      <Section tone="light">
        <Container>
          <Eyebrow>What we host</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
              開催しているイベント
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {kinds.map((k) => (
              <StaggerItem key={k.title} className="bg-paper p-8 sm:p-10">
                <h3 className="font-jp text-xl font-bold">{k.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-mute">{k.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Gallery — イベントの様子 */}
      <Section tone="fog">
        <Container>
          <Eyebrow>Gallery · イベントの様子</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
              これまでの開催から。
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl leading-relaxed text-mute">
              発表、対話、交流。実際の現場に触れながら、仲間とともに学び合う場をつくっています。
            </p>
          </Reveal>

          <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {events.photos.map((p) => (
              <StaggerItem key={p.src}>
                <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <JoinCTA />
    </>
  );
}
