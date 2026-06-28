/**
 * Auth.js (NextAuth v5) — メンバー会員登録 / ログイン用。
 *
 * メンバーは Google / Apple アカウントで会員登録・ログインする。
 * 各プロバイダは対応する環境変数が設定されている場合のみ有効化される
 * （未設定ならボタンは表示されず、ビルドも通る）。
 *
 * 管理者（admin）は別系統（src/lib/auth.ts の HMAC Cookie）のまま。
 * この Auth.js セッションは「member」ロールのみを扱う。
 *
 * 必要な環境変数:
 *   AUTH_SECRET              … セッション署名用（既存のものを流用可）
 *   AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET   … Google OAuth
 *   AUTH_APPLE_ID  / AUTH_APPLE_SECRET     … Sign in with Apple
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

const providers: Provider[] = [];
if (hasGoogle) providers.push(Google);
if (hasApple) providers.push(Apple);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers,
  pages: {
    // 専用のサインインUIは /members 側で出す。
    signIn: "/members",
    error: "/members",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      // Auth.js 経由のログインは常に member ロール。
      (token as { role?: string }).role = "member";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role =
          (token as { role?: string }).role ?? "member";
      }
      return session;
    },
  },
  events: {
    // 初回ログイン＝会員登録。メンバー台帳に記録（メール重複は store 側で排除）。
    async signIn({ user, account }) {
      if (!user?.email) return;
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
