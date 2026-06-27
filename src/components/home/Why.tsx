"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";

export default function Why() {
  const t = useT();
  const shifts = t.why.shifts;
  return (
    <section data-nav-theme="light" className="bg-fog text-ink">
      <Container className="py-24 sm:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <Eyebrow>{t.why.eyebrow}</Eyebrow>
            <Reveal>
              <h2 className="mt-7 font-jp text-[clamp(1.9rem,5vw,3.5rem)] font-bold leading-[1.15] tracking-[-0.02em]">
                {t.why.titleLines[0]}
                <br />
                {t.why.titleLines[1]}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md whitespace-pre-line leading-relaxed text-mute">
                {t.why.lead}
              </p>
            </Reveal>
          </div>

          <Stagger className="lg:pt-16">
            <div className="border-t border-ink/15">
              {shifts.map((s) => (
                <StaggerItem key={s.to}>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-ink/15 py-6 sm:gap-8 sm:py-7">
                    <span className="text-sm text-mute line-through decoration-mute/40 sm:text-base">
                      {s.from}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="h-5 w-5 text-mute"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-right font-jp text-lg font-bold tracking-tight sm:text-2xl">
                      {s.to}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
