"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useT } from "@/i18n/LocaleProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

/** バーが時間軸に沿って左から伸びる。 */
function GrowBar({
  show,
  delay,
  className,
  children,
}: {
  show: boolean;
  delay: number;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className}
      style={{ originX: 0 }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={show ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
      transition={{ duration: 1.0, ease: EASE, delay }}
    >
      <motion.span
        className="truncate"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.55 }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}

/** 現場から現場への矢印。 */
function HopArrow({ show, delay }: { show: boolean; delay: number }) {
  return (
    <motion.span
      aria-hidden
      className="shrink-0 font-display text-sm text-mute"
      initial={{ opacity: 0, x: -6 }}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      →
    </motion.span>
  );
}

/** 行の上をゆっくり進み続ける「あなた」のドット。 */
function Traveler({
  show,
  delay,
  className,
}: {
  show: boolean;
  delay: number;
  className: string;
}) {
  if (!show) return null;
  return (
    <motion.span
      aria-hidden
      className={
        "pointer-events-none absolute top-1/2 z-10 h-2.5 w-2.5 -translate-y-1/2 rounded-full " +
        className
      }
      initial={{ left: "2%", opacity: 0 }}
      animate={{ left: ["2%", "96%"], opacity: [0, 1, 1, 1, 0] }}
      transition={{
        delay,
        duration: 6,
        repeat: Infinity,
        repeatDelay: 1.4,
        ease: "easeInOut",
      }}
    />
  );
}

/**
 * 経験設計のモデル図。
 * 「深める」（一つの現場に長期）と「横断する」（半年単位で複数現場）の
 * 2つの道が、どちらも「社会と共創する熟達」へ向かうことをアニメーションで示す。
 */
export default function ExperienceModel() {
  const t = useT();
  const m = t.preview.model;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });
  const show = reduce ? true : inView;
  const instant = !!reduce;
  const d = (v: number) => (instant ? 0 : v);

  return (
    <figure
      ref={ref}
      className="mt-12 overflow-hidden rounded-3xl border border-line bg-fog p-7 sm:p-10"
    >
      <figcaption className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-mute">Model</p>
          <p className="mt-3 font-jp text-xl font-bold sm:text-2xl">
            {m.heading}
          </p>
        </div>
        {/* 凡例：動くドット＝あなた */}
        <div className="flex items-center gap-2 text-xs text-mute">
          <span className="relative flex h-2.5 w-2.5">
            {!instant && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-30" />
            )}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ink" />
          </span>
          {m.you}
        </div>
      </figcaption>

      <div className="mt-8 space-y-8">
        {/* 深める（1現場・長期） */}
        <div>
          <motion.div
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
            initial={{ opacity: 0, y: 10 }}
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.7, ease: EASE, delay: d(0.05) }}
          >
            <span className="font-jp text-sm font-bold">{m.deepLabel}</span>
            <span className="text-xs text-mute">{m.deepDesc}</span>
          </motion.div>
          <div className="relative mt-3">
            <GrowBar
              show={show}
              delay={d(0.25)}
              className="flex h-11 items-center rounded-full bg-ink px-5 text-xs font-medium text-paper"
            >
              {m.deepBar}
            </GrowBar>
            <Traveler show={show && !instant} delay={2.6} className="bg-paper" />
          </div>
        </div>

        {/* 横断する（半年 × 複数現場） */}
        <div>
          <motion.div
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
            initial={{ opacity: 0, y: 10 }}
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.7, ease: EASE, delay: d(0.35) }}
          >
            <span className="font-jp text-sm font-bold">{m.crossLabel}</span>
            <span className="text-xs text-mute">{m.crossDesc}</span>
          </motion.div>
          <div className="relative mt-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {m.crossBars.map((label, i) => (
                <div
                  key={label}
                  className="contents"
                >
                  {i > 0 && <HopArrow show={show} delay={d(0.55 + i * 0.45)} />}
                  <GrowBar
                    show={show}
                    delay={d(0.55 + i * 0.45)}
                    className="flex h-11 min-w-0 flex-1 items-center rounded-full border border-line bg-paper px-3 text-xs font-medium text-ink sm:px-5"
                  >
                    {label}
                  </GrowBar>
                </div>
              ))}
            </div>
            <Traveler show={show && !instant} delay={3.4} className="bg-ink" />
          </div>
          {/* 時間軸 */}
          <motion.div
            className="mt-3 flex justify-between border-t border-line pt-2 font-display text-[11px] tracking-wide text-mute"
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: d(0.4) }}
          >
            {m.months.map((mo) => (
              <span key={mo}>{mo}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 2つの道が収束するゴール */}
      <div className="mt-8 flex flex-col items-center">
        <motion.div
          aria-hidden
          className="h-7 w-px bg-line"
          style={{ originY: 0 }}
          initial={{ scaleY: 0 }}
          animate={show ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: d(1.9) }}
        />
        <motion.div
          className="relative mt-3"
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={
            show ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 8 }
          }
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
            delay: d(2.2),
          }}
        >
          {!instant && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-ink"
              animate={{ scale: [1, 1.18], opacity: [0.25, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 2.8,
              }}
            />
          )}
          <span className="relative block rounded-full bg-ink px-6 py-3 text-center font-jp text-sm font-bold text-paper sm:text-base">
            {m.goal}
          </span>
        </motion.div>
      </div>

      <motion.p
        className="mx-auto mt-7 max-w-2xl text-center text-sm leading-relaxed text-mute"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: d(2.5) }}
      >
        {m.caption}
      </motion.p>
    </figure>
  );
}
