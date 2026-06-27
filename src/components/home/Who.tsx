import { RevealLines, Reveal } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";

export default function Who() {
  return (
    <section data-nav-theme="dark" className="bg-ink text-paper-dim">
      <Container className="py-24 sm:py-32 lg:py-40">
        <Eyebrow className="text-mute-dark">Who · 求める人物像</Eyebrow>

        <h2 className="mt-10 max-w-5xl font-jp text-[clamp(1.8rem,5.2vw,4rem)] font-bold leading-[1.18] tracking-[-0.02em] text-paper">
          <RevealLines
            lines={[
              "まず、動いてみたい人。",
              "就活のためじゃなく、",
              "自分の動機から始めたい人。",
              "学んだことを、言葉にできる人。",
            ]}
          />
        </h2>

        <Reveal delay={0.2}>
          <p className="mt-12 max-w-xl leading-relaxed text-mute-dark">
            入口は、広く。最初から完璧である必要はありません。曖昧な状況でも一歩を踏み出し、活動を通じて自分の志向と適性を見つけていく——そんな姿勢を、私たちは大切にします。
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
