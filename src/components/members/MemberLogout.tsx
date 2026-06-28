"use client";

import { signOut } from "next-auth/react";

/**
 * メンバー / 管理者どちらのログアウトにも対応するボタン。
 * - OAuth メンバー（Auth.js セッション） → next-auth の signOut
 * - 管理者（HMAC Cookie）             → 既存の /api/auth/logout
 */
export default function MemberLogout({
  viaOAuth,
  label,
}: {
  viaOAuth: boolean;
  label: string;
}) {
  async function handle() {
    if (viaOAuth) {
      await signOut({ callbackUrl: "/" });
    } else {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    }
  }
  return (
    <button
      type="button"
      onClick={handle}
      className="inline-flex h-11 items-center rounded-full border border-line px-6 text-sm font-medium text-mute transition-colors hover:border-ink hover:text-ink"
    >
      {label}
    </button>
  );
}
