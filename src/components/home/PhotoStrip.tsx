import Image from "next/image";
import { Container, Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { events } from "@/data/site";

/** ホームに置く、写真が横に流れるストリップ（ホバーで一時停止）。 */
export default function PhotoStrip() {
  // 途切れず流すため写真を複製。
  const row = [...events.photos, ...events.photos];

  return (
    <section data-nav-theme="light" className="overflow-hidden bg-fog py-20 sm:py-28">
      <Container>
        <Eyebrow>Community · 活動の様子</Eyebrow>
        <Reveal>
          <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
            現場には、いつも仲間がいる。
          </h2>
        </Reveal>
      </Container>

      <div className="marquee relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-fog to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-fog to-transparent sm:w-28" />
        <div className="marquee-track">
          {row.map((p, i) => (
            <figure
              key={i}
              className="group relative mx-3 aspect-[3/2] h-48 shrink-0 overflow-hidden rounded-2xl bg-mist sm:h-64"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="380px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
