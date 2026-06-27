import { Container, Eyebrow } from "@/components/ui";
import { RevealLines, Reveal } from "@/components/motion";
import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string | string[];
  lead?: ReactNode;
}) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-36 text-ink sm:pb-24 sm:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-60" />
      <Container className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-7 font-jp text-[clamp(2.4rem,7vw,5.5rem)] font-bold leading-[1.04] tracking-[-0.03em]">
          <RevealLines lines={lines} />
        </h1>
        {lead && (
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mute">
              {lead}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
