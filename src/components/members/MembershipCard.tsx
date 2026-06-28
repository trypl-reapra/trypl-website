"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

type Props = {
  name: string | null;
  email: string | null;
  image: string | null;
  memberId: string | null;
  memberSince: string | null;
};

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
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 0, active: false });

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({
      rx: -py * 10,
      ry: px * 12,
      gx: (e.clientX - r.left) / r.width * 100,
      gy: (e.clientY - r.top) / r.height * 100,
      active: true,
    });
  }
  function reset() {
    setT({ rx: 0, ry: 0, gx: 50, gy: 0, active: false });
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
        className="group relative aspect-[1.585/1] w-full select-none overflow-hidden rounded-[26px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)] transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.active ? 1.015 : 1})`,
          transformStyle: "preserve-3d",
          background:
            "linear-gradient(135deg, #0c0c14 0%, #15151f 45%, #1b1430 100%)",
        }}
      >
        {/* ホログラフィックなにじみ */}
        <div
          className="pointer-events-none absolute -inset-1/4 opacity-40 blur-2xl"
          style={{
            background:
              "conic-gradient(from 140deg, #6ee7ff, #a78bfa, #f0abfc, #fda4af, #fcd34d, #6ee7ff)",
          }}
        />
        {/* 細かいグリッドの質感 */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />
        {/* カーソル追従グレア（光沢） */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: t.active ? 0.9 : 0.35,
            background: `radial-gradient(550px circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,0.28), rgba(255,255,255,0.06) 25%, transparent 55%)`,
          }}
        />
        {/* 周縁の縁取り */}
        <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-white/15" />

        {/* 中身 */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6 text-paper sm:p-7">
          {/* 上段：ロゴ ＋ MEMBER */}
          <div className="flex items-start justify-between">
            <span className="text-paper">
              <Logo tone="paper" />
            </span>
            <span className="rounded-full border border-white/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-paper/80">
              Member
            </span>
          </div>

          {/* 中段：チップ ＋ 名前 */}
          <div className="flex items-center gap-4">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                referrerPolicy="no-referrer"
                className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white/30"
              />
            ) : (
              <div
                className="h-9 w-12 shrink-0 rounded-md"
                style={{
                  background:
                    "linear-gradient(135deg, #f7e29a 0%, #d9b75a 50%, #b58f3c 100%)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5)",
                }}
              />
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
                {displayName}
              </p>
              {email && (
                <p className="truncate text-xs text-paper/55">{email}</p>
              )}
            </div>
          </div>

          {/* 下段：会員ID ＋ 入会年月 */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-paper/45">
                Member ID
              </p>
              <p className="mt-1 font-mono text-sm tracking-wider text-paper/90">
                {memberId ?? "TRYPL-000000"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-paper/45">
                Member Since
              </p>
              <p className="mt-1 font-mono text-sm tracking-wider text-paper/90">
                {sinceLabel(memberSince)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
