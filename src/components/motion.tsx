"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------------------------------------------------------- Reveal */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  immediate = false,
  scale = false,
  blur = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  /** ファーストビュー固定の要素（ヒーロー等）はマウント時に必ず再生する。
   *  スクロールで入ってくる要素はビューポート検知で再生する。 */
  immediate?: boolean;
  /** Apple ライクな軽いスケールイン（画像・カード向け）。 */
  scale?: boolean;
  /** ぼかし → くっきり（被写体の登場演出）。 */
  blur?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // useInView は要素のマウント後にオブザーバを張るため、whileInView と違って
  // ハイドレーション前後の初回コールバック取りこぼしが起きにくい。
  const inView = useInView(ref, { once, margin: "0px 0px -12% 0px" });
  const show = immediate || inView;
  if (reduce) return <div className={className}>{children}</div>;
  const hidden = {
    opacity: 0,
    y,
    scale: scale ? 0.94 : 1,
    filter: blur ? "blur(14px)" : "blur(0px)",
  };
  const shown = { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={show ? shown : hidden}
      transition={{ duration: blur ? 1.05 : 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------- ScrollFadeOut */
/** スクロールで上方へ抜けるときに、内容をふわっと薄れさせて少し縮める。
 *  Apple のヒーローが次のセクションへ溶けるように消える挙動に寄せている。 */

export function ScrollFadeOut({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} style={{ opacity, y, scale }} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------ RevealLines */
/** 行ごとにマスクから立ち上がる見出し演出（日本語でも自然）。 */

export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** ファーストビュー固定の見出し（ヒーロー / ページヘッダー）はマウント時に再生。 */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const show = immediate || inView;
  return (
    <span ref={ref} className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          {reduce ? (
            <span className={cn("block", lineClassName)}>{line}</span>
          ) : (
            <motion.span
              className={cn("block", lineClassName)}
              initial={{ y: "115%" }}
              animate={show ? { y: 0 } : { y: "115%" }}
              transition={{ duration: 0.95, ease: EASE, delay: delay + i * 0.09 }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  );
}

/* --------------------------------------------------------------- Stagger */

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerParent}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------- Parallax */

export function Parallax({
  children,
  className,
  speed = 0.18,
}: {
  children: ReactNode;
  className?: string;
  /** 正の値で下方向にゆっくり、負の値で上方向に。 */
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-speed * 100}%`, `${speed * 100}%`],
  );
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/* -------------------------------------------------------------- Magnetic */

export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.3 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------- Marquee */

export function Marquee({
  items,
  className,
  separator = "／",
}: {
  items: readonly string[];
  className?: string;
  separator?: string;
}) {
  const content = (
    <span className="flex shrink-0 items-center" aria-hidden>
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-[0.6em]">{t}</span>
          <span className="opacity-30">{separator}</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div className="marquee-track">
        {content}
        {content}
      </div>
    </div>
  );
}
