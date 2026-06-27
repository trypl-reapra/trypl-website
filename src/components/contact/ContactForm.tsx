"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const categories = [
  "参加について",
  "取材・メディア",
  "企業・大学との連携",
  "採用・インターン掲載",
  "その他",
];

const inputCls =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-mute/60 focus:border-ink";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      category: fd.get("category"),
      message: fd.get("message"),
    };
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "送信に失敗しました");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
      setState("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {state === "done" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[320px] flex-col items-center justify-center text-center"
        >
          <div className="grid h-14 w-14 place-items-center rounded-full bg-ink text-paper">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="mt-6 font-jp text-2xl font-bold">送信しました</h3>
          <p className="mt-3 max-w-sm leading-relaxed text-mute">
            お問い合わせありがとうございます。内容を確認のうえ、担当より折り返しご連絡します。
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">お名前</span>
              <input name="name" required maxLength={100} className={inputCls} placeholder="山田 太郎" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">メールアドレス</span>
              <input
                name="email"
                type="email"
                required
                maxLength={200}
                className={inputCls}
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">種別</span>
            <select name="category" className={inputCls} defaultValue={categories[0]}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">お問い合わせ内容</span>
            <textarea
              name="message"
              required
              rows={6}
              maxLength={5000}
              className={inputCls + " resize-y"}
              placeholder="ご相談内容をご記入ください。"
            />
          </label>

          {state === "error" && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={state === "sending"}
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
          >
            {state === "sending" ? "送信中…" : "送信する"}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
