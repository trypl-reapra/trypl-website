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
const MEMBER_PW = process.env.MEMBER_PASSWORD || "";

export type Role = "admin" | "member";
export const COOKIE = "trypl_session";

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function checkPassword(role: Role, pw: string): boolean {
  const expected = role === "admin" ? ADMIN_PW : MEMBER_PW;
  if (!expected) return false;
  return safeEq(pw, expected);
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
