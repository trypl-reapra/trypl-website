/**
 * SNS / 外部リンク。
 * すべてプレースホルダー（href: "#"）。実アカウントが決まったら href と handle を更新。
 * available: false のものはリンク集で「準備中」として薄く表示されます。
 */

export type SocialKey =
  | "instagram"
  | "x"
  | "linkedin"
  | "tiktok"
  | "threads"
  | "youtube"
  | "note"
  | "line"
  | "slack";

export type Social = {
  key: SocialKey;
  label: string;
  handle: string;
  href: string;
  available: boolean;
  /** リンク集での役割 */
  role: "発信" | "拡散" | "コミュニティ" | "接点管理";
};

export const socials: Social[] = [
  {
    key: "instagram",
    label: "Instagram",
    handle: "@trypl_official",
    href: "https://www.instagram.com/trypl_official",
    available: true,
    role: "発信",
  },
  {
    key: "x",
    label: "X (Twitter)",
    handle: "@trypl_official",
    href: "https://x.com/trypl_official",
    available: true,
    role: "拡散",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "TrypL",
    href: "https://www.linkedin.com/showcase/trypl/",
    available: true,
    role: "発信",
  },
  {
    key: "tiktok",
    label: "TikTok",
    handle: "@trypl.jp",
    href: "#",
    available: false,
    role: "発信",
  },
  {
    key: "threads",
    label: "Threads",
    handle: "@trypl.jp",
    href: "#",
    available: false,
    role: "拡散",
  },
  {
    key: "youtube",
    label: "YouTube",
    handle: "@trypl",
    href: "#",
    available: false,
    role: "発信",
  },
  {
    key: "note",
    label: "note",
    handle: "@trypl",
    href: "#",
    available: false,
    role: "発信",
  },
  {
    key: "line",
    label: "LINE公式アカウント",
    handle: "友だち追加で最新情報",
    href: "#",
    available: false,
    role: "接点管理",
  },
  {
    key: "slack",
    label: "Slack コミュニティ",
    handle: "メンバー専用",
    href: "#",
    available: false,
    role: "コミュニティ",
  },
];

/** 参加導線（Googleフォーム等）。プレースホルダー。 */
export const entryForm = {
  label: "参加フォーム",
  description: "まずは興味の登録から。30秒で完了します。",
  href: "#",
  available: false,
};
