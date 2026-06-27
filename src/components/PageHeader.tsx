import Image from "next/image";
import { Container, Eyebrow } from "@/components/ui";
import { RevealLines, Reveal } from "@/components/motion";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  lead,
  image,
}: {
  eyebrow: string;
  title: string | string[];
  lead?: ReactNode;
  /** 背景に敷く横長画像（public 配下のパス）。指定時は暗いスクリム＋白文字。 */
  image?: string;
}) {
  const lines = Array.isArray(title) ? title : [title];
  const hasImage = !!image;

  return (
    <section
      data-nav-theme={hasImage ? "dark" : "light"}
      className={cn(
        "relative overflow-hidden pb-16 pt-36 sm:pb-24 sm:pt-44",
        hasImage ? "bg-ink text-paper" : "bg-paper text-ink",
      )}
    >
      {hasImage ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* iPhone 壁紙のような自然写真を、文字が読めるよう暗く締める */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60" />
      )}

      <Container className="relative">
        <Eyebrow className={hasImage ? "text-paper/75" : undefined}>
          {eyebrow}
        </Eyebrow>
        <h1
          className={cn(
            "mt-7 font-jp text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[1.04] tracking-[-0.03em]",
            hasImage && "[text-shadow:0_2px_30px_rgba(0,0,0,0.4)]",
          )}
        >
          <RevealLines immediate lines={lines} />
        </h1>
        {lead && (
          <Reveal immediate delay={0.2}>
            <p
              className={cn(
                "mt-8 max-w-2xl text-lg leading-relaxed",
                hasImage ? "text-paper/85" : "text-mute",
              )}
            >
              {lead}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
