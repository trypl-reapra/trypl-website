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

  // 初期化：保存値 → ブラウザ言語 の順で決定。
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) {
      setLocaleState(saved);
      return;
    }
    const browser = navigator.language.slice(0, 2);
    if (isLocale(browser)) setLocaleState(browser);
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
