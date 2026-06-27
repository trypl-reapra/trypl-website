"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import InternshipCard from "./InternshipCard";
import InternshipDetailPanel from "./InternshipDetailPanel";
import { cn } from "@/lib/cn";
import type { CategoryKey, Internship } from "@/data/internships";

type Filter = "all" | CategoryKey;

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-mute hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export default function InternshipsBrowser({
  items,
  categories,
}: {
  items: Internship[];
  categories: { key: CategoryKey; label: string }[];
}) {
  const [active, setActive] = useState<Filter>("all");
  const [selected, setSelected] = useState<Internship | null>(null);
  const lenis = useLenis();

  const filtered =
    active === "all" ? items : items.filter((i) => i.category === active);

  // ポップアップ表示中はスクロールを止める＋Escで閉じる。
  useEffect(() => {
    if (!lenis) return;
    if (selected) lenis.stop();
    else lenis.start();
  }, [selected, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={active === "all"} onClick={() => setActive("all")}>
          すべて
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c.key}
            active={active === c.key}
            onClick={() => setActive(c.key)}
          >
            {c.label}
          </Chip>
        ))}
        <span className="ml-auto self-center text-sm tabular-nums text-mute">
          {filtered.length} 件
        </span>
      </div>

      <motion.div
        layout
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((i) => (
            <motion.div
              key={i.slug}
              layout
              layoutId={`card-${i.slug}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
              style={{ borderRadius: 16 }}
            >
              <InternshipCard
                internship={i}
                onSelect={() => setSelected(i)}
                className="h-full"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Apple ライクな展開ポップアップ */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[80]">
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-ink/45 backdrop-blur-md"
            />
            {/* centered, expands from the card via shared layoutId */}
            <div className="absolute inset-0 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
              <motion.div
                layoutId={`card-${selected.slug}`}
                style={{ borderRadius: 24 }}
                className="relative my-auto w-full max-w-3xl overflow-hidden bg-paper text-ink shadow-[0_60px_140px_-40px_rgba(0,0,0,0.6)]"
              >
                <InternshipDetailPanel
                  internship={selected}
                  onClose={() => setSelected(null)}
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
