"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Logo, LogoMark } from "@/components/logo";

type Props = {
  name: string | null;
  email: string | null;
  image: string | null;
  memberId: string | null;
  memberSince: string | null;
};

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function sinceLabel(iso: string | null): string {
  if (!iso) return new Date().getFullYear().toString();
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return new Date().getFullYear().toString();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function MembershipCard({
  name,
  email,
  image,
  memberId,
  memberSince,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 70, gy: 0, active: false });
  const [copied, setCopied] = useState(false);

  async function copyId() {
    if (!memberId) return;
    try {
      await navigator.clipboard.writeText(memberId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({
      rx: -py * 9,
      ry: px * 11,
      gx: ((e.clientX - r.left) / r.width) * 100,
      gy: ((e.clientY - r.top) / r.height) * 100,
      active: true,
    });
  }
  function reset() {
    setT({ rx: 0, ry: 0, gx: 70, gy: 0, active: false });
  }

  const displayName = name || (email ? email.split("@")[0] : "TrypL Member");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[440px]"
      style={{ perspective: 1200 }}
    >
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="group relative aspect-[1.585/1] w-full select-none overflow-hidden rounded-[26px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)] transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.active ? 1.012 : 1})`,
          transformStyle: "preserve-3d",
          background:
            "linear-gradient(150deg, #0a0a0c 0%, #121214 55%, #18181d 100%)",
        }}
      >
        {/* フッターと同じ手法：白マークを右に大きく見切れさせ、低不透明度で敷く */}
        <div className="pointer-events-none absolute right-[-3.5rem] top-1/2 h-[150%] w-[150%] max-w-none -translate-y-1/2 opacity-[0.06]">
          <LogoMark tone="paper" className="h-full w-full" />
        </div>
        {/* ごく薄い質感のグリッド */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />
        {/* カーソル追従のグレア（白・控えめ） */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: t.active ? 0.5 : 0.18,
            background: `radial-gradient(480px circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.16), transparent 55%)`,
          }}
        />
        {/* 上辺の淡いハイライト */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05), transparent)",
          }}
        />
        {/* 周縁の細い縁取り */}
        <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-white/10" />

        {/* 中身 */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6 text-paper sm:p-7">
          {/* 上段：ロゴ ＋ MEMBER */}
          <div className="flex items-start justify-between">
            <span className="text-paper">
              <Logo tone="paper" />
            </span>
            <span className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-paper/75">
              Member
            </span>
          </div>

          {/* 中段：アバター/チップ ＋ 名前 */}
          <div className="flex items-center gap-4">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                referrerPolicy="no-referrer"
                className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white/25"
              />
            ) : (
              <div
                className="h-9 w-12 shrink-0 rounded-md"
                style={{
                  background:
                    "linear-gradient(135deg, #d8d8da 0%, #a8a8ad 50%, #7c7c82 100%)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4)",
                }}
              />
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
                {displayName}
              </p>
              {email && (
                <p className="truncate text-xs text-paper/50">{email}</p>
              )}
            </div>
          </div>

          {/* 下段：会員ID ＋ 入会年月 */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-paper/40">
                Member ID
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-sm tracking-wider text-paper/85">
                  {memberId ?? "TRYPL-000000"}
                </span>
                <button
                  type="button"
                  onClick={copyId}
                  aria-label="Copy Member ID"
                  className="grid h-6 w-6 place-items-center rounded-md text-paper/55 transition-colors hover:bg-white/10 hover:text-paper"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-paper/40">
                Member Since
              </p>
              <p className="mt-1 font-mono text-sm tracking-wider text-paper/85">
                {sinceLabel(memberSince)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
