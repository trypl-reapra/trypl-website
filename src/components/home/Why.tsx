import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";

const shifts = [
  { from: "就活のために", to: "内発的動機から" },
  { from: "短期の実績づくり", to: "長期の時間軸で" },
  { from: "情報を受け取るだけ", to: "実践して学ぶ" },
  { from: "ひとりで悩む", to: "仲間と共創する" },
];

export default function Why() {
  return (
    <section data-nav-theme="light" className="bg-fog text-ink">
      <Container className="py-24 sm:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <Eyebrow>Why TrypL</Eyebrow>
            <Reveal>
              <h2 className="mt-7 font-jp text-[clamp(1.9rem,5vw,3.5rem)] font-bold leading-[1.15] tracking-[-0.02em]">
                なぜ、
                <br />
                TrypL なのか。
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md leading-relaxed text-mute">
                「良い大学に入る」ことに全力を注いだ先で、燃え尽きてしまう。気づけば3年生、「就活どうしよう」と焦り出す。
                <br />
                <br />
                本来、学生の時間は、もっと豊かな探索の場であるはず。TrypLは、その問いに別の入口を用意します。
              </p>
            </Reveal>
          </div>

          <Stagger className="lg:pt-16">
            <div className="border-t border-ink/15">
              {shifts.map((s) => (
                <StaggerItem key={s.to}>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-ink/15 py-6 sm:gap-8 sm:py-7">
                    <span className="text-sm text-mute line-through decoration-mute/40 sm:text-base">
                      {s.from}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="h-5 w-5 text-mute"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-right font-jp text-lg font-bold tracking-tight sm:text-2xl">
                      {s.to}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
