import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { sessionRole } from "@/auth";
import { storeMode } from "@/lib/store";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "管理画面" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if ((await sessionRole()) !== "admin") redirect("/members");
  return <AdminDashboard storeMode={storeMode} />;
}
