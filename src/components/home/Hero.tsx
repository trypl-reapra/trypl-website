"use client";

import {
  RevealLines,
  Reveal,
  Parallax,
  Magnetic,
  ScrollFadeOut,
} from "@/components/motion";
import { RingsSvg, DashRing } from "@/components/decor";
import { Button, Eyebrow } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";

export default function Hero() {
  const t = useT();
  return (
    <section
      data-nav-theme="light"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-paper px-page pb-20 pt-28 text-ink sm:pt-24"
    >
      {/* faint geometric grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-[0.9]" />

      {/* concentric rings, slow rotation + parallax drift */}
      <Parallax
        speed={0.12}
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(112vw,1000px)] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative h-full w-full opacity-[0.85]">
          <div className="absolute inset-0 animate-spin-slower text-ink">
            <RingsSvg />
          </div>
          <div
            className="absolute inset-0 animate-spin-slow text-ink [animation-direction:reverse]"
          >
            <DashRing />
          </div>
        </div>
      </Parallax>

      {/* top + bottom fade so rings melt into the page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent" />

      <ScrollFadeOut className="relative z-10 mx-auto w-full min-w-0 max-w-[1280px]">
        <div className="min-w-0 max-w-3xl">
          <Eyebrow>{t.hero.eyebrow}</Eyebrow>

          <h1 className="mt-6 font-jp text-[clamp(2.35rem,6.4vw,5.25rem)] font-bold leading-[1.04] tracking-[-0.03em]">
            <RevealLines immediate lines={t.hero.title} delay={0.05} />
          </h1>

          <Reveal immediate delay={0.4}>
            <p className="mt-7 max-w-xl text-base leading-[1.9] text-mute sm:text-lg">
              {t.hero.lead1}
            </p>
          </Reveal>

          <Reveal immediate delay={0.5}>
            <p className="mt-5 max-w-xl text-base leading-[1.9] text-mute sm:text-lg">
              {t.hero.lead2}
            </p>
          </Reveal>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button href="/internships" size="lg">
                {t.hero.seeInternships}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </Magnetic>
            <Button href="/about" variant="outline" size="lg">
              {t.hero.aboutLink}
            </Button>
          </div>
        </div>
      </ScrollFadeOut>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-mute sm:flex">
        <span className="eyebrow text-[0.625rem]">{t.scroll}</span>
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="animate-cue absolute inset-x-0 top-0 h-4 bg-ink" />
        </span>
      </div>
    </section>
  );
}
