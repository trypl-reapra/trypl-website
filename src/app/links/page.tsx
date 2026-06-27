import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/cn";
import { site, events } from "@/data/site";
import { socials, entryForm } from "@/data/socials";

export const metadata: Metadata = {
  title: "リンク集",
  description:
    "TrypL の公式リンク集。各種SNS・募集一覧・参加フォームへの入口をまとめた、TrypLの母艦ページ。",
};

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
}: {
  label: string;
  sub?: string;
  href: string;
  available: boolean;
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
      {available ? (
        <ArrowUpRight />
      ) : (
        <span className="shrink-0 text-xs text-mute">準備中</span>
      )}
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

export default function LinksPage() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-paper px-page pb-20 pt-28 text-ink">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />

      <div className="relative w-full max-w-lg">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <LogoMark className="h-12 w-12" />
            <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
              TrypL
            </h1>
            <p className="mt-2 text-sm text-mute">{site.tagline}</p>
            <p className="mt-1 text-xs tracking-wide text-mute">
              REAPRA発・実践型インターンコミュニティ
            </p>
          </div>
        </Reveal>

        {/* primary actions */}
        <Reveal delay={0.1}>
          <div className="mt-10 space-y-3">
            <LinkRow
              label={entryForm.label}
              sub={entryForm.description}
              href={entryForm.href}
              available={entryForm.available}
            />
            <LinkRow
              label="募集一覧を見る"
              sub="REAPRA・投資先でのインターン"
              href="/internships"
              available
            />
            <LinkRow
              label="イベントに参加する"
              sub="説明会・座談会・ワークショップ（Luma）"
              href={events.lumaUrl}
              available
            />
            <LinkRow
              label="TrypLとは"
              sub="ミッション・名前の由来・運営"
              href="/about"
              available
            />
          </div>
        </Reveal>

        {/* socials */}
        <Reveal delay={0.2}>
          <p className="eyebrow mt-12 text-center text-mute">Follow us</p>
          <div className="mt-5 space-y-3">
            {socials.map((s) => (
              <LinkRow
                key={s.key}
                label={s.label}
                sub={s.handle}
                href={s.href}
                available={s.available}
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
              Powered by REAPRA
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
