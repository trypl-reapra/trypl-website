"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/logo";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import { usePages } from "@/i18n/pages";

type Providers = { google: boolean; apple: boolean; any: boolean };

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.94H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.06l3.01-2.34Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M11.18 8.49c-.02-1.7 1.39-2.51 1.45-2.55-.79-1.16-2.02-1.32-2.46-1.34-1.05-.1-2.04.61-2.57.61-.53 0-1.34-.6-2.21-.58-1.14.02-2.19.66-2.78 1.68-1.18 2.05-.3 5.08.85 6.74.56.81 1.23 1.72 2.1 1.69.84-.03 1.16-.54 2.18-.54s1.31.54 2.2.52c.91-.02 1.49-.83 2.05-1.64.64-.94.91-1.85.92-1.9-.02-.01-1.77-.68-1.79-2.7ZM9.49 3.6c.47-.57.79-1.36.7-2.15-.68.03-1.5.45-1.98 1.02-.43.5-.81 1.31-.71 2.08.76.06 1.53-.39 1.99-.95Z" />
    </svg>
  );
}

export default function MemberRegister({ providers }: { providers: Providers }) {
  const t = usePages().memberAuth;
  const line = socials.find((s) => s.key === "line");
  // 応募ページ等から来た場合、ログイン後にその場所へ戻す（内部パスのみ許可）。
  const params = useSearchParams();
  const rawNext = params.get("next");
  const callbackUrl =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/members";

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
        className="relative w-full max-w-sm"
      >
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow text-mute">{t.badge}</span>
          <LogoMark className="mt-5 h-11 w-11" />
          <h1 className="mt-5 font-jp text-2xl font-bold tracking-tight">
            {t.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-mute">{t.desc}</p>
        </div>

        {providers.any ? (
          <div className="mt-9 space-y-3">
            {providers.google && (
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl })}
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line bg-paper text-sm font-medium text-ink transition-colors hover:bg-fog"
              >
                <GoogleIcon />
                {t.google}
              </button>
            )}
            {providers.apple && (
              <button
                type="button"
                onClick={() => signIn("apple", { callbackUrl })}
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-ink text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
              >
                <AppleIcon />
                {t.apple}
              </button>
            )}
            <p className="pt-2 text-center text-xs leading-relaxed text-mute">
              {t.privacy}
            </p>
          </div>
        ) : (
          <div className="mt-9 rounded-2xl border border-line bg-fog/40 p-6 text-center">
            <h2 className="font-jp text-base font-bold">{t.prepTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">{t.prepDesc}</p>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              {line?.available && (
                <a
                  href={line.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  LINE{t.prepLine}
                </a>
              )}
              <a href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>
            </div>
          </div>
        )}

      </motion.div>
    </section>
  );
}
