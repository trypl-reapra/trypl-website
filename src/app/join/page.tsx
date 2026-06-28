import type { Metadata } from "next";
import JoinContent from "@/components/pages/JoinContent";

export const metadata: Metadata = {
  title: "参加する",
  description:
    "TrypL への参加方法。知る → 深める → 登録 → つながる → 実践。内発的動機を起点に、社会との接点をここから。",
};

export default function JoinPage() {
  return <JoinContent />;
}
