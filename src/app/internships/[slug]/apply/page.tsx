import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getInternship } from "@/data/internships";
import ApplyForm from "@/components/internships/ApplyForm";

export const metadata: Metadata = { title: "応募" };
export const dynamic = "force-dynamic";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const internship = getInternship(slug);
  if (!internship) notFound();

  // 応募は会員限定。未ログインは会員登録/ログインへ。
  const session = await auth();
  if (!session?.user) redirect("/members");

  return (
    <ApplyForm
      slug={slug}
      company={internship.company}
      title={internship.title}
      name={session.user.name ?? ""}
      email={session.user.email ?? ""}
    />
  );
}
