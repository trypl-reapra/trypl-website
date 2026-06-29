"use client";

import { useEffect, useRef, useState } from "react";

/**
 * セクション背景のループ動画。黒（bg-ink）からフェードインする。
 *
 * フェードのトリガーを onPlaying/onLoadedData の JSX イベントだけに頼ると、
 * 動画がハイドレーション前にロード/再生完了した場合にイベントを取りこぼし、
 * opacity:0（＝黒いまま）で固まる。これを防ぐため:
 *  1) マウント時に readyState を確認（既に再生可能なら即表示）
 *  2) loadeddata / canplay / playing を購読
 *  3) フォールバックのタイマーで必ず表示
 * の三重で確実に表示させる。
 */
export default function BackgroundVideo({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const show = () => setOn(true);

    // 既に1フレーム以上デコード済み（イベント発火済みのケース）なら即表示。
    if (v.readyState >= 2) show();

    v.addEventListener("loadeddata", show);
    v.addEventListener("canplay", show);
    v.addEventListener("playing", show);
    // 自動再生の後押し（ポリシーで弾かれても無視）。
    void v.play?.().catch(() => {});

    // 念のためのフォールバック：上記を取りこぼしても必ず表示する。
    const t = window.setTimeout(show, 800);

    return () => {
      v.removeEventListener("loadeddata", show);
      v.removeEventListener("canplay", show);
      v.removeEventListener("playing", show);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={`pointer-events-none absolute inset-0 h-full w-full bg-ink object-cover transition-opacity duration-[1400ms] ease-out ${on ? "opacity-100" : "opacity-0"} ${className}`}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
