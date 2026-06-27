"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/cn";
import { nav, cta } from "@/data/site";

type Theme = "light" | "dark";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // 背後にあるセクションの明暗（data-nav-theme）に追従する配色テーマ。
  const [theme, setTheme] = useState<Theme>("light");
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ナビ直下（ビューポート最上部）に来ているセクションの明暗を検知して配色を切替。
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]"),
    );
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const t = (e.target as HTMLElement).dataset.navTheme;
            if (t === "dark" || t === "light") setTheme(t);
          }
        });
      },
      // ビューポート最上部の細いラインに交差したセクションを「ナビの背後」とみなす。
      { rootMargin: "0px 0px -100% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  // ルート変更でメニューを閉じる
  useEffect(() => setOpen(false), [pathname]);

  // メニュー開閉でスクロールを止める
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  const dark = theme === "dark" && !open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled || open ? "backdrop-blur-xl" : "backdrop-blur-0",
          scrolled && !open
            ? dark
              ? "border-paper/10 bg-ink/40"
              : "border-ink/10 bg-paper/55"
            : "border-transparent bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-page">
          <Link
            href="/"
            aria-label="TrypL ホーム（先頭へ）"
            onClick={(e) => {
              setOpen(false);
              // すでにホームにいる場合は遷移せず先頭までスクロール。
              if (pathname === "/") {
                e.preventDefault();
                if (lenis) lenis.scrollTo(0, { duration: 1.1 });
                else window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={cn(
              "relative z-50 transition-colors duration-500",
              dark ? "text-paper" : "text-ink",
            )}
          >
            <Logo tone={dark ? "paper" : "ink"} />
          </Link>

          {/* desktop */}
          <div className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "link-underline text-sm transition-colors duration-500",
                  dark
                    ? "text-paper/75 hover:text-paper"
                    : "text-ink/80 hover:text-ink",
                  pathname === item.href && (dark ? "text-paper" : "text-ink"),
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={cta.href}
              className={cn(
                "inline-flex h-9 items-center rounded-full px-5 text-sm font-medium transition-colors duration-500",
                dark
                  ? "bg-paper text-ink hover:bg-fog"
                  : "bg-ink text-paper hover:bg-ink-soft",
              )}
            >
              {cta.label}
            </Link>
          </div>

          {/* mobile toggle */}
          <button
            type="button"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-6 transition-all duration-300",
                  open || dark ? "bg-paper" : "bg-ink",
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 block h-[1.5px] w-6 transition-all duration-300",
                  open || dark ? "bg-paper" : "bg-ink",
                  open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "",
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-ink text-paper-dim md:hidden"
            data-lenis-prevent
          >
            <div className="flex h-full flex-col justify-between px-page pb-12 pt-24">
              <ul className="flex flex-col gap-2">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      className="block py-2 font-display text-4xl font-medium tracking-tight"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={cta.href}
                  className="inline-flex h-14 w-full items-center justify-center rounded-full bg-paper text-base font-medium text-ink"
                >
                  {cta.label}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
