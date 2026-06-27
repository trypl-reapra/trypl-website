"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InternshipCard from "./InternshipCard";
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
  const filtered =
    active === "all" ? items : items.filter((i) => i.category === active);

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

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((i) => (
            <motion.div
              key={i.slug}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <InternshipCard internship={i} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
