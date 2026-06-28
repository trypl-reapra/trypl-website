import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { listMembers } from "@/lib/store";
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

  // 応募は会員限定。未ログインは会員登録/ログインへ（ログイン後この応募ページへ戻す）。
  const session = await auth();
  if (!session?.user)
    redirect(`/members?next=${encodeURIComponent(`/internships/${slug}/apply`)}`);

  const email = session.user.email ?? "";
  const me = email
    ? (await listMembers()).find((m) => m.email === email)
    : null;

  return (
    <ApplyForm
      slug={slug}
      company={internship.company}
      title={internship.title}
      email={email}
      defaultName={me?.profile?.fullName || session.user.name || ""}
      profile={me?.profile ?? null}
    />
  );
}
