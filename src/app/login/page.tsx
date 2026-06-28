import { redirect } from "next/navigation";

// ログインは会員登録/ログインの統一ハブ（/members）に集約。
export default function LoginPage() {
  redirect("/members");
}
