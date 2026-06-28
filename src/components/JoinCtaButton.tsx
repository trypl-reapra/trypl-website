"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui";
import { Magnetic } from "@/components/motion";
import { useT } from "@/i18n/LocaleProvider";

/**
 * 「参加する」CTA。ログイン中は「会員ページへ（/members）」に切り替わる。
 * loggedOutLabel を渡すと、未ログイン時のラベルだけ差し替えられる。
 */
export default function JoinCtaButton({
  variant = "inverse",
  size = "lg",
  loggedOutLabel,
}: {
  variant?: "primary" | "inverse" | "outline" | "outline-invert";
  size?: "md" | "lg";
  loggedOutLabel?: string;
}) {
  const t = useT();
  const { status } = useSession();
  const authed = status === "authenticated";
  const href = authed ? "/members" : "/join";
  const label = authed ? t.ctaMember : loggedOutLabel ?? t.cta;

  return (
    <Magnetic>
      <Button href={href} variant={variant} size={size}>
        {label}
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </Magnetic>
  );
}
