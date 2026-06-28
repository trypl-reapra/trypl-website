"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import LogoutButton from "./LogoutButton";
import { cn } from "@/lib/cn";

type Contact = {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  createdAt: string;
};
type Row = {
  source: "code" | "admin";
  key: string;
  company: string;
  title: string;
  location: string;
  compensation: string;
  summary: string;
  applyUrl: string;
  hidden: boolean;
};
type Member = {
  id: string;
  email: string;
  name: string;
  image: string;
  provider: string;
  createdAt: string;
  founder?: boolean;
};
type Application = {
  id: string;
  slug: string;
  company: string;
  title: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const inputCls =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none transition-colors focus:border-ink";

function fmt(iso: string) {
  return iso.replace("T", " ").slice(0, 16);
}

async function api(method: string, body?: unknown) {
  await fetch("/api/admin/internships", {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export default function AdminDashboard({ storeMode }: { storeMode: string }) {
  const [tab, setTab] = useState<
    "contacts" | "applications" | "internships" | "members"
  >("contacts");
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [code, setCode] = useState<Row[] | null>(null);
  const [admin, setAdmin] = useState<Row[] | null>(null);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [apps, setApps] = useState<Application[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, i, mb, ap] = await Promise.all([
      fetch("/api/admin/contacts").then((r) => r.json()),
      fetch("/api/admin/internships").then((r) => r.json()),
      fetch("/api/admin/members").then((r) => r.json()),
      fetch("/api/admin/applications").then((r) => r.json()),
    ]);
    setContacts(c.contacts ?? []);
    setCode(i.code ?? []);
    setAdmin(i.admin ?? []);
    setMembers(mb.members ?? []);
    setApps(ap.applications ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const internCount = (code?.length ?? 0) + (admin?.length ?? 0);

  return (
    <div className="min-h-[100svh] bg-fog pt-28 pb-24 text-ink">
      <div className="mx-auto w-full max-w-[1100px] px-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-mute">Admin · 管理画面</p>
            <h1 className="mt-3 font-jp text-3xl font-bold tracking-tight sm:text-4xl">
              ダッシュボード
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                storeMode === "kv"
                  ? "border-ink/20 text-mute"
                  : "border-amber-400/50 bg-amber-50 text-amber-700",
              )}
            >
              保存: {storeMode === "kv" ? "KV（恒久）" : "メモリ（暫定）"}
            </span>
            <LogoutButton />
          </div>
        </div>

        <div className="mt-8 flex gap-1 rounded-full border border-line bg-paper p-1 sm:w-fit">
          {([
            ["contacts", `お問い合わせ${contacts ? ` (${contacts.length})` : ""}`],
            ["applications", `応募${apps ? ` (${apps.length})` : ""}`],
            ["internships", `募集管理${code ? ` (${internCount})` : ""}`],
            ["members", `メンバー${members ? ` (${members.length})` : ""}`],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={cn(
                "flex-1 rounded-full px-5 py-2 text-sm font-medium transition-colors sm:flex-none",
                tab === k ? "bg-ink text-paper" : "text-mute hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={load}
            className="rounded-full px-4 py-2 text-sm text-mute hover:text-ink"
            title="再読み込み"
          >
            ↻
          </button>
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="text-sm text-mute">読み込み中…</p>
          ) : tab === "contacts" ? (
            <ContactsTab contacts={contacts ?? []} />
          ) : tab === "applications" ? (
            <ApplicationsTab apps={apps ?? []} />
          ) : tab === "members" ? (
            <MembersTab members={members ?? []} reload={load} />
          ) : (
            <InternshipsTab
              code={code ?? []}
              admin={admin ?? []}
              reload={load}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ContactsTab({ contacts }: { contacts: Contact[] }) {
  if (!contacts.length)
    return (
      <p className="rounded-2xl border border-line bg-paper p-8 text-sm text-mute">
        まだお問い合わせはありません。
      </p>
    );
  return (
    <div className="space-y-3">
      {contacts.map((c) => (
        <motion.details
          key={c.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="group rounded-2xl border border-line bg-paper p-5 sm:p-6"
        >
          <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
            <div className="min-w-0">
              <span className="font-medium">{c.name}</span>
              <span className="ml-3 text-sm text-mute">{c.email}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-mute">
              <span className="rounded-full border border-line px-2.5 py-1">
                {c.category}
              </span>
              <span className="tabular-nums">{fmt(c.createdAt)}</span>
            </div>
          </summary>
          <p className="mt-4 whitespace-pre-wrap border-t border-line pt-4 text-sm leading-relaxed text-mute">
            {c.message}
          </p>
          <a
            href={`mailto:${c.email}`}
            className="link-underline mt-4 inline-block text-sm font-medium"
          >
            メールで返信
          </a>
        </motion.details>
      ))}
    </div>
  );
}

function ApplicationsTab({ apps }: { apps: Application[] }) {
  if (!apps.length)
    return (
      <p className="rounded-2xl border border-line bg-paper p-8 text-sm text-mute">
        まだ応募はありません。会員が募集ページの「応募する」から送信すると、ここに一覧が表示されます。
      </p>
    );
  return (
    <div className="space-y-3">
      {apps.map((ap) => (
        <motion.details
          key={ap.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="group rounded-2xl border border-line bg-paper p-5 sm:p-6"
        >
          <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
            <div className="min-w-0">
              <span className="font-medium">{ap.name || "（名前未設定）"}</span>
              <span className="ml-3 text-sm text-mute">{ap.email}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-mute">
              <span className="rounded-full border border-line px-2.5 py-1">
                {ap.company}｜{ap.title}
              </span>
              <span className="tabular-nums">{fmt(ap.createdAt)}</span>
            </div>
          </summary>
          <p className="mt-4 whitespace-pre-wrap border-t border-line pt-4 text-sm leading-relaxed text-mute">
            {ap.message}
          </p>
          <a
            href={`mailto:${ap.email}`}
            className="link-underline mt-4 inline-block text-sm font-medium"
          >
            メールで返信
          </a>
        </motion.details>
      ))}
    </div>
  );
}

function MembersTab({
  members,
  reload,
}: {
  members: Member[];
  reload: () => void;
}) {
  if (!members.length)
    return (
      <p className="rounded-2xl border border-line bg-paper p-8 text-sm text-mute">
        まだ会員登録はありません。Google での会員登録が有効になると、ここに一覧が表示されます。
      </p>
    );
  return (
    <div className="space-y-3">
      {members.map((mb) => (
        <MemberRow key={mb.id} mb={mb} reload={reload} />
      ))}
    </div>
  );
}

function MemberRow({ mb, reload }: { mb: Member; reload: () => void }) {
  const [busy, setBusy] = useState(false);

  async function toggleFounder() {
    setBusy(true);
    await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mb.email, founder: !mb.founder }),
    });
    reload();
    setBusy(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper p-5 sm:p-6"
    >
      <div className="min-w-0">
        <span className="font-medium">{mb.name || "（名前未設定）"}</span>
        {mb.founder && (
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
            創設メンバー
          </span>
        )}
        <span className="ml-3 text-sm text-mute">{mb.email}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-mute">
        {mb.provider && (
          <span className="rounded-full border border-line px-2.5 py-1 capitalize">
            {mb.provider}
          </span>
        )}
        <span className="tabular-nums">{fmt(mb.createdAt)}</span>
        <button
          type="button"
          disabled={busy}
          onClick={toggleFounder}
          className={cn(
            "rounded-full border px-3 py-1 font-medium transition-colors disabled:opacity-50",
            mb.founder
              ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
              : "border-line text-ink hover:border-ink",
          )}
        >
          {mb.founder ? "創設メンバー解除" : "創設メンバーに指定"}
        </button>
        <a
          href={`mailto:${mb.email}`}
          className="link-underline font-medium text-ink"
        >
          連絡
        </a>
      </div>
    </motion.div>
  );
}

function InternshipRow({ row, reload }: { row: Row; reload: () => void }) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await api("PATCH", {
      source: row.source,
      key: row.key,
      hidden: !row.hidden,
    });
    setBusy(false);
    reload();
  }
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    await api("PATCH", {
      source: row.source,
      key: row.key,
      company: fd.get("company"),
      title: fd.get("title"),
      location: fd.get("location"),
      compensation: fd.get("compensation"),
      summary: fd.get("summary"),
      applyUrl: fd.get("applyUrl"),
    });
    setBusy(false);
    setEditing(false);
    reload();
  }
  async function remove() {
    if (!confirm("この募集を削除（非表示）しますか？")) return;
    setBusy(true);
    await api("DELETE", { source: row.source, key: row.key });
    setBusy(false);
    reload();
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-paper p-5",
        row.hidden && "opacity-60",
      )}
    >
      {editing ? (
        <form onSubmit={save} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="company" defaultValue={row.company} placeholder="企業名" className={inputCls} />
            <input name="location" defaultValue={row.location} placeholder="勤務地" className={inputCls} />
          </div>
          <input name="title" defaultValue={row.title} placeholder="タイトル" className={inputCls} />
          <input name="compensation" defaultValue={row.compensation} placeholder="報酬" className={inputCls} />
          <textarea name="summary" defaultValue={row.summary} rows={3} placeholder="概要" className={inputCls + " resize-y"} />
          <input name="applyUrl" defaultValue={row.applyUrl} placeholder="応募URL" className={inputCls} />
          <div className="flex gap-3 pt-1 text-sm">
            <button type="submit" disabled={busy} className="rounded-full bg-ink px-5 py-2 font-medium text-paper disabled:opacity-60">
              保存
            </button>
            <button type="button" onClick={() => setEditing(false)} className="px-3 py-2 text-mute hover:text-ink">
              キャンセル
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-mute">{row.company}</p>
              <h3 className="mt-1 font-semibold leading-snug">{row.title}</h3>
            </div>
            {row.hidden && (
              <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-xs text-mute">
                非表示
              </span>
            )}
          </div>
          {row.summary && (
            <p className="mt-3 line-clamp-2 text-sm text-mute">{row.summary}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mute">
            {row.location && <span>{row.location}</span>}
            {row.compensation && <span>{row.compensation}</span>}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-4 text-sm">
            <button type="button" disabled={busy} onClick={toggle} className="font-medium text-ink hover:underline">
              {row.hidden ? "公開する" : "非表示にする"}
            </button>
            <button type="button" onClick={() => setEditing(true)} className="font-medium text-ink hover:underline">
              編集
            </button>
            {row.source === "admin" && (
              <button type="button" disabled={busy} onClick={remove} className="font-medium text-red-600 hover:underline">
                削除
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function InternshipsTab({
  code,
  admin,
  reload,
}: {
  code: Row[];
  admin: Row[];
  reload: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/internships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: fd.get("company"),
        title: fd.get("title"),
        location: fd.get("location"),
        compensation: fd.get("compensation"),
        summary: fd.get("summary"),
        applyUrl: fd.get("applyUrl"),
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setErr((await res.json()).error || "追加に失敗しました");
      return;
    }
    (e.target as HTMLFormElement).reset();
    reload();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={add} className="h-fit rounded-2xl border border-line bg-paper p-6">
        <h2 className="font-jp text-lg font-bold">募集を追加</h2>
        <p className="mt-1 text-sm text-mute">
          追加した募集は募集一覧ページに即時公開されます。
        </p>
        <div className="mt-5 space-y-3">
          <input name="company" required placeholder="企業名（例：株式会社ジコウ）" className={inputCls} />
          <input name="title" required placeholder="募集タイトル" className={inputCls} />
          <div className="grid grid-cols-2 gap-3">
            <input name="location" placeholder="勤務地" className={inputCls} />
            <input name="compensation" placeholder="報酬" className={inputCls} />
          </div>
          <textarea name="summary" rows={3} placeholder="概要" className={inputCls + " resize-y"} />
          <input name="applyUrl" placeholder="応募URL（mailto: も可）" className={inputCls} />
        </div>
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        <button type="submit" disabled={busy} className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-ink-soft disabled:opacity-60">
          {busy ? "追加中…" : "追加する"}
        </button>
      </form>

      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-mute">
            管理画面で追加した募集（{admin.length}）
          </h3>
          {admin.length ? (
            <div className="mt-4 space-y-3">
              {admin.map((r) => (
                <InternshipRow key={r.key} row={r} reload={reload} />
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-2xl border border-line bg-paper p-6 text-sm text-mute">
              まだありません。左のフォームから追加できます。
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-mute">
            既存の募集（{code.length}）
          </h3>
          <div className="mt-4 space-y-3">
            {code.map((r) => (
              <InternshipRow key={r.key} row={r} reload={reload} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
