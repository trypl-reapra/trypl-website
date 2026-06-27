import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * TrypL のシンボルマーク（公式アイコン）。
 * 黒地に白の幾何学的な T を象ったブランドマークを角丸の正方形で表示する。
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/trypl-mark.png"
      alt="TrypL"
      width={330}
      height={329}
      priority
      className={cn(
        "h-[1.1em] w-[1.1em] rounded-[0.22em] object-cover",
        className,
      )}
    />
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
