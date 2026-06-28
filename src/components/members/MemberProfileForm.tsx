"use client";

import { useState } from "react";
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

export default function MemberProfileForm({
  email,
  profile,
  defaultName,
}: {
  email: string;
  profile: Profile | null;
  defaultName: string;
}) {
  const t = usePages();
  const m = t.members;
  const a = t.apply;
  const complete = !!(
    profile?.fullName &&
    profile?.school &&
    profile?.year &&
    profile?.phone
  );

  const [fullName, setFullName] = useState(profile?.fullName || defaultName);
  const [furigana, setFurigana] = useState(profile?.furigana || "");
  const [school, setSchool] = useState(profile?.school || "");
  const [department, setDepartment] = useState(profile?.department || "");
  const [year, setYear] = useState(profile?.year || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  // 登録済みかつ完了なら最初は折りたたみ表示。
  const [editing, setEditing] = useState(!complete);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    try {
      const res = await fetch("/api/members/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          furigana,
          school,
          department,
          year,
          phone,
        }),
      });
      if (!res.ok) throw new Error();
      setState("saved");
      setEditing(false);
    } catch {
      setState("error");
    }
  }

  return (
    <div
      className={
        "rounded-2xl border p-6 sm:p-7 " +
        (complete || state === "saved"
          ? "border-line bg-paper"
          : "border-amber-300 bg-amber-50/50")
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-jp text-lg font-bold">{m.profileHeading}</h3>
          <p className="mt-1 text-sm text-mute">
            {complete || state === "saved" ? m.profileLead : m.profileIncomplete}
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            {m.profileEdit}
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label={a.fullNameLabel} value={fullName} onChange={setFullName} required autoComplete="name" />
          <Field label={a.furiganaLabel} value={furigana} onChange={setFurigana} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={a.schoolLabel} value={school} onChange={setSchool} required />
            <Field label={a.yearLabel} value={year} onChange={setYear} required placeholder={a.yearPlaceholder} />
          </div>
          <Field label={a.departmentLabel} value={department} onChange={setDepartment} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={a.phoneLabel} value={phone} onChange={setPhone} required type="tel" autoComplete="tel" />
            <label className="block">
              <span className="mb-2 block text-sm font-medium">{a.emailLabel}</span>
              <input type="email" value={email} readOnly className={inputCls + " bg-fog text-mute"} />
            </label>
          </div>

          {state === "error" && (
            <p className="text-sm text-red-600">{a.errorDefault}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={state === "saving"}
              className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
            >
              {state === "saving" ? m.profileSaving : m.profileSave}
            </button>
            {complete && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-sm text-mute link-underline"
              >
                {m.profileCancel}
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="mt-5 grid gap-x-8 gap-y-1.5 text-sm text-mute sm:grid-cols-2">
          <span>{a.fullNameLabel}：{profile?.fullName}</span>
          <span>{a.furiganaLabel}：{profile?.furigana || "—"}</span>
          <span>{a.schoolLabel}：{profile?.school}</span>
          <span>{a.yearLabel}：{profile?.year}</span>
          <span>{a.departmentLabel}：{profile?.department || "—"}</span>
          <span>{a.phoneLabel}：{profile?.phone}</span>
        </div>
      )}
    </div>
  );
}
