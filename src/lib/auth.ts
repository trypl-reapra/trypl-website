/**
 * 簡易セッション認証。
 * パスワードは環境変数（ADMIN_PASSWORD / MEMBER_PASSWORD）で管理し、
 * リポジトリには秘密を置かない。Cookie は HMAC 署名トークン。
 */

import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET || "trypl-insecure-dev-secret";
const ADMIN_PW = process.env.ADMIN_PASSWORD || "";
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const MEMBER_PW = process.env.MEMBER_PASSWORD || "";

export type Role = "admin" | "member";
export const COOKIE = "trypl_session";

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * 1つのログインフォームで判定する。
 * - 管理者ユーザー名＋管理者パスワードが一致 → admin
 * - それ以外でメンバー用パスワードが一致 → member（ユーザー名は任意）
 */
export function authenticate(username: string, password: string): Role | null {
  if (
    ADMIN_PW &&
    safeEq(username.trim(), ADMIN_USER) &&
    safeEq(password, ADMIN_PW)
  ) {
    return "admin";
  }
  if (MEMBER_PW && safeEq(password, MEMBER_PW)) return "member";
  return null;
}

export function sign(role: Role): string {
  const payload = `${role}.${Date.now()}`;
  const p = Buffer.from(payload).toString("base64url");
  const mac = createHmac("sha256", SECRET).update(p).digest("base64url");
  return `${p}.${mac}`;
}

export function verify(token?: string): Role | null {
  if (!token) return null;
  const [p, mac] = token.split(".");
  if (!p || !mac) return null;
  const expected = createHmac("sha256", SECRET).update(p).digest("base64url");
  if (!safeEq(mac, expected)) return null;
  const role = Buffer.from(p, "base64url").toString().split(".")[0];
  return role === "admin" || role === "member" ? role : null;
}

/** 現在のセッションのロールを返す（サーバー専用）。 */
export async function currentRole(): Promise<Role | null> {
  const store = await cookies();
  return verify(store.get(COOKIE)?.value);
}

/** ログイン機能が有効か（パスワードが設定されているか）。 */
export const authConfigured = !!(ADMIN_PW || MEMBER_PW);
