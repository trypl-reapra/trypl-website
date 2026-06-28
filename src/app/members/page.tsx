import type { Metadata } from "next";
import { auth, memberProviders } from "@/auth";
import { currentRole } from "@/lib/auth";
import MembersContent from "@/components/pages/MembersContent";
import MemberRegister from "@/components/members/MemberRegister";

export const metadata: Metadata = { title: "メンバー" };
export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const session = await auth();
  const isAdmin = (await currentRole()) === "admin";

  // ログイン済み（OAuth メンバー or 管理者）→ メンバーダッシュボード。
  if (session?.user || isAdmin) {
    return (
      <MembersContent
        isAdmin={isAdmin}
        viaOAuth={!!session?.user}
        name={session?.user?.name ?? null}
        email={session?.user?.email ?? null}
      />
    );
  }

  // 未ログイン → 会員登録 / ログイン画面（Google / Apple）。
  return <MemberRegister providers={memberProviders} />;
}
