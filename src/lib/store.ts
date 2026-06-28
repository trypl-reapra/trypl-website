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
  hidden: boolean;
  createdAt: string;
};

/** 応募に必要な最低限のプロフィール（会員が応募時に登録）。 */
export type MemberProfile = {
  fullName: string;
  furigana?: string;
  school: string;
  department?: string;
  year: string;
  phone: string;
};

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
  /** 応募用プロフィール（一度入力すると次回以降は自動入力される）。 */
  profile?: MemberProfile;
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

// ---- in-memory fallback ----
// globalThis に載せて、同一プロセス内の別バンドル（API ルートとページ等）でも
// 同じ状態を共有する。※プロセスを跨ぐ恒久共有には KV が必要。
type Mem = {
  contacts: Contact[];
  internships: AdminInternship[];
  overrides: Record<string, Override>;
  members: Member[];
  applications: Application[];
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

/** 退会：指定メールの会員レコードを削除する。 */
export async function removeMemberByEmail(email: string): Promise<void> {
  const items = (await listMembers()).filter((m) => m.email !== email);
  await saveAllMembers(items);
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

export const storeMode = useKV ? "kv" : "memory";
