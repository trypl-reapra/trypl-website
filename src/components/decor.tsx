import { cn } from "@/lib/cn";

/**
 * 同心円・十字・目盛り・ドットによる幾何学リング。
 * currentColor で描画。透明度はそのまま、色は親で text-* 指定。
 */
export function RingsSvg({ className }: { className?: string }) {
  const ticks = Array.from({ length: 60 });
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      {/* 目盛り（計器のような精密感） */}
      <g stroke="currentColor">
        {ticks.map((_, i) => {
          const a = (i / ticks.length) * Math.PI * 2;
          const major = i % 5 === 0;
          const r1 = major ? 268 : 276;
          const r2 = 284;
          return (
            <line
              key={i}
              x1={300 + Math.cos(a) * r1}
              y1={300 + Math.sin(a) * r1}
              x2={300 + Math.cos(a) * r2}
              y2={300 + Math.sin(a) * r2}
              strokeWidth={major ? 1.4 : 0.8}
              opacity={major ? 0.35 : 0.18}
            />
          );
        })}
      </g>

      {/* 同心円 */}
      <circle cx="300" cy="300" r="258" stroke="currentColor" strokeWidth="1" opacity="0.14" />
      <circle cx="300" cy="300" r="196" stroke="currentColor" strokeWidth="1" opacity="0.12" />
      <circle cx="300" cy="300" r="130" stroke="currentColor" strokeWidth="1" opacity="0.16" />
      <circle cx="300" cy="300" r="66" stroke="currentColor" strokeWidth="1" opacity="0.22" />

      {/* 十字 */}
      <line x1="20" y1="300" x2="580" y2="300" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
      <line x1="300" y1="20" x2="300" y2="580" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />

      {/* カーディナルのドット */}
      {[
        [300, 42],
        [558, 300],
        [300, 558],
        [42, 300],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.2" fill="currentColor" opacity="0.5" />
      ))}
    </svg>
  );
}

/** 破線の単独リング（逆回転レイヤー用）。 */
export function DashRing({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <circle
        cx="300"
        cy="300"
        r="232"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 12"
        opacity="0.3"
      />
    </svg>
  );
}

/** 角のクロスティック（Apple ライクな精密アクセント）。 */
export function CornerTick({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
    >
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
