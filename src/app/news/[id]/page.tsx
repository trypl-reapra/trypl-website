import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listPublicPress } from "@/lib/store";
import NewsArticle from "@/components/pages/NewsArticle";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = (await listPublicPress()).find((p) => p.id === id);
  if (!item) return { title: "ニュース" };
  return {
    title: item.title,
    description: item.summary || undefined,
    alternates: { canonical: `/news/${id}` },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = (await listPublicPress()).find((p) => p.id === id);
  if (!item) notFound();
  return (
    <NewsArticle
      title={item.title}
      outlet={item.outlet}
      url={item.url}
      date={item.date}
      summary={item.summary}
      body={item.body ?? ""}
      image={item.image ?? ""}
    />
  );
}
