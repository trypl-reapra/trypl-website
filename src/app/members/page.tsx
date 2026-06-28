import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, memberProviders } from "@/auth";
import { listMembers } from "@/lib/store";
import { profileComplete } from "@/lib/profile";
import MembersContent from "@/components/pages/MembersContent";
import MemberRegister from "@/components/members/MemberRegister";
import FrozenNotice from "@/components/members/FrozenNotice";
import ProfileGate from "@/components/members/ProfileGate";

export const metadata: Metadata = {
  title: "メンバー",
  robots: { index: false, follow: false },
};
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

  // 未ログイン → 会員登録 / ログイン画面（Google）。
  if (!session?.user) {
    return <MemberRegister providers={memberProviders} />;
  }

  // 管理者（TrypL の Google アカウント）→ そのまま管理画面へ。
  const role = (session.user as { role?: string }).role;
  if (role === "admin") redirect("/admin");

  // 一般メンバー → メンバーダッシュボード（会員証など）。
  const email = session.user.email ?? null;
  const me = email
    ? (await listMembers()).find((m) => m.email === email)
    : null;

  // 凍結中のメンバーには案内のみ表示。
  if (me?.frozen) return <FrozenNotice />;

  const name = session.user.name ?? null;
  const image = session.user.image ?? null;
  const memberId = email ? memberCode(email) : null;
  const memberSince = me?.createdAt ?? null;
  const profile = me?.profile ?? null;

  // 登録情報が未入力なら、登録画面のみ表示（ゲート）。
  if (!profileComplete(profile)) {
    return (
      <ProfileGate
        name={name}
        email={email}
        image={image}
        memberId={memberId}
        memberSince={memberSince}
        profile={profile}
      />
    );
  }

  return (
    <MembersContent
      name={name}
      email={email}
      image={image}
      memberId={memberId}
      memberSince={memberSince}
      founder={!!me?.founder}
      profile={profile}
    />
  );
}
