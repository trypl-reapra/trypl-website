import { Marquee, Reveal, RevealLines, Stagger, StaggerItem } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { brandWords } from "@/data/site";

const pillars = [
  {
    n: "01",
    label: "社会との接点",
    body: "REAPRA および投資先企業での実際のインターン。机上ではなく、本物の現場から始まる。",
  },
  {
    n: "02",
    label: "実践からの学び",
    body: "やりながら学び、感じたことを言葉にして蓄積する。「自分は何者か」を実践の中で探っていく。",
  },
  {
    n: "03",
    label: "長期の時間軸",
    body: "就活や報酬のためではなく、1年後・5年後・10年後を見据えて社会と向き合い続ける。",
  },
];

export default function Statement() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper-dim">
      {/* brand words marquee, edge to edge */}
      <div className="border-b border-line-dark py-7 text-paper">
        <Marquee
          items={brandWords}
          separator="／"
          className="text-stroke font-jp text-[clamp(1.9rem,6vw,4.25rem)] font-bold leading-none"
        />
      </div>

      <Container className="py-24 sm:py-32 lg:py-40">
        <Eyebrow className="text-mute-dark">What we do</Eyebrow>

        <h2 className="mt-8 max-w-4xl font-jp text-[clamp(1.9rem,5vw,3.75rem)] font-bold leading-[1.18] tracking-[-0.02em] text-paper">
          <RevealLines
            lines={[
              "社会と学生の距離を縮め",
              "実践的な学びを最大化する。",
            ]}
          />
        </h2>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl leading-relaxed text-mute-dark">
            TrypLは、REAPRAの投資先企業群と連携し、単なるスキル習得に留まらない、社会のリアルな課題に向き合う機会を提供します。社会に価値を生み出すためには、まず動いてみること。私たちは「案ずるより産むが易し」を合言葉に、学生が社会のプレイヤーとして成長するためのコミュニティを構築しています。
          </p>
        </Reveal>

        <Stagger className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line-dark bg-line-dark sm:grid-cols-3">
          {pillars.map((p) => (
            <StaggerItem
              key={p.n}
              className="bg-ink p-8 transition-colors duration-500 hover:bg-ink-soft sm:p-10"
            >
              <span className="font-display text-sm tracking-widest text-mute-dark">
                {p.n}
              </span>
              <h3 className="mt-6 text-xl font-semibold text-paper">{p.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute-dark">
                {p.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
