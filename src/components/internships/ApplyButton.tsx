"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui";
import { Magnetic } from "@/components/motion";
import { usePages } from "@/i18n/pages";

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 募集ページは誰でも閲覧できるが、応募は会員限定。
 * - ログイン済み（会員） → そのまま応募リンク
 * - 未ログイン           → 会員登録（/members）へ誘導
 */
export default function ApplyButton({
  slug,
  applyLabel,
}: {
  slug: string;
  applyLabel: string;
}) {
  const { status } = useSession();
  const t = usePages().apply;
  const authed = status === "authenticated";

  return (
    <>
      <div className="mt-7">
        <Magnetic className="w-full">
          <Button
            href={authed ? `/internships/${slug}/apply` : "/members"}
            size="lg"
            className="w-full"
          >
            {authed ? applyLabel : t.cta}
            <Arrow />
          </Button>
        </Magnetic>
      </div>
      <p className="mt-4 text-center text-xs text-mute">
        {authed ? t.authedNote : t.note}
      </p>
    </>
  );
}
