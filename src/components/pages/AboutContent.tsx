"use client";

import { Fragment } from "react";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import JoinCTA from "@/components/home/JoinCTA";
import { Container, Section, Eyebrow } from "@/components/ui";
import { Reveal, RevealLines, Stagger, StaggerItem } from "@/components/motion";
import { representative } from "@/data/team";
import { usePages } from "@/i18n/pages";

export default function AboutContent() {
  const t = usePages();
  const a = t.about;

  return (
    <>
      <PageHeader
        eyebrow={t.headers.about.eyebrow}
        title={t.headers.about.title}
        lead={t.headers.about.lead}
      />

      {/* What */}
      <Section tone="light" topPad={false}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Eyebrow>{a.whatEyebrow}</Eyebrow>
            <div className="max-w-2xl">
              <Reveal>
                <p className="font-jp text-2xl font-bold leading-[1.5] tracking-[-0.01em] sm:text-3xl">
                  {a.whatLede}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-8 leading-relaxed text-mute">{a.whatP1}</p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-6 leading-relaxed text-mute">{a.whatP2}</p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* The name */}
      <Section tone="fog">
        <Container>
          <Eyebrow>{a.nameEyebrow}</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.9rem,5vw,3.5rem)] font-bold tracking-[-0.02em]">
              {a.nameHeading}
            </h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {a.triple.map((it) => (
              <StaggerItem key={it.key} className="bg-fog p-8 sm:p-10">
                <span className="font-display text-5xl font-bold tracking-tight text-ink">
                  L
                </span>
                <p className="eyebrow mt-6 text-mute">{it.key}</p>
                <p className="mt-2 font-jp text-2xl font-bold">{it.jp}</p>
                <p className="mt-4 text-sm leading-relaxed text-mute">{it.body}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <div className="mt-14 overflow-hidden rounded-3xl border border-line bg-paper p-8 sm:p-12">
              <div className="flex flex-wrap items-end gap-x-5 gap-y-7 font-display sm:gap-x-8">
                {a.words.map((w, i) => (
                  <Fragment key={w.en}>
                    {i > 0 && (
                      <span className="pb-7 text-2xl font-light text-mute sm:pb-9 sm:text-4xl">
                        ×
                      </span>
                    )}
                    <span className="leading-none">
                      <span className="block text-4xl font-bold tracking-tight text-ink sm:text-6xl">
                        {w.en === "pLay" ? (
                          <>
                            p
                            <span className="text-ink underline decoration-2 underline-offset-4">
                              L
                            </span>
                            ay
                          </>
                        ) : (
                          w.en
                        )}
                      </span>
                      <span className="mt-3 block font-jp text-sm font-medium text-mute sm:text-base">
                        {w.jp}
                      </span>
                    </span>
                  </Fragment>
                ))}
              </div>
              <p className="mt-9 max-w-xl border-t border-line pt-8 leading-relaxed text-mute">
                {a.nameTagline}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* REAPRA */}
      <Section tone="dark">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Eyebrow className="text-mute-dark">{a.reapraEyebrow}</Eyebrow>
            <div className="max-w-2xl">
              <h2 className="font-jp text-[clamp(1.7rem,4vw,3rem)] font-bold leading-[1.25] tracking-[-0.02em] text-paper">
                <RevealLines lines={a.reapraHeading} />
              </h2>
              <Reveal delay={0.2}>
                <p className="mt-8 leading-relaxed text-mute-dark">{a.reapraP1}</p>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="mt-6 leading-relaxed text-mute-dark">{a.reapraP2}</p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Vision */}
      <Section tone="light">
        <Container>
          <Eyebrow>{a.visionEyebrow}</Eyebrow>
          <h2 className="mt-8 max-w-5xl font-jp text-[clamp(1.9rem,5.2vw,4rem)] font-bold leading-[1.18] tracking-[-0.02em]">
            <RevealLines lines={a.visionHeading} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-2xl leading-relaxed text-mute">{a.visionP}</p>
          </Reveal>
        </Container>
      </Section>

      {/* Message */}
      <Section tone="fog">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.82fr] lg:gap-20">
            <div className="order-2 lg:order-1">
              <Eyebrow>{a.msgEyebrow}</Eyebrow>
              <Reveal>
                <h2 className="mt-7 font-jp text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold leading-[1.45] tracking-[-0.02em]">
                  {a.msgTitle}
                </h2>
              </Reveal>
              <div className="mt-8 max-w-2xl">
                {a.msgBody.map((para, i) => (
                  <Reveal key={i} delay={0.05 + i * 0.05}>
                    <p
                      className={"leading-[1.95] text-mute" + (i > 0 ? " mt-6" : "")}
                    >
                      {para}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal scale blur className="order-1 lg:order-2 lg:sticky lg:top-28">
              <figure>
                <Image
                  src={representative.photo!}
                  alt={a.repName}
                  width={900}
                  height={1080}
                  priority
                  className="aspect-[4/5] w-full rounded-3xl object-cover"
                />
                <figcaption className="mt-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-jp text-xl font-bold text-ink">
                      {a.repName}
                    </span>
                    {representative.reading && (
                      <span className="font-display text-xs tracking-wide text-mute">
                        {representative.reading}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-mute">{a.repRole}</p>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Container>
      </Section>

      <JoinCTA />
    </>
  );
}
