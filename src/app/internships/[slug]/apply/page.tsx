import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { listMembers } from "@/lib/store";
import { profileComplete } from "@/lib/profile";
import { getInternship } from "@/data/internships";
import ApplyForm from "@/components/internships/ApplyForm";

export const metadata: Metadata = {
  title: "応募",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const internship = getInternship(slug);
  if (!internship) notFound();

  const session = await auth();
  if (!session?.user)
    redirect(`/members?next=${encodeURIComponent(`/internships/${slug}/apply`)}`);

  const email = session.user.email ?? "";
  const me = email
    ? (await listMembers()).find((m) => m.email === email)
    : null;

  // 凍結中のアカウントは応募フローに進めない（メンバーページへ戻す）。
  if (me?.frozen) redirect("/members");

  // 登録情報が未入力なら、まず登録画面へ。
  if (!me?.profile || !profileComplete(me.profile))
    redirect(`/members?next=${encodeURIComponent(`/internships/${slug}/apply`)}`);

  return (
    <ApplyForm
      slug={slug}
      company={internship.company}
      title={internship.title}
      email={email}
      profile={me.profile}
    />
  );
}
