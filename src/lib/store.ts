/**
 * サーバー側ストレージ。
 * Vercel KV（Upstash Redis REST）が設定されていればそれを使い、
 * 無ければ同一インスタンス内で保持するインメモリにフォールバックする。
 * → ローカル開発・デモは即動作。KV を有効化すれば恒久化される。
 *
 * 恒久化したい場合は Vercel の KV(または Upstash) を作成し、
 * KV_REST_API_URL / KV_REST_API_TOKEN を環境変数に設定して再デプロイするだけ。
 */

import "server-only";
import type { MemberProfile } from "@/lib/profile";
import { defaultPress, defaultEvents } from "@/data/site";

export type Contact = {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  createdAt: string;
};

export type AdminInternship = {
  id: string;
  company: string;
  title: string;
  location: string;
  compensation: string;
  summary: string;
  applyUrl: string;
  /** ヘッダー画像（デフォルト画像のパス or 任意URL）。 */
  headerImage?: string;
  hidden: boolean;
  createdAt: string;
};

/** イベント（管理画面から登録。日時・場所・説明・申込URL）。 */
export type EventItem = {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  startTime: string;
  endTime: string;
  place: string;
  online: boolean;
  description: string;
  registerUrl: string;
  image?: string;
  hidden: boolean;
  createdAt: string;
};

/** ニュース / プレス掲載（管理画面から登録）。 */
export type PressItem = {
  id: string;
  title: string;
  outlet: string;
  /** 外部記事のURL（媒体掲載など）。内部のお知らせは空でよい。 */
  url: string;
  /** YYYY-MM-DD */
  date: string;
  summary: string;
  /** 記事本文（任意）。詳細ページに表示。 */
  body?: string;
  image?: string;
  hidden: boolean;
  createdAt: string;
};

// 会員プロフィールの型はクライアント共通モジュール @/lib/profile に集約（上部で import）。
export type { MemberProfile } from "@/lib/profile";

/** 会員登録したメンバー（Google / Apple でログインした人）。 */
export type Member = {
  id: string;
  email: string;
  name: string;
  image: string;
  provider: string;
  createdAt: string;
  /** 創設メンバー（管理画面で指定）。会員証がゴールドになる。 */
  founder?: boolean;
  /** 凍結（管理画面で指定）。ログイン・応募が不可になる。 */
  frozen?: boolean;
  /** 応募用プロフィール（一度入力すると次回以降は自動入力される）。 */
  profile?: MemberProfile;
};

/** 退会したメンバーの記録（退会者リスト）。 */
export type Withdrawal = {
  id: string;
  email: string;
  name: string;
  profile?: MemberProfile;
  /** 入会日（元の createdAt） */
  memberSince: string;
  /** 退会日時 */
  withdrawnAt: string;
};

/** 募集への応募（会員が応募ボタンから送信）。 */
export type Application = {
  id: string;
  slug: string;
  company: string;
  title: string;
  email: string;
  /** 応募者の最低限プロフィール（応募時点のスナップショット）。 */
  profile: MemberProfile;
  message: string;
  createdAt: string;
};

/** 既存（コード管理）の募集に対する上書き。slug をキーに保存。 */
export type Override = Partial<{
  hidden: boolean;
  company: string;
  title: string;
  location: string;
  compensation: string;
  summary: string;
  applyUrl: string;
}>;

// Vercel Marketplace の Redis 連携（Upstash 等）で注入される環境変数。
// 連携の構成により KV_REST_API_* か UPSTASH_REDIS_REST_* のどちらかになるため、
// 両方を受け付ける（どちらの名前でも自動で恒久ストレージに切り替わる）。
const KV_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const useKV = !!(KV_URL && KV_TOKEN);

const K_CONTACTS = "trypl:contacts";
const K_INTERNSHIPS = "trypl:internships";
const K_OVERRIDES = "trypl:overrides";
const K_MEMBERS = "trypl:members";
const K_APPLICATIONS = "trypl:applications";
const K_WITHDRAWALS = "trypl:withdrawals";
const K_EVENTS = "trypl:events";
const K_PRESS = "trypl:press";
const K_STATS = "trypl:stats"; // ハッシュ：total / day:YYYY-MM-DD

