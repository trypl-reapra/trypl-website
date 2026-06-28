"use client";

import { signOut } from "next-auth/react";

/** メンバー / 管理者ともに Auth.js セッションをサインアウトする。 */
export default function MemberLogout({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex h-11 items-center rounded-full border border-line px-6 text-sm font-medium text-mute transition-colors hover:border-ink hover:text-ink"
    >
      {label}
    </button>
  );
}
