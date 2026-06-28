"use client";

import { useEffect, useState } from "react";
import { Container, Eyebrow } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { useT } from "@/i18n/LocaleProvider";

type PressItem = {
  id: string;
  title: string;
  outlet: string;
  url: string;
  date: string;
  summary: string;
};

function fmt(d: string) {
  const dt = new Date(d + "T00:00:00");
  if (Number.isNaN(dt.getTime())) return d;
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
}

export default function Press() {
  const t = useT();
  const [items, setItems] = useState<PressItem[] | null>(null);

  useEffect(() => {
    let on = true;
    fetch("/api/press")
      .then((r) => r.json())
      .then((d) => on && setItems(d.press ?? []))
      .catch(() => on && setItems([]));
    return () => {
      on = false;
    };
  }, []);

  // 掲載がなければセクションごと非表示。
  if (!items || items.length === 0) return null;

  return (
    <section data-nav-theme="light" className="bg-paper text-ink">
      <Container className="py-24 sm:py-32">
        <Eyebrow>{t.press.eyebrow}</Eyebrow>
        <Reveal>
          <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
            {t.press.heading}
          </h2>
        </Reveal>

        <Stagger className="mt-12 divide-y divide-line border-y border-line">
          {items.slice(0, 6).map((p) => {
            const inner = (
              <div className="grid gap-2 py-6 transition-colors group-hover:opacity-70 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline sm:gap-6">
                <span className="font-display text-sm tabular-nums text-mute">
                  {fmt(p.date)}
                </span>
                <span className="min-w-0">
                  <span className="font-jp font-bold leading-snug">{p.title}</span>
                  {p.summary && (
                    <span className="mt-1 block text-sm leading-relaxed text-mute">
                      {p.summary}
                    </span>
                  )}
                </span>
                <span className="text-xs text-mute">
                  {p.outlet}
                  {p.url && <span className="ml-2">↗</span>}
                </span>
              </div>
            );
            return (
              <StaggerItem key={p.id}>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group">{inner}</div>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
