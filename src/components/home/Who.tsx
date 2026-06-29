"use client";

import { useState } from "react";
import { RevealLines, Reveal } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";

export default function Who() {
  const t = useT();
  const [videoOn, setVideoOn] = useState(false);
  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ink text-paper-dim"
    >
      {/* 右→左へ流れるランドスケープのループ背景 */}
      <video
        className={`pointer-events-none absolute inset-0 h-full w-full bg-ink object-cover transition-opacity duration-[1400ms] ease-out ${videoOn ? "opacity-100" : "opacity-0"}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => setVideoOn(true)}
        onLoadedData={() => setVideoOn(true)}
      >
        <source src="/media/video/who.mp4" type="video/mp4" />
      </video>
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
