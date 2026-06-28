"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  image?: string;
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

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((p) => (
            <StaggerItem key={p.id} className="h-full">
              <Link
                href={`/news/${p.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-all duration-500 hover:-translate-y-1 hover:border-ink hover:shadow-[0_30px_70px_-45px_rgba(0,0,0,0.45)]"
              >
                {p.image && (
                  <div className="relative aspect-[16/9] overflow-hidden bg-mist">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(max-width:640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3 text-xs text-mute">
                    <span className="font-display tabular-nums">{fmt(p.date)}</span>
                    {p.outlet && (
                      <span className="rounded-full border border-line px-2 py-0.5">
                        {p.outlet}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-jp font-bold leading-snug">{p.title}</h3>
                  {p.summary && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mute">
                      {p.summary}
                    </p>
                  )}
                  <span className="mt-auto pt-3 text-xs font-medium text-ink">
                    詳しく見る →
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
