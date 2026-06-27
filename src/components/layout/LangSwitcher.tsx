"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { LOCALES, type Locale } from "@/i18n/dict";
import { cn } from "@/lib/cn";

const SHORT: Record<Locale, string> = { ja: "JA", en: "EN", ko: "KO" };

/** 日本語 / English / 한국어 を切り替えるセグメント。nav の明暗に追従。 */
export default function LangSwitcher({
  dark,
  className,
}: {
  dark?: boolean;
  className?: string;
}) {
  const { locale, setLocale } = useLocale();
  return (
    <div
      role="group"
      aria-label="言語 / Language / 언어"
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 text-[0.7rem] font-medium transition-colors duration-500",
        dark ? "border-paper/20" : "border-ink/15",
        className,
      )}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={cn(
            "rounded-full px-2.5 py-1 tracking-wide transition-colors duration-300",
            locale === l
              ? dark
                ? "bg-paper text-ink"
                : "bg-ink text-paper"
              : dark
                ? "text-paper/65 hover:text-paper"
                : "text-ink/55 hover:text-ink",
          )}
        >
          {SHORT[l]}
        </button>
      ))}
    </div>
  );
}
