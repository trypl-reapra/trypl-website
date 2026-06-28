import type { Metadata } from "next";
import InternshipsView from "@/components/internships/InternshipsView";
import {
  getAllInternships,
  getUsedCategories,
  type Internship,
} from "@/data/internships";
import { getOverrides, listPublicAdminInternships } from "@/lib/store";

export const metadata: Metadata = {
  title: "募集一覧",
  description:
    "REAPRA および投資先企業でのインターン募集要項。コミュニティ・事業開発・リサーチ・マーケティングなど、実践の現場を横断する機会を掲載しています。",
  alternates: { canonical: "/internships" },
};

// 管理画面で追加した募集を反映するためリクエスト時に描画する。
export const dynamic = "force-dynamic";

export default async function InternshipsPage() {
  const [adminItems, overrides] = await Promise.all([
    listPublicAdminInternships(),
    getOverrides(),
  ]);

  const mapped: Internship[] = adminItems.map((a) => ({
    slug: `admin-${a.id}`,
    company: a.company,
    companyTag: "インターン募集",
    title: a.title,
    category: "business",
    location: a.location || "—",
    workStyle: "remote",
    commitment: "—",
    duration: "—",
    compensation: a.compensation || "応相談",
    summary: a.summary || "",
    about: a.summary || "",
    responsibilities: [],
    requirements: [],
    welcome: [],
    tags: [],
    applyUrl: a.applyUrl || "#",
    applyLabel: "応募する",
    postedAt: a.createdAt.slice(0, 10),
    featured: false,
  }));

  // 既存（コード）募集に管理画面の上書き（非表示・編集）を適用。
  const codeItems = getAllInternships()
    .filter((i) => !overrides[i.slug]?.hidden)
    .map((i) => {
      const ov = overrides[i.slug];
      return ov
        ? {
            ...i,
            company: ov.company ?? i.company,
            title: ov.title ?? i.title,
            location: ov.location ?? i.location,
            compensation: ov.compensation ?? i.compensation,
            summary: ov.summary ?? i.summary,
            applyUrl: ov.applyUrl ?? i.applyUrl,
          }
        : i;
    });

  const items = [...mapped, ...codeItems].sort((x, y) =>
    y.postedAt.localeCompare(x.postedAt),
  );
  const categories = getUsedCategories();

  return <InternshipsView items={items} categories={categories} />;
}
