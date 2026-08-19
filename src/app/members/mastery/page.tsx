import type { Metadata } from "next";
import Link from "next/link";
import { auth, memberProviders } from "@/auth";
import { parseMasteryPayload, MASTERY_SITE } from "@/lib/mastery";
import MasteryClaim from "@/components/members/MasteryClaim";

export const metadata: Metadata = {
  title: "熟達タイプを記録する",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/**
 * 熟達タイプ診断（mastery-type）の結果を会員ページに記録する受け口。
 * 診断サイトの結果画面から /members/mastery?r=<ペイロード> で飛んでくる。
 * 未ログインなら Google ログイン（＝会員登録）に流れ、戻ってきて記録する。
 */
export default async function MasteryPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const { r } = await searchParams;
  const rec = parseMasteryPayload(r);

  // リンクが壊れている / 手で書き換えられている場合。
  if (!rec || !r) {
    return (
      <section
        data-nav-theme="light"
        className="flex min-h-[100svh] items-center justify-center bg-paper px-page py-28 text-ink"
      >
        <div className="w-full max-w-sm text-center">
          <h1 className="font-jp text-2xl font-bold tracking-tight">
            結果を読み取れませんでした
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            リンクが途中で切れているかもしれません。診断サイトの結果画面から、もう一度お試しください。
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={MASTERY_SITE}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
            >
              診断サイトへ
            </a>
            <Link href="/members" className="link-underline text-sm text-mute">
              会員ページへ
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const session = await auth();
  return (
    <MasteryClaim
      rec={rec}
      payload={r}
      signedIn={!!session?.user?.email}
      providers={memberProviders}
    />
  );
}
