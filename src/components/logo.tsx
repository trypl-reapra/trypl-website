import { cn } from "@/lib/cn";

/**
 * TrypL のシンボル：3つの円が重なるトライアド。
 * 「3つのL（Learning / Long-term / LifeMission）」と
 * 「重なり＝社会との共創」を表す幾何学マーク。currentColor で描画。
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("h-[1.1em] w-[1.1em]", className)}
    >
      <circle cx="20" cy="13.2" r="9.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="13" cy="25.4" r="9.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="27" cy="25.4" r="9.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

/** マーク＋ワードマーク。nav / footer から <Link> で包んで使う。 */
export function Logo({
  className,
  withMark = true,
}: {
  className?: string;
  withMark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {withMark && <LogoMark className="h-[1.05em] w-[1.05em]" />}
      <span className="font-display text-[1.15em] font-semibold tracking-tight">
        TrypL
      </span>
    </span>
  );
}

/** 3つの点。区切りやアクセントに使う小さな幾何モチーフ。 */
export function TriDot({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-[0.28em]", className)}
      aria-hidden="true"
    >
      <span className="h-[0.3em] w-[0.3em] rounded-full bg-current" />
      <span className="h-[0.3em] w-[0.3em] rounded-full bg-current" />
      <span className="h-[0.3em] w-[0.3em] rounded-full bg-current" />
    </span>
  );
}
