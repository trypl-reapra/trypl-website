"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/PageHeader";
import JoinCTA from "@/components/home/JoinCTA";
import { Container, Section, Button, Eyebrow } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { events } from "@/data/site";
import { usePages } from "@/i18n/pages";
import { useLocale } from "@/i18n/LocaleProvider";
import { fmtDateLocale } from "@/lib/fmtDate";

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

export default function EventsContent({
  upcoming = [],
}: {
  upcoming?: EventItem[];
}) {
  const t = usePages();
  const { locale } = useLocale();
  const e = t.events;
  const today = new Date().toISOString().slice(0, 10);

  const { status } = useSession();
  const authed = status === "authenticated";
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (!authed) {
      setRegistered(new Set());
      return;
    }
    let on = true;
    fetch("/api/events/registrations")
      .then((r) => r.json())
      .then((d) => on && setRegistered(new Set<string>(d.eventIds ?? [])))
      .catch(() => {});
    return () => {
      on = false;
    };
  }, [authed]);

  async function toggleRsvp(id: string, join: boolean) {
    setPending(id);
    try {
      const res = await fetch("/api/events/register", {
        method: join ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id }),
      });
      if (res.ok) {
        setRegistered((prev) => {
          const n = new Set(prev);
          if (join) n.add(id);
          else n.delete(id);
          return n;
        });
      }
    } finally {
      setPending(null);
    }
  }

  const rsvpBtn =
    "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[0.95rem] font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60";

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
                            {fmtDateLocale(ev.date, locale)}
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
                      {ev.date >= today && (
                        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end sm:pl-4">
                          {authed ? (
                            registered.has(ev.id) ? (
                              <>
                                <span className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-ink/[0.06] px-5 text-sm font-semibold text-ink">
                                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                                    <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  {e.registered}
                                </span>
                                <button
                                  type="button"
                                  disabled={pending === ev.id}
                                  onClick={() => toggleRsvp(ev.id, false)}
                                  className="text-xs text-mute link-underline disabled:opacity-50"
                                >
                                  {e.cancelRsvp}
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                disabled={pending === ev.id}
                                onClick={() => toggleRsvp(ev.id, true)}
                                className={rsvpBtn}
                              >
                                {pending === ev.id ? "…" : e.register}
                              </button>
                            )
                          ) : (
                            <Button
                              href={`/members?next=${encodeURIComponent("/events")}`}
                              size="md"
                            >
                              {e.register}
                            </Button>
                          )}
                          {ev.registerUrl && (
                            <a
                              href={ev.registerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-mute link-underline"
                            >
                              {e.externalPage}
                            </a>
                          )}
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
            {[...events.photos, ...events.photos].map((p, i) => (
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
