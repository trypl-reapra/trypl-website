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

/** TrypL 代表者。 */
export const representative: Member = {
  name: "山田 晃義",
  reading: "Akiyoshi Yamada",
  role: "TrypL 代表",
  org: "TrypL",
  bio: "TrypL の全体をリードし、ビジョンの設定・方針決定・チームづくりを担う代表者。REAPRA の理念を現場の実践へとつなぐ役割を果たす。",
  photo: "/media/image/team/yamada-akiyoshi.webp",
};

/** 代表メッセージ（見出し＋本文）。 */
export const representativeMessage = {
  title: "「やりたい」という衝動を、社会の現場で形にする。",
  body: [
    "TrypLが目指すのは、単なる学生団体やインターン紹介所ではありません。それは、どんな人とも安心感を持って本音を出し合い、共に人生という冒険を楽しみ、互いに応援し支え合える「家族」のような愛情に満ちたコミュニティです。",
    "今の社会では、多くの学生が「将来のためにスキルや実績を作らなければならない」という強迫観念に囚われています。しかし、本当に大切なのは、履歴書を飾ることではなく、あなた自身の内側にある純粋な動機（あなたらしさ）に従って、社会の複雑さに直接触れてみることです。",
    "自分の弱さもさらけ出し合いながら、仲間と共に未踏の現場へ踏み出す。その試行錯誤のプロセスこそが、あなたを本当の意味での「熟達」へと導きます。私たちは、この挑戦を楽しみ、共に成長していける「越境者」たちを待っています。",
  ],
} as const;

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
    body: "他大学への展開とアンバサダー制度。日本で圧倒的な学生実践コミュニティを目指す。",
  },
];
