"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  dict,
  LOCALE_HTML,
  LOCALES,
  type Locale,
} from "@/i18n/dict";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "trypl.locale";

function isLocale(v: string | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ja");

  // 初期化：初回アクセスは常に日本語。
  // ユーザーが言語スイッチャーで明示的に選んだ場合のみ、その選択（保存値）を尊重する。
  // ブラウザ言語による自動切り替えは行わない。
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) setLocaleState(saved);
  }, []);

  // <html lang> を同期。
  useEffect(() => {
    document.documentElement.lang = LOCALE_HTML[locale];
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

/** 現在のロケールの辞書を返す。 */
export function useT() {
  const { locale } = useLocale();
  return dict[locale];
}
