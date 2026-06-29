"use client";

import { RevealLines, Reveal, ScrollFadeOut } from "@/components/motion";
import { Fragment } from "react";
import { Button, Eyebrow } from "@/components/ui";
import BackgroundVideo from "@/components/BackgroundVideo";
import JoinCtaButton from "@/components/JoinCtaButton";
import { useT } from "@/i18n/LocaleProvider";
import { site } from "@/data/site";

export default function Hero() {
  const t = useT();
  // eyebrow 内の "REAPRA" を公式サイトへのリンクにする。
  const eyebrowParts = t.hero.eyebrow.split("REAPRA");
  return (
    <section
      data-nav-theme="dark"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink px-page pb-20 pt-28 text-paper sm:pt-24"
    >
      {/* ループ背景動画（イベントの様子から生成・無音） */}
      <BackgroundVideo src="/media/video/hero-v2.mp4" />

      {/* 可読性のためのスクリム（左を濃く＋全体を少し暗く＋下端を締める） */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
      {/* 微かな幾何グリッド */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade text-paper opacity-[0.12]" />

      <ScrollFadeOut className="relative z-10 mx-auto w-full min-w-0 max-w-[1280px]">
        <div className="min-w-0 max-w-3xl">
          <Eyebrow className="text-paper/70">
            <span>
              {eyebrowParts.map((part, idx) => (
                <Fragment key={idx}>
                  {part}
                  {idx < eyebrowParts.length - 1 && (
                    <a
                      href={site.parent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-paper underline decoration-paper/40 underline-offset-2 transition-colors hover:decoration-paper"
                    >
                      REAPRA
                    </a>
                  )}
                </Fragment>
              ))}
            </span>
          </Eyebrow>

          <h1 className="mt-6 font-jp text-[clamp(2.35rem,6.4vw,5.25rem)] font-bold leading-[1.04] tracking-[-0.03em] text-paper [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]">
            <RevealLines immediate lines={t.hero.title} delay={0.05} />
          </h1>

          <Reveal immediate delay={0.4}>
            <p className="mt-7 max-w-xl text-base leading-[1.9] text-paper/85 sm:text-lg">
              {t.hero.lead1}
            </p>
          </Reveal>

          <Reveal immediate delay={0.5}>
            <p className="mt-5 max-w-xl text-base leading-[1.9] text-paper/85 sm:text-lg">
              {t.hero.lead2}
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <JoinCtaButton variant="inverse" size="lg" />
            <Button href="/about" variant="outline-invert" size="lg">
              {t.hero.aboutLink}
            </Button>
          </div>
        </div>
      </ScrollFadeOut>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-paper/70 sm:flex">
        <span className="eyebrow text-[0.625rem]">{t.scroll}</span>
        <span className="relative block h-10 w-px overflow-hidden bg-paper/25">
          <span className="animate-cue absolute inset-x-0 top-0 h-4 bg-paper" />
        </span>
      </div>
    </section>
  );
}
