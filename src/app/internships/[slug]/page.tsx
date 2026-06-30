import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Badge } from "@/components/ui";
import { Reveal } from "@/components/motion";
import InternshipCard from "@/components/internships/InternshipCard";
import ApplyButton from "@/components/internships/ApplyButton";
import {
  CATEGORIES,
  WORK_STYLE_LABEL,
  asCategoryKey,
  getAllInternships,
  getInternship,
  type Internship,
} from "@/data/internships";
import {
  getOverrides,
  listPublicAdminInternships,
  type AdminInternship,
} from "@/lib/store";

// 管理画面の上書き（応募URL・会社HP・非表示など）を反映するため都度描画。
export const dynamic = "force-dynamic";

/** 管理画面で追加した募集を募集詳細の形に変換。 */
function mapAdmin(a: AdminInternship): Internship {
  return {
    slug: `admin-${a.id}`,
    company: a.company,
    companyTag: "インターン募集",
    title: a.title,
    category: asCategoryKey(a.category),
    location: a.location || "—",
    workStyle: "remote",
    commitment: "—",
    duration: "—",
    compensation: a.compensation || "応相談",
    summary: a.summary || "",
    about: a.summary || "",
    responsibilities: [],
    requirements: [],
    welcome: [],
    tags: [],
    applyUrl: a.applyUrl || "",
    applyLabel: "応募する",
    companyUrl: a.companyUrl,
    headerImage: a.headerImage,
    postedAt: a.createdAt.slice(0, 10),
    featured: false,
  };
}

/** slug から募集を解決（コード募集は上書き適用、admin- は管理画面の追加分）。 */
async function resolveInternship(slug: string): Promise<Internship | null> {
  if (slug.startsWith("admin-")) {
    const id = slug.slice("admin-".length);
    const a = (await listPublicAdminInternships()).find((x) => x.id === id);
    return a ? mapAdmin(a) : null;
  }
  const base = getInternship(slug);
  if (!base) return null;
  const ov = (await getOverrides())[slug];
  if (ov?.hidden) return null;
  return ov
    ? {
        ...base,
        company: ov.company ?? base.company,
        title: ov.title ?? base.title,
        location: ov.location ?? base.location,
        compensation: ov.compensation ?? base.compensation,
        summary: ov.summary ?? base.summary,
        applyUrl: ov.applyUrl ?? base.applyUrl,
        companyUrl: ov.companyUrl ?? base.companyUrl,
        category: ov.category ? asCategoryKey(ov.category) : base.category,
      }
    : base;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = await resolveInternship(slug);
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
  const i = await resolveInternship(slug);
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
              {i.companyUrl && (
                <a
                  href={i.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink link-underline"
                >
                  会社ホームページを見る
                  <span aria-hidden>↗</span>
                </a>
              )}
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
                {i.companyUrl && (
                  <a
                    href={i.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-between gap-2 rounded-xl border border-line px-4 py-3 text-sm font-medium transition-colors hover:border-ink"
                  >
                    <span>会社ホームページ</span>
                    <span aria-hidden>↗</span>
                  </a>
                )}
                <ApplyButton
                  slug={i.slug}
                  applyLabel={i.applyLabel}
                  applyUrl={i.applyUrl}
                />
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
