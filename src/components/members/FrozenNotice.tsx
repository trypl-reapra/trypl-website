"use client";

import { motion } from "framer-motion";
import MemberLogout from "@/components/members/MemberLogout";
import { site } from "@/data/site";
import { usePages } from "@/i18n/pages";

export default function FrozenNotice() {
  const m = usePages().members;
  return (
    <section
      data-nav-theme="light"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-paper px-page py-28 text-ink"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-3xl border border-line bg-paper p-10 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-fog text-mute">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="mt-6 font-jp text-xl font-bold">{m.frozenTitle}</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">{m.frozenBody}</p>
        <a
          href={`mailto:${site.email}`}
          className="link-underline mt-5 inline-block text-sm"
        >
          {site.email}
        </a>
        <div className="mt-8 flex justify-center">
          <MemberLogout label={m.logout} />
        </div>
      </motion.div>
    </section>
  );
}
