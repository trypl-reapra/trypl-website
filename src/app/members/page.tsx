import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentRole } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import { Container, Section } from "@/components/ui";
import LogoutButton from "@/components/admin/LogoutButton";
import { events } from "@/data/site";

export const metadata: Metadata = { title: "メンバー" };
export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const role = await currentRole();
  if (!role) redirect("/login");

  return (
    <>
      <PageHeader
        eyebrow="Members · メンバー専用"
        title={["ようこそ、TrypL へ。"]}
        lead="メンバー限定のリンクと最新情報です。実践の現場へ、ここから。"
      />
      <Section tone="light" topPad={false}>
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href="/internships"
              className="rounded-2xl border border-line p-7 transition-colors hover:border-ink"
            >
              <h3 className="font-jp text-xl font-bold">募集一覧</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">
                REAPRA・投資先の実践機会を見る。
              </p>
            </Link>
            <a
              href={events.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-line p-7 transition-colors hover:border-ink"
            >
              <h3 className="font-jp text-xl font-bold">イベント（Luma）</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">
                説明会・座談会・ワークショップの予定。
              </p>
            </a>
          </div>

          <div className="mt-12 flex items-center gap-4">
            {role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-ink-soft"
              >
                管理画面へ
              </Link>
            )}
            <LogoutButton />
          </div>
        </Container>
      </Section>
    </>
  );
}