// ---- in-memory fallback ----
// globalThis に載せて、同一プロセス内の別バンドル（API ルートとページ等）でも
// 同じ状態を共有する。※プロセスを跨ぐ恒久共有には KV が必要。
type Mem = {
  contacts: Contact[];
  internships: AdminInternship[];
  overrides: Record<string, Override>;
  members: Member[];
  applications: Application[];
  withdrawals: Withdrawal[];
  events: EventItem[];
  press: PressItem[];
  stats: Record<string, number>;
};
const g = globalThis as unknown as { __tryplMem?: Mem };
const mem: Mem =
  g.__tryplMem ??
  (g.__tryplMem = {
    contacts: [],
    internships: [],
    overrides: {},
    members: [],
    applications: [],
    withdrawals: [],
    events: [],
    press: [],
    stats: {},
  });

async function kv(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(KV_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV error ${res.status}`);
  const data = (await res.json()) as { result: unknown };
  return data.result;
}

function rid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

/* --------------------------------------------------------- contacts */

export async function addContact(
  input: Omit<Contact, "id" | "createdAt">,
  now: string,
): Promise<Contact> {
  const contact: Contact = { id: rid(), createdAt: now, ...input };
  if (useKV) {
    await kv(["LPUSH", K_CONTACTS, JSON.stringify(contact)]);
  } else {
    mem.contacts.unshift(contact);
  }
  return contact;
}

export async function listContacts(): Promise<Contact[]> {
  if (useKV) {
    const raw = (await kv(["LRANGE", K_CONTACTS, 0, -1])) as string[];
    return (raw || []).map((s) => JSON.parse(s) as Contact);
  }
  return mem.contacts;
}

async function saveAllContacts(items: Contact[]): Promise<void> {
  if (useKV) {
    await kv(["DEL", K_CONTACTS]);
    if (items.length)
      await kv(["RPUSH", K_CONTACTS, ...items.map((c) => JSON.stringify(c))]);
  } else mem.contacts = items;
}

export async function deleteContact(id: string): Promise<void> {
  await saveAllContacts((await listContacts()).filter((c) => c.id !== id));
}

export async function clearContacts(): Promise<void> {
  await saveAllContacts([]);
}

/* --------------------------------------------------------- members */

/**
 * 会員登録（OAuth ログイン）を台帳に記録する。
 * 同じメールアドレスが既にあれば、名前・画像などを最新に更新するだけ。
 */
export async function addMember(
  input: Omit<Member, "id" | "createdAt">,
  now: string,
): Promise<Member> {
  const existing = (await listMembers()).find((m) => m.email === input.email);
  if (existing) {
    const updated: Member = { ...existing, ...input };
    const items = (await listMembers()).map((m) =>
      m.email === input.email ? updated : m,
    );
    await saveAllMembers(items);
    return updated;
  }
  const member: Member = { id: rid(), createdAt: now, ...input };
  if (useKV) {
    await kv(["LPUSH", K_MEMBERS, JSON.stringify(member)]);
  } else {
    mem.members.unshift(member);
  }
  return member;
}

export async function listMembers(): Promise<Member[]> {
  if (useKV) {
    const raw = (await kv(["LRANGE", K_MEMBERS, 0, -1])) as string[];
    return (raw || []).map((s) => JSON.parse(s) as Member);
  }
  return mem.members;
}

/** 退会：会員レコードを退会ログに記録し、メンバー一覧から外す。 */
export async function withdrawMember(
  email: string,
  now: string,
): Promise<void> {
  const members = await listMembers();
  const m = members.find((x) => x.email === email);
  if (!m) return;
  const record: Withdrawal = {
    id: rid(),
    email: m.email,
    name: m.name,
    profile: m.profile,
    memberSince: m.createdAt,
    withdrawnAt: now,
  };
  if (useKV) {
    await kv(["LPUSH", K_WITHDRAWALS, JSON.stringify(record)]);
  } else {
    mem.withdrawals.unshift(record);
  }
  await saveAllMembers(members.filter((x) => x.email !== email));
}

export async function listWithdrawals(): Promise<Withdrawal[]> {
  if (useKV) {
    const raw = (await kv(["LRANGE", K_WITHDRAWALS, 0, -1])) as string[];
    return (raw || []).map((s) => JSON.parse(s) as Withdrawal);
  }
  return mem.withdrawals;
}

async function saveAllWithdrawals(items: Withdrawal[]): Promise<void> {
  if (useKV) {
    await kv(["DEL", K_WITHDRAWALS]);
    if (items.length)
      await kv(["RPUSH", K_WITHDRAWALS, ...items.map((w) => JSON.stringify(w))]);
  } else mem.withdrawals = items;
}

export async function deleteWithdrawal(id: string): Promise<void> {
  await saveAllWithdrawals((await listWithdrawals()).filter((w) => w.id !== id));
}

export async function clearWithdrawals(): Promise<void> {
  await saveAllWithdrawals([]);
}

/** 管理者によるメンバー削除（退会ログに残さず完全削除＝テスト用）。 */
export async function adminRemoveMember(email: string): Promise<void> {
  await saveAllMembers((await listMembers()).filter((m) => m.email !== email));
}

export async function clearMembers(): Promise<void> {
  await saveAllMembers([]);
}

/** 凍結中か（ログイン・応募の可否判定に使用）。 */
export async function isMemberFrozen(email: string): Promise<boolean> {
  const m = (await listMembers()).find((x) => x.email === email);
  return !!m?.frozen;
}

/** 創設メンバー指定の切り替え（管理画面から）。 */
export async function setMemberFounder(
  email: string,
  founder: boolean,
): Promise<void> {
  const items = (await listMembers()).map((m) =>
    m.email === email ? { ...m, founder } : m,
  );
  await saveAllMembers(items);
}

/** 凍結の切り替え（管理画面から）。 */
export async function setMemberFrozen(
  email: string,
  frozen: boolean,
): Promise<void> {
  const items = (await listMembers()).map((m) =>
    m.email === email ? { ...m, frozen } : m,
  );
  await saveAllMembers(items);
}

/** 応募プロフィールを保存（本人が応募時に入力）。 */
export async function setMemberProfile(
  email: string,
  profile: MemberProfile,
): Promise<void> {
  const items = (await listMembers()).map((m) =>
    m.email === email ? { ...m, profile } : m,
  );
  await saveAllMembers(items);
}

async function saveAllMembers(items: Member[]): Promise<void> {
  if (useKV) {
    await kv(["DEL", K_MEMBERS]);
    if (items.length) {
      await kv(["RPUSH", K_MEMBERS, ...items.map((m) => JSON.stringify(m))]);
    }
  } else {
    mem.members = items;
  }
}

/* ----------------------------------------------------- applications */

export async function addApplication(
  input: Omit<Application, "id" | "createdAt">,
  now: string,
): Promise<Application> {
  const item: Application = { id: rid(), createdAt: now, ...input };
  if (useKV) {
    await kv(["LPUSH", K_APPLICATIONS, JSON.stringify(item)]);
  } else {
    mem.applications.unshift(item);
  }
  return item;
}

export async function listApplications(): Promise<Application[]> {
  if (useKV) {
    const raw = (await kv(["LRANGE", K_APPLICATIONS, 0, -1])) as string[];
    return (raw || []).map((s) => JSON.parse(s) as Application);
  }
  return mem.applications;
}

async function saveAllApplications(items: Application[]): Promise<void> {
  if (useKV) {
    await kv(["DEL", K_APPLICATIONS]);
    if (items.length)
      await kv(["RPUSH", K_APPLICATIONS, ...items.map((a) => JSON.stringify(a))]);
  } else mem.applications = items;
}

export async function deleteApplication(id: string): Promise<void> {
  await saveAllApplications((await listApplications()).filter((a) => a.id !== id));
}

export async function clearApplications(): Promise<void> {
  await saveAllApplications([]);
}

/* ----------------------------------------------------- internships */

export async function addInternship(
  input: Omit<AdminInternship, "id" | "createdAt" | "hidden">,
  now: string,
): Promise<AdminInternship> {
  const item: AdminInternship = {
    id: rid(),
    createdAt: now,
    hidden: false,
    ...input,
  };
  if (useKV) {
    await kv(["LPUSH", K_INTERNSHIPS, JSON.stringify(item)]);
  } else {
    mem.internships.unshift(item);
  }
  return item;
}

export async function listAdminInternships(): Promise<AdminInternship[]> {
  if (useKV) {
    const raw = (await kv(["LRANGE", K_INTERNSHIPS, 0, -1])) as string[];
    return (raw || []).map((s) => JSON.parse(s) as AdminInternship);
  }
  return mem.internships;
}

/** 公開用：非表示でない管理追加の募集だけ返す。 */
export async function listPublicAdminInternships(): Promise<AdminInternship[]> {
  return (await listAdminInternships()).filter((i) => !i.hidden);
}

async function saveAllInternships(items: AdminInternship[]): Promise<void> {
  if (useKV) {
    await kv(["DEL", K_INTERNSHIPS]);
    if (items.length) {
      await kv([
        "RPUSH",
        K_INTERNSHIPS,
        ...items.map((i) => JSON.stringify(i)),
      ]);
    }
  } else {
    mem.internships = items;
  }
}

export async function deleteInternship(id: string): Promise<void> {
  const items = (await listAdminInternships()).filter((i) => i.id !== id);
  await saveAllInternships(items);
}

export async function clearInternships(): Promise<void> {
  await saveAllInternships([]);
}

export async function setInternshipHidden(
  id: string,
  hidden: boolean,
): Promise<void> {
  const items = (await listAdminInternships()).map((i) =>
    i.id === id ? { ...i, hidden } : i,
  );
  await saveAllInternships(items);
}

export async function updateInternship(
  id: string,
  patch: Partial<Omit<AdminInternship, "id" | "createdAt">>,
): Promise<void> {
  const items = (await listAdminInternships()).map((i) =>
    i.id === id ? { ...i, ...patch } : i,
  );
  await saveAllInternships(items);
}

/* -------------------------------------- overrides (code internships) */

export async function getOverrides(): Promise<Record<string, Override>> {
  if (useKV) {
    const raw = (await kv(["GET", K_OVERRIDES])) as string | null;
    return raw ? (JSON.parse(raw) as Record<string, Override>) : {};
  }
  return mem.overrides;
}

export async function setOverride(
  slug: string,
  patch: Override,
): Promise<void> {
  const all = await getOverrides();
  const next = { ...all, [slug]: { ...all[slug], ...patch } };
  if (useKV) {
    await kv(["SET", K_OVERRIDES, JSON.stringify(next)]);
  } else {
    mem.overrides = next;
  }
}

/* --------------------------------------------------------- events */

export async function addEvent(
  input: Omit<EventItem, "id" | "createdAt" | "hidden">,
  now: string,
): Promise<EventItem> {
  const item: EventItem = { id: rid(), createdAt: now, hidden: false, ...input };
  if (useKV) await kv(["LPUSH", K_EVENTS, JSON.stringify(item)]);
  else mem.events.unshift(item);
  return item;
}

// 既定イベント（実開催分）を一度だけ KV へ投入。削除後は再投入しない。
let eventSeedChecked = false;
async function ensureEventSeed(): Promise<void> {
  if (eventSeedChecked) return;
  eventSeedChecked = true;
  try {
    if (useKV) {
      const flag = (await kv(["GET", "trypl:seeded:events"])) as string | null;
      if (flag === "v1") return;
      const raw = (await kv(["LRANGE", K_EVENTS, 0, -1])) as string[];
      const has = new Set(
        (raw || []).map((s) => (JSON.parse(s) as EventItem).id),
      );
      const add = (defaultEvents as EventItem[]).filter((e) => !has.has(e.id));
      if (add.length)
        await kv(["RPUSH", K_EVENTS, ...add.map((e) => JSON.stringify(e))]);
      await kv(["SET", "trypl:seeded:events", "v1"]);
    } else if (mem.events.length === 0) {
      mem.events.unshift(...(defaultEvents as EventItem[]));
    }
  } catch {}
}

export async function listEvents(): Promise<EventItem[]> {
  await ensureEventSeed();
  if (useKV) {
    const raw = (await kv(["LRANGE", K_EVENTS, 0, -1])) as string[];
    return (raw || []).map((s) => JSON.parse(s) as EventItem);
  }
  return mem.events;
}

/** 公開用：非表示でないイベントを日付昇順で返す。 */
export async function listPublicEvents(): Promise<EventItem[]> {
  return (await listEvents())
    .filter((e) => !e.hidden)
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function saveAllEvents(items: EventItem[]): Promise<void> {
  if (useKV) {
    await kv(["DEL", K_EVENTS]);
    if (items.length)
      await kv(["RPUSH", K_EVENTS, ...items.map((e) => JSON.stringify(e))]);
  } else mem.events = items;
}

export async function deleteEvent(id: string): Promise<void> {
  await saveAllEvents((await listEvents()).filter((e) => e.id !== id));
}

export async function setEventHidden(id: string, hidden: boolean): Promise<void> {
  await saveAllEvents(
    (await listEvents()).map((e) => (e.id === id ? { ...e, hidden } : e)),
  );
}

/* ---------------------------------------------------------- press */

export async function addPress(
  input: Omit<PressItem, "id" | "createdAt" | "hidden">,
  now: string,
): Promise<PressItem> {
  const item: PressItem = { id: rid(), createdAt: now, hidden: false, ...input };
  if (useKV) await kv(["LPUSH", K_PRESS, JSON.stringify(item)]);
  else mem.press.unshift(item);
  return item;
}

// 初期ニュース（公式サイト公開など）を一度だけ KV に投入する。
// これにより管理画面でも編集・削除できる正規データになる。削除後は再投入しない。
let pressSeedChecked = false;
async function ensurePressSeed(): Promise<void> {
  if (pressSeedChecked) return;
  pressSeedChecked = true;
  try {
    if (useKV) {
      const flag = (await kv(["GET", "trypl:seeded:press"])) as string | null;
      if (flag === "v3") return;
      // 旧シードの launch-2026 を除いて、最新版を投入（重複防止・既存の追加分は保持）。
      const raw = (await kv(["LRANGE", K_PRESS, 0, -1])) as string[];
      const kept = (raw || [])
        .map((s) => JSON.parse(s) as PressItem)
        .filter((p) => p.id !== "launch-2026");
      const next = [...kept, ...(defaultPress as PressItem[])];
      await kv(["DEL", K_PRESS]);
      if (next.length)
        await kv(["RPUSH", K_PRESS, ...next.map((p) => JSON.stringify(p))]);
      await kv(["SET", "trypl:seeded:press", "v3"]);
    } else if (mem.press.length === 0) {
      mem.press.unshift(...(defaultPress as PressItem[]));
    }
  } catch {}
}

export async function listPress(): Promise<PressItem[]> {
  await ensurePressSeed();
  if (useKV) {
    const raw = (await kv(["LRANGE", K_PRESS, 0, -1])) as string[];
    return (raw || []).map((s) => JSON.parse(s) as PressItem);
  }
  return mem.press;
}

export async function listPublicPress(): Promise<PressItem[]> {
  return (await listPress())
    .filter((p) => !p.hidden)
    .sort((a, b) => b.date.localeCompare(a.date));
}

async function saveAllPress(items: PressItem[]): Promise<void> {
  if (useKV) {
    await kv(["DEL", K_PRESS]);
    if (items.length)
      await kv(["RPUSH", K_PRESS, ...items.map((p) => JSON.stringify(p))]);
  } else mem.press = items;
}

export async function deletePress(id: string): Promise<void> {
  await saveAllPress((await listPress()).filter((p) => p.id !== id));
}

export async function setPressHidden(id: string, hidden: boolean): Promise<void> {
  await saveAllPress(
    (await listPress()).map((p) => (p.id === id ? { ...p, hidden } : p)),
  );
}

/** 既存プレスの内容を更新（管理画面の編集）。 */
export async function updatePress(
  id: string,
  patch: Partial<Omit<PressItem, "id" | "createdAt">>,
): Promise<void> {
  await saveAllPress(
    (await listPress()).map((p) => (p.id === id ? { ...p, ...patch } : p)),
  );
}

/* --------------------------------------------------- access stats */

export async function trackView(day: string): Promise<void> {
  if (useKV) {
    await kv(["HINCRBY", K_STATS, "total", 1]);
    await kv(["HINCRBY", K_STATS, `day:${day}`, 1]);
  } else {
    mem.stats.total = (mem.stats.total || 0) + 1;
    const k = `day:${day}`;
    mem.stats[k] = (mem.stats[k] || 0) + 1;
  }
}

export async function getStats(): Promise<Record<string, number>> {
  if (useKV) {
    const raw = (await kv(["HGETALL", K_STATS])) as unknown;
    const out: Record<string, number> = {};
    if (Array.isArray(raw)) {
      for (let i = 0; i + 1 < raw.length; i += 2)
        out[String(raw[i])] = Number(raw[i + 1]) || 0;
    } else if (raw && typeof raw === "object") {
      for (const [k, v] of Object.entries(raw as Record<string, unknown>))
        out[k] = Number(v) || 0;
    }
    return out;
  }
  return mem.stats;
}

export async function resetStats(): Promise<void> {
  if (useKV) await kv(["DEL", K_STATS]);
  else mem.stats = {};
}

/** イベント / プレスの全消去（テスト用）。 */
export async function clearEvents(): Promise<void> {
  await saveAllEvents([]);
}
export async function clearPress(): Promise<void> {
  await saveAllPress([]);
}

export const storeMode = useKV ? "kv" : "memory";
