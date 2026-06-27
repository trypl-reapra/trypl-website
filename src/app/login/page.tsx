"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ログインに失敗しました");
      router.push(data.role === "admin" ? "/admin" : "/members");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
      setState("error");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-ink";

  return (
    <section
      data-nav-theme="light"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-paper px-page py-28 text-ink"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow text-mute">Members only</span>
          <LogoMark className="mt-5 h-11 w-11" />
          <h1 className="mt-5 font-jp text-2xl font-bold tracking-tight">
            メンバー限定ログイン
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            TrypL のメンバーになった方だけがアクセスできる、限定エリアです。
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">ユーザー名</span>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className={inputCls}
              placeholder="お名前 / ユーザー名"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">パスワード</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={inputCls}
              placeholder="••••••••"
            />
          </label>

          {state === "error" && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={state === "sending"}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
          >
            {state === "sending" ? "確認中…" : "ログイン"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-mute">
          メンバー用パスワードは運営からお知らせします。
          <br />
          運営者は管理者アカウントでログインすると管理画面に進みます。
        </p>
      </motion.div>
    </section>
  );
}
