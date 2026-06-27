"use client";

import { motion } from "framer-motion";
import { Button, Badge } from "@/components/ui";
import { Magnetic } from "@/components/motion";
import {
  CATEGORIES,
  WORK_STYLE_LABEL,
  type Internship,
} from "@/data/internships";

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="border-t border-line pt-7">
      <h3 className="text-sm font-semibold tracking-wide text-mute">{title}</h3>
      <ul className="mt-4 space-y-3">
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

export default function InternshipDetailPanel({
  internship: i,
  onClose,
}: {
  internship: Internship;
  onClose: () => void;
}) {
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
    <div className="flex max-h-[88vh] flex-col">
      {/* sticky header */}
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-paper/85 px-6 py-5 backdrop-blur-xl sm:px-9">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-line px-3 py-1 text-xs text-mute">
              {CATEGORIES[i.category]}
            </span>
            {i.featured && (
              <span className="eyebrow text-[0.625rem] text-ink">Featured</span>
            )}
          </div>
          <p className="mt-3 truncate text-sm text-mute">
            {i.company} · {i.companyTag}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-ink hover:text-paper"
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
          <div className="space-y-9">
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-mute">
                この企業・チームについて
              </h3>
              <p className="mt-4 leading-relaxed">{i.about}</p>
            </div>
            <DetailList title="主な業務" items={i.responsibilities} />
            <DetailList title="求める人物像" items={i.requirements} />
            <DetailList title="歓迎する経験・スキル" items={i.welcome} />
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
              <div className="mt-7">
                <Magnetic className="w-full">
                  <Button href={i.applyUrl} size="lg" className="w-full">
                    {i.applyLabel}
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
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
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
