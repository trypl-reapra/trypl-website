"use client";

import Link from "next/link";
import { Logo, LogoMark } from "@/components/logo";
import { Container } from "@/components/ui";
import { site, cta } from "@/data/site";
import { socials } from "@/data/socials";
import { useT } from "@/i18n/LocaleProvider";
import { usePages } from "@/i18n/pages";
import FooterQuote from "@/components/layout/FooterQuote";

export default function Footer() {
  const year = 2026;
  const t = useT();
  const pages = usePages();
  const navItems = [
    { label: t.nav.about, href: "/about" },
    { label: t.nav.internships, href: "/internships" },
    { label: t.nav.events, href: "/events" },
    { label: t.press.heading, href: "/news" },
    { label: t.nav.links, href: "/links" },
    { label: t.footer.contact, href: "/contact" },
    { label: t.cta, href: cta.href },
    { label: t.footer.login, href: "/members" },
    { label: t.footer.privacy, href: "/privacy" },
    { label: t.footer.terms, href: "/legal" },
  ];

  return (
    <footer
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ink text-paper-dim"
    >
      {/* 大きめの幾何マークを薄く配置。右側だけ画面外へ大きく見切れさせる。 */}
      <div className="pointer-events-none absolute right-[-7rem] top-1/2 hidden h-[clamp(240px,26vw,340px)] w-[clamp(240px,26vw,340px)] -translate-y-1/2 opacity-[0.07] sm:block">
        <LogoMark tone="paper" className="h-full w-full" />
      </div>

      <Container className="relative py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo className="text-paper" tone="paper" />
            <p className="mt-6 text-sm leading-relaxed text-mute-dark">
              {pages.tagline}
              <br />
              {t.footer.desc}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-6 inline-block text-sm text-paper-dim"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="サイト内リンク">
            <h3 className="eyebrow text-mute-dark">{t.footer.explore}</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-paper-dim/80 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="SNS リンク">
            <h3 className="eyebrow text-mute-dark">{t.footer.follow}</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {socials.map((s) => (
                <li key={s.key}>
                  {s.available ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-paper-dim/80 transition-colors hover:text-paper"
                    >
                      {s.label}
                    </a>
                  ) : (
                    <span className="text-paper-dim/35">{s.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line-dark pt-8 text-xs text-mute-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {t.footer.poweredBy}{" "}
            <a
              href={site.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper-dim/80 hover:text-paper"
            >
              {site.parent.name}
            </a>
            .
          </p>
          <FooterQuote />
        </div>
      </Container>
    </footer>
  );
}
