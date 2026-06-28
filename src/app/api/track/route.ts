import { NextResponse } from "next/server";
import { getStats, trackView } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** ページビュー計測（公開・軽量）。本文不要。 */
export async function POST() {
  try {
    await trackView(new Date().toISOString().slice(0, 10));
  } catch {}
  return new NextResponse(null, { status: 204 });
}

/** 動作確認用：累計ビュー数を返す（公開）。 */
export async function GET() {
  try {
    const s = await getStats();
    return NextResponse.json({ total: s.total || 0 });
  } catch {
    return NextResponse.json({ total: 0 });
  }
}
