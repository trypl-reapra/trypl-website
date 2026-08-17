"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePages } from "@/i18n/pages";
import {
  MASTERY_SITE,
  MASTERY_TYPES,
  masteryAxisView,
  type MasteryRecord,
} from "@/lib/mastery";

/** 会員ページに表示する熟達タイプ。未記録なら診断への導線を出す。 */
export default function MasteryPanel({ mastery }: { mastery?: MasteryRecord }) {
  const m = usePages().mastery;
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  async function remove() {
    setRemoving(true);
    try {
      await fetch("/api/members/mastery", { method: "DELETE" });
      router.refresh();
    } finally {
      setRemoving(false);
    }
  }

  if (!mastery) {
    return (
      <div className="rounded-2xl border border-line p-7">
        <h3 className="font-jp text-xl font-bold">{m.cardHeading}</h3>
        <p className="mt-3 text-sm leading-relaxed text-mute">{m.cardEmpty}</p>
        <a
          href={MASTERY_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
        >
          {m.cardEmptyCta}
        </a>
      </div>
    );
  }

  const t = MASTERY_TYPES[mastery.code];
  const axes = masteryAxisView(mastery);
  const recordedAt = new Date(mastery.recordedAt);
  const dateLabel = Number.isNaN(recordedAt.getTime())
    ? ""
    : recordedAt.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div className="rounded-2xl border border-line p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-jp text-xl font-bold">{m.cardHeading}</h3>
        <span className="font-mono text-[0.66rem] tracking-[0.2em] text-mute">
          {mastery.mode === "quick" ? m.cardModeQuick : m.cardModeFull}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-mute">{m.cardLead}</p>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-jp text-3xl font-bold tracking-tight">
          {t?.name ?? mastery.code}
        </span>
        <span className="font-mono text-xs tracking-[0.2em] text-mute">
          {t?.en} · {mastery.code}
        </span>
      </div>
      {t && <p className="mt-2 text-sm text-mute">{t.catch}</p>}

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {axes.map((a) => (
          <div key={a.key}>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-xs text-mute">{a.name}</dt>
              <dd className="text-xs font-medium">
                {a.label} <span className="font-mono text-mute">{a.pct}%</span>
              </dd>
            </div>
            <div className="mt-1.5 h-[3px] w-full bg-line">
              <div className="h-full bg-ink" style={{ width: `${a.pct}%` }} />
            </div>
          </div>
        ))}
      </dl>

      {mastery.sensor !== null && (
        <p className="mt-5 text-xs text-mute">
          {m.cardSensor}{" "}
          <span className="font-mono text-ink">{mastery.sensor}</span>
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-xs text-mute">
        {dateLabel && (
          <span>
            {m.cardRecordedAt} {dateLabel}
          </span>
        )}
        <a
          href={MASTERY_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          {m.cardRetake}
        </a>
        <button
          type="button"
          onClick={remove}
          disabled={removing}
          className="link-underline disabled:opacity-60"
        >
          {removing ? m.cardRemoving : m.cardRemove}
        </button>
      </div>
    </div>
  );
}
