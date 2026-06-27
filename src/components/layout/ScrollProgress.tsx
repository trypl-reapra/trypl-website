"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ページ最上部の極細スクロール進捗バー。
 * mix-blend-difference で背景の明暗に関わらず視認できる。
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-paper mix-blend-difference"
    />
  );
}
