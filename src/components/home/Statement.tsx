"use client";

import { Marquee, Reveal, RevealLines, Stagger, StaggerItem } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";

export default function Statement() {
  const t = useT();
  const pillars = t.statement.pillars.map((p, i) => ({
    n: `0${i + 1}`,
    ...p,
  }));
  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ink text-paper-dim"
    >
      {/* brand words marquee, edge to edge */}
      <div className="border-b border-line-dark py-7 text-paper">
        <Marquee
          items={t.statement.brandWords}
          separator="／"
          className="text-stroke font-jp text-[clamp(1.9rem,6vw,4.25rem)] font-bold leading-none"
        />
      </div>

      <Container className="py-24 sm:py-32 lg:py-40">
        <Eyebrow className="text-mute-dark">{t.statement.eyebrow}</Eyebrow>

        <h2 className="mt-8 max-w-4xl font-jp text-[clamp(1.9rem,5vw,3.75rem)] font-bold leading-[1.18] tracking-[-0.02em] text-paper">
          <RevealLines lines={t.statement.title} />
        </h2>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl leading-relaxed text-mute-dark">
            {t.statement.body}
          </p>
        </Reveal>

        <Stagger className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line-dark bg-line-dark sm:grid-cols-3">
          {pillars.map((p) => (
            <StaggerItem
              key={p.n}
              className="bg-ink p-8 transition-colors duration-500 hover:bg-ink-soft sm:p-10"
            >
              <span className="font-display text-sm tracking-widest text-mute-dark">
                {p.n}
              </span>
              <h3 className="mt-6 text-xl font-semibold text-paper">{p.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute-dark">
                {p.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
