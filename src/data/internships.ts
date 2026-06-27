/**
 * インターン募集要項データ。
 * ───────────────────────────────────────────────────────────
 * ⚠️ すべてサンプル（プレースホルダー）です。
 *    実際の募集が決まったら、各エントリを差し替えてください。
 *    applyUrl には Wantedly / 応募フォーム等の実 URL を設定します。
 *    投資先企業名（company）はサンプル名です。
 * ───────────────────────────────────────────────────────────
 * 新しい募集を追加する手順:
 *   1. 下の配列に1件オブジェクトを追加
 *   2. slug は URL になるので一意・英数字ハイフンで
 *   3. category は CATEGORIES のキーから選ぶ
 */

export type CategoryKey =
  | "community"
  | "business"
  | "marketing"
  | "research"
  | "design"
  | "data"
  | "engineering";

export const CATEGORIES: Record<CategoryKey, string> = {
  community: "コミュニティ",
  business: "ビジネス開発",
  marketing: "マーケティング",
  research: "リサーチ",
  design: "デザイン",
  data: "データ",
  engineering: "エンジニアリング",
};

export type WorkStyle = "remote" | "hybrid" | "onsite";

export const WORK_STYLE_LABEL: Record<WorkStyle, string> = {
  remote: "フルリモート",
  hybrid: "ハイブリッド",
  onsite: "出社",
};

export type Internship = {
  slug: string;
  company: string;
  /** 企業の一言説明（業種） */
  companyTag: string;
  title: string;
  category: CategoryKey;
  location: string;
  workStyle: WorkStyle;
  /** コミット目安 */
  commitment: string;
  /** 期間目安 */
  duration: string;
  compensation: string;
  /** カード・OG用の短い要約 */
  summary: string;
  /** 企業・チームについて */
  about: string;
  responsibilities: string[];
  requirements: string[];
  welcome: string[];
  tags: string[];
  applyUrl: string;
  applyLabel: string;
  featured?: boolean;
  /** ISO 日付 */
  postedAt: string;
};

