"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { quotes } from "@/data/quotes";

/** 世界の名言を順に表示（フェード切替）。約8秒ごとに次へ。 */
export default function FooterQuote() {
  const [i, setI] = useState(0);

  useEffect(() => {
    // ハイドレーション不整合を避けるため、マウント後にランダムな開始位置へ。
    setI(Math.floor(Math.random() * quotes.length));
    const id = setInterval(
      () => setI((p) => (p + 1) % quotes.length),
      8000,
    );
    return () => clearInterval(id);
  }, []);

  const q = quotes[i];
  return (
    <div className="min-w-0 max-w-md sm:text-right">
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="leading-relaxed"
        >
          <span className="italic text-paper-dim/90">“{q.text}”</span>{" "}
          <span className="whitespace-nowrap text-mute-dark">— {q.author}</span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
