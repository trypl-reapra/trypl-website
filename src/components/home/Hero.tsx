import { RevealLines, Parallax, Magnetic } from "@/components/motion";
import { RingsSvg, DashRing } from "@/components/decor";
import { Button, Eyebrow } from "@/components/ui";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-paper text-ink">
      {/* faint geometric grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-[0.9]" />

      {/* concentric rings, slow rotation + parallax drift */}
      <Parallax
        speed={0.12}
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(112vw,1000px)] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative h-full w-full opacity-[0.85]">
          <div className="absolute inset-0 animate-spin-slower text-ink">
            <RingsSvg />
          </div>
          <div
            className="absolute inset-0 animate-spin-slow text-ink [animation-direction:reverse]"
          >
            <DashRing />
          </div>
        </div>
      </Parallax>

      {/* top + bottom fade so rings melt into the page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-page">
        <div className="max-w-4xl">
          <Eyebrow>REAPRA発・実践型コミュニティ</Eyebrow>

          <h1 className="mt-7 font-jp text-[clamp(2.7rem,9vw,7.5rem)] font-bold leading-[0.98] tracking-[-0.03em]">
            <RevealLines
              lines={["社会とつながり、", "やりながら学ぶ。"]}
              delay={0.05}
            />
          </h1>

          <RevealLines
            className="mt-8 max-w-xl text-base leading-relaxed text-mute sm:text-lg"
            delay={0.45}
            lines={[
              "TrypL（トリプル）は、REAPRA発の若年層向け実践型インターンコミュニティ。",
              "内発的動機を起点に、実践から「社会と共創する熟達」への一歩を。",
            ]}
          />

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button href="/internships" size="lg">
                募集を見る
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
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
            <Button href="/about" variant="outline" size="lg">
              TrypLとは
            </Button>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-mute sm:flex">
        <span className="eyebrow text-[0.625rem]">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="animate-cue absolute inset-x-0 top-0 h-4 bg-ink" />
        </span>
      </div>
    </section>
  );
}
