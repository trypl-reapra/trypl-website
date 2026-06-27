"use client";

import { RevealLines, Reveal } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";

export default function Who() {
  const t = useT();
  return (
    <section data-nav-theme="dark" className="bg-ink text-paper-dim">
      <Container className="py-24 sm:py-32 lg:py-40">
        <Eyebrow className="text-mute-dark">{t.who.eyebrow}</Eyebrow>

        <h2 className="mt-10 max-w-5xl font-jp text-[clamp(1.8rem,5.2vw,4rem)] font-bold leading-[1.18] tracking-[-0.02em] text-paper">
          <RevealLines lines={t.who.titleLines} />
        </h2>

        <Reveal delay={0.2}>
          <p className="mt-12 max-w-xl leading-relaxed text-mute-dark">
            {t.who.lead}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
