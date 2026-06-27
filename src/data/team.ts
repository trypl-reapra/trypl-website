/**
 * 運営チーム。公開して問題ない範囲のみ掲載しています。
 * メンバーを追加・変更する場合はここを編集してください。
 */

export type Member = {
  name: string;
  reading?: string;
  role: string;
  org: string;
  bio: string;
  /** public/ 配下のポートレート画像パス（任意） */
  photo?: string;
};

export const team: Member[] = [
  {
    name: "山田 晃義",
    reading: "Akiyoshi Yamada",
    role: "TrypL 責任者",
    org: "TrypL",
    bio: "TrypL の全体をリードし、ビジョンの設定・方針決定・チームづくりを担う責任者。REAPRA の理念を現場の実践へとつなぐ役割を果たす。",
    photo: "/team/yamada-akiyoshi.webp",
  },
  {
    name: "諸藤 周平",
    reading: "Shuhei Morofuji",
    role: "促媒者・伴走者",
    org: "REAPRA 代表",
    bio: "「産業創造の研究実践」を掲げる REAPRA 代表。長期の時間軸と内発的動機を起点とする学習のアプローチで、TrypL に伴走する。",
  },
];

/** About ページで使う、活動の歩み（プレースホルダー） */
export const milestones: { phase: string; title: string; body: string }[] = [
  {
    phase: "Phase 0",
    title: "立ち上げ準備",
    body: "名称・ロゴ・ブランドトーンの確定、SNS と母艦サイトの整備、参加導線の設計。",
  },
  {
    phase: "Phase 1",
    title: "九州大学での実証",
    body: "大学関係者・学生団体との対話、小規模イベント、初期メンバーの獲得とコミュニティ運用の開始。",
  },
  {
    phase: "Phase 2",
    title: "コミュニティ定着",
    body: "定例イベントとインターン情報の流通、メンバー同士の交流活性化、参加フローの改善。",
  },
  {
    phase: "Phase 3",
    title: "全国へ",
    body: "他大学への展開とアンバサダー制度。日本で最も強い学生実践コミュニティを目指す。",
  },
];
