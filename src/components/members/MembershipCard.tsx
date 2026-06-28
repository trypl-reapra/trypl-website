"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Logo, LogoMark } from "@/components/logo";

export type CardVariant = "unregistered" | "member" | "founder";

type Props = {
  name: string | null;
  email: string | null;
  image: string | null;
  memberId: string | null;
  memberSince: string | null;
  variant: CardVariant;
  /** 未登録時に右上へ出すラベル（例：未登録） */
  unregisteredLabel?: string;
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

function themeFor(v: CardVariant) {
  if (v === "founder")
    return {
      bg: "linear-gradient(135deg, #5e4612 0%, #b98f2f 24%, #f6e7a8 50%, #cfa53c 73%, #533d0f 100%)",
      logoTone: "ink" as const,
      markOpacity: "opacity-[0.10]",
      ring: "ring-black/15",
      sheen: 0.5,
      label: "Founding Member",
      labelCls: "border-[#3a2c08]/35 text-[#3a2c08]/85",
      avatarRing: "ring-[#3a2c08]/25",
      main: "text-[#241b04]",
      sub: "text-[#241b04]/60",
      faint: "text-[#241b04]/45",
      value: "text-[#241b04]/90",
      copyBtn: "text-[#241b04]/60 hover:bg-black/10 hover:text-[#241b04]",
      chip: "linear-gradient(135deg, #efe6c4 0%, #c9b06a 50%, #9a824a 100%)",
      back: "linear-gradient(135deg, #4a380e 0%, #b8902f 50%, #4a380e 100%)",
    };
  if (v === "member")
    return {
      bg: "linear-gradient(135deg, #0c0c10 0%, #24242c 50%, #0a0a0d 100%)",
      logoTone: "paper" as const,
      markOpacity: "opacity-[0.07]",
      ring: "ring-white/10",
      sheen: 0.45,
      label: "Member",
      labelCls: "border-white/20 text-paper/75",
      avatarRing: "ring-white/25",
      main: "text-paper",
      sub: "text-paper/50",
      faint: "text-paper/40",
      value: "text-paper/85",
      copyBtn: "text-paper/55 hover:bg-white/10 hover:text-paper",
      chip: "linear-gradient(135deg, #d8d8da 0%, #a8a8ad 50%, #7c7c82 100%)",
      back: "linear-gradient(135deg, #0a0a0d 0%, #2a2a34 50%, #0a0a0d 100%)",
    };
  // unregistered = white plastic
  return {
    bg: "linear-gradient(135deg, #ffffff 0%, #e7e7ea 48%, #f7f7f8 100%)",
    logoTone: "ink" as const,
    markOpacity: "opacity-[0.05]",
    ring: "ring-black/10",
    sheen: 0.18,
    label: "",
    labelCls: "border-amber-400/60 bg-amber-50 text-amber-700",
    avatarRing: "ring-black/10",
    main: "text-[#2b2b2e]",
    sub: "text-[#2b2b2e]/55",
    faint: "text-[#2b2b2e]/45",
    value: "text-[#2b2b2e]/90",
    copyBtn: "text-[#2b2b2e]/55 hover:bg-black/5 hover:text-[#2b2b2e]",
    chip: "linear-gradient(135deg, #e6e6e9 0%, #c9c9cf 50%, #aeaeb5 100%)",
    back: "linear-gradient(135deg, #f3f3f5 0%, #dcdce0 50%, #f3f3f5 100%)",
  };
}

export default function MembershipCard({
  name,
  email,
  image,
  memberId,
  memberSince,
  variant,
  unregisteredLabel = "未登録",
}: Props) {
  const c = themeFor(variant);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const drag = useRef<{ on: boolean; px: number; py: number }>({
    on: false,
    px: 0,
    py: 0,
  });

  async function copyId() {
    if (!memberId) return;
    try {
      await navigator.clipboard.writeText(memberId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function down(e: React.PointerEvent) {
    drag.current = { on: true, px: e.clientX, py: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    if (!drag.current.on) return;
    const dx = e.clientX - drag.current.px;
    const dy = e.clientY - drag.current.py;
    drag.current.px = e.clientX;
    drag.current.py = e.clientY;
    setRot((r) => ({
      x: Math.max(-32, Math.min(32, r.x - dy * 0.4)),
      y: r.y + dx * 0.6,
    }));
  }
  function up(e: React.PointerEvent) {
    drag.current.on = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }

  const displayName = name || (email ? email.split("@")[0] : "TrypL Member");
  const glintX = (((rot.y % 60) + 60) % 60) / 60; // 0..1 で光沢を移動

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[440px] touch-none"
      style={{ perspective: 1300 }}
    >
      <div
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className="relative aspect-[1.585/1] w-full cursor-grab select-none active:cursor-grabbing"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transition: drag.current.on ? "none" : "transform 0.4s ease",
        }}
      >
        {/* ===== 表面 ===== */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[26px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]"
          style={{ background: c.bg, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* 見切れマーク */}
          <div className={`pointer-events-none absolute right-[-3.5rem] top-1/2 h-[172%] w-[150%] max-w-none -translate-y-1/2 ${c.markOpacity}`}>
            <LogoMark tone={c.logoTone} className="h-full w-full object-contain" />
          </div>
          {/* メタルの光沢（回転で移動） */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: c.sheen,
              background:
                "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.55) 49%, transparent 60%)",
              transform: `translateX(${(glintX - 0.5) * 120}%)`,
            }}
          />
          <div className={`pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ${c.ring}`} />

          <div className={`relative z-10 flex h-full flex-col justify-between p-6 sm:p-7 ${c.main}`}>
            <div className="flex items-start justify-between">
              <span className={c.main}>
                <Logo tone={c.logoTone} />
              </span>
              {variant === "unregistered" ? (
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${c.labelCls}`}>
                  {unregisteredLabel}
                </span>
              ) : (
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${c.labelCls}`}>
                  {c.label}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" referrerPolicy="no-referrer" className={`h-12 w-12 shrink-0 rounded-full object-cover ring-2 ${c.avatarRing}`} />
              ) : (
                <div className="h-9 w-12 shrink-0 rounded-md" style={{ background: c.chip, boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4)" }} />
              )}
              <div className="min-w-0">
                <p className="truncate font-display text-2xl font-semibold tracking-tight sm:text-[1.7rem]">{displayName}</p>
                {email && <p className={`truncate text-xs ${c.sub}`}>{email}</p>}
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className={`text-[9px] font-medium uppercase tracking-[0.22em] ${c.faint}`}>Member ID</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`font-mono text-sm tracking-wider ${c.value}`}>{memberId ?? "TRYPL-000000"}</span>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={copyId}
                    aria-label="Copy Member ID"
                    className={`grid h-6 w-6 place-items-center rounded-md transition-colors ${c.copyBtn}`}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[9px] font-medium uppercase tracking-[0.22em] ${c.faint}`}>Member Since</p>
                <p className={`mt-1 font-mono text-sm tracking-wider ${c.value}`}>{sinceLabel(memberSince)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 裏面 ===== */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[26px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]"
          style={{
            background: c.back,
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* 磁気ストライプ風の帯 */}
          <div className="absolute inset-x-0 top-7 h-10 bg-black/35" />
          <div className={`pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ${c.ring}`} />
          <div className={`relative z-10 flex h-full flex-col items-center justify-center gap-3 p-6 ${c.main}`}>
            <LogoMark tone={c.logoTone} className="h-10 w-10 opacity-90" />
            <p className="font-display text-sm uppercase tracking-[0.35em] opacity-80">
              TrypL Membership
            </p>
            <p className={`font-mono text-xs ${c.value}`}>{memberId ?? "TRYPL-000000"}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
