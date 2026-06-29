"use client";

import { RevealLines, Reveal } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import BackgroundVideo from "@/components/BackgroundVideo";
import { useT } from "@/i18n/LocaleProvider";

export default function Who() {
  const t = useT();
  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ink text-paper-dim"
    >
      {/* 右→左へ流れるランドスケープのループ背景 */}
      <BackgroundVideo src="/media/video/who.mp4" />
      {/* 可読性スクリム：テキストのある左・上を程よく締めつつ、ランドスケープ映像を見せる */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/10 to-ink/35" />

      <Container className="relative z-10 py-24 sm:py-32 lg:py-40">
        <Eyebrow className="text-paper/70">{t.who.eyebrow}</Eyebrow>

        <h2 className="mt-10 max-w-5xl font-jp text-[clamp(1.8rem,5.2vw,4rem)] font-bold leading-[1.2] tracking-[-0.02em] text-paper [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]">
          <RevealLines lines={t.who.titleLines} />
        </h2>

        <Reveal delay={0.2}>
          <p className="mt-12 max-w-xl text-base leading-[1.9] text-paper sm:text-lg [text-shadow:0_1px_18px_rgba(0,0,0,0.7)]">
            {t.who.lead}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
