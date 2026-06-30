"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePages } from "@/i18n/pages";
import { profileComplete, type MemberProfile } from "@/lib/profile";

const inputCls =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-ink";

function Label({ text, required, optional }: { text: string; required?: boolean; optional?: string }) {
  return (
    <span className="mb-2 block text-sm font-medium">
      {text}
      {required && <span className="ml-1 text-red-500">*</span>}
      {optional && <span className="ml-1 text-xs font-normal text-mute">（{optional}）</span>}
    </span>
  );
}

export default function MemberProfileForm({
  email,
  profile,
  defaultName,
}: {
  email: string;
  profile: MemberProfile | null;
  defaultName: string;
}) {
  const t = usePages();
  const mp = t.memberProfile;
  const router = useRouter();
  const complete = profileComplete(profile);

  const [f, setF] = useState({
    fullName: profile?.fullName || defaultName,
    furigana: profile?.furigana || "",
    status: profile?.status || "",
    affiliation: profile?.affiliation || "",
    department: profile?.department || "",
    grade: profile?.grade || "",
    note: profile?.note || "",
    birthday: profile?.birthday || "",
    gender: profile?.gender || "",
    phone: profile?.phone || "",
  });
  const [editing, setEditing] = useState(!complete);
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((s) => ({ ...s, [k]: v }));
  }

  // 誕生日：年・月・日をそれぞれセレクトで選ぶ。f.birthday は "YYYY-MM-DD"。
  const thisYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 71 }, (_, i) => thisYear - 10 - i); // 10〜80歳相当
  const [bParts, setBParts] = useState(() => {
    const [y, m, d] = (profile?.birthday || "").split("-");
    return {
      y: y || "",
      m: m ? String(Number(m)) : "",
      d: d ? String(Number(d)) : "",
    };
  });
  function daysInMonth(y: string, m: string) {
    const mm = Number(m);
    if (!mm) return 31;
    return new Date(Number(y) || 2000, mm, 0).getDate();
  }
  function setBirthday(next: { y: string; m: string; d: string }) {
    let { d } = next;
    const { y, m } = next;
    if (d && Number(d) > daysInMonth(y, m)) d = ""; // 月変更で不正な日になったら解除
    setBParts({ y, m, d });
    const combined =
      y && m && d
        ? `${y}-${String(Number(m)).padStart(2, "0")}-${String(Number(d)).padStart(2, "0")}`
        : "";
    set("birthday", combined);
  }

  const canSave = profileComplete(f);

  const affLabel =
    f.status === "highschool"
      ? mp.affHighschool
      : f.status === "university"
        ? mp.affUniversity
        : f.status === "working"
          ? mp.affWorking
          : "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    setState("saving");
    try {
      const res = await fetch("/api/members/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error();
      setEditing(false);
      router.refresh(); // 未登録ゲート→ダッシュボードへ切替
    } catch {
      setState("error");
    }
  }

  if (!editing && complete) {
    const statusLabel =
      { highschool: mp.statusHighschool, university: mp.statusUniversity, working: mp.statusWorking, other: mp.statusOther }[
        f.status as "highschool"
      ] || "";
    return (
      <div className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-jp text-lg font-bold">{mp.heading}</h3>
            <p className="mt-1 text-sm text-mute">{mp.lead}</p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            {mp.edit}
          </button>
        </div>
        <div className="mt-5 grid gap-x-8 gap-y-1.5 text-sm text-mute sm:grid-cols-2">
          <span>{mp.name}：{f.fullName}</span>
          <span>{mp.furigana}：{f.furigana || "—"}</span>
          <span>{mp.statusLabel}：{statusLabel}</span>
          {affLabel && <span>{affLabel}：{f.affiliation || "—"}</span>}
          {f.status === "university" && <span>{mp.department}：{f.department || "—"}</span>}
          {(f.status === "highschool" || f.status === "university") && (
            <span>{mp.grade}：{f.grade || "—"}</span>
          )}
          {f.status === "other" && <span className="sm:col-span-2">{mp.note}：{f.note || "—"}</span>}
          <span>{mp.birthday}：{f.birthday || "—"}</span>
          <span>{mp.gender}：{f.gender || "—"}</span>
          <span>{mp.phone}：{f.phone || "—"}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
      {!complete && (
        <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {mp.incomplete}
        </p>
      )}
      <div className="space-y-4">
        <label className="block">
          <Label text={mp.name} required />
          <input className={inputCls} value={f.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
        </label>
        <label className="block">
          <Label text={mp.furigana} required />
          <input className={inputCls} value={f.furigana} onChange={(e) => set("furigana", e.target.value)} />
        </label>

        <label className="block">
          <Label text={mp.statusLabel} required />
          <select
            className={inputCls}
            value={f.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="">{mp.select}</option>
            <option value="highschool">{mp.statusHighschool}</option>
            <option value="university">{mp.statusUniversity}</option>
            <option value="working">{mp.statusWorking}</option>
            <option value="other">{mp.statusOther}</option>
          </select>
        </label>

        {/* 区分に応じた項目 */}
        {(f.status === "highschool" || f.status === "university" || f.status === "working") && (
          <label className="block">
            <Label text={affLabel} required />
            <input className={inputCls} value={f.affiliation} onChange={(e) => set("affiliation", e.target.value)} />
          </label>
        )}
        {f.status === "university" && (
          <label className="block">
            <Label text={mp.department} required />
            <input className={inputCls} value={f.department} onChange={(e) => set("department", e.target.value)} />
          </label>
        )}
        {(f.status === "highschool" || f.status === "university") && (
          <label className="block">
            <Label text={mp.grade} required />
            <input className={inputCls} value={f.grade} placeholder={mp.gradePlaceholder} onChange={(e) => set("grade", e.target.value)} />
          </label>
        )}
        {f.status === "other" && (
          <label className="block">
            <Label text={mp.note} required />
            <textarea className={inputCls + " resize-y"} rows={2} value={f.note} onChange={(e) => set("note", e.target.value)} />
          </label>
        )}

        {/* 誕生日：年・月・日をそれぞれ選択 */}
        <div className="block">
          <Label text={mp.birthday} required />
          <div className="grid grid-cols-3 gap-2">
            <select
              className={inputCls}
              value={bParts.y}
              aria-label={mp.birthYear}
              onChange={(e) => setBirthday({ ...bParts, y: e.target.value })}
            >
              <option value="">{mp.birthYear}</option>
              {YEARS.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
            <select
              className={inputCls}
              value={bParts.m}
              aria-label={mp.birthMonth}
              onChange={(e) => setBirthday({ ...bParts, m: e.target.value })}
            >
              <option value="">{mp.birthMonth}</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={String(m)}>
                  {m}
                </option>
              ))}
            </select>
            <select
              className={inputCls}
              value={bParts.d}
              aria-label={mp.birthDay}
              onChange={(e) => setBirthday({ ...bParts, d: e.target.value })}
            >
              <option value="">{mp.birthDay}</option>
              {Array.from(
                { length: daysInMonth(bParts.y, bParts.m) },
                (_, i) => i + 1,
              ).map((d) => (
                <option key={d} value={String(d)}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <Label text={mp.gender} optional={mp.optional} />
            <select className={inputCls} value={f.gender} onChange={(e) => set("gender", e.target.value)}>
              <option value="">{mp.select}</option>
              <option value={mp.genderMale}>{mp.genderMale}</option>
              <option value={mp.genderFemale}>{mp.genderFemale}</option>
              <option value={mp.genderOther}>{mp.genderOther}</option>
              <option value={mp.genderNA}>{mp.genderNA}</option>
            </select>
          </label>
          <label className="block">
            <Label text={mp.phone} optional={mp.optional} />
            <input className={inputCls} type="tel" value={f.phone} autoComplete="tel" onChange={(e) => set("phone", e.target.value)} />
          </label>
        </div>

        <label className="block">
          <Label text={mp.email} />
          <input className={inputCls + " bg-fog text-mute"} value={email} readOnly />
        </label>
      </div>

      {state === "error" && <p className="mt-3 text-sm text-red-600">{t.apply.errorDefault}</p>}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!canSave || state === "saving"}
          className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-50"
        >
          {state === "saving" ? mp.saving : mp.save}
        </button>
        {complete && (
          <button type="button" onClick={() => setEditing(false)} className="text-sm text-mute link-underline">
            {mp.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
