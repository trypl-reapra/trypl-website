"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import LogoutButton from "./LogoutButton";
import { cn } from "@/lib/cn";
import { DEFAULT_HEADER_IMAGES } from "@/data/internships";
import { profileComplete } from "@/lib/profile";

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
type Profile = {
  fullName: string;
  furigana?: string;
  status?: string;
  affiliation?: string;
  department?: string;
  grade?: string;
  jobTitle?: string;
  note?: string;
  age?: string;
  gender?: string;
  phone?: string;
};

const STATUS_JP: Record<string, string> = {
  highschool: "高校生",
  university: "大学生",
  working: "社会人",
  other: "その他",
};
type Member = {
  id: string;
  email: string;
  name: string;
  image: string;
  provider: string;
  createdAt: string;
  founder?: boolean;
  frozen?: boolean;
  profile?: Profile;
};
type Withdrawal = {
  id: string;
  email: string;
  name: string;
  profile?: Profile;
  memberSince: string;
  withdrawnAt: string;
};
type EventItem = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  place: string;
  online: boolean;
  description: string;
  registerUrl: string;
  hidden: boolean;
  createdAt: string;
};
type PressItem = {
  id: string;
  title: string;
  outlet: string;
  url: string;
  date: string;
  summary: string;
  hidden: boolean;
  createdAt: string;
};
type Application = {
  id: string;
  slug: string;
  company: string;
  title: string;
  email: string;
  profile: Profile;
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

async function adminDelete(url: string, body: unknown) {
  await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** 画像ピッカー：デフォルト画像から選択 or 任意URL入力。 */
function ImagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">画像</p>
      <div className="grid grid-cols-3 gap-2">
        {DEFAULT_HEADER_IMAGES.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => onChange(value === src ? "" : src)}
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors",
              value === src ? "border-ink" : "border-transparent hover:border-line",
            )}
          >
            <Image src={src} alt="" fill sizes="120px" className="object-cover" />
          </button>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="または画像URLを入力"
        className={inputCls + " mt-2"}
      />
      <p className="mt-1 text-xs text-mute">
        未選択でも投稿できます（画像なしで表示）。
      </p>
    </div>
  );
}

/** 個別削除ボタン（テスト用）。 */
function DelBtn({ onDelete }: { onDelete: () => Promise<void> | void }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!window.confirm("削除しますか？")) return;
        setBusy(true);
        await onDelete();
        setBusy(false);
      }}
      className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      削除
    </button>
  );
}

/** カテゴリ全消去ボタン（テスト用）。 */
function ClearAll({
  label,
  onClear,
}: {
  label: string;
  onClear: () => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!window.confirm(`${label}：本当にすべて削除しますか？（テスト用）`))
          return;
        setBusy(true);
        await onClear();
        setBusy(false);
      }}
      className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      {label}
    </button>
  );
}

