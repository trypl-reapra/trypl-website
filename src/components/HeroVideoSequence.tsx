"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 複数の動画クリップを順番に再生し、クリップ間をクロスフェードでつなぐ背景。
 *
 * ・各クリップは個別ファイル（`clips` で指定）＝1本ずつ差し替え可能。
 * ・全クリップを重ねて配置し、表示中の1本だけ opacity:1。切り替え時に
 *   CSS の opacity トランジションでクロスフェードする。
 * ・最後まで再生したら最初へループ。
 * ・最初のクリップは readyState / イベント / フォールバックで確実に表示
 *   （ハイドレーション前にロード完了しても黒く固まらない）。
 */
const CROSSFADE_MS = 1000;

export default function HeroVideoSequence({
  clips,
  className = "",
}: {
  clips: string[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const transitioning = useRef(false);

  // 最初のクリップが再生可能になったら表示（黒→フェードイン）。
  useEffect(() => {
    const v = refs.current[0];
    if (!v) return;
    const show = () => setReady(true);
    if (v.readyState >= 2) show();
    v.addEventListener("loadeddata", show);
    v.addEventListener("canplay", show);
    v.addEventListener("playing", show);
    void v.play?.().catch(() => {});
    const t = window.setTimeout(show, 800);
    return () => {
      v.removeEventListener("loadeddata", show);
      v.removeEventListener("canplay", show);
      v.removeEventListener("playing", show);
      window.clearTimeout(t);
    };
  }, []);

  // 表示中クリップが終わりに近づいたら次へクロスフェード。
  function onTimeUpdate(i: number) {
    if (i !== active || transitioning.current) return;
    const v = refs.current[i];
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    if (v.currentTime < v.duration - CROSSFADE_MS / 1000) return;

    transitioning.current = true;
    const next = (i + 1) % clips.length;
    const nv = refs.current[next];
    if (nv) {
      try {
        nv.currentTime = 0;
        void nv.play().catch(() => {});
      } catch {}
    }
    setActive(next);
    // クロスフェード完了後、前のクリップを停止（リソース節約）。
    window.setTimeout(() => {
      const pv = refs.current[i];
      if (pv) {
        try {
          pv.pause();
        } catch {}
      }
      transitioning.current = false;
    }, CROSSFADE_MS + 100);
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 bg-ink ${className}`}
      aria-hidden="true"
    >
      {clips.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity ease-out"
          style={{
            opacity: ready && i === active ? 1 : 0,
            transitionDuration: `${CROSSFADE_MS}ms`,
          }}
          muted
          playsInline
          preload="auto"
          autoPlay={i === 0}
          onTimeUpdate={() => onTimeUpdate(i)}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
    </div>
  );
}
