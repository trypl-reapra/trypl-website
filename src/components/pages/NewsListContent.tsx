"use client";

import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Container, Section } from "@/components/ui";
import { Stagger, StaggerItem } from "@/components/motion";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { usePages } from "@/i18n/pages";
import { fmtDateLocale } from "@/lib/fmtDate";

type PressItem = {
  id: string;
  title: string;
  date: string;
  summary: string;
  image?: string;
};

export default function NewsListContent({ items }: { items: PressItem[] }) {
  const t = useT();
  const pages = usePages();
  const { locale } = useLocale();
  const h = pages.headers.news;

  return (
    <>
      <PageHeader eyebrow={h.eyebrow} title={h.title} lead={h.lead} />

      <Section tone="light" topPad={false}>
        <Container>
          {items.length === 0 ? (
            <p className="rounded-2xl border border-line bg-paper p-10 text-center text-sm leading-relaxed text-mute">
              {t.press.empty}
            </p>
          ) : (
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
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
                        <span className="font-display tabular-nums">
                          {fmtDateLocale(p.date, locale)}
                        </span>
                      </div>
                      <h3 className="mt-2 font-jp font-bold leading-snug">{p.title}</h3>
                      {p.summary && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mute">
                          {p.summary}
                        </p>
                      )}
                      <span className="mt-auto pt-3 text-xs font-medium text-ink">
                        {t.press.more} →
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Container>
      </Section>
    </>
  );
}