export default function AdminDashboard({ storeMode }: { storeMode: string }) {
  const [tab, setTab] = useState<
    | "overview"
    | "contacts"
    | "applications"
    | "internships"
    | "members"
    | "events"
    | "press"
  >("overview");
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [code, setCode] = useState<Row[] | null>(null);
  const [admin, setAdmin] = useState<Row[] | null>(null);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[] | null>(null);
  const [apps, setApps] = useState<Application[] | null>(null);
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [press, setPress] = useState<PressItem[] | null>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, i, mb, ap, ev, pr, st] = await Promise.all([
      fetch("/api/admin/contacts").then((r) => r.json()),
      fetch("/api/admin/internships").then((r) => r.json()),
      fetch("/api/admin/members").then((r) => r.json()),
      fetch("/api/admin/applications").then((r) => r.json()),
      fetch("/api/admin/events").then((r) => r.json()),
      fetch("/api/admin/press").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ]);
    setContacts(c.contacts ?? []);
    setCode(i.code ?? []);
    setAdmin(i.admin ?? []);
    setMembers(mb.members ?? []);
    setWithdrawals(mb.withdrawals ?? []);
    setApps(ap.applications ?? []);
    setEvents(ev.events ?? []);
    setPress(pr.press ?? []);
    setStats(st.stats ?? {});
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

        <div className="mt-8 flex flex-wrap items-center gap-1 rounded-2xl border border-line bg-paper p-1">
          {([
            ["overview", "概要"],
            ["contacts", `お問い合わせ${contacts ? ` (${contacts.length})` : ""}`],
            ["applications", `応募${apps ? ` (${apps.length})` : ""}`],
            ["members", `メンバー${members ? ` (${members.length})` : ""}`],
            ["internships", `募集管理${code ? ` (${internCount})` : ""}`],
            ["events", `イベント${events ? ` (${events.length})` : ""}`],
            ["press", `プレス${press ? ` (${press.length})` : ""}`],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                tab === k ? "bg-ink text-paper" : "text-mute hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={load}
            className="ml-auto rounded-full px-4 py-2 text-sm text-mute hover:text-ink"
            title="再読み込み"
          >
            ↻
          </button>
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="text-sm text-mute">読み込み中…</p>
          ) : tab === "overview" ? (
            <OverviewTab
              stats={stats ?? {}}
              members={members ?? []}
              withdrawals={withdrawals ?? []}
              apps={apps ?? []}
              contacts={contacts ?? []}
              events={events ?? []}
              press={press ?? []}
              internCount={internCount}
              reload={load}
            />
          ) : tab === "contacts" ? (
            <ContactsTab contacts={contacts ?? []} reload={load} />
          ) : tab === "applications" ? (
            <ApplicationsTab apps={apps ?? []} reload={load} />
          ) : tab === "members" ? (
            <MembersTab
              members={members ?? []}
              withdrawals={withdrawals ?? []}
              reload={load}
            />
          ) : tab === "events" ? (
            <EventsTab events={events ?? []} reload={load} />
          ) : tab === "press" ? (
            <PressTab press={press ?? []} reload={load} />
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

function ContactsTab({
  contacts,
  reload,
}: {
  contacts: Contact[];
  reload: () => void;
}) {
  if (!contacts.length)
    return (
      <p className="rounded-2xl border border-line bg-paper p-8 text-sm text-mute">
        まだお問い合わせはありません。
      </p>
    );
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <ClearAll
          label="お問い合わせを全削除"
          onClear={async () => {
            await adminDelete("/api/admin/contacts", { all: true });
            reload();
          }}
        />
      </div>
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
          <div className="mt-4 flex items-center gap-4">
            <a
              href={`mailto:${c.email}`}
              className="link-underline inline-block text-sm font-medium"
            >
              メールで返信
            </a>
            <DelBtn
              onDelete={async () => {
                await adminDelete("/api/admin/contacts", { id: c.id });
                reload();
              }}
            />
          </div>
        </motion.details>
      ))}
    </div>
  );
}

function ApplicationsTab({
  apps,
  reload,
}: {
  apps: Application[];
  reload: () => void;
}) {
  if (!apps.length)
    return (
      <p className="rounded-2xl border border-line bg-paper p-8 text-sm text-mute">
        まだ応募はありません。会員が募集ページの「応募する」から送信すると、ここに一覧が表示されます。
      </p>
    );
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <ClearAll
          label="応募を全削除"
          onClear={async () => {
            await adminDelete("/api/admin/applications", { all: true });
            reload();
          }}
        />
      </div>
      {apps.map((ap) => (
        <motion.details
          key={ap.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="group rounded-2xl border border-line bg-paper p-5 sm:p-6"
        >
          <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
            <div className="min-w-0">
              <span className="font-medium">
                {ap.profile?.fullName || "（名前未設定）"}
              </span>
              {ap.profile?.furigana && (
                <span className="ml-2 text-xs text-mute">
                  {ap.profile.furigana}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-mute">
              <span className="rounded-full border border-line px-2.5 py-1">
                {ap.company}｜{ap.title}
              </span>
              <span className="tabular-nums">{fmt(ap.createdAt)}</span>
            </div>
          </summary>
          <ProfileGrid p={ap.profile} email={ap.email} />
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">
            {ap.message}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <a
              href={`mailto:${ap.email}`}
              className="link-underline inline-block text-sm font-medium"
            >
              メールで返信
            </a>
            <DelBtn
              onDelete={async () => {
                await adminDelete("/api/admin/applications", { id: ap.id });
                reload();
              }}
            />
          </div>
        </motion.details>
      ))}
    </div>
  );
}

type MemberFilter = "all" | "founder" | "frozen" | "withdrawn";

function MembersTab({
  members,
  withdrawals,
  reload,
}: {
  members: Member[];
  withdrawals: Withdrawal[];
  reload: () => void;
}) {
  const [filter, setFilter] = useState<MemberFilter>("all");

  const counts = {
    all: members.length,
    founder: members.filter((m) => m.founder).length,
    frozen: members.filter((m) => m.frozen).length,
    withdrawn: withdrawals.length,
  };
  const shown =
    filter === "founder"
      ? members.filter((m) => m.founder)
      : filter === "frozen"
        ? members.filter((m) => m.frozen)
        : members;

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(
          [
            ["all", `メンバー (${counts.all})`],
            ["founder", `創設メンバー (${counts.founder})`],
            ["frozen", `凍結 (${counts.frozen})`],
            ["withdrawn", `退会した人 (${counts.withdrawn})`],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === k
                ? "border-ink bg-ink text-paper"
                : "border-line text-mute hover:border-ink hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto">
          {filter === "withdrawn" ? (
            <ClearAll
              label="退会記録を全削除"
              onClear={async () => {
                await adminDelete("/api/admin/members", { clear: "withdrawals" });
                reload();
              }}
            />
          ) : (
            <ClearAll
              label="メンバーを全削除"
              onClear={async () => {
                await adminDelete("/api/admin/members", { clear: "members" });
                reload();
              }}
            />
          )}
        </span>
      </div>

      {filter === "withdrawn" ? (
        withdrawals.length ? (
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <WithdrawalRow key={w.id} w={w} reload={reload} />
            ))}
          </div>
        ) : (
          <Empty>退会した人はまだいません。</Empty>
        )
      ) : shown.length ? (
        <div className="space-y-3">
          {shown.map((mb) => (
            <MemberRow key={mb.id} mb={mb} reload={reload} />
          ))}
        </div>
      ) : (
        <Empty>
          {filter === "all"
            ? "まだ会員登録はありません。"
            : "該当するメンバーはいません。"}
        </Empty>
      )}
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-line bg-paper p-8 text-sm text-mute">
      {children}
    </p>
  );
}

