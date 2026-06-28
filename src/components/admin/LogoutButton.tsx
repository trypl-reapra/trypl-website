"use client";

import { signOut } from "next-auth/react";
import { usePages } from "@/i18n/pages";

export default function LogoutButton() {
  const label = usePages().members.logout;
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex h-11 items-center rounded-full border border-line px-6 text-sm font-medium text-ink transition-colors hover:border-ink"
    >
      {label}
    </button>
  );
}
