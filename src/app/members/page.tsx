import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentRole } from "@/lib/auth";
import MembersContent from "@/components/pages/MembersContent";

export const metadata: Metadata = { title: "メンバー" };
export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const role = await currentRole();
  if (!role) redirect("/login");
  return <MembersContent role={role} />;
}
