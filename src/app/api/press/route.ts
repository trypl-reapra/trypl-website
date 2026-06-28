import { NextResponse } from "next/server";
import { listPublicPress } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 公開：掲載中のプレス一覧（ホームのニュースセクション用）。 */
export async function GET() {
  return NextResponse.json({ press: await listPublicPress() });
}
