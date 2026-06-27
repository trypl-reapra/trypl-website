import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentRole } from "@/lib/auth";
import { storeMode } from "@/lib/store";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "管理画面" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const role = await currentRole();
  if (role !== "admin") redirect("/login");
  return <AdminDashboard storeMode={storeMode} />;
}
