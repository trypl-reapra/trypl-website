"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container, Section } from "@/components/ui";
import PageHeader from "@/components/PageHeader";
import { usePages } from "@/i18n/pages";

type Profile = {
  fullName: string;
  furigana?: string;
  school: string;
  department?: string;
  year: string;
  phone: string;
};

const inputCls =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-ink";

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

export default function ApplyForm({
  slug,
  company,
  title,
  email,
  defaultName,
  profile,
}: {
  slug: string;
  company: string;
  title: string;
  email: string;
  defaultName: string;
  profile: Profile | null;
}) {
  const t = usePages().apply;
  const [fullName, setFullName] = useState(profile?.fullName || defaultName);
  const [furigana, setFurigana] = useState(profile?.furigana || "");
  const [school, setSchool] = useState(profile?.school || "");
  const [department, setDepartment] = useState(profile?.department || "");
  const [year, setYear] = useState(profile?.year || "");
  const [phone, setPhone] = useState(profile?.phone || "");
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
        body: JSON.stringify({
          slug,
          fullName,
          furigana,
          school,
          department,
          year,
          phone,
          message,
        }),
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
        eyebrow={t.formEyebrow}
        title={t.formTitle}
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
                <p className="eyebrow text-mute">{t.detailsHeading}</p>

                <Field
                  label={t.fullNameLabel}
                  value={fullName}
                  onChange={setFullName}
                  required
                  autoComplete="name"
                />
                <Field
                  label={t.furiganaLabel}
                  value={furigana}
                  onChange={setFurigana}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label={t.schoolLabel}
                    value={school}
                    onChange={setSchool}
                    required
                  />
                  <Field
                    label={t.yearLabel}
                    value={year}
                    onChange={setYear}
                    required
                    placeholder={t.yearPlaceholder}
                  />
                </div>
                <Field
                  label={t.departmentLabel}
                  value={department}
                  onChange={setDepartment}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label={t.phoneLabel}
                    value={phone}
                    onChange={setPhone}
                    required
                    type="tel"
                    autoComplete="tel"
                  />
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium">
                      {t.emailLabel}
                    </span>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className={inputCls + " bg-fog text-mute"}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">
                    {t.messageLabel}
                    <span className="ml-1 text-red-500">*</span>
                  </span>
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
                  <Link
                    href={`/internships/${slug}`}
                    className="text-sm text-mute link-underline"
                  >
                    {t.cancel}
                  </Link>
                </div>
                <p className="pt-2 text-xs leading-relaxed text-mute">
                  {t.formNote}
                </p>
              </form>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
