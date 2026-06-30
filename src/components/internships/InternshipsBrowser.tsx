"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InternshipCard from "./InternshipCard";
import InternshipModal from "./InternshipModal";
import { cn } from "@/lib/cn";
import {
  WORK_STYLE_LABEL,
  type CategoryKey,
  type Internship,
  type WorkStyle,
} from "@/data/internships";

type CatFilter = "all" | CategoryKey;
type WsFilter = "all" | WorkStyle;

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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M20 20l-3.2-3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function InternshipsBrowser({
  items,
  categories,
}: {
  items: Internship[];
  categories: { key: CategoryKey; label: string }[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CatFilter>("all");
  const [ws, setWs] = useState<WsFilter>("all");
  const [company, setCompany] = useState<string>("all");
  const [selected, setSelected] = useState<Internship | null>(null);

  // 企業の選択肢（重複排除・五十音/英字順）。
  const companies = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.company))).sort((a, b) =>
        a.localeCompare(b, "ja"),
      ),
    [items],
  );
  // 実際に使われている勤務形態だけ表示。
  const wsUsed = useMemo(() => {
    const set = new Set(items.map((i) => i.workStyle));
    return (["remote", "hybrid", "onsite"] as WorkStyle[]).filter((w) =>
      set.has(w),
    );
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => {
      if (cat !== "all" && i.category !== cat) return false;
      if (ws !== "all" && i.workStyle !== ws) return false;
      if (company !== "all" && i.company !== company) return false;
      if (needle) {
        const hay = [
          i.title,
          i.company,
          i.companyTag,
          i.summary,
          i.location,
          ...(i.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [items, q, cat, ws, company]);

  const hasFilters =
    q.trim() !== "" || cat !== "all" || ws !== "all" || company !== "all";
  function clearAll() {
    setQ("");
    setCat("all");
    setWs("all");
    setCompany("all");
  }

  return (
    <div>
      {/* キーワード検索 */}
      <div className="relative max-w-xl">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute">
          <SearchIcon />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="キーワードで検索（職種・企業・タグなど）"
          className="h-12 w-full rounded-full border border-line bg-paper pl-12 pr-11 text-sm outline-none transition-colors focus:border-ink"
          aria-label="募集をキーワードで検索"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="検索をクリア"
            className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-mute transition-colors hover:bg-ink/[0.06] hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* カテゴリ */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Chip active={cat === "all"} onClick={() => setCat("all")}>
          すべて
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c.key}
            active={cat === c.key}
            onClick={() => setCat(c.key)}
          >
            {c.label}
          </Chip>
        ))}
        <span className="ml-auto self-center text-sm tabular-nums text-mute">
          {filtered.length} 件
        </span>
      </div>

      {/* 勤務形態・企業・クリア */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-mute">勤務形態</span>
        <Chip active={ws === "all"} onClick={() => setWs("all")}>
          すべて
        </Chip>
        {wsUsed.map((w) => (
          <Chip key={w} active={ws === w} onClick={() => setWs(w)}>
            {WORK_STYLE_LABEL[w]}
          </Chip>
        ))}
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          aria-label="企業で絞り込む"
          className="ml-1 h-10 max-w-[220px] rounded-full border border-line bg-paper px-4 text-sm text-mute outline-none transition-colors hover:border-ink focus:border-ink"
        >
          <option value="all">すべての企業</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-mute link-underline"
          >
            条件をクリア
          </button>
        )}
      </div>

      {/* 一覧 */}
      {filtered.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-line bg-paper px-6 py-14 text-center text-sm text-mute">
          条件に合う募集が見つかりませんでした。
          <br />
          キーワードや絞り込みを変えてお試しください。
        </p>
      ) : (
        <motion.div
          layout
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
      )}

      <InternshipModal selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
