"use client";

import Image from "next/image";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { useT, useLocale } from "@/i18n/LocaleProvider";
import { fmtDateLocale } from "@/lib/fmtDate";

export default function NewsArticle({
  title,
  date,
  summary,
  body,
  image,
}: {
  title: string;
  date: string;
  summary: string;
  body: string;
  image: string;
}) {
  const t = useT();
  const { locale } = useLocale();
  const n = t.news;

  return (
    <Section tone="light" topPad={false} className="pt-28 sm:pt-32">
      <Container>
        <article className="mx-auto max-w-2xl">
          <Eyebrow>{n.eyebrow}</Eyebrow>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-mute">
            <span className="font-display tabular-nums">{fmtDateLocale(date, locale)}</span>
          </div>
          <h1 className="mt-4 font-jp text-[clamp(1.7rem,4.5vw,2.6rem)] font-bold leading-[1.3] tracking-[-0.02em]">
            {title}
          </h1>

          {image && (
            <Reveal className="mt-8 overflow-hidden rounded-2xl border border-line">
              <div className="relative aspect-[16/9]">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          )}

          <div className="mt-8 leading-[1.95] text-ink/85">
            {body ? (
              body.split("\n").map((line, i) =>
                line.trim() === "" ? (
                  <div key={i} className="h-4" />
                ) : (
                  <p key={i} className="mt-4 first:mt-0">
                    {line}
                  </p>
                ),
              )
            ) : (
              <p>{summary}</p>
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-8">
            <Link href="/" className="text-sm text-mute link-underline">
              ← {n.back}
            </Link>
          </div>
        </article>
      </Container>
    </Section>
  );
}
