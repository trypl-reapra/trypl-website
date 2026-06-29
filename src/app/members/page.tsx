import type { Metadata } from "next";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { auth, memberProviders } from "@/auth";
import { listMembers } from "@/lib/store";
import { profileComplete } from "@/lib/profile";
import { memberCode } from "@/lib/member";
import { qrPayload } from "@/lib/checkin";
import MembersContent from "@/components/pages/MembersContent";
import MemberRegister from "@/components/members/MemberRegister";
import FrozenNotice from "@/components/members/FrozenNotice";
import ProfileGate from "@/components/members/ProfileGate";

export const metadata: Metadata = {
  title: "メンバー",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/** 会員証の裏に載せるイベント受付用QRを SVG 文字列で生成。 */
async function buildQrSvg(email: string): Promise<string | undefined> {
  try {
    return await QRCode.toString(qrPayload(email), {
      type: "svg",
      margin: 1,
      color: { dark: "#0b0b0d", light: "#ffffff" },
    });
  } catch {
    return undefined;
  }
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await auth();

  // 応募フロー等から渡される遷移先（同一オリジンのパスのみ許可）。
  const { next } = await searchParams;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") ? next : null;

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
  const qrSvg = email ? await buildQrSvg(email) : undefined;

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
        qrSvg={qrSvg}
      />
    );
  }

  // 登録情報が揃っていれば、応募フロー等の遷移先へ戻す。
  if (safeNext) redirect(safeNext);

  return (
    <MembersContent
      name={name}
      email={email}
      image={image}
      memberId={memberId}
      memberSince={memberSince}
      founder={!!me?.founder}
      profile={profile}
      qrSvg={qrSvg}
    />
  );
}
