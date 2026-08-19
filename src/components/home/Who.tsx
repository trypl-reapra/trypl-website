"use client";

import { RevealLines, Reveal } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import BackgroundVideo from "@/components/BackgroundVideo";
import { MASTERY_SITE } from "@/lib/mastery";
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
      {/* 文字が確実に読めるよう、左〜下を濃いめに締めるスクリム */}
      <div className="pointer-events-none absolute inset-0 bg-ink/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/45" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />

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

        {/* 熟達タイプ診断（別サイト）。結果は会員ページに記録でき、会員化の入口になる */}
        <Reveal delay={0.3}>
          <div className="mt-10 max-w-xl rounded-2xl border border-paper/25 bg-ink/40 p-6 backdrop-blur-sm sm:p-7">
            <p className="text-sm leading-[1.9] text-paper/90">
              {t.who.masteryLead}
            </p>
            <a
              href={MASTERY_SITE}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-paper px-6 text-sm font-medium text-ink transition-colors hover:bg-paper/90"
            >
              {t.who.masteryCta}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path
                  d="M7 17L17 7M7 7h10v10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
