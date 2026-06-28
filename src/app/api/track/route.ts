import { NextResponse } from "next/server";
import { trackView } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** ページビュー計測（公開・軽量）。本文不要。 */
export async function POST() {
  try {
    await trackView(new Date().toISOString().slice(0, 10));
  } catch {}
  return new NextResponse(null, { status: 204 });
}
