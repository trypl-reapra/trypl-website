import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * TrypL のシンボルマーク（公式アイコン）。
 * 幾何学的な T を象ったブランドマーク。背景は透過済みで、
 * tone に応じて明背景用（ink＝黒）と暗背景用（paper＝白）を出し分ける。
 * object-contain で全体を収めるため、マークの上端が欠けない。
 */
export function LogoMark({
  className,
  tone = "ink",
}: {
  className?: string;
  /** ink: 明るい背景に黒マーク / paper: 暗い背景に白マーク */
  tone?: "ink" | "paper";
}) {
  return (
    <Image
      src={tone === "paper" ? "/trypl-mark-light.png" : "/trypl-mark-dark.png"}
      alt="TrypL"
      width={330}
      height={329}
      priority
      className={cn("h-[1.1em] w-[1.1em] object-contain", className)}
    />
  );
}

/** マーク＋ワードマーク。nav / footer から <Link> で包んで使う。 */
export function Logo({
  className,
  withMark = true,
  tone = "ink",
}: {
  className?: string;
  withMark?: boolean;
  tone?: "ink" | "paper";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {withMark && <LogoMark tone={tone} className="h-[1.05em] w-[1.05em]" />}
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
