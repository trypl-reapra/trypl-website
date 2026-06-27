"use client";

import { RevealLines, Reveal } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";

export default function Who() {
  const t = useT();
  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ink text-paper-dim"
    >
      {/* 右→左へ流れるランドスケープのループ背景 */}
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/who-poster.jpg"
        aria-hidden="true"
      >
        <source src="/who.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />

      <Container className="relative z-10 py-24 sm:py-32 lg:py-40">
        <Eyebrow className="text-paper/60">{t.who.eyebrow}</Eyebrow>

        <h2 className="mt-10 max-w-5xl font-jp text-[clamp(1.8rem,5.2vw,4rem)] font-bold leading-[1.18] tracking-[-0.02em] text-paper [text-shadow:0_2px_30px_rgba(0,0,0,0.4)]">
          <RevealLines lines={t.who.titleLines} />
        </h2>

        <Reveal delay={0.2}>
          <p className="mt-12 max-w-xl leading-relaxed text-paper/80">
            {t.who.lead}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
