"use client";

import { useRouter } from "next/navigation";
import { usePages } from "@/i18n/pages";

export default function LogoutButton() {
  const router = useRouter();
  const label = usePages().members.logout;
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex h-11 items-center rounded-full border border-line px-6 text-sm font-medium text-ink transition-colors hover:border-ink"
    >
      {label}
    </button>
  );
}
