"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container, Section } from "@/components/ui";
import PageHeader from "@/components/PageHeader";
import { usePages } from "@/i18n/pages";

export default function ApplyForm({
  slug,
  company,
  title,
  name,
  email,
}: {
  slug: string;
  company: string;
  title: string;
  name: string;
  email: string;
}) {
  const t = usePages().apply;
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/internships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, message }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-ink";

  return (
    <>
      <PageHeader eyebrow={t.formEyebrow} title={t.formTitle} lead={`${company}｜${title}`} />
      <Section tone="light" topPad={false}>
        <Container>
          <div className="mx-auto max-w-xl">
            {state === "done" ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-line bg-fog/50 p-10 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
                  <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                    <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="mt-6 font-jp text-2xl font-bold">{t.doneTitle}</h2>
                <p className="mt-3 text-sm leading-relaxed text-mute">{t.doneBody}</p>
                <Link
                  href="/internships"
                  className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-ink-soft"
                >
                  {t.backToListing}
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">{t.nameLabel}</span>
                    <input type="text" value={name} readOnly className={inputCls + " bg-fog text-mute"} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">{t.emailLabel}</span>
                    <input type="email" value={email} readOnly className={inputCls + " bg-fog text-mute"} />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">{t.messageLabel}</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={7}
                    required
                    placeholder={t.messagePlaceholder}
                    className={inputCls + " resize-y"}
                  />
                </label>

                {state === "error" && (
                  <p className="text-sm text-red-600">{t.errorDefault}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
                  >
                    {state === "sending" ? t.sending : t.submit}
                  </button>
                  <Link href={`/internships/${slug}`} className="text-sm text-mute link-underline">
                    {t.cancel}
                  </Link>
                </div>
                <p className="pt-2 text-xs leading-relaxed text-mute">{t.formNote}</p>
              </form>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
