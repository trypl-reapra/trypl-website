import { NextResponse } from "next/server";
import { listPublicPress } from "@/lib/store";
import { defaultPress } from "@/data/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 公開：既定ニュース＋掲載中のプレスを日付降順で返す（ホームのニュースセクション用）。 */
export async function GET() {
  const dynamicPress = await listPublicPress();
  const press = [...defaultPress, ...dynamicPress].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return NextResponse.json({ press });
}
