"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import InternshipDetailPanel from "./InternshipDetailPanel";
import type { Internship } from "@/data/internships";

/** 募集の前面ポップアップ。背景・外側クリック・Esc で閉じる。共有 layoutId で
 *  クリックしたカードから展開する（Apple 風）。 */
export default function InternshipModal({
  selected,
  onClose,
}: {
  selected: Internship | null;
  onClose: () => void;
}) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (selected) lenis.stop();
    else lenis.start();
  }, [selected, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {selected && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-ink/45 backdrop-blur-md"
          />
          {/* このコンテナの空白部分（＝パネルの外側）クリックで閉じる */}
          <div
            className="absolute inset-0 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
            onClick={onClose}
          >
            <motion.div
              layoutId={`card-${selected.slug}`}
              style={{ borderRadius: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-auto w-full max-w-3xl overflow-hidden bg-paper text-ink shadow-[0_60px_140px_-40px_rgba(0,0,0,0.6)]"
            >
              <InternshipDetailPanel internship={selected} onClose={onClose} />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
