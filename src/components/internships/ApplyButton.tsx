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

/** 外部の応募ページ（Wantedly / HERP 等）か判定。"#" や空は社内応募。 */
function isExternalApply(url: string): boolean {
  const u = (url || "").trim();
  return u !== "" && u !== "#" && /^(https?:|mailto:)/i.test(u);
}

/**
 * 募集ページの応募ボタン。
 * - applyUrl が外部URL（Wantedly / HERP 等）→ そのページへ直接遷移（誰でも可）
 * - applyUrl が空 / "#" → 会員限定の社内応募フロー
 *     ・ログイン済み（会員） → そのまま応募リンク
 *     ・未ログイン           → 会員登録（/members）へ誘導
 */
export default function ApplyButton({
  slug,
  applyLabel,
  applyUrl = "",
}: {
  slug: string;
  applyLabel: string;
  applyUrl?: string;
}) {
  const { status } = useSession();
  const t = usePages().apply;
  const authed = status === "authenticated";

  // 外部の応募ページが設定されていれば、そこへ直接遷移する。
  if (isExternalApply(applyUrl)) {
    return (
      <>
        <div className="mt-7">
          <Magnetic className="w-full">
            <Button href={applyUrl} size="lg" className="w-full">
              {applyLabel}
              <Arrow />
            </Button>
          </Magnetic>
        </div>
        <p className="mt-4 text-center text-xs text-mute">{t.externalNote}</p>
      </>
    );
  }

  // 社内応募フロー（応募はダッシュボードで管理）。
  return (
    <>
      <div className="mt-7">
        <Magnetic className="w-full">
          <Button
            href={
              authed
                ? `/internships/${slug}/apply`
                : `/members?next=${encodeURIComponent(`/internships/${slug}/apply`)}`
            }
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
