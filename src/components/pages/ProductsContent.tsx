"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import JoinCTA from "@/components/home/JoinCTA";
import { Container, Section, Eyebrow } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { MASTERY_SITE } from "@/lib/mastery";
import { usePages } from "@/i18n/pages";

/** 各プロダクトの遷移先。文言は i18n、行き先はここで持つ（翻訳者がURLを触らずに済む）。 */
const HREFS = [MASTERY_SITE, "/members", "/internships", "/events"];

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

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductsContent() {
  const t = usePages();
  const p = t.productsPage;

  return (
    <>
      <PageHeader
        eyebrow={t.headers.products.eyebrow}
        title={t.headers.products.title}
        lead={t.headers.products.lead}
      />

      <Section tone="light" topPad={false}>
        <Container>
          <Reveal>
            <p className="max-w-3xl text-base leading-[1.95] text-mute sm:text-lg">
              {p.intro}
            </p>
          </Reveal>

          {/* 4つの入口。番号を大きく振って、上から順に読める並びにする */}
          <div className="mt-20 space-y-20 sm:mt-28 sm:space-y-28">
            {p.items.map((item, i) => {
              const href = HREFS[i] ?? "/";
              const inner = (
                <span className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors hover:bg-ink-soft">
                  {item.cta}
                  {item.external ? <ArrowUpRight /> : <ArrowRight />}
                </span>
              );
              return (
                <article
                  key={item.num}
                  className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] lg:gap-12"
                >
                  {/* 通し番号。フィールドノート的な「記録 01」の並びに揃える */}
                  <Reveal>
                    <div className="flex items-baseline gap-4 lg:block">
                      <span className="font-mono text-4xl font-bold tabular-nums text-ink/15 sm:text-5xl">
                        {item.num}
                      </span>
                      <span className="eyebrow whitespace-nowrap text-mute lg:mt-4 lg:block">
                        {item.badge}
                      </span>
                    </div>
                  </Reveal>

                  <div className="min-w-0">
                    <Reveal delay={0.05}>
                      <h2 className="font-jp text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.3] tracking-[-0.02em]">
                        {item.name}
                      </h2>
                      <p className="mt-3 font-display text-lg font-semibold text-ink/80 sm:text-xl">
                        {item.tagline}
                      </p>
                    </Reveal>

                    <Reveal delay={0.1}>
                      <p className="mt-6 max-w-2xl text-[0.98rem] leading-[1.95] text-mute">
                        {item.body}
                      </p>
                    </Reveal>

                    <Stagger className="mt-8 grid gap-2.5 sm:grid-cols-2">
                      {item.points.map((pt) => (
                        <StaggerItem key={pt}>
                          <span className="flex items-start gap-3 text-sm leading-relaxed">
                            <span
                              aria-hidden="true"
                              className="mt-[0.42em] h-[7px] w-[7px] shrink-0 rotate-45 bg-ink"
                            />
                            {pt}
                          </span>
                        </StaggerItem>
                      ))}
                    </Stagger>

                    <Reveal delay={0.15}>
                      <div className="mt-9">
                        {item.external ? (
                          <a href={href} target="_blank" rel="noopener noreferrer">
                            {inner}
                          </a>
                        ) : (
                          <Link href={href}>{inner}</Link>
                        )}
                      </div>
                    </Reveal>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 順番を強制しないことを明示する。診断から入っても募集から入ってもよい */}
      <Section tone="fog">
        <Container>
          <Reveal>
            <Eyebrow className="text-mute">Flow</Eyebrow>
            <h2 className="mt-6 max-w-3xl font-jp text-[clamp(1.5rem,3.6vw,2.6rem)] font-bold leading-[1.35] tracking-[-0.02em]">
              {p.flowTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-[1.95] text-mute">
              {p.flowLead}
            </p>
          </Reveal>

          <Stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {p.items.map((item, i) => (
              <StaggerItem key={item.num}>
                {item.external ? (
                  <a
                    href={HREFS[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.66rem] tracking-[0.2em] text-mute">
                        {item.num}
                      </span>
                      <span className="mt-1.5 block truncate font-jp font-bold">
                        {item.name}
                      </span>
                    </span>
                    <ArrowUpRight />
                  </a>
                ) : (
                  <Link
                    href={HREFS[i]}
                    className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.66rem] tracking-[0.2em] text-mute">
                        {item.num}
                      </span>
                      <span className="mt-1.5 block truncate font-jp font-bold">
                        {item.name}
                      </span>
                    </span>
                    <ArrowRight />
                  </Link>
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* いちばん軽い入口（診断）へ最後にもう一度送る */}
      <Section tone="dark">
        <Container>
          <Reveal>
            <Eyebrow className="text-paper/70">Start here</Eyebrow>
            <h2 className="mt-6 max-w-3xl font-jp text-[clamp(1.7rem,4.4vw,3.2rem)] font-bold leading-[1.3] tracking-[-0.02em] text-paper">
              {p.ctaTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-[1.95] text-paper/70">
              {p.ctaLead}
            </p>
            <a
              href={MASTERY_SITE}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-paper px-7 text-sm font-medium text-ink transition-colors hover:bg-paper/90"
            >
              {p.items[0].cta}
              <ArrowUpRight />
            </a>
          </Reveal>
        </Container>
      </Section>

      <JoinCTA />
    </>
  );
}
