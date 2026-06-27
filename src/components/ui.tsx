import Link from "next/link";
import { cn } from "@/lib/cn";
import { TriDot } from "@/components/logo";
import type { ComponentProps, ReactNode } from "react";

/* -------------------------------------------------------------- Container */

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-page", className)}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- Section */

export function Section({
  children,
  className,
  tone = "light",
  id,
  topPad = true,
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark" | "fog";
  id?: string;
  /** false にすると上の余白を外す（PageHeader直後などで使用）。 */
  topPad?: boolean;
}) {
  const tones = {
    light: "bg-paper text-ink",
    fog: "bg-fog text-ink",
    dark: "bg-ink text-paper-dim",
  } as const;
  return (
    <section
      id={id}
      data-nav-theme={tone === "dark" ? "dark" : "light"}
      className={cn(
        "relative scroll-mt-24 pb-24 sm:pb-32 lg:pb-40",
        topPad && "pt-24 sm:pt-32 lg:pt-40",
        tones[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- Eyebrow */

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-3 text-mute",
        className,
      )}
    >
      <TriDot className="text-current opacity-70" />
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------- Button */

type Variant =
  | "primary"
  | "inverse"
  | "outline"
  | "outline-invert"
  | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-soft",
  inverse: "bg-paper text-ink hover:bg-fog",
  outline:
    "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  "outline-invert":
    "border border-paper/25 text-paper-dim hover:bg-paper hover:text-ink",
  ghost: "text-current hover:opacity-60",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<ComponentProps<"a">, "href">) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,border-color,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none whitespace-nowrap",
    variants[variant],
    sizes[size],
    className,
  );
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------- ArrowLink */

export function ArrowLink({
  children,
  href,
  className,
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  const external = /^https?:\/\//.test(href);
  const inner = (
    <>
      <span className="link-underline">{children}</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
  const classes = cn(
    "group inline-flex items-center gap-2 font-medium",
    className,
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

/* ------------------------------------------------------------------ Badge */

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-current/15 px-3 py-1 text-xs tracking-wide",
        className,
      )}
    >
      {children}
    </span>
  );
}
