"use client";

import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import JoinCTA from "@/components/home/JoinCTA";
import { Container, Section, Button, Eyebrow } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { events } from "@/data/site";
import { usePages } from "@/i18n/pages";

type EventItem = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  place: string;
  online: boolean;
  description: string;
  registerUrl: string;
  image?: string;
};

const WD = ["日", "月", "火", "水", "木", "金", "土"];
function fmtDate(d: string) {
  const dt = new Date(d + "T00:00:00");
  if (Number.isNaN(dt.getTime())) return d;
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(
    dt.getDate(),
  ).padStart(2, "0")}（${WD[dt.getDay()]}）`;
}

export default function EventsContent({
  upcoming = [],
}: {
  upcoming?: EventItem[];
}) {
  const t = usePages();
  const e = t.events;
  return (
    <>
      <PageHeader
        eyebrow={t.headers.events.eyebrow}
        title={t.headers.events.title}
        lead={t.headers.events.lead}
      />

      {upcoming.length > 0 && (
        <Section tone="light" topPad={false}>
          <Container>
            <Eyebrow>{e.upcomingEyebrow}</Eyebrow>
            <Reveal>
              <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
                {e.upcomingHeading}
              </h2>
            </Reveal>
            <Stagger className="mt-12 space-y-5">
              {upcoming.map((ev) => (
                <StaggerItem key={ev.id}>
                  <article className="grid gap-5 overflow-hidden rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-ink sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-mute">
                        <span className="tabular-nums text-ink">
                          {fmtDate(ev.date)}
                        </span>
                        {(ev.startTime || ev.endTime) && (
                          <span className="tabular-nums">
                            {ev.startTime}
                            {ev.endTime ? `–${ev.endTime}` : ""}
                          </span>
                        )}
                        <span className="inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-xs">
                          {ev.online ? e.online : ev.place || e.offline}
                        </span>
                      </div>
                      <h3 className="mt-3 font-jp text-xl font-bold tracking-tight sm:text-2xl">
                        {ev.title}
                      </h3>
                      {ev.description && (
                        <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-mute">
                          {ev.description}
                        </p>
                      )}
                      {!ev.online && ev.place && (
                        <p className="mt-3 text-sm text-mute">📍 {ev.place}</p>
                      )}
                    </div>
                    {ev.registerUrl && (
                      <div className="sm:pl-4">
                        <Button href={ev.registerUrl} size="md">
                          {e.register}
                        </Button>
                      </div>
                    )}
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </Section>
      )}

      <Section tone="dark" topPad={upcoming.length === 0 ? false : undefined}>
        <Container>
          <div className="rounded-3xl border border-line-dark p-8 sm:p-12">
            <Eyebrow className="text-mute-dark">{e.calEyebrow}</Eyebrow>
            <h2 className="mt-6 font-jp text-3xl font-bold tracking-tight text-paper sm:text-4xl">
              {e.calHeading}
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-mute-dark">
              {e.calBody}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={events.lumaUrl} variant="inverse" size="lg">
                {e.calBtn}
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
                  <path
                    d="M7 17L17 7M7 7h10v10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button href="/internships" variant="outline-invert" size="lg">
                {e.seeInternships}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="light">
        <Container>
          <Eyebrow>{e.hostEyebrow}</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
              {e.hostHeading}
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {e.kinds.map((k) => (
              <StaggerItem key={k.title} className="bg-paper p-8 sm:p-10">
                <h3 className="font-jp text-xl font-bold">{k.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-mute">{k.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <Eyebrow>{e.galleryEyebrow}</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
              {e.galleryHeading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl leading-relaxed text-mute">
              {e.galleryLead}
            </p>
          </Reveal>
        </Container>

        <Reveal className="marquee relative mt-12 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-fog to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-fog to-transparent sm:w-24" />
          <div className="marquee-track">
            {[...events.photos, ...events.photos, ...events.photos].map((p, i) => (
              <figure
                key={i}
                className="group relative mx-2 aspect-[4/3] h-36 shrink-0 overflow-hidden rounded-xl bg-mist sm:h-44"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
              </figure>
            ))}
          </div>
        </Reveal>
      </Section>

      <JoinCTA />
    </>
  );
}
