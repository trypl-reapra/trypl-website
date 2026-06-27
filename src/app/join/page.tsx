import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Container, Section, Button, Eyebrow } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { site } from "@/data/site";
import { entryForm, socials } from "@/data/socials";

export const metadata: Metadata = {
  title: "参加する",
  description:
    "TrypL への参加方法。知る → 深める → 登録 → つながる → 実践。内発的動機を起点に、社会との接点をここから。",
};

const steps = [
  { title: "知る", body: "SNS やイベントを通じて、TrypL の世界に触れる。" },
  {
    title: "深める",
    body: "説明会・座談会・対話の場で、活動やインターンの実際を知る。",
  },
  {
    title: "登録する",
    body: "参加フォームから興味を登録。30秒ほどで完了します。",
  },
  {
    title: "つながる",
    body: "コミュニティ（Slack）に参加し、同世代の仲間や運営とつながる。",
  },
  {
    title: "実践する",
    body: "自分に合うインターンへ。やりながら学び、熟達への一歩を踏み出す。",
  },
];

const faqs = [
  { q: "参加に費用はかかりますか？", a: "いいえ。コミュニティへの参加は無料です。" },
  {
    q: "文系・理系や学部は問われますか？",
    a: "問いません。学部・専攻に関わらず、内発的な動機を大切にする方を歓迎します。",
  },
  {
    q: "対象となる学年は？",
    a: "主に大学生・大学院生（16〜25歳が目安）です。将来的には高校生や社会人2年目の方などへも広げていく予定です。",
  },
  {
    q: "地方に住んでいても参加できますか？",
    a: "はい。リモート中心の活動やインターンも多くあります。場所に関わらず参加いただけます。",
  },
  {
    q: "就職活動の役に立ちますか？",
    a: "結果としてキャリアの確かな足場になりますが、TrypL は就活対策の場ではなく、内発的動機を起点に社会と関わる実践の場です。",
  },
];

export default function JoinPage() {
  const line = socials.find((s) => s.key === "line");
  const slack = socials.find((s) => s.key === "slack");

  return (
    <>
      <PageHeader
        eyebrow="Join · 参加する"
        title={["最初の一歩を、", "ここから。"]}
        lead="興味の登録から、説明会、そして実践へ。完璧である必要はありません。まずは気軽に、扉を開いてみてください。"
      />

      {/* steps */}
      <Section tone="light" topPad={false}>
        <Container>
          <Eyebrow>How it works</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
              参加から実践までの、5ステップ。
            </h2>
          </Reveal>

          <Stagger className="mt-12">
            <ol>
              {steps.map((s, i) => (
                <StaggerItem key={s.title}>
                  <li className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-line py-7 sm:gap-10 sm:py-8">
                    <span className="font-display text-2xl tabular-nums text-mute sm:text-3xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-jp text-xl font-bold sm:text-2xl">
                        {s.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-mute">{s.body}</p>
                    </div>
                  </li>
                </StaggerItem>
              ))}
            </ol>
          </Stagger>
        </Container>
      </Section>

      {/* entry CTA */}
      <Section tone="dark">
        <Container>
          <div className="rounded-3xl border border-line-dark p-8 sm:p-12">
            <Eyebrow className="text-mute-dark">Get started</Eyebrow>
            <h2 className="mt-6 font-jp text-3xl font-bold tracking-tight text-paper sm:text-4xl">
              いますぐ、はじめる。
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-mute-dark">
              まずは参加フォームから。その後、LINE で最新情報を受け取り、コミュニティ（Slack）でつながりましょう。
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button
                href={entryForm.available ? entryForm.href : "#"}
                variant="inverse"
                size="lg"
                aria-disabled={!entryForm.available}
              >
                {entryForm.available ? "参加フォームへ" : "参加フォーム（準備中）"}
              </Button>
              <Button href="/internships" variant="outline-invert" size="lg">
                募集を見る
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-mute-dark">
              <span>
                LINE：
                {line?.available ? (
                  <a
                    href={line.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-paper-dim"
                  >
                    友だち追加
                  </a>
                ) : (
                  <span className="text-paper-dim/50">準備中</span>
                )}
              </span>
              <span>
                Slack：
                {slack?.available ? (
                  <a
                    href={slack.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-paper-dim"
                  >
                    参加する
                  </a>
                ) : (
                  <span className="text-paper-dim/50">準備中</span>
                )}
              </span>
              <span>
                お問い合わせ：
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline text-paper-dim"
                >
                  {site.email}
                </a>
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="light">
        <Container>
          <Eyebrow>FAQ</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
              よくある質問
            </h2>
          </Reveal>
          <div className="mt-10 max-w-3xl">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group border-t border-line py-5 last:border-b"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <span className="font-medium">{f.q}</span>
                  <span className="relative h-4 w-4 shrink-0 text-mute">
                    <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-300 group-open:rotate-90 group-open:scale-0" />
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-mute">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
