"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container, Section } from "@/components/ui";
import PageHeader from "@/components/PageHeader";
import { usePages } from "@/i18n/pages";
import type { MemberProfile } from "@/lib/profile";

const inputCls =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-ink";

export default function ApplyForm({
  slug,
  company,
  title,
  email,
  profile,
}: {
  slug: string;
  company: string;
  title: string;
  email: string;
  profile: MemberProfile;
}) {
  const t = usePages();
  const a = t.apply;
  const mp = t.memberProfile;
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  const statusLabel =
    {
      highschool: mp.statusHighschool,
      university: mp.statusUniversity,
      working: mp.statusWorking,
      other: mp.statusOther,
    }[profile.status as "highschool"] || "";

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

  return (
    <>
      <PageHeader
        eyebrow={a.formEyebrow}
        title={a.formTitle}
        lead={`${company}｜${title}`}
      />
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
                <h2 className="mt-6 font-jp text-2xl font-bold">{a.doneTitle}</h2>
                <p className="mt-3 text-sm leading-relaxed text-mute">{a.doneBody}</p>
                <Link href="/internships" className="mt-8 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-ink-soft">
                  {a.backToListing}
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                {/* 登録済みプロフィール（読み取り専用） */}
                <div className="rounded-2xl border border-line bg-fog/40 p-5">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow text-mute">{a.detailsHeading}</p>
                    <Link href="/members" className="text-xs text-mute link-underline">
                      {mp.edit}
                    </Link>
                  </div>
                  <div className="mt-3 grid gap-x-6 gap-y-1 text-sm text-mute sm:grid-cols-2">
                    <span>{mp.name}：{profile.fullName}</span>
                    <span>{mp.statusLabel}：{statusLabel}</span>
                    {profile.affiliation && <span>{profile.affiliation}</span>}
                    <span>{a.emailLabel}：{email}</span>
                    {profile.phone && <span>{mp.phone}：{profile.phone}</span>}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    {a.messageLabel}
                    <span className="ml-1 text-red-500">*</span>
                  </span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={7}
                    required
                    placeholder={a.messagePlaceholder}
                    className={inputCls + " resize-y"}
                  />
                </label>

                {state === "error" && (
                  <p className="text-sm text-red-600">{a.errorDefault}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
                  >
                    {state === "sending" ? a.sending : a.submit}
                  </button>
                  <Link href={`/internships/${slug}`} className="text-sm text-mute link-underline">
                    {a.cancel}
                  </Link>
                </div>
              </form>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
