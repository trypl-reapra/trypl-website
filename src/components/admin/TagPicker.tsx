"use client";

import { INDUSTRY_TAGS } from "@/data/internships";
import { cn } from "@/lib/cn";

/**
 * タグをボタン（チップ）で選択するピッカー。
 * 業種ベースのプリセット（INDUSTRY_TAGS）＋ 既存の独自タグ（プリセット外）を表示し、
 * クリックで選択/解除する。選択中の配列を onChange で返す。
 */
export default function TagPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  // プリセット ＋ 既存値のうちプリセットに無いもの（独自タグを失わない）。
  const extras = value.filter((t) => !INDUSTRY_TAGS.includes(t));
  const options = [...INDUSTRY_TAGS, ...extras];

  function toggle(tag: string) {
    onChange(
      value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag],
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const active = value.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-ink bg-ink text-paper"
                : "border-line text-mute hover:border-ink hover:text-ink",
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
