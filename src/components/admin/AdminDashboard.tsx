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
type AdminInternship = {
  id: string;
  company: string;
  title: string;
  location: string;
  compensation: string;
  summary: string;
  applyUrl: string;
  hidden: boolean;
  createdAt: string;
};

const inputCls =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none transition-colors focus:border-ink";

function fmt(iso: string) {
  // クライアントのロケールに依存しない簡易表記。
  return iso.replace("T", " ").slice(0, 16);
}

export default function AdminDashboard({
  storeMode,
}: {
  storeMode: string;
}) {
  const [tab, setTab] = useState<"contacts" | "internships">("contacts");
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [items, setItems] = useState<AdminInternship[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, i] = await Promise.all([
      fetch("/api/admin/contacts").then((r) => r.json()),
      fetch("/api/admin/internships").then((r) => r.json()),
    ]);
    setContacts(c.contacts ?? []);
    setItems(i.internships ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
              title={
                storeMode === "kv"
                  ? "Vercel KV に永続化されています"
                  : "インメモリ保存（KV未設定）：インスタンス再起動で消えます"
              }
            >
              保存: {storeMode === "kv" ? "KV（恒久）" : "メモリ（暫定）"}
            </span>
            <LogoutButton />
          </div>
        </div>

        {/* tabs */}
        <div className="mt-8 flex gap-1 rounded-full border border-line bg-paper p-1 sm:w-fit">
          {([
            ["contacts", `お問い合わせ${contacts ? ` (${contacts.length})` : ""}`],
            ["internships", `募集管理${items ? ` (${items.length})` : ""}`],
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
          ) : (
            <InternshipsTab items={items ?? []} reload={load} />
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

function InternshipsTab({
  items,
  reload,
}: {
  items: AdminInternship[];
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
      const d = await res.json();
      setErr(d.error || "追加に失敗しました");
      return;
    }
    (e.target as HTMLFormElement).reset();
    reload();
  }

  async function toggle(id: string, hidden: boolean) {
    await fetch("/api/admin/internships", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, hidden }),
    });
    reload();
  }
  async function remove(id: string) {
    await fetch("/api/admin/internships", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    reload();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      {/* add form */}
      <form
        onSubmit={add}
        className="h-fit rounded-2xl border border-line bg-paper p-6"
      >
        <h2 className="font-jp text-lg font-bold">募集を追加</h2>
        <p className="mt-1 text-sm text-mute">
          ここで追加した募集は、募集一覧ページに即時で公開されます。
        </p>
        <div className="mt-5 space-y-3">
          <input name="company" required placeholder="企業名（例：株式会社ジコウ）" className={inputCls} />
          <input name="title" required placeholder="募集タイトル" className={inputCls} />
          <div className="grid grid-cols-2 gap-3">
            <input name="location" placeholder="勤務地" className={inputCls} />
            <input name="compensation" placeholder="報酬（例：時給1,200円〜）" className={inputCls} />
          </div>
          <textarea name="summary" rows={3} placeholder="概要" className={inputCls + " resize-y"} />
          <input name="applyUrl" placeholder="応募URL（mailto: も可）" className={inputCls} />
        </div>
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {busy ? "追加中…" : "追加する"}
        </button>
      </form>

      {/* list */}
      <div>
        {!items.length ? (
          <p className="rounded-2xl border border-line bg-paper p-8 text-sm text-mute">
            管理画面から追加した募集はまだありません。（既存のサンプル募集はコード側で管理されています）
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((i) => (
              <div
                key={i.id}
                className={cn(
                  "rounded-2xl border border-line bg-paper p-5",
                  i.hidden && "opacity-60",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-mute">{i.company}</p>
                    <h3 className="mt-1 font-semibold leading-snug">{i.title}</h3>
                  </div>
                  {i.hidden && (
                    <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-xs text-mute">
                      非表示
                    </span>
                  )}
                </div>
                {i.summary && (
                  <p className="mt-3 line-clamp-2 text-sm text-mute">{i.summary}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mute">
                  {i.location && <span>{i.location}</span>}
                  {i.compensation && <span>{i.compensation}</span>}
                </div>
                <div className="mt-4 flex gap-3 border-t border-line pt-4 text-sm">
                  <button
                    type="button"
                    onClick={() => toggle(i.id, !i.hidden)}
                    className="font-medium text-ink hover:underline"
                  >
                    {i.hidden ? "公開する" : "非表示にする"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i.id)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
