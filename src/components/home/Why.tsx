"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal } from "@/components/motion";
import { Container, Eyebrow } from "@/components/ui";
import { useT } from "@/i18n/LocaleProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

function ShiftRow({
  from,
  to,
  index,
}: {
  from: string;
  to: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const d = index * 0.18;

  return (
    <div
      ref={ref}
      className="group grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-ink/15 py-6 sm:gap-8 sm:py-7"
    >
      {/* before — fades back with a drawn strike-through（線はテキスト幅だけ） */}
      <motion.span
        initial={{ opacity: 0, x: -24 }}
        animate={inView ? { opacity: 0.5, x: 0 } : {}}
        transition={{ duration: 1.3, ease: EASE, delay: d }}
        className="justify-self-start text-sm text-mute sm:text-base"
      >
        <span className="relative inline-block">
          {from}
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.05, ease: EASE, delay: d + 0.7 }}
            className="absolute left-0 top-1/2 h-px w-full origin-left bg-mute/50"
          />
        </span>
      </motion.span>

      {/* arrow — appears, nudges on hover */}
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: EASE, delay: d + 0.85 }}
        className="h-5 w-5 text-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>

      {/* after — slides in and pops */}
      <motion.span
        initial={{ opacity: 0, x: 28 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.3, ease: EASE, delay: d + 1.05 }}
        className="text-right font-jp text-lg font-bold tracking-tight sm:text-2xl"
      >
        {to}
      </motion.span>
    </div>
  );
}

export default function Why() {
  const t = useT();
  const shifts = t.why.shifts;
  return (
    <section data-nav-theme="light" className="bg-fog text-ink">
      <Container className="py-24 sm:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <Eyebrow>{t.why.eyebrow}</Eyebrow>
            <Reveal>
              <h2 className="mt-7 font-jp text-[clamp(1.9rem,5vw,3.5rem)] font-bold leading-[1.15] tracking-[-0.02em]">
                {t.why.titleLines[0]}
                <br />
                {t.why.titleLines[1]}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md whitespace-pre-line leading-relaxed text-mute">
                {t.why.lead}
              </p>
            </Reveal>
          </div>

          <div className="border-t border-ink/15 lg:pt-16">
            {shifts.map((s, idx) => (
              <ShiftRow key={s.to} from={s.from} to={s.to} index={idx} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