function ProfileGrid({ p, email }: { p?: Profile; email: string }) {
  return (
    <div className="mt-4 grid gap-x-6 gap-y-1.5 border-t border-line pt-4 text-sm text-mute sm:grid-cols-2">
      <span>氏名：{p?.fullName || "（未入力）"}</span>
      <span>ふりがな：{p?.furigana || "—"}</span>
      <span>区分：{p?.status ? STATUS_JP[p.status] || p.status : "—"}</span>
      <span>所属：{p?.affiliation || "—"}</span>
      <span>学部・学科：{p?.department || "—"}</span>
      <span>学年：{p?.grade || "—"}</span>
      <span>職種：{p?.jobTitle || "—"}</span>
      <span>年齢：{p?.age || "—"}</span>
      <span>性別：{p?.gender || "—"}</span>
      <span>電話：{p?.phone || "—"}</span>
      {p?.note && <span className="sm:col-span-2">補足：{p.note}</span>}
      <span className="sm:col-span-2">メール：{email}</span>
    </div>
  );
}

function MemberRow({ mb, reload }: { mb: Member; reload: () => void }) {
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mb.email, ...body }),
    });
    reload();
    setBusy(false);
  }

  return (
    <motion.details
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group rounded-2xl border bg-paper p-5 sm:p-6",
        mb.frozen ? "border-red-200" : "border-line",
      )}
    >
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <span className="font-medium">
            {mb.profile?.fullName || mb.name || "（名前未設定）"}
          </span>
          {mb.founder && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
              創設メンバー
            </span>
          )}
          {mb.frozen && (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
              凍結中
            </span>
          )}
          <span className="ml-3 text-sm text-mute">{mb.email}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-mute">
          <span className="capitalize">{mb.provider || "—"}</span>
          <span className="tabular-nums">{fmt(mb.createdAt)}</span>
          <span className="text-ink/40 transition-transform duration-300 group-open:rotate-180">
            ▾
          </span>
        </div>
      </summary>

      <ProfileGrid p={mb.profile} email={mb.email} />
      {!mb.profile && (
        <p className="mt-2 text-xs text-mute">
          ※ まだ応募していないため、詳細プロフィールは未入力です（応募時に登録されます）。
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => patch({ founder: !mb.founder })}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
            mb.founder
              ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
              : "border-line text-ink hover:border-ink",
          )}
        >
          {mb.founder ? "創設メンバー解除" : "創設メンバーに指定"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => patch({ frozen: !mb.frozen })}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
            mb.frozen
              ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
              : "border-line text-ink hover:border-ink",
          )}
        >
          {mb.frozen ? "凍結を解除" : "アカウントを凍結"}
        </button>
        <a
          href={`mailto:${mb.email}`}
          className="link-underline ml-auto text-xs font-medium text-ink"
        >
          メールで連絡
        </a>
        <DelBtn
          onDelete={async () => {
            await adminDelete("/api/admin/members", { email: mb.email });
            reload();
          }}
        />
      </div>
    </motion.details>
  );
}

