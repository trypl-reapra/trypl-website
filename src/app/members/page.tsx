import type { Metadata } from "next";
import { auth, memberProviders } from "@/auth";
import { currentRole } from "@/lib/auth";
import { listMembers } from "@/lib/store";
import MembersContent from "@/components/pages/MembersContent";
import MemberRegister from "@/components/members/MemberRegister";

export const metadata: Metadata = { title: "メンバー" };
export const dynamic = "force-dynamic";

/** メールから安定した会員番号（表示用）を作る。 */
function memberCode(email: string): string {
  let h = 0;
  for (let i = 0; i < email.length; i++) {
    h = (h * 31 + email.charCodeAt(i)) >>> 0;
  }
  return "TRYPL-" + h.toString(36).toUpperCase().padStart(6, "0").slice(-6);
}

export default async function MembersPage() {
  const session = await auth();
  const isAdmin = (await currentRole()) === "admin";

  // ログイン済み（OAuth メンバー or 管理者）→ メンバーダッシュボード。
  if (session?.user || isAdmin) {
    const email = session?.user?.email ?? null;
    const me = email
      ? (await listMembers()).find((m) => m.email === email)
      : null;
    return (
      <MembersContent
        isAdmin={isAdmin}
        viaOAuth={!!session?.user}
        name={session?.user?.name ?? null}
        email={email}
        image={session?.user?.image ?? null}
        memberId={email ? memberCode(email) : null}
        memberSince={me?.createdAt ?? null}
      />
    );
  }

  // 未ログイン → 会員登録 / ログイン画面（Google / Apple）。
  return <MemberRegister providers={memberProviders} />;
}
