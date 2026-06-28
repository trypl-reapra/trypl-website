"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePages } from "@/i18n/pages";

const inputCls =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-mute/60 focus:border-ink";

export default function ContactForm() {
  const c = usePages().contact;
  const categories = c.categories;
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
      if (!res.ok) throw new Error(data.error || c.errorDefault);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : c.errorDefault);
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
          <h3 className="mt-6 font-jp text-2xl font-bold">{c.doneTitle}</h3>
          <p className="mt-3 max-w-sm leading-relaxed text-mute">{c.doneBody}</p>
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
              <span className="mb-2 block text-sm font-medium">{c.fName}</span>
              <input name="name" required maxLength={100} className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">{c.fEmail}</span>
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
            <span className="mb-2 block text-sm font-medium">{c.fCategory}</span>
            <select name="category" className={inputCls} defaultValue={categories[0]}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">{c.fMessage}</span>
            <textarea
              name="message"
              required
              rows={6}
              maxLength={5000}
              className={inputCls + " resize-y"}
              placeholder={c.fMessagePlaceholder}
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
            {state === "sending" ? c.sending : c.submit}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
