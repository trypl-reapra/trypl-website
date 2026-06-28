"use client";

import { useState } from "react";
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
      glare: "rgba(255,255,255,0.55)",
      glareBase: 0.22,
      label: "Founding Member",
      labelCls: "border-[#3a2c08]/35 text-[#3a2c08]/85",
      avatarRing: "ring-[#3a2c08]/25",
      main: "text-[#241b04]",
      sub: "text-[#241b04]/60",
      faint: "text-[#241b04]/45",
      value: "text-[#241b04]/90",
      copyBtn: "text-[#241b04]/60 hover:bg-black/10 hover:text-[#241b04]",
      chip: "linear-gradient(135deg, #efe6c4 0%, #c9b06a 50%, #9a824a 100%)",
    };
  if (v === "member")
    return {
      bg: "linear-gradient(135deg, #0c0c10 0%, #24242c 50%, #0a0a0d 100%)",
      logoTone: "paper" as const,
      markOpacity: "opacity-[0.07]",
      ring: "ring-white/10",
      glare: "rgba(255,255,255,0.30)",
      glareBase: 0.14,
      label: "Member",
      labelCls: "border-white/20 text-paper/75",
      avatarRing: "ring-white/25",
      main: "text-paper",
      sub: "text-paper/50",
      faint: "text-paper/40",
      value: "text-paper/85",
      copyBtn: "text-paper/55 hover:bg-white/10 hover:text-paper",
      chip: "linear-gradient(135deg, #d8d8da 0%, #a8a8ad 50%, #7c7c82 100%)",
    };
  // unregistered = white plastic（マット・控えめ）
  return {
    bg: "linear-gradient(135deg, #ffffff 0%, #e7e7ea 48%, #f7f7f8 100%)",
    logoTone: "ink" as const,
    markOpacity: "opacity-[0.05]",
    ring: "ring-black/10",
    glare: "rgba(255,255,255,0.7)",
    glareBase: 0.06,
    label: "",
    labelCls: "border-amber-400/60 bg-amber-50 text-amber-700",
    avatarRing: "ring-black/10",
    main: "text-[#2b2b2e]",
    sub: "text-[#2b2b2e]/55",
    faint: "text-[#2b2b2e]/45",
    value: "text-[#2b2b2e]/90",
    copyBtn: "text-[#2b2b2e]/55 hover:bg-black/5 hover:text-[#2b2b2e]",
    chip: "linear-gradient(135deg, #e6e6e9 0%, #c9c9cf 50%, #aeaeb5 100%)",
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
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 0, active: false });
  const [copied, setCopied] = useState(false);

  async function copyId() {
    if (!memberId) return;
    try {
      await navigator.clipboard.writeText(memberId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function move(e: React.PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({
      rx: -py * 22, // よく動くように大きめ
      ry: px * 26,
      gx: ((e.clientX - r.left) / r.width) * 100,
      gy: ((e.clientY - r.top) / r.height) * 100,
      active: true,
    });
  }
  function leave() {
    setT({ rx: 0, ry: 0, gx: 50, gy: 0, active: false });
  }

  const displayName = name || (email ? email.split("@")[0] : "TrypL Member");
  // ハイライトは傾きと逆方向に動かして立体感を強める
  const hlX = 50 - t.ry * 1.4;
  const hlY = 50 + t.rx * 1.4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[440px] touch-none"
      style={{ perspective: 900 }}
    >
      <div
        onPointerMove={move}
        onPointerLeave={leave}
        className="group relative aspect-[1.585/1] w-full select-none overflow-hidden rounded-[26px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)] will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.active ? 1.05 : 1})`,
          transition: t.active ? "transform 0.06s ease-out" : "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          background: c.bg,
        }}
      >
        {/* 見切れマーク */}
        <div className={`pointer-events-none absolute right-[-3.5rem] top-1/2 h-[172%] w-[150%] max-w-none -translate-y-1/2 ${c.markOpacity}`}>
          <LogoMark tone={c.logoTone} className="h-full w-full object-contain" />
        </div>

        {/* カーソル追従のスペキュラ（金属ほど強く） */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: c.glareBase + (t.active ? 0.6 : 0),
            transition: "opacity 0.3s ease",
            background: `radial-gradient(420px circle at ${t.gx}% ${t.gy}%, ${c.glare}, transparent 55%)`,
          }}
        />
        {/* 斜めのハイライト帯（傾きで移動して質感を出す） */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: t.active ? 0.5 : 0.2,
            transition: "opacity 0.3s ease",
            background: `linear-gradient(100deg, transparent 42%, ${c.glare} ${hlX / 2 + 25}%, transparent 62%)`,
            transform: `translateY(${(hlY - 50) * 0.3}%)`,
          }}
        />
        {/* 上辺の淡いハイライト */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10), transparent)" }} />
        {/* 縁取り */}
        <div className={`pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ${c.ring}`} />

        {/* 中身 */}
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
    </motion.div>
  );
}
