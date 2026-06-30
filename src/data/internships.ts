/**
 * インターン募集要項データ。
 * ───────────────────────────────────────────────────────────
 * これらは実在の募集です。応募は各社の外部募集ページ（HERP / Wantedly）で
 * 受け付けるため、applyUrl にその URL を設定しています。
 *   - 株式会社ジコウ（HERP）       : https://herp.careers/careers/companies/jicou/jobs
 *   - ITecMarin株式会社（Wantedly）: https://www.wantedly.com/companies/company_5382314
 * applyUrl が外部 URL の募集は「応募する」で直接そのページへ遷移します。
 * applyUrl を空にすると、これまで通り社内（ダッシュボード内）応募フローになります。
 * ───────────────────────────────────────────────────────────
 * 新しい募集を追加する手順:
 *   1. 下の配列に1件オブジェクトを追加
 *   2. slug は URL になるので一意・英数字ハイフンで
 *   3. category は CATEGORIES のキーから選ぶ
 *   4. 応募を外部で受けるなら applyUrl に URL を、社内応募なら空文字を設定
 *   5. companyUrl に会社HPを設定（募集ページに表示される）
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
  /** 応募URL。外部募集ページ（HERP / Wantedly 等）なら直接遷移。空なら社内応募フロー。 */
  applyUrl: string;
  applyLabel: string;
  /** 会社ホームページ（募集ページに表示）。 */
  companyUrl?: string;
  /** 管理画面で設定したヘッダー画像（未設定なら headerImageFor で自動割当）。 */
  headerImage?: string;
  featured?: boolean;
  /** ISO 日付 */
  postedAt: string;
};

const JICOU = {
  company: "株式会社ジコウ",
  companyUrl: "https://jicou.jp/",
} as const;

const ITECMARIN = {
  company: "ITecMarin株式会社",
  companyUrl: "https://www.itecmarin.com/",
} as const;

