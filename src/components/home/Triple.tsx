"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Container, Eyebrow } from "@/components/ui";
import { usePages } from "@/i18n/pages";
import { cn } from "@/lib/cn";

export default function Triple() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const home = usePages().home;
  const triple = home.triple;
  const TRY = home.tryLine;
  const n = triple.length;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n))));
  });

  /* reduced-motion / no-JS friendly: static three columns */
  if (reduce) {
    return (
      <section data-nav-theme="light" className="bg-paper text-ink">
        <Container className="py-24 sm:py-32">
          <Eyebrow>{home.tripleEyebrow}</Eyebrow>
          <h2 className="mt-7 font-jp text-[clamp(1.9rem,5vw,3.5rem)] font-bold tracking-[-0.02em]">
            {home.tripleHeading}
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {triple.map((t) => (
              <div key={t.key} className="border-t border-ink pt-6">
                <span className="eyebrow text-mute">{t.key}</span>
                <p className="mt-3 font-jp text-3xl font-bold">{t.jp}</p>
                <p className="mt-4 text-lg">{t.line}</p>
                <p className="mt-3 text-sm leading-relaxed text-mute">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-sm tracking-wide text-mute">{TRY}</p>
        </Container>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      data-nav-theme="light"
      className="relative bg-paper text-ink"
      style={{ height: `${n * 100}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        {/* giant faint L — three meanings, one letter */}
        <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center">
          <span className="font-display text-[58vw] font-bold leading-none text-fog">
            L
          </span>
        </div>

        <Container className="relative">
          <div className="flex items-center justify-between">
            <Eyebrow>{home.tripleEyebrow}</Eyebrow>
            <span className="font-display text-sm tabular-nums text-mute">
              {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[0.85fr_1.15fr]">
            {/* stacked list */}
            <ul className="space-y-3">
              {triple.map((t, i) => (
                <li
                  key={t.key}
                  className={cn(
                    "font-display text-3xl font-semibold tracking-tight transition-colors duration-500 sm:text-[2.6rem]",
                    i === active ? "text-ink" : "text-mist",
                  )}
                >
                  <span className="inline-flex items-center gap-4">
                    <span
                      className={cn(
                        "h-px bg-ink transition-all duration-500",
                        i === active ? "w-12 opacity-100" : "w-4 opacity-30",
                      )}
                    />
                    {t.key}
                  </span>
                </li>
              ))}
            </ul>

            {/* active content */}
            <div className="relative min-h-[230px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="eyebrow text-mute">{triple[active].key}</span>
                  <p className="mt-4 font-jp text-4xl font-bold tracking-tight sm:text-5xl">
                    {triple[active].jp}
                  </p>
                  <p className="mt-6 text-xl text-ink sm:text-2xl">
                    {triple[active].line}
                  </p>
                  <p className="mt-4 max-w-md leading-relaxed text-mute">
                    {triple[active].body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-14 h-px w-full bg-line">
            <motion.div className="h-px bg-ink" style={{ width: barWidth }} />
          </div>
          <p className="mt-5 text-xs tracking-wide text-mute sm:text-sm">{TRY}</p>
        </Container>
      </div>
    </section>
  );
}
