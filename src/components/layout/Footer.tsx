import Link from "next/link";
import { Logo, LogoMark } from "@/components/logo";
import { Container } from "@/components/ui";
import { site, nav, cta } from "@/data/site";
import { socials } from "@/data/socials";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-paper-dim">
      {/* 巨大な幾何マーク（薄く） */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] opacity-[0.05]">
        <LogoMark tone="paper" className="h-full w-full" />
      </div>

      <Container className="relative py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo className="text-paper" tone="paper" />
            <p className="mt-6 text-sm leading-relaxed text-mute-dark">
              {site.tagline}
              <br />
              REAPRA発・若年層向け実践型インターンコミュニティ。
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-6 inline-block text-sm text-paper-dim"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="サイト内リンク">
            <h3 className="eyebrow text-mute-dark">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[...nav, cta].map((item) => (
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
            <h3 className="eyebrow text-mute-dark">Follow</h3>
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
            © {year} {site.name}. Powered by{" "}
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
          <p className="tracking-wide">Learning · Long-term · LifeMission</p>
        </div>
      </Container>
    </footer>
  );
}
