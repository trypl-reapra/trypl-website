import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Button, Badge } from "@/components/ui";
import { Magnetic, Reveal } from "@/components/motion";
import InternshipCard from "@/components/internships/InternshipCard";
import {
  CATEGORIES,
  WORK_STYLE_LABEL,
  getAllInternships,
  getInternship,
  internships,
} from "@/data/internships";

export function generateStaticParams() {
  return internships.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = getInternship(slug);
  if (!i) return { title: "募集が見つかりません" };
  return {
    title: `${i.title}｜${i.company}`,
    description: i.summary,
    openGraph: { title: `${i.title}｜${i.company}`, description: i.summary },
  };
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="border-t border-line pt-8">
      <h2 className="text-sm font-semibold tracking-wide text-mute">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((t, idx) => (
          <li key={idx} className="flex gap-3 leading-relaxed">
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function InternshipDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const i = getInternship(slug);
  if (!i) notFound();

  const others = getAllInternships()
    .filter((x) => x.slug !== i.slug)
    .slice(0, 3);

  const facts: [string, string][] = [
    ["勤務地", i.location],
    ["勤務形態", WORK_STYLE_LABEL[i.workStyle]],
    ["コミット", i.commitment],
    ["期間", i.duration],
    ["報酬", i.compensation],
    ["カテゴリ", CATEGORIES[i.category]],
    ["掲載日", i.postedAt.replace(/-/g, ".")],
  ];

  return (
    <article className="bg-paper text-ink">
      {/* header */}
      <section className="relative overflow-hidden pb-12 pt-32 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />
        <Container className="relative">
          <Link
            href="/internships"
            className="group inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path
                d="M19 12H5M11 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            募集一覧へ戻る
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-line px-3 py-1 text-xs text-mute">
              {CATEGORIES[i.category]}
            </span>
            {i.featured && (
              <span className="eyebrow text-[0.625rem] text-ink">Featured</span>
            )}
          </div>

          <p className="mt-6 text-mute">
            {i.company} · {i.companyTag}
          </p>
          <h1 className="mt-2 max-w-4xl font-jp text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[1.08] tracking-[-0.02em]">
            {i.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mute">
            {i.summary}
          </p>
        </Container>
      </section>

      {/* body */}
      <Container className="pb-24 sm:pb-32">
        <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
          <div className="space-y-10">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-mute">
                この企業・チームについて
              </h2>
              <p className="mt-5 leading-relaxed">{i.about}</p>
            </div>
            <DetailList title="主な業務" items={i.responsibilities} />
            <DetailList title="求める人物像" items={i.requirements} />
            <DetailList title="歓迎する経験・スキル" items={i.welcome} />

            {i.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-line pt-8">
                {i.tags.map((t) => (
                  <Badge key={t} className="text-mute">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* sticky apply card */}
          <aside>
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-line p-7">
                <dl className="space-y-4">
                  {facts.map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-4 text-sm"
                    >
                      <dt className="shrink-0 text-mute">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-7">
                  <Magnetic className="w-full">
                    <Button href={i.applyUrl} size="lg" className="w-full">
                      {i.applyLabel}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="h-4 w-4"
                      >
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  </Magnetic>
                </div>
                <p className="mt-4 text-center text-xs text-mute">
                  応募前に TrypL への参加もおすすめです
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* other roles */}
      {others.length > 0 && (
        <section className="border-t border-line bg-fog">
          <Container className="py-20 sm:py-28">
            <h2 className="font-jp text-2xl font-bold tracking-tight sm:text-3xl">
              ほかの募集
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <Reveal key={o.slug} className="h-full">
                  <InternshipCard internship={o} className="h-full" />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
