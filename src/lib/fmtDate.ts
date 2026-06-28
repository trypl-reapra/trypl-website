import type { Locale } from "@/i18n/dict";

const WD: Record<Locale, string[]> = {
  ja: ["日", "月", "火", "水", "木", "金", "土"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ko: ["일", "월", "화", "수", "목", "금", "토"],
};

/** YYYY.MM.DD（曜）— ja は全角括弧、en/ko は半角括弧でロケールに合わせて整形。 */
export function fmtDateLocale(d: string, locale: Locale): string {
  const dt = new Date(d + "T00:00:00");
  if (Number.isNaN(dt.getTime())) return d;
  const ymd = `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(
    dt.getDate(),
  ).padStart(2, "0")}`;
  const wd = WD[locale][dt.getDay()];
  return locale === "ja" ? `${ymd}（${wd}）` : `${ymd} (${wd})`;
}
