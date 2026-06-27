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

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const useKV = !!(KV_URL && KV_TOKEN);

const K_CONTACTS = "trypl:contacts";
const K_INTERNSHIPS = "trypl:internships";

// ---- in-memory fallback (per serverless instance) ----
const mem: { contacts: Contact[]; internships: AdminInternship[] } = {
  contacts: [],
  internships: [],
};

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

export const storeMode = useKV ? "kv" : "memory";
