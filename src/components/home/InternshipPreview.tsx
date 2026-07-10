"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Container, Eyebrow, ArrowLink } from "@/components/ui";
import InternshipCard from "@/components/internships/InternshipCard";
import InternshipModal from "@/components/internships/InternshipModal";
import { getAllInternships, type Internship } from "@/data/internships";
import { useT } from "@/i18n/LocaleProvider";

export default function InternshipPreview() {
  const items = getAllInternships().slice(0, 3);
  const t = useT();
  const [selected, setSelected] = useState<Internship | null>(null);

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
              <motion.div
                layoutId={`card-${i.slug}`}
                style={{ borderRadius: 16 }}
                className="h-full"
              >
                <InternshipCard
                  internship={i}
                  onSelect={() => setSelected(i)}
                  className="h-full"
                />
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* 経験設計のモデル図 */}
        <Reveal delay={0.1}>
          <figure className="mt-12 rounded-3xl border border-line bg-fog p-7 sm:p-10">
            <figcaption>
              <p className="eyebrow text-mute">Model</p>
              <p className="mt-3 font-jp text-xl font-bold sm:text-2xl">
                {t.preview.model.heading}
              </p>
            </figcaption>

            <div className="mt-8 space-y-8">
              {/* 深める（1現場・長期） */}
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-jp text-sm font-bold">
                    {t.preview.model.deepLabel}
                  </span>
                  <span className="text-xs text-mute">
                    {t.preview.model.deepDesc}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="col-span-3 flex h-11 items-center truncate rounded-full bg-ink px-5 text-xs font-medium text-paper">
                    {t.preview.model.deepBar}
                  </div>
                </div>
              </div>

              {/* 横断する（半年 × 複数現場） */}
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-jp text-sm font-bold">
                    {t.preview.model.crossLabel}
                  </span>
                  <span className="text-xs text-mute">
                    {t.preview.model.crossDesc}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {t.preview.model.crossBars.map((label) => (
                    <div
                      key={label}
                      className="flex h-11 items-center truncate rounded-full border border-line bg-paper px-3 text-xs font-medium text-ink sm:px-5"
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between border-t border-line pt-2 font-display text-[11px] tracking-wide text-mute">
                  {t.preview.model.months.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-7 max-w-2xl text-sm leading-relaxed text-mute">
              {t.preview.model.caption}
            </p>
          </figure>
        </Reveal>
      </Container>

      <InternshipModal selected={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
