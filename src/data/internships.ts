/**
 * インターン募集要項データ。
 * ───────────────────────────────────────────────────────────
 * ⚠️ 「株式会社ジコウ」は実際の募集です（applyUrl: mailto:trypl@reapra.sg）。
 *    それ以外は「募集要項の例」です。企業名（company）と業種（companyTag）は
 *    REAPRA Japan の実在の投資先企業（https://jp.reapra.com/investment/ 掲載）を
 *    参照していますが、職務内容・条件・待遇は TrypL が作成したサンプルで、各社の
 *    公式募集ではありません。実際に募集する際は各社と調整のうえ差し替え、
 *    applyUrl に Wantedly / 応募フォーム等の実 URL を設定してください。
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
    slug: "jicou-ai-business",
    company: "株式会社ジコウ",
    companyTag: "生成AI × 仕事を通じた学び",
    title: "AI × ビジネス インターン（4職種）",
    category: "business",
    location: "福岡",
    workStyle: "onsite",
    commitment: "応相談",
    duration: "応相談",
    compensation: "時給 1,150円〜",
    summary:
      "生成AIを活用しながら実際のビジネスに携わる、4職種同時募集。やりたいことがまだ決まっていなくても、現場に飛び込みながら自分の興味や強みを見つけられる。",
    about:
      "株式会社ジコウ（REAPRA 投資先）では現在、4つの職種でインターンを募集しています。どの職種も、生成AIを活用しながら実際のビジネスに携われるのが特徴です。マーケティング、営業、事業開発、経営企画など、実際の現場に飛び込みながら自分の興味や強みを見つけていくことができます。",
    responsibilities: [
      "AI × マーケティング — 生成AIを活用した集客・コンテンツの実践",
      "AI × 事業開発 — 新規事業の仮説検証とグロース",
      "AI × 法人営業 — 顧客開拓から受注までの営業実践",
      "AI × 経営企画 — 数字に基づく経営の意思決定サポート",
    ],
    requirements: [
      "「学生のうちに成長したい」という意欲があること",
      "「ビジネスの現場を経験してみたい」と思えること",
      "「AIを実務で使ってみたい」という関心があること",
    ],
    welcome: [
      "やりたいことがまだ決まっていなくても歓迎",
      "福岡で現場に通えること",
    ],
    tags: ["生成AI", "マーケティング", "事業開発", "営業", "経営企画", "福岡"],
    applyUrl: "mailto:trypl@reapra.sg",
    applyLabel: "メールで応募・相談する",
    featured: true,
    postedAt: "2026-06-25",
  },
  {
    slug: "yolot-business-dev",
    company: "YOLOT",
    companyTag: "高級宿・ヴィラ予約プラットフォーム",
    title: "事業開発・サプライ開拓インターン",
    category: "business",
    location: "東京 / リモート",
    workStyle: "hybrid",
    commitment: "週3日〜",
    duration: "6か月〜",
    compensation: "時給1,400円〜（応相談）",
    summary:
      "一棟貸しの宿・ヴィラを掲載へつなぐサプライ開拓と、宿泊体験のUX改善。受注までの距離をファネルで捉える事業開発を、当事者として経験する。",
    about:
      "YOLOT（ヨロット）は、特別な一日のための高級宿・ヴィラを集めた予約プラットフォームを運営する REAPRA 投資先。供給（宿）と需要（旅行者）の両面を地道に育てるマーケットプレイス事業です。",
    responsibilities: [
      "掲載候補となる宿・ヴィラのリサーチとリスト化",
      "オーナーへの初回コンタクト・掲載交渉のサポート",
      "掲載ページ（写真・文言）の改善提案",
      "問い合わせ〜予約までのファネルの定量分析",
    ],
    requirements: [
      "人に会い、現場（宿）に足を運ぶことを厭わないこと",
      "数字でものごとを捉えようとする姿勢",
      "曖昧な状況でもまず動いてみられること",
    ],
    welcome: [
      "旅行・ホスピタリティ・地域活性への関心",
      "法人開拓・インサイドセールスの経験",
      "スプレッドシートでの分析経験",
    ],
    tags: ["事業開発", "マーケットプレイス", "旅行", "営業"],
    applyUrl: "#",
    applyLabel: "応募する",
    featured: true,
    postedAt: "2026-06-16",
  },
  {
    slug: "coten-history-research",
    company: "COTEN",
    companyTag: "世界史データベース",
    title: "歴史データベース・リサーチインターン",
    category: "research",
    location: "福岡 / リモート",
    workStyle: "remote",
    commitment: "週2日〜",
    duration: "6か月〜",
    compensation: "時給1,300円〜（応相談）",
    summary:
      "人物・出来事を構造化し、世界史を横断検索できるデータベースを育てる。一次情報にあたり、仮説を立て、検証する知的探究を実践する。",
    about:
      "COTEN（コテン）は、世界中の歴史をメタデータ化し、時代や地域を越えて人物・事象を比較できるデータベースの構築に挑む REAPRA 投資先。「歴史を学問の世界から解放する」ことを目指しています。",
    responsibilities: [
      "歴史上の人物・出来事に関する文献リサーチ",
      "情報の構造化・データベースへの入力と検証",
      "出典の確認とファクトチェック",
      "編集方針のドキュメント化",
    ],
    requirements: [
      "歴史・人文知への強い関心",
      "一次情報を地道に集め、構造化できること",
      "正確さと根気を要する作業を楽しめること",
    ],
    welcome: [
      "歴史学・社会科学の専攻またはそれに準ずる関心",
      "英語など多言語での文献読解",
      "Notion / スプレッドシートでの情報整理経験",
    ],
    tags: ["リサーチ", "歴史", "データベース", "リモート"],
    applyUrl: "#",
    applyLabel: "応募する",
    postedAt: "2026-06-14",
  },
  {
    slug: "agrimedia-field-marketing",
    company: "AGRIMEDIA",
    companyTag: "都市型体験農園「シェア畑」",
    title: "体験農園コミュニティ・マーケティングインターン",
    category: "marketing",
    location: "首都圏 / 現地 + リモート",
    workStyle: "hybrid",
    commitment: "週2〜3日",
    duration: "3か月〜",
    compensation: "時給1,250円〜 + 交通費",
    summary:
      "手ぶらで通える貸し農園の集客と、利用者コミュニティづくり。届けたい相手（誰に）と価値（何を）を磨きながら、現場で伝わる施策を試す。",
    about:
      "AGRIMEDIA（アグリメディア）は、サポート付き貸し農園「シェア畑」などを運営し、都市の遊休農地と「土に触れたい人」をつなぐ REAPRA 投資先。農と都市生活の距離を縮める事業です。",
    responsibilities: [
      "農園見学会・体験イベントの企画と現地運営",
      "SNS・チラシ・Web での集客コンテンツ制作",
      "申込〜入会までの導線の改善提案",
      "利用者へのヒアリングと声の整理",
    ],
    requirements: [
      "現場に出向くフットワークの軽さ",
      "読み手・参加者の立場で考えられること",
      "食・農・地域・自然への関心",
    ],
    welcome: ["SNS運用やイベント運営の経験", "デザインツール（Canva/Figma）の経験"],
    tags: ["マーケティング", "コミュニティ", "農業", "現場"],
    applyUrl: "#",
    applyLabel: "応募する",
    postedAt: "2026-06-12",
  },
  {
    slug: "foodison-ops-data",
    company: "FOODISON",
    companyTag: "水産流通プラットフォーム「魚ポチ」",
    title: "水産流通オペレーション データインターン",
    category: "data",
    location: "東京 / ハイブリッド",
    workStyle: "hybrid",
    commitment: "週2日〜",
    duration: "3か月〜",
    compensation: "時給1,400円〜",
    summary:
      "飲食店向け鮮魚EC「魚ポチ」の受発注データを読み解き、現場のムダを見つけて改善提案へ。地に足のついたデータ活用を実践する。",
    about:
      "FOODISON（フーディソン）は、飲食店向けの生鮮品EC「魚ポチ」などを通じて、旧来アナログだった水産物流通のIT化に取り組む REAPRA 投資先。鮮度と需給という難しい変数に向き合う事業です。",
    responsibilities: [
      "受発注・在庫データの集計と可視化",
      "需給のボトルネック分析と改善提案",
      "物流・仕入れ現場担当者との連携",
      "分析結果のレポーティング",
    ],
    requirements: [
      "数字を扱うことに抵抗がないこと",
      "現場目線で考えられること",
      "失敗を恐れず試行錯誤できること",
    ],
    welcome: ["SQL / スプレッドシートでの分析経験", "Python の基礎", "飲食・食領域への関心"],
    tags: ["データ", "オペレーション", "水産", "EC"],
    applyUrl: "#",
    applyLabel: "応募する",
    postedAt: "2026-06-10",
  },
  {
    slug: "medup-healthcare-business",
    company: "メダップ",
    companyTag: "医療機関向け経営支援SaaS",
    title: "医療DX 事業開発インターン",
    category: "business",
    location: "東京 / リモート",
    workStyle: "remote",
    commitment: "週3日〜",
    duration: "6か月〜",
    compensation: "時給1,400円〜",
    summary:
      "病院の地域連携・経営課題に向き合うSaaSの導入支援とカスタマーサクセス。顧客の現場に入り込み、課題をプロダクトへ接続する。",
    about:
      "メダップは、病院の地域医療連携や経営を支える SaaS を提供する REAPRA 投資先。医療という社会インフラの、見えづらいが本質的な課題に取り組んでいます。",
    responsibilities: [
      "導入病院へのオンボーディング支援のサポート",
      "利用状況データの分析と活用提案",
      "顧客インタビューと課題の構造化",
      "プロダクトフィードバックの集約",
    ],
    requirements: [
      "人と話し、相手の課題を丁寧に聞けること",
      "数字でものごとを捉えようとする姿勢",
      "医療・社会インフラへの関心",
    ],
    welcome: [
      "法人向けカスタマーサクセス/営業の経験",
      "BIツール・スプレッドシートでの分析経験",
    ],
    tags: ["事業開発", "医療", "SaaS", "リモート"],
    applyUrl: "#",
    applyLabel: "応募する",
    postedAt: "2026-06-07",
  },
  {
    slug: "rechroma-climate-research",
    company: "リクロマ",
    companyTag: "気候変動・カーボン市場",
    title: "気候テック フィールドリサーチ・インターン",
    category: "research",
    location: "東京 / リモート + 現地",
    workStyle: "hybrid",
    commitment: "週2〜3日",
    duration: "6か月〜",
    compensation: "時給1,300円〜 + 交通費",
    summary:
      "企業のGHG（温室効果ガス）算定・脱炭素の社会実装に向けて、制度や現場の一次情報を集める。机上では見えない情報を、足で集める。",
    about:
      "リクロマは、企業の温室効果ガス算定支援やカーボンクレジットなど、気候変動対策の市場づくりに取り組む REAPRA 投資先。ルールが定まりきらない領域で、長い時間軸の社会課題に挑みます。",
    responsibilities: [
      "脱炭素・カーボン市場に関するデスクリサーチ",
      "企業・有識者へのヒアリング設計と同席",
      "制度・規制動向の整理とレポート作成",
      "調査結果の構造化とドキュメント化",
    ],
    requirements: [
      "気候・エネルギー・社会課題への関心",
      "一次情報を地道に集め、構造化できること",
      "曖昧で正解のない問いに向き合えること",
    ],
    welcome: ["英語でのリサーチ経験", "環境・サステナビリティ領域の学習経験"],
    tags: ["リサーチ", "気候テック", "脱炭素", "制度"],
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

/* ------------------------------------------------- header images */
/** 募集ポップアップのヘッダーに使う横長画像。募集ごとに別の自然写真を割り当て。 */
const HEADER_POOL = [
  "/media/image/internship/1.jpg",
  "/media/image/internship/2.jpg",
  "/media/image/internship/3.jpg",
  "/media/image/internship/4.jpg",
  "/media/image/internship/5.jpg",
  "/media/image/internship/6.jpg",
  "/media/image/internship/7.jpg",
  "/media/image/internship/8.jpg",
  "/media/image/internship/9.jpg",
];

const HEADER_BY_SLUG: Record<string, string> = {
  "jicou-ai-business": "/media/image/internship/1.jpg",
  "trypl-community-growth": "/media/image/internship/2.jpg",
  "reapra-industry-research": "/media/image/internship/3.jpg",
  "yolot-business-dev": "/media/image/internship/4.jpg",
  "coten-history-research": "/media/image/internship/5.jpg",
  "agrimedia-field-marketing": "/media/image/internship/6.jpg",
  "foodison-ops-data": "/media/image/internship/7.jpg",
  "medup-healthcare-business": "/media/image/internship/8.jpg",
  "rechroma-climate-research": "/media/image/internship/9.jpg",
};

/** スラッグから安定的にヘッダー画像を決める（未登録は文字列ハッシュでプールから）。 */
export function headerImageFor(slug: string): string {
  if (HEADER_BY_SLUG[slug]) return HEADER_BY_SLUG[slug];
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return HEADER_POOL[h % HEADER_POOL.length];
}
