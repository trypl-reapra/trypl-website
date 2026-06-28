"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { usePages } from "@/i18n/pages";

/**
 * 退会ボタン。確認のうえで、本人の会員レコードを削除してからサインアウトする。
 */
export default function DeleteAccountButton() {
  const m = usePages().members;
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      await fetch("/api/members/delete", { method: "POST" });
      await signOut({ callbackUrl: "/" });
    } catch {
      setBusy(false);
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs text-mute underline decoration-mute/40 underline-offset-4 transition-colors hover:text-red-600 hover:decoration-red-300"
      >
        {m.deleteAccount}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
      <p className="text-sm leading-relaxed text-ink">{m.deleteConfirm}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={remove}
          className="inline-flex h-10 items-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? m.deleting : m.deleteConfirmYes}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => setConfirming(false)}
          className="inline-flex h-10 items-center rounded-full border border-line px-5 text-sm font-medium text-mute transition-colors hover:border-ink hover:text-ink"
        >
          {m.deleteCancel}
        </button>
      </div>
    </div>
  );
}