export const internships: Internship[] = [
  /* ───────────── 株式会社ジコウ（応募：HERP） ───────────── */
  {
    slug: "jicou-ai-marketing",
    ...JICOU,
    companyTag: "科学機器業界に特化した人材エージェント",
    title: "AI×マーケティングインターン｜新たなキャリアの第一歩を届ける",
    category: "marketing",
    location: "福岡（唐人町オフィス）/ 一部リモート",
    workStyle: "hybrid",
    commitment: "週15時間〜（週1〜2日出社）",
    duration: "応相談",
    compensation: "時給1,150円〜（研修時1,100円）",
    summary:
      "科学機器業界に特化した人材エージェントの集客を、生成AIを活用したマーケティングで担う。リサーチからコンテンツ制作、分析・改善まで一連を実践する。",
    about:
      "株式会社ジコウ（REAPRA 投資先）は、科学機器業界に特化した人材エージェント事業などを通じて、「働く大人の創意工夫」に貢献することを目指すスタートアップです。少人数のチームで、生成AIを実務にフル活用しながら事業をつくっています。",
    responsibilities: [
      "Gemini・Claude 等を活用した SNS・ブログコンテンツの企画・制作",
      "SEO キーワード調査と記事構成の設計",
      "表示回数・流入・登録率などの KPI 計測",
      "データ分析にもとづく改善提案と実行",
    ],
    requirements: [
      "「学生のうちに成長したい」という意欲があること",
      "基本的な PC 操作ができ、自走して学べること",
      "AIを実務で使ってみたいという関心があること",
    ],
    welcome: [
      "SNS運用・コンテンツ制作の経験",
      "マーケティング・SEO への関心",
      "福岡で週1〜2日通えること",
    ],
    tags: ["生成AI", "マーケティング", "SEO", "福岡"],
    applyUrl: "https://herp.careers/careers/companies/jicou/jobs/I5zx3ePdsvoZ",
    applyLabel: "応募する",
    featured: true,
    postedAt: "2026-06-29",
  },
  {
    slug: "jicou-ai-bizdev",
    ...JICOU,
    companyTag: "科学機器業界に特化した人材エージェント",
    title: "AI×事業開発インターン｜未開拓市場を見つけ出す",
    category: "business",
    location: "福岡（唐人町オフィス）/ 東京 / 一部リモート",
    workStyle: "hybrid",
    commitment: "週15時間〜（週1〜2日出社）",
    duration: "応相談",
    compensation: "時給1,150円〜（研修時1,100円）",
    summary:
      "生成AIを使って未開拓市場を発掘する事業開発インターン。市場調査・仮説立案・検証インタビューから経営層への提案まで、新規事業の立ち上げを実地で経験する。",
    about:
      "株式会社ジコウ（REAPRA 投資先）は、科学機器業界に特化した人材エージェント事業などを展開するスタートアップ。生成AIを実務に取り入れながら、未開拓の市場を切り拓いています。",
    responsibilities: [
      "Gemini・Claude 等を活用した市場・競合のリサーチ",
      "ターゲット業界・企業へのアプローチ設計",
      "関係者インタビューによる仮説検証",
      "リサーチ結果の構造化と経営層への提案",
    ],
    requirements: [
      "基本的な PC 操作と論理的思考",
      "自走して学び、チームで動けること",
      "曖昧な状況でもまず動いてみられること",
    ],
    welcome: [
      "AIツールの利用経験",
      "事業開発・新規事業への関心",
      "4週間のオンボーディングで基礎から学べます",
    ],
    tags: ["生成AI", "事業開発", "新規事業", "福岡", "東京"],
    applyUrl: "https://herp.careers/careers/companies/jicou/jobs/wayIOxKhj8Rx",
    applyLabel: "応募する",
    featured: true,
    postedAt: "2026-06-29",
  },
  {
    slug: "jicou-ai-sales",
    ...JICOU,
    companyTag: "科学機器業界に特化した人材エージェント",
    title: "AI×法人営業インターン｜科学機器業界の採用を変える",
    category: "business",
    location: "福岡（唐人町オフィス）/ 東京 / 一部リモート",
    workStyle: "hybrid",
    commitment: "週15時間〜（週1〜2日出社）",
    duration: "応相談",
    compensation: "時給1,150円〜（研修時1,100円）",
    summary:
      "科学機器業界の採用課題に向き合う法人営業インターン。生成AIでターゲティングや訴求を磨きながら、顧客開拓から提案までの営業を実践する。",
    about:
      "株式会社ジコウ（REAPRA 投資先）は、科学機器業界に特化した人材エージェント。メーカー・商社・研究機関の採用課題に、生成AIを活用しながら向き合っています。",
    responsibilities: [
      "AIを使ったターゲットリスト・営業文面の作成",
      "電話・メール・フォームでの新規開拓",
      "採用課題・人材ニーズのヒアリング",
      "自社サービスの提案と商談サポート",
    ],
    requirements: [
      "ビジネスコミュニケーションに前向きであること",
      "断られても粘り強く取り組めること",
      "主体的に行動できること",
    ],
    welcome: [
      "営業・接客の経験",
      "AIツールの利用経験",
      "週15時間以上・週1〜2日出社できること",
    ],
    tags: ["生成AI", "法人営業", "採用", "福岡", "東京"],
    applyUrl: "https://herp.careers/careers/companies/jicou/jobs/GfqJkhADJ3sI",
    applyLabel: "応募する",
    featured: true,
    postedAt: "2026-06-28",
  },
  {
    slug: "jicou-ai-strategy",
    ...JICOU,
    companyTag: "科学機器業界に特化した人材エージェント",
    title: "AI×経営企画インターン｜データで経営を動かす",
    category: "data",
    location: "福岡（大手門オフィス）/ 東京 / 一部リモート",
    workStyle: "hybrid",
    commitment: "週15時間〜（週1〜2日出社）",
    duration: "応相談",
    compensation: "時給1,150円〜（研修時1,100円）",
    summary:
      "経営の「右腕」として、データ分析と生成AIで意思決定を支える経営企画インターン。数字を可視化し、課題を見つけ、改善を提案する。",
    about:
      "株式会社ジコウ（REAPRA 投資先）は、科学機器業界に特化した人材エージェント事業を展開する設立5年目のスタートアップ。生成AIを使って、データドリブンな経営に挑戦しています。",
    responsibilities: [
      "売上・コスト・KPI を可視化するダッシュボード構築",
      "Gemini・Claude 等を活用した社内データの分析",
      "生産性指標やレポートの作成",
      "データにもとづく課題発見と改善提案",
    ],
    requirements: [
      "基本的な PC 操作と論理的思考",
      "自走して学べること",
      "数字を扱うことに抵抗がないこと",
    ],
    welcome: [
      "データ分析・スプレッドシートの経験（未経験も歓迎）",
      "経営・事業づくりへの関心",
    ],
    tags: ["生成AI", "経営企画", "データ", "福岡", "東京"],
    applyUrl: "https://herp.careers/careers/companies/jicou/jobs/iGU5ULFGeDyS",
    applyLabel: "応募する",
    featured: true,
    postedAt: "2026-06-28",
  },
  {
    slug: "jicou-open-position",
    ...JICOU,
    companyTag: "科学機器業界に特化した人材エージェント",
    title: "オープンポジション｜ビジネス職・マーケティング職・企画職",
    category: "business",
    location: "福岡 / 一部リモート",
    workStyle: "hybrid",
    commitment: "正社員（フルタイム）",
    duration: "—",
    compensation: "要相談（スキル・経験による）",
    summary:
      "事業開発・経営企画・営業・マーケティングなど、経歴や興味に応じて柔軟にポジションを決める正社員のオープンポジション。少人数チームで事業づくりに携わる。",
    about:
      "株式会社ジコウ（REAPRA 投資先）は、科学に強みを持つ人のキャリアを支援するスタートアップ。「働く大人の創意工夫に貢献する」というビジョンに共感し、試行錯誤を楽しめる仲間を募集しています。",
    responsibilities: [
      "科学機器業界の採用・組織課題の解決",
      "少人数チームでの事業改善・新規事業開発",
      "マーケティング・採用・事業拡大の各施策への参画",
      "コアタイム（11:00-17:00）でリモートと出社を併用",
    ],
    requirements: [
      "会社のビジョンへの共感",
      "反復的な課題解決を楽しめること",
      "学び続ける好奇心",
    ],
    welcome: ["スキルのギャップは選考のなかで相談可能です"],
    tags: ["正社員", "事業開発", "マーケティング", "企画", "福岡"],
    applyUrl: "https://herp.careers/careers/companies/jicou/jobs/tuSjaXVGGFTz",
    applyLabel: "応募する",
    postedAt: "2026-06-27",
  },
  {
    slug: "jicou-career-supporter",
    ...JICOU,
    companyTag: "科学機器業界に特化した人材エージェント",
    title: "キャリアサポーター（キャリアアドバイザー / リクルーティングアドバイザー）",
    category: "business",
    location: "福岡県 / 一部リモート",
    workStyle: "hybrid",
    commitment: "正社員（フルタイム）",
    duration: "—",
    compensation: "年収360〜600万円（賞与年1回・昇給年2回）",
    summary:
      "科学機器業界に特化した人材紹介で、求職者と企業の双方を支えるキャリアサポーター。業界の「人事部」として、採用とキャリアの伴走を担う。",
    about:
      "株式会社ジコウ（REAPRA 投資先）は、科学機器業界に特化した人材エージェント。クライアントの「人事部」となり、業界の成長と働く人の充実を支えることを目指しています。",
    responsibilities: [
      "求職者面談・キャリア相談・求人マッチング",
      "求人作成・スカウトなどの採用戦略の立案",
      "応募書類・面接準備のサポート",
      "採用プロセスの最適化と入社後の定着支援",
    ],
    requirements: [
      "人と向き合い、課題を丁寧に聞けること",
      "業界・キャリア支援に関心があること",
    ],
    welcome: ["人材・採用領域の経験", "法人・個人の双方に関わった経験"],
    tags: ["正社員", "人材", "キャリア", "採用", "福岡"],
    applyUrl: "https://herp.careers/careers/companies/jicou/jobs/qojC9LgUL83O",
    applyLabel: "応募する",
    postedAt: "2026-06-27",
  },
  {
    slug: "jicou-casual-meeting",
    ...JICOU,
    companyTag: "科学機器業界に特化した人材エージェント",
    title: "カジュアル面談申し込みフォーム",
    category: "business",
    location: "オンライン",
    workStyle: "remote",
    commitment: "—",
    duration: "—",
    compensation: "—",
    summary:
      "選考の前に、まずは気軽に話してみたい方へ。会社の雰囲気や事業、働き方について、カジュアルにお話しできる面談の申し込み窓口です。",
    about:
      "株式会社ジコウ（REAPRA 投資先）は、科学機器業界の人材エージェント事業などを展開するスタートアップ。応募の前に、会社のことを知ってから判断したい方のためのカジュアル面談を用意しています。",
    responsibilities: [
      "会社・事業・カルチャーについての対話",
      "ビジネス・営業・マーケティング・企画などの仕事の紹介",
      "選考前のすり合わせ・疑問の解消",
    ],
    requirements: [
      "キャリアに迷っている / 興味がある方",
      "スタートアップ環境に関心がある方",
    ],
    welcome: [],
    tags: ["カジュアル面談", "オンライン", "福岡"],
    applyUrl: "https://herp.careers/careers/companies/jicou/jobs/9s-fsYidoKd3",
    applyLabel: "カジュアル面談を申し込む",
    postedAt: "2026-06-26",
  },
  {
    slug: "jicou-career-meeting",
    ...JICOU,
    companyTag: "科学機器業界に特化した人材エージェント",
    title: "キャリア面談（代表との壁打ち）",
    category: "business",
    location: "オンライン",
    workStyle: "remote",
    commitment: "—",
    duration: "—",
    compensation: "—",
    summary:
      "代表と、キャリアや働き方について「壁打ち」できる面談。採用を前提としない、これからのキャリアを一緒に考える対話の場です。",
    about:
      "株式会社ジコウ（REAPRA 投資先）は2021年設立の少人数スタートアップ。働く大人がキャリアを通じて充実できることを目指しています。採用を保証するものではなく、キャリアについて率直に話す機会です。",
    responsibilities: [
      "代表とのキャリアについての対話・壁打ち",
      "働くこと・キャリアの築き方を考える",
    ],
    requirements: [
      "自分のキャリアを真剣に考えている方",
      "人のキャリア支援や「働く」ことに関心がある方",
    ],
    welcome: [],
    tags: ["キャリア面談", "オンライン", "福岡"],
    applyUrl: "https://herp.careers/careers/companies/jicou/jobs/nuke5aaJu4XS",
    applyLabel: "キャリア面談を申し込む",
    postedAt: "2026-06-26",
  },

  /* ───────────── ITecMarin株式会社（応募：Wantedly） ───────────── */
  {
    slug: "itecmarin-sales-intern-intro",
    ...ITECMARIN,
    companyTag: "船 × IT（海運業界の変革）",
    title: "学生セールスインターン（フルリモート）｜1から学ぶ！船・海運メディア事業",
    category: "business",
    location: "フルリモート（福岡拠点）",
    workStyle: "remote",
    commitment: "応相談",
    duration: "応相談",
    compensation: "応相談",
    summary:
      "船・海運業界をITで変革するメディア事業で、営業を1から学べる学生インターン。問い合わせ対応から新規開拓、SNS運用、動画制作までフルリモートで挑戦する。",
    about:
      "ITecMarin株式会社は「海運 × IT」で、高齢化の進む海運業界の変革に取り組む REAPRA 関連のスタートアップ。船員採用支援やノウハウのデジタル化に取り組み、4年連続で前年比200%以上の成長を続けています。フルリモート体制です。",
    responsibilities: [
      "顧客の問い合わせ対応と新規開拓・営業戦略の立案",
      "SNS（X・Facebook・YouTube・TikTok）運用とチャンネル拡大",
      "YouTube・TikTok 向けの動画・コンテンツ制作",
      "データ分析にもとづく施策立案",
      "海事関係者へのインタビュー・連携",
    ],
    requirements: [
      "成長意欲・学習意欲が高いこと",
      "計画より実行を重視できる行動力",
      "誠実に取り組めること",
    ],
    welcome: ["海運・業界変革への関心", "週次フィードバックと動画研修でサポートします"],
    tags: ["フルリモート", "営業", "SNS", "海運", "メディア"],
    applyUrl: "https://www.wantedly.com/projects/2362119",
    applyLabel: "応募する",
    featured: true,
    postedAt: "2026-06-25",
  },
  {
    slug: "itecmarin-sales-intern-growth",
    ...ITECMARIN,
    companyTag: "船 × IT（海運業界の変革）",
    title: "学生セールスインターン（フルリモート）｜業界変革！船・海運メディア事業で営業を学ぶ",
    category: "business",
    location: "フルリモート（福岡拠点）",
    workStyle: "remote",
    commitment: "応相談",
    duration: "応相談",
    compensation: "応相談",
    summary:
      "海運業界をITで変える成長スタートアップで、PDCAを回して「正解を探し当てる力」を磨く学生セールスインターン。代表（元・総合商社）のメンタリングを受けながら実践する。",
    about:
      "ITecMarin株式会社は「海運 × IT」で、船員採用支援・ノウハウのデジタル化・労働環境の改善に取り組む REAPRA 関連のスタートアップ。4年連続で前年比200%以上の成長を続け、フルリモートで事業を運営しています。",
    responsibilities: [
      "海運採用ソリューションの問い合わせ対応・新規開拓",
      "SNS運用でチャンネルを1万人から10万人へ拡大",
      "海事教育コンテンツの動画制作",
      "データ分析とキャンペーン戦略の立案",
      "船員・海事関係者とのコミュニケーション",
    ],
    requirements: [
      "成長意欲が高く、自ら動けること",
      "試行錯誤（PDCA）を楽しめること",
      "誠実さと素直さ",
    ],
    welcome: [
      "代表（元・三井物産／7年）のメンタリングを受けられます",
      "週次フィードバックとフルリモートのサポート体制",
    ],
    tags: ["フルリモート", "営業", "PDCA", "海運", "スタートアップ"],
    applyUrl: "https://www.wantedly.com/projects/2098771",
    applyLabel: "応募する",
    postedAt: "2026-06-24",
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

/** 管理画面の画像ピッカーで選べるデフォルト画像。 */
export const DEFAULT_HEADER_IMAGES = HEADER_POOL;

const HEADER_BY_SLUG: Record<string, string> = {
  "jicou-ai-marketing": "/media/image/internship/1.jpg",
  "jicou-ai-bizdev": "/media/image/internship/2.jpg",
  "jicou-ai-sales": "/media/image/internship/3.jpg",
  "jicou-ai-strategy": "/media/image/internship/4.jpg",
  "jicou-open-position": "/media/image/internship/5.jpg",
  "jicou-career-supporter": "/media/image/internship/6.jpg",
  "jicou-casual-meeting": "/media/image/internship/7.jpg",
  "jicou-career-meeting": "/media/image/internship/8.jpg",
  "itecmarin-sales-intern-intro": "/media/image/internship/9.jpg",
  "itecmarin-sales-intern-growth": "/media/image/internship/2.jpg",
};

/** スラッグから安定的にヘッダー画像を決める（未登録は文字列ハッシュでプールから）。 */
export function headerImageFor(slug: string): string {
  if (HEADER_BY_SLUG[slug]) return HEADER_BY_SLUG[slug];
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return HEADER_POOL[h % HEADER_POOL.length];
}
