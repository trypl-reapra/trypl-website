"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Container, Eyebrow, ArrowLink } from "@/components/ui";
import InternshipCard from "@/components/internships/InternshipCard";
import { getAllInternships } from "@/data/internships";
import { useT } from "@/i18n/LocaleProvider";

export default function InternshipPreview() {
  const items = getAllInternships().slice(0, 3);
  const t = useT();

  return (
    <section data-nav-theme="light" className="bg-paper text-ink">
      <Container className="py-24 sm:py-32 lg:py-40">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <Eyebrow>{t.preview.eyebrow}</Eyebrow>
            <Reveal>
              <h2 className="mt-7 font-jp text-[clamp(1.9rem,5vw,3.5rem)] font-bold tracking-[-0.02em]">
                {t.preview.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 leading-relaxed text-mute">
                {t.preview.lead}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <ArrowLink href="/internships" className="shrink-0">
              {t.preview.all}
            </ArrowLink>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <StaggerItem key={i.slug} className="h-full">
              <InternshipCard internship={i} className="h-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
