import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import JoinCTA from "@/components/home/JoinCTA";
import { Container, Section, Eyebrow } from "@/components/ui";
import { Reveal, RevealLines, Stagger, StaggerItem } from "@/components/motion";
import { triple } from "@/data/site";
import { representative, representativeMessage, milestones } from "@/data/team";

export const metadata: Metadata = {
  title: "TrypLとは",
  description:
    "TrypL（トリプル）は、REAPRA発の若年層向け実践型インターンコミュニティ。名前に込めた3つのL、REAPRAとの関係、ビジョン、運営チーム、これまでの歩みを紹介します。",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About · TrypLとは"
        title={["社会と共創する、", "その予備軍を。"]}
        lead="内発的動機を起点に、学生が社会と共創しながら学び、挑戦し、熟達していく。TrypLは、その実践機会を提供するコミュニティです。"
      />

      {/* What */}
      <Section tone="light" topPad={false}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Eyebrow>What</Eyebrow>
            <div className="max-w-2xl">
              <Reveal>
                <p className="font-jp text-2xl font-bold leading-[1.5] tracking-[-0.01em] sm:text-3xl">
                  TrypL は、REAPRA と連携した「若年層向けインターンシップコミュニティ」です。
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-8 leading-relaxed text-mute">
                  不透明度が増す社会において、若年層が長い時間軸をかけて「株式会社にまつわる仕事＝社会との繋がり」を通じて社会と共創し、熟達でイキイキ生きる（ウェルビーイング）きっかけを掴む——その場と機会を共創するプロジェクトです。
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-6 leading-relaxed text-mute">
                  就活や報酬・お金ドリブンではなく、「自分は何者か」「どう社会に関わりたいか」という内発的な動機を持つ学生が、実際の企業活動を通じて「社会と共創する熟達」の一歩を踏み出していきます。
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* The name */}
      <Section tone="fog">
        <Container>
          <Eyebrow>The name</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.9rem,5vw,3.5rem)] font-bold tracking-[-0.02em]">
              名前に込めた、3つのL。
            </h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {triple.map((t) => (
              <StaggerItem key={t.key} className="bg-fog p-8 sm:p-10">
                <span className="font-display text-5xl font-bold tracking-tight text-ink">
                  L
                </span>
                <p className="eyebrow mt-6 text-mute">{t.key}</p>
                <p className="mt-2 font-jp text-2xl font-bold">{t.jp}</p>
                <p className="mt-4 text-sm leading-relaxed text-mute">{t.body}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <p className="mt-12 font-display text-lg tracking-tight text-ink sm:text-2xl">
              Try
              <span className="text-mute"> 挑戦 </span>×<span> Practice</span>
              <span className="text-mute"> 実践 </span>×<span> pLay</span>
              <span className="text-mute"> 楽しむ</span>
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">
              「楽しく遊ぶように、実践に挑戦する」。読み方は “トリプル”。その姿勢を、名前そのものに込めています。
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* REAPRA */}
      <Section tone="dark">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Eyebrow className="text-mute-dark">REAPRA にとっての意義</Eyebrow>
            <div className="max-w-2xl">
              <h2 className="font-jp text-[clamp(1.7rem,4vw,3rem)] font-bold leading-[1.25] tracking-[-0.02em] text-paper">
                <RevealLines
                  lines={[
                    "長く続く、",
                    "芯を食った内発的動機を。",
                  ]}
                />
              </h2>
              <Reveal delay={0.2}>
                <p className="mt-8 leading-relaxed text-mute-dark">
                  REAPRA は「産業創造の研究実践」をミッションに、世代を跨ぐ長い時間軸で社会課題を解決する産業を創り、そのリーダーを育んでいます。その核心にあるのが、外発的・短期的な成功ではなく、自分の内面から湧き出る使命感を問い続けるアプローチです。
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="mt-6 leading-relaxed text-mute-dark">
                  TrypL を通じて内発的動機と向き合った学生たちが、5年後・10年後に自分のキャリアや届けたい社会を持って、再び REAPRA のエコシステムに接続してくれる。それも、TrypL が持つ長期的な意義です。
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Vision */}
      <Section tone="light">
        <Container>
          <Eyebrow>Vision · 2035</Eyebrow>
          <h2 className="mt-8 max-w-5xl font-jp text-[clamp(1.9rem,5.2vw,4rem)] font-bold leading-[1.18] tracking-[-0.02em]">
            <RevealLines
              lines={[
                "「大学生になったら、",
                "とりあえず TrypL。」",
              ]}
            />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-2xl leading-relaxed text-mute">
              大学の生活協同組合のように、当たり前にそこにある存在へ。2035年までに、既存の有力学生団体を超える規模と質を持つ、日本で最も強い学生実践コミュニティを目指します。学生が自分のペースで「やりたいこと」や「社会への貢献のかたち」を探し、深められる場を提供し続けます。
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Message — 代表メッセージ */}
      <Section tone="fog">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.82fr] lg:gap-20">
            {/* eyebrow + heading + greeting */}
            <div className="order-2 lg:order-1">
              <Eyebrow>Message · 代表メッセージ</Eyebrow>
              <Reveal>
                <h2 className="mt-7 font-jp text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold leading-[1.45] tracking-[-0.02em]">
                  {representativeMessage.title}
                </h2>
              </Reveal>
              <div className="mt-8 max-w-2xl">
                {representativeMessage.body.map((p, i) => (
                  <Reveal key={i} delay={0.05 + i * 0.05}>
                    <p
                      className={
                        "leading-[1.95] text-mute" + (i > 0 ? " mt-6" : "")
                      }
                    >
                      {p}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* large portrait, top-aligned with the heading */}
            <Reveal className="order-1 lg:order-2 lg:sticky lg:top-28">
              <figure>
                <Image
                  src={representative.photo!}
                  alt={representative.name}
                  width={900}
                  height={1080}
                  priority
                  className="aspect-[4/5] w-full rounded-3xl object-cover"
                />
                <figcaption className="mt-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-jp text-xl font-bold text-ink">
                      {representative.name}
                    </span>
                    {representative.reading && (
                      <span className="font-display text-xs tracking-wide text-mute">
                        {representative.reading}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-mute">
                    {representative.role} · {representative.org}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Roadmap */}
      <Section tone="light">
        <Container>
          <Eyebrow>Roadmap</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.9rem,5vw,3.5rem)] font-bold tracking-[-0.02em]">
              これからの歩み
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
            {milestones.map((m) => (
              <StaggerItem key={m.phase} className="bg-paper p-7 sm:p-8">
                <span className="font-display text-xs tracking-widest text-mute">
                  {m.phase}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{m.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <JoinCTA />
    </>
  );
}
