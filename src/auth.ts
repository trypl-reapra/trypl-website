/**
 * Auth.js (NextAuth v5) — 会員 / 管理者の単一認証。
 *
 * ・一般メンバー：Google（/ Apple）でログイン＝会員登録。
 * ・管理者：環境変数 ADMIN_EMAILS に登録したメールの Google アカウントでログインすると
 *   role が "admin" になり、/admin（管理画面）に入れる。専用のパスワード画面は持たない。
 *
 * 必要な環境変数:
 *   AUTH_SECRET            … セッション署名用
 *   AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET   … Google OAuth
 *   AUTH_APPLE_ID  / AUTH_APPLE_SECRET     … Sign in with Apple（任意）
 *   ADMIN_EMAILS           … 管理者の Google メール（カンマ区切りで複数可）
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import type { Provider } from "next-auth/providers";
import { addMember } from "@/lib/store";

const hasGoogle = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
const hasApple = !!(process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET);

/** 画面側で「どのプロバイダが利用可能か」を出し分けるためのフラグ。 */
export const memberProviders = {
  google: hasGoogle,
  apple: hasApple,
  any: hasGoogle || hasApple,
};

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export type Role = "admin" | "member";

function roleForEmail(email?: string | null): Role {
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) return "admin";
  return "member";
}

const providers: Provider[] = [];
if (hasGoogle) providers.push(Google);
if (hasApple) providers.push(Apple);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers,
  pages: { signIn: "/members", error: "/members" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      const email = (user?.email ?? token.email) as string | undefined;
      (token as { role?: Role }).role = roleForEmail(email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: Role }).role =
          (token as { role?: Role }).role ?? "member";
      }
      return session;
    },
  },
  events: {
    // 初回ログイン＝会員登録。管理者アカウントは運営者なので台帳には載せない。
    async signIn({ user, account }) {
      if (!user?.email) return;
      if (roleForEmail(user.email) === "admin") return;
      try {
        await addMember(
          {
            email: user.email,
            name: user.name ?? "",
            image: user.image ?? "",
            provider: account?.provider ?? "",
          },
          new Date().toISOString(),
        );
      } catch {
        // 台帳記録に失敗してもログイン自体は継続させる。
      }
    },
  },
});

/** 現在のセッションのロールを返す（サーバー専用）。未ログインは null。 */
export async function sessionRole(): Promise<Role | null> {
  const s = await auth();
  if (!s?.user) return null;
  return (s.user as { role?: Role }).role ?? "member";
}