function WithdrawalRow({ w, reload }: { w: Withdrawal; reload: () => void }) {
  return (
    <motion.details
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border border-line bg-paper p-5 sm:p-6"
    >
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <span className="font-medium">
            {w.profile?.fullName || w.name || "（名前未設定）"}
          </span>
          <span className="ml-3 text-sm text-mute">{w.email}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-mute">
          <span>
            退会：<span className="tabular-nums">{fmt(w.withdrawnAt)}</span>
          </span>
          <span className="text-ink/40 transition-transform duration-300 group-open:rotate-180">
            ▾
          </span>
        </div>
      </summary>
      <ProfileGrid p={w.profile} email={w.email} />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-mute">
          入会日：{fmt(w.memberSince)} ／ 退会日：{fmt(w.withdrawnAt)}
        </p>
        <DelBtn
          onDelete={async () => {
            await adminDelete("/api/admin/members", { withdrawalId: w.id });
            reload();
          }}
        />
      </div>
    </motion.details>
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
  const [headerImage, setHeaderImage] = useState("");

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
        headerImage,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setErr((await res.json()).error || "追加に失敗しました");
      return;
    }
    (e.target as HTMLFormElement).reset();
    setHeaderImage("");
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

          <ImagePicker value={headerImage} onChange={setHeaderImage} />
        </div>
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        <button type="submit" disabled={busy} className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-ink-soft disabled:opacity-60">
          {busy ? "追加中…" : "追加する"}
        </button>
      </form>

      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-mute">
              管理画面で追加した募集（{admin.length}）
            </h3>
            {admin.length > 0 && (
              <ClearAll
                label="追加分を全削除"
                onClear={async () => {
                  await adminDelete("/api/admin/internships", { all: true });
                  reload();
                }}
              />
            )}
          </div>
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

/* ----------------------------------------------------- overview */

function Donut({
  title,
  segments,
}: {
  title: string;
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 42;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
      <h3 className="font-jp font-bold">{title}</h3>
      {total === 0 ? (
        <p className="mt-6 text-sm text-mute">まだデータがありません。</p>
      ) : (
        <div className="mt-5 flex items-center gap-6">
          <svg viewBox="0 0 100 100" className="h-32 w-32 shrink-0 -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f1f3" strokeWidth="14" />
            {segments
              .filter((s) => s.value > 0)
              .map((s, i) => {
                const len = (s.value / total) * circ;
                const node = (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="14"
                    strokeDasharray={`${len} ${circ - len}`}
                    strokeDashoffset={-acc}
                  />
                );
                acc += len;
                return node;
              })}
          </svg>
          <ul className="min-w-0 flex-1 space-y-1.5 text-sm">
            {segments.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: s.color }} />
                <span className="truncate text-mute">{s.label}</span>
                <span className="ml-auto font-medium tabular-nums">{s.value}</span>
                <span className="w-10 shrink-0 text-right text-xs text-mute">
                  {Math.round((s.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function lastDays(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function OverviewTab({
  stats,
  members,
  withdrawals,
  apps,
  contacts,
  events,
  press,
  internCount,
  reload,
}: {
  stats: Record<string, number>;
  members: Member[];
  withdrawals: Withdrawal[];
  apps: Application[];
  contacts: Contact[];
  events: EventItem[];
  press: PressItem[];
  internCount: number;
  reload: () => void;
}) {
  const founders = members.filter((m) => m.founder).length;
  const frozen = members.filter((m) => m.frozen).length;
  const days = lastDays(14);
  const series = days.map((d) => stats[`day:${d}`] || 0);
  const max = Math.max(1, ...series);

  // 区分別の内訳
  const sc = { highschool: 0, university: 0, working: 0, other: 0, none: 0 };
  members.forEach((m) => {
    const s = m.profile?.status;
    if (s === "highschool" || s === "university" || s === "working" || s === "other") sc[s]++;
    else sc.none++;
  });
  const statusSegs = [
    { label: "高校生", value: sc.highschool, color: "#60a5fa" },
    { label: "大学生", value: sc.university, color: "#34d399" },
    { label: "社会人", value: sc.working, color: "#f59e0b" },
    { label: "その他", value: sc.other, color: "#a78bfa" },
    { label: "未登録", value: sc.none, color: "#d4d4d8" },
  ];
  const registered = members.filter(
    (m) => !m.founder && profileComplete(m.profile),
  ).length;
  const unregistered = members.filter(
    (m) => !m.founder && !profileComplete(m.profile),
  ).length;
  const typeSegs = [
    { label: "創設メンバー", value: founders, color: "#d4af37" },
    { label: "通常メンバー（登録済）", value: registered, color: "#3f3f46" },
    { label: "未登録", value: unregistered, color: "#d4d4d8" },
  ];

  const cards: [string, number][] = [
    ["累計アクセス", stats.total || 0],
    ["メンバー", members.length],
    ["創設メンバー", founders],
    ["凍結", frozen],
    ["退会", withdrawals.length],
    ["応募", apps.length],
    ["お問い合わせ", contacts.length],
    ["募集", internCount],
    ["イベント", events.length],
    ["プレス", press.length],
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-xs text-mute">{label}</p>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Donut title="区分別の割合" segments={statusSegs} />
        <Donut title="メンバー種別" segments={typeSegs} />
      </div>

      <div className="rounded-2xl border border-line bg-paper p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-jp font-bold">アクセス数（直近14日）</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-mute">累計 {stats.total || 0} PV</span>
            <ClearAll
              label="アクセス数をリセット"
              onClear={async () => {
                await adminDelete("/api/admin/stats", {});
                reload();
              }}
            />
          </div>
        </div>
        <div className="mt-6 flex h-40 items-stretch gap-1.5">
          {series.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t bg-ink/80"
                  style={{ height: `${Math.max(2, (v / max) * 100)}%` }}
                  title={`${days[i]}: ${v} PV`}
                />
              </div>
              <span className="text-[9px] tabular-nums text-mute">
                {days[i].slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-mute">
        ※ アクセス数は管理画面を除く全ページのページビュー。KV 有効時のみ恒久集計されます。
      </p>
    </div>
  );
}

/* ------------------------------------------------------- events */

function EventsTab({
  events,
  reload,
}: {
  events: EventItem[];
  reload: () => void;
}) {
  return (
    <div className="space-y-8">
      <EventForm reload={reload} />
      {events.length === 0 ? (
        <Empty>まだイベントがありません。上のフォームから追加してください。</Empty>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-end">
            <ClearAll
              label="イベントを全削除"
              onClear={async () => {
                await adminDelete("/api/admin/events", { all: true });
                reload();
              }}
            />
          </div>
          {events.map((ev) => (
            <EventRow key={ev.id} ev={ev} reload={reload} />
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY_EVENT = {
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  place: "",
  online: false,
  description: "",
  registerUrl: "",
  image: "",
};

function EventForm({ reload }: { reload: () => void }) {
  const [f, setF] = useState({ ...EMPTY_EVENT });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((s) => ({ ...s, [k]: v }));
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!f.title || !f.date) {
      setErr("タイトルと日付は必須です");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    setBusy(false);
    if (res.ok) {
      setF({ ...EMPTY_EVENT });
      reload();
    } else setErr("追加に失敗しました");
  }
  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-paper p-6">
      <h2 className="font-jp text-lg font-bold">イベントを追加</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          className={inputCls + " sm:col-span-2"}
          placeholder="タイトル *"
          value={f.title}
          onChange={(e) => set("title", e.target.value)}
        />
        <input
          type="date"
          className={inputCls}
          value={f.date}
          onChange={(e) => set("date", e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="time"
            className={inputCls}
            value={f.startTime}
            onChange={(e) => set("startTime", e.target.value)}
          />
          <input
            type="time"
            className={inputCls}
            value={f.endTime}
            onChange={(e) => set("endTime", e.target.value)}
          />
        </div>
        <input
          className={inputCls}
          placeholder="場所（会場名・住所など）"
          value={f.place}
          onChange={(e) => set("place", e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-mute">
          <input
            type="checkbox"
            checked={f.online}
            onChange={(e) => set("online", e.target.checked)}
          />
          オンライン開催
        </label>
        <input
          className={inputCls + " sm:col-span-2"}
          placeholder="申込URL（Luma 等）"
          value={f.registerUrl}
          onChange={(e) => set("registerUrl", e.target.value)}
        />
        <textarea
          className={inputCls + " sm:col-span-2"}
          rows={3}
          placeholder="説明"
          value={f.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <div className="sm:col-span-2">
          <ImagePicker value={f.image} onChange={(v) => set("image", v)} />
        </div>
      </div>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex h-10 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper disabled:opacity-60"
      >
        {busy ? "追加中…" : "追加する"}
      </button>
    </form>
  );
}

function EventRow({ ev, reload }: { ev: EventItem; reload: () => void }) {
  const [busy, setBusy] = useState(false);
  async function act(method: string, body: unknown) {
    setBusy(true);
    await fetch("/api/admin/events", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    reload();
    setBusy(false);
  }
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-paper p-5",
        ev.hidden ? "border-line opacity-60" : "border-line",
      )}
    >
      <div className="min-w-0">
        <span className="text-sm tabular-nums text-mute">
          {ev.date} {ev.startTime}
        </span>
        <span className="ml-3 font-medium">{ev.title}</span>
        <span className="ml-2 text-xs text-mute">
          {ev.online ? "オンライン" : ev.place}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          disabled={busy}
          onClick={() => act("PATCH", { id: ev.id, hidden: !ev.hidden })}
          className="rounded-full border border-line px-3 py-1 hover:border-ink"
        >
          {ev.hidden ? "公開する" : "非表示にする"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (window.confirm("このイベントを削除しますか？"))
              act("DELETE", { id: ev.id });
          }}
          className="rounded-full border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50"
        >
          削除
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- press */

function PressTab({
  press,
  reload,
}: {
  press: PressItem[];
  reload: () => void;
}) {
  return (
    <div className="space-y-8">
      <PressForm reload={reload} />
      {press.length === 0 ? (
        <Empty>まだプレス掲載がありません。上のフォームから追加してください。</Empty>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-end">
            <ClearAll
              label="プレスを全削除"
              onClear={async () => {
                await adminDelete("/api/admin/press", { all: true });
                reload();
              }}
            />
          </div>
          {press.map((p) => (
            <PressRow key={p.id} p={p} reload={reload} />
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY_PRESS = { title: "", outlet: "", url: "", date: "", summary: "", image: "" };

function PressForm({ reload }: { reload: () => void }) {
  const [f, setF] = useState({ ...EMPTY_PRESS });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((s) => ({ ...s, [k]: v }));
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!f.title || !f.date) {
      setErr("タイトルと日付は必須です");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/admin/press", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    setBusy(false);
    if (res.ok) {
      setF({ ...EMPTY_PRESS });
      reload();
    } else setErr("追加に失敗しました");
  }
  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-paper p-6">
      <h2 className="font-jp text-lg font-bold">ニュース／プレスを追加</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          className={inputCls + " sm:col-span-2"}
          placeholder="見出し *"
          value={f.title}
          onChange={(e) => set("title", e.target.value)}
        />
        <input
          className={inputCls}
          placeholder="媒体名（例：日本経済新聞）"
          value={f.outlet}
          onChange={(e) => set("outlet", e.target.value)}
        />
        <input
          type="date"
          className={inputCls}
          value={f.date}
          onChange={(e) => set("date", e.target.value)}
        />
        <input
          className={inputCls + " sm:col-span-2"}
          placeholder="記事URL"
          value={f.url}
          onChange={(e) => set("url", e.target.value)}
        />
        <textarea
          className={inputCls + " sm:col-span-2"}
          rows={2}
          placeholder="概要（任意）"
          value={f.summary}
          onChange={(e) => set("summary", e.target.value)}
        />
        <div className="sm:col-span-2">
          <ImagePicker value={f.image} onChange={(v) => set("image", v)} />
        </div>
      </div>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex h-10 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper disabled:opacity-60"
      >
        {busy ? "追加中…" : "追加する"}
      </button>
    </form>
  );
}

function PressRow({ p, reload }: { p: PressItem; reload: () => void }) {
  const [busy, setBusy] = useState(false);
  async function act(method: string, body: unknown) {
    setBusy(true);
    await fetch("/api/admin/press", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    reload();
    setBusy(false);
  }
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-paper p-5",
        p.hidden ? "border-line opacity-60" : "border-line",
      )}
    >
      <div className="min-w-0">
        <span className="text-sm tabular-nums text-mute">{p.date}</span>
        <span className="ml-3 font-medium">{p.title}</span>
        <span className="ml-2 text-xs text-mute">{p.outlet}</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-ink"
          >
            記事
          </a>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => act("PATCH", { id: p.id, hidden: !p.hidden })}
          className="rounded-full border border-line px-3 py-1 hover:border-ink"
        >
          {p.hidden ? "公開する" : "非表示にする"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (window.confirm("この掲載を削除しますか？")) act("DELETE", { id: p.id });
          }}
          className="rounded-full border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50"
        >
          削除
        </button>
      </div>
    </div>
  );
}
