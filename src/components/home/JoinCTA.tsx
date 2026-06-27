"use client";

import { RevealLines, Reveal, Magnetic, Parallax } from "@/components/motion";
import { RingsSvg } from "@/components/decor";
import { Button, Container, Eyebrow } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";

export default function JoinCTA() {
  const t = useT();
  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ink text-paper-dim"
    >
      {/* faint rings */}
      <Parallax
        speed={0.1}
        className="pointer-events-none absolute -right-[15%] top-1/2 aspect-square w-[min(80vw,720px)] -translate-y-1/2 text-paper/[0.5]"
      >
        <div className="h-full w-full animate-spin-slower opacity-[0.12]">
          <RingsSvg />
        </div>
      </Parallax>

      <Container className="relative py-28 sm:py-36 lg:py-44">
        <Eyebrow className="text-mute-dark">{t.join.eyebrow}</Eyebrow>

        <h2 className="mt-8 font-jp text-[clamp(2.6rem,9vw,7rem)] font-bold leading-[0.98] tracking-[-0.03em] text-paper">
          <RevealLines lines={[t.join.title]} />
        </h2>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-xl leading-relaxed text-mute-dark">
            {t.join.body}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic>
            <Button href="/join" variant="inverse" size="lg">
              {t.join.primary}
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
          <Button href="/internships" variant="outline-invert" size="lg">
            {t.join.secondary}
          </Button>
        </div>
      </Container>
    </section>
  );
}
