"use client";

import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/cn";
import { site, events } from "@/data/site";
import { socials, entryForm } from "@/data/socials";
import { usePages } from "@/i18n/pages";

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path
        d="M7 17L17 7M7 7h10v10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkRow({
  label,
  sub,
  href,
  available,
  prep,
}: {
  label: string;
  sub?: string;
  href: string;
  available: boolean;
  prep: string;
}) {
  const inner = (
    <div
      className={cn(
        "group flex items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        available
          ? "border-line hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-paper"
          : "border-line/70 opacity-50",
      )}
    >
      <div className="min-w-0">
        <p className="font-medium">{label}</p>
        {sub && (
          <p className="truncate text-sm text-mute group-hover:text-paper/70">
            {sub}
          </p>
        )}
      </div>
      {available ? <ArrowUpRight /> : <span className="shrink-0 text-xs text-mute">{prep}</span>}
    </div>
  );

  if (!available) return inner;
  const external = /^https?:\/\//.test(href);
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href}>{inner}</Link>
  );
}

export default function LinksContent() {
  const pages = usePages();
  const t = pages.links;
  return (
    <section
      data-nav-theme="light"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-paper px-page pb-20 pt-28 text-ink"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />

      <div className="relative w-full max-w-lg">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <LogoMark className="h-12 w-12" />
            <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
              TrypL
            </h1>
            <p className="mt-2 text-sm text-mute">{pages.tagline}</p>
            <p className="mt-1 text-xs tracking-wide text-mute">{t.subtitle}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 space-y-3">
            <LinkRow
              label={t.entryLabel}
              sub={t.entryDesc}
              href={entryForm.href}
              available={entryForm.available}
              prep={t.prep}
            />
            <LinkRow label={t.primary[0].label} sub={t.primary[0].sub} href="/internships" available prep={t.prep} />
            <LinkRow label={t.primary[1].label} sub={t.primary[1].sub} href={events.lumaUrl} available prep={t.prep} />
            <LinkRow label={t.primary[2].label} sub={t.primary[2].sub} href="/about" available prep={t.prep} />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="eyebrow mt-12 text-center text-mute">{t.followUs}</p>
          <div className="mt-5 space-y-3">
            {socials.map((s) => (
              <LinkRow
                key={s.key}
                label={s.label}
                sub={s.handle}
                href={s.href}
                available={s.available}
                prep={t.prep}
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-col items-center gap-2 text-center text-xs text-mute">
            <a href={`mailto:${site.email}`} className="link-underline">
              {site.email}
            </a>
            <a
              href={site.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              {t.poweredBy}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
