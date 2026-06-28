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
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <PageHeader
        eyebrow={t.headers.events.eyebrow}
        title={t.headers.events.title}
        lead={t.headers.events.lead}
      />

      {/* 開催予定（イベント一覧） */}
      <Section tone="light" topPad={false}>
        <Container>
          <Eyebrow>{e.upcomingEyebrow}</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
              {e.upcomingHeading}
            </h2>
          </Reveal>

          {upcoming.length > 0 ? (
            <Stagger className="mt-12 space-y-5">
              {upcoming.map((ev) => (
                <StaggerItem key={ev.id}>
                  <article
                    className={
                      "overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-500 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_30px_70px_-45px_rgba(0,0,0,0.4)] sm:flex " +
                      (ev.date < today ? "opacity-70" : "")
                    }
                  >
                    {ev.image && (
                      <div className="relative aspect-[16/10] shrink-0 sm:aspect-auto sm:w-60">
                        <Image
                          src={ev.image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 240px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-mute">
                          <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-semibold tabular-nums text-paper">
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
                          {ev.date < today && (
                            <span className="inline-flex items-center rounded-full bg-mist px-2.5 py-0.5 text-xs text-mute">
                              {e.ended}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 font-jp text-xl font-bold tracking-tight sm:text-2xl">
                          {ev.title}
                        </h3>
                        {ev.description && (
                          <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-mute">
                            {ev.description}
                          </p>
                        )}
                        {!ev.online && ev.place && (
                          <p className="mt-2 text-sm text-mute">📍 {ev.place}</p>
                        )}
                      </div>
                      {ev.registerUrl && (
                        <div className="shrink-0 sm:pl-4">
                          <Button href={ev.registerUrl} size="md">
                            {e.register}
                          </Button>
                        </div>
                      )}
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="mt-10 rounded-2xl border border-line bg-paper p-10 text-center text-sm leading-relaxed text-mute">
              {e.noUpcoming}
            </p>
          )}
        </Container>
      </Section>

      {/* 活動の様子 */}
      <Section tone="fog">
        <Container>
          <Eyebrow>{e.galleryEyebrow}</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
              {e.galleryHeading}
            </h2>
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
