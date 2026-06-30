"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui";
import ApplyButton from "@/components/internships/ApplyButton";
import {
  CATEGORIES,
  WORK_STYLE_LABEL,
  headerImageFor,
  type Internship,
} from "@/data/internships";
import { internshipBodyHtml, sanitizeBodyHtml, safeHref } from "@/lib/internshipBody";
import { useT } from "@/i18n/LocaleProvider";
import { usePages } from "@/i18n/pages";

export default function InternshipDetailPanel({
  internship: i,
  onClose,
}: {
  internship: Internship;
  onClose: () => void;
}) {
  const t = useT();
  const fl = usePages().internshipsFilter;
  const facts: [string, string][] = [
    [fl.facts.location, i.location],
    [fl.facts.workStyle, WORK_STYLE_LABEL[i.workStyle]],
    [fl.facts.commitment, i.commitment],
    [fl.facts.duration, i.duration],
    [fl.facts.compensation, i.compensation],
    [fl.facts.category, CATEGORIES[i.category]],
    [fl.facts.postedAt, i.postedAt.replace(/-/g, ".")],
  ];

  return (
    <div className="flex max-h-[88vh] flex-col">
      {/* 横長のヘッダー画像（iPhone 壁紙風）。閉じる・企業名をオーバーレイ。 */}
      <div className="relative h-36 shrink-0 sm:h-48">
        <Image
          src={i.headerImage || headerImageFor(i.slug)}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10" />

        <button
          type="button"
          onClick={onClose}
          aria-label={t.a11y.close}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ink/40 text-paper backdrop-blur-md transition-colors hover:bg-ink/70"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-3 px-6 pb-5 sm:px-9">
          <span className="inline-flex items-center rounded-full border border-paper/30 bg-ink/20 px-3 py-1 text-xs text-paper backdrop-blur-md">
            {CATEGORIES[i.category]}
          </span>
          {i.featured && (
            <span className="eyebrow text-[0.625rem] text-paper">Featured</span>
          )}
          <span className="text-sm text-paper/85">
            {i.company}
            {i.companyTag ? ` · ${i.companyTag}` : ""}
          </span>
        </div>
      </div>

      {/* scrollable body */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="overflow-y-auto overscroll-contain px-6 py-8 sm:px-9 sm:py-10"
        data-lenis-prevent
      >
        <h2 className="font-jp text-[clamp(1.6rem,4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em]">
          {i.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mute">
          {i.summary}
        </p>

        <div className="mt-9 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div className="space-y-7">
            <div
              className="max-w-none leading-relaxed [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-7 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-1.5 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold [&_hr]:my-6 [&_hr]:border-line [&_li]:leading-relaxed [&_p]:my-3 [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&>:first-child]:mt-0"
              dangerouslySetInnerHTML={{
                __html: sanitizeBodyHtml(internshipBodyHtml(i)),
              }}
            />
            {i.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-line pt-7">
                {i.tags.map((t) => (
                  <Badge key={t} className="text-mute">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <aside>
            <div className="rounded-2xl border border-line p-6 sm:p-7 lg:sticky lg:top-4">
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
                  href={safeHref(i.companyUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-between gap-2 rounded-xl border border-line px-4 py-3 text-sm font-medium transition-colors hover:border-ink"
                >
                  <span>{fl.companyHomepage}</span>
                  <span aria-hidden>↗</span>
                </a>
              )}
              <ApplyButton
                slug={i.slug}
                applyLabel={i.applyLabel}
                applyUrl={i.applyUrl}
              />
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