export const internships: Internship[] = [
  {
    slug: "trypl-community-growth",
    company: "REAPRA / TrypL",
    companyTag: "学生コミュニティ運営",
    title: "コミュニティ・グロース インターン",
    category: "community",
    location: "福岡 / リモート",
    workStyle: "hybrid",
    commitment: "週2〜3日",
    duration: "6か月〜",
    compensation: "時給制（応相談）",
    summary:
      "TrypL そのものを一緒に育てる中核ポジション。SNS発信・イベント企画・オンボーディング設計まで、コミュニティづくりを実践から学ぶ。",
    about:
      "TrypL は REAPRA 発の学生向け実践型コミュニティです。立ち上げフェーズの今、発信・運営・仕組みづくりを共に担うメンバーを募集しています。",
    responsibilities: [
      "Instagram / X / TikTok などの企画・投稿・分析",
      "説明会やイベントの企画・運営",
      "参加者のオンボーディングと継続支援の設計",
      "学びや気づきの言語化・ドキュメント化",
    ],
    requirements: [
      "曖昧な状況でもまず動いてみられること",
      "自分の感情や学びを言葉にして共有できること",
      "学生コミュニティづくりに当事者として関わりたいこと",
    ],
    welcome: [
      "SNS運用・コンテンツ制作の経験",
      "イベント企画・運営の経験",
      "九州大学を中心とした学生ネットワーク",
    ],
    tags: ["コミュニティ", "SNS", "立ち上げ", "福岡"],
    applyUrl: "#",
    applyLabel: "応募する",
    featured: true,
    postedAt: "2026-06-20",
  },
  {
    slug: "reapra-industry-research",
    company: "REAPRA",
    companyTag: "産業創造の研究実践",
    title: "産業創造リサーチ・インターン",
    category: "research",
    location: "東京 / リモート",
    workStyle: "hybrid",
    commitment: "週2日〜",
    duration: "6か月〜",
    compensation: "時給制（応相談）",
    summary:
      "長期時間軸で社会課題と産業を捉えるREAPRAの研究実践に伴走。一次情報にあたり、仮説を立て、検証する一連のプロセスを体験する。",
    about:
      "REAPRA は「産業創造の研究実践」をミッションに、世代を跨ぐ長期時間軸で社会課題を解決する産業とリーダーを育んでいます。",
    responsibilities: [
      "業界・市場・社会課題に関するデスクリサーチ",
      "有識者・実務家へのインタビュー設計と同席",
      "リサーチ結果の構造化とドキュメント化",
      "定例ミーティングでの議論への参加",
    ],
    requirements: [
      "長期の時間軸でものごとを考えることに関心があること",
      "一次情報を地道に集め、構造化できること",
      "知的な探究を楽しめること",
    ],
    welcome: [
      "特定の社会課題・産業への強い関心",
      "英語でのリサーチ経験",
      "定量・定性の両面から分析した経験",
    ],
    tags: ["リサーチ", "産業創造", "長期時間軸"],
    applyUrl: "#",
    applyLabel: "応募する",
    featured: true,
    postedAt: "2026-06-18",
  },
  {
    slug: "kanata-business-dev",
    company: "Kanata Inc.（サンプル）",
    companyTag: "中小企業向け SaaS スタートアップ",
    title: "プロダクト・ビジネス開発インターン",
    category: "business",
    location: "東京 / リモート",
    workStyle: "remote",
    commitment: "週3日〜",
    duration: "3か月〜",
    compensation: "時給1,300円〜",
    summary:
      "顧客の現場に入り込み、課題を発見してプロダクトに接続する。受注までの距離をファネルで捉える事業開発を、当事者として経験する。",
    about:
      "Kanata Inc. は、地域の中小企業の業務をやさしくデジタル化する SaaS を開発するスタートアップ（※サンプル企業）。",
    responsibilities: [
      "顧客インタビューと現場観察",
      "営業ファネルの設計・改善のサポート",
      "プロダクトフィードバックの集約と整理",
      "受注プロセスの定量分析",
    ],
    requirements: [
      "人と話し、現場に足を運ぶことを厭わないこと",
      "数字でものごとを捉えようとする姿勢",
      "失敗を恐れず試行錯誤できること",
    ],
    welcome: [
      "法人営業・カスタマーサクセスの経験",
      "スプレッドシート/BIツールでの分析経験",
    ],
    tags: ["事業開発", "SaaS", "営業", "リモート"],
    applyUrl: "#",
    applyLabel: "応募する",
    postedAt: "2026-06-15",
  },
  {
    slug: "tsumugu-content-marketing",
    company: "Tsumugu Education（サンプル）",
    companyTag: "学びのプラットフォーム",
    title: "コンテンツ・マーケティングインターン",
    category: "marketing",
    location: "リモート",
    workStyle: "remote",
    commitment: "週2日〜",
    duration: "3か月〜",
    compensation: "時給1,200円〜",
    summary:
      "学びを届けるコンテンツを企画・制作・配信。届けたい相手（誰に）と価値（何を）を磨きながら、伝わる発信を実践する。",
    about:
      "Tsumugu Education は、世代を超えて学びをつなぐプラットフォームを運営するスタートアップ（※サンプル企業）。",
    responsibilities: [
      "SNS・ブログ・メールのコンテンツ企画と制作",
      "配信後のデータ分析と改善",
      "ユーザーインタビューの実施",
      "編集カレンダーの運用",
    ],
    requirements: [
      "文章を書くこと・伝えることが好きなこと",
      "読み手の立場で考えられること",
    ],
    welcome: ["SNS運用の実績", "デザインツール（Figma/Canva）の経験"],
    tags: ["マーケティング", "コンテンツ", "教育"],
    applyUrl: "#",
    applyLabel: "応募する",
    postedAt: "2026-06-12",
  },
  {
    slug: "hibana-climate-field-research",
    company: "Hibana Energy（サンプル）",
    companyTag: "気候テック",
    title: "気候テック フィールドリサーチ・インターン",
    category: "research",
    location: "九州 / 現地中心",
    workStyle: "onsite",
    commitment: "週2〜3日",
    duration: "6か月〜",
    compensation: "時給1,300円〜 + 交通費",
    summary:
      "再生可能エネルギーの社会実装に向けて、地域の現場に入り込む。机上では見えない一次情報を、足で集める。",
    about:
      "Hibana Energy は、地域分散型の再エネ普及に取り組む気候テックスタートアップ（※サンプル企業）。",
    responsibilities: [
      "地域事業者・自治体へのヒアリング",
      "現地調査とデータ収集",
      "調査レポートの作成",
    ],
    requirements: [
      "現場に出向くフットワークの軽さ",
      "気候・エネルギー・地域課題への関心",
    ],
    welcome: ["普通自動車免許", "九州エリアに在住・通学していること"],
    tags: ["リサーチ", "気候テック", "現場", "九州"],
    applyUrl: "#",
    applyLabel: "応募する",
    postedAt: "2026-06-08",
  },
  {
    slug: "mioka-ops-data",
    company: "Mioka Logistics（サンプル）",
    companyTag: "物流オペレーション",
    title: "オペレーション改善 データインターン",
    category: "data",
    location: "東京 / ハイブリッド",
    workStyle: "hybrid",
    commitment: "週2日〜",
    duration: "3か月〜",
    compensation: "時給1,400円〜",
    summary:
      "現場のデータを読み解き、オペレーションのムダを見つけて改善提案へ。地に足のついたデータ活用を実践する。",
    about:
      "Mioka Logistics は、地域物流の生産性を高めるオペレーションを構築するスタートアップ（※サンプル企業）。",
    responsibilities: [
      "オペレーションデータの集計・可視化",
      "ボトルネックの分析と改善提案",
      "現場担当者との連携",
    ],
    requirements: [
      "数字を扱うことに抵抗がないこと",
      "現場目線で考えられること",
    ],
    welcome: ["SQL / スプレッドシートでの分析経験", "Python の基礎"],
    tags: ["データ", "オペレーション", "物流"],
    applyUrl: "#",
    applyLabel: "応募する",
    postedAt: "2026-06-05",
  },
];

export function getAllInternships(): Internship[] {
  return [...internships].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export function getInternship(slug: string): Internship | undefined {
  return internships.find((i) => i.slug === slug);
}

export function getFeatured(): Internship[] {
  return getAllInternships().filter((i) => i.featured);
}

/** 実際に募集に使われている category だけ返す（フィルタ用） */
export function getUsedCategories(): { key: CategoryKey; label: string }[] {
  const used = new Set(internships.map((i) => i.category));
  return (Object.keys(CATEGORIES) as CategoryKey[])
    .filter((k) => used.has(k))
    .map((k) => ({ key: k, label: CATEGORIES[k] }));
}
