"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import LangSwitcher from "@/components/layout/LangSwitcher";
import { cn } from "@/lib/cn";
import { site, cta } from "@/data/site";
import { useT } from "@/i18n/LocaleProvider";

type Theme = "light" | "dark";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // 背後にあるセクションの明暗（data-nav-theme）に追従する配色テーマ。
  const [theme, setTheme] = useState<Theme>("light");
  const pathname = usePathname();
  const lenis = useLenis();
  const t = useT();
  const { status } = useSession();
  const authed = status === "authenticated";

  const navItems = [
    { label: t.nav.about, href: "/about" },
    { label: t.nav.internships, href: "/internships" },
    { label: t.nav.events, href: "/events" },
    { label: t.footer.contact, href: "/contact" },
    { label: t.nav.links, href: "/links" },
  ];

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
    // テーマ指定のないページ（管理画面など）は明色（濃い文字）を既定にする。
    // 指定がないと前ページの dark が残り、白いヘッダーが見えなくなるため。
    if (!targets.length) {
      setTheme("light");
      return;
    }
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
          {/* 通常リンク（<a>）にしてフルリロードでサイトのトップを開く。 */}
          <a
            href={site.url}
            aria-label="TrypL ホーム"
            onClick={() => setOpen(false)}
            className={cn(
              "relative z-50 transition-colors duration-500",
              dark ? "text-paper" : "text-ink",
            )}
          >
            <Logo tone={dark ? "paper" : "ink"} />
          </a>

          {/* desktop */}
          <div className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
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
            <LangSwitcher dark={dark} />
            {authed ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-5 text-sm font-medium transition-colors duration-500",
                  dark
                    ? "bg-paper text-ink hover:bg-fog"
                    : "bg-ink text-paper hover:bg-ink-soft",
                )}
              >
                {t.footer.logout}
              </button>
            ) : (
              <Link
                href={cta.href}
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-5 text-sm font-medium transition-colors duration-500",
                  dark
                    ? "bg-paper text-ink hover:bg-fog"
                    : "bg-ink text-paper hover:bg-ink-soft",
                )}
              >
                {t.cta}
              </Link>
            )}
          </div>

          {/* mobile toggle */}
          <button
            type="button"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
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
            className="fixed inset-0 z-40 bg-ink text-paper-dim lg:hidden"
            data-lenis-prevent
          >
            <div className="flex h-full flex-col justify-between px-page pb-12 pt-24">
              <ul className="flex flex-col gap-2">
                {navItems.map((item, i) => (
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
                className="space-y-6"
              >
                <LangSwitcher dark />
                {authed ? (
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="inline-flex h-14 w-full items-center justify-center rounded-full bg-paper text-base font-medium text-ink"
                  >
                    {t.footer.logout}
                  </button>
                ) : (
                  <Link
                    href={cta.href}
                    className="inline-flex h-14 w-full items-center justify-center rounded-full bg-paper text-base font-medium text-ink"
                  >
                    {t.cta}
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
