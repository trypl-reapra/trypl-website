/**
 * Global site configuration.
 * 編集ポイント: サイト名・連絡先・SNS の正式 URL が決まったらここを更新。
 */

export const site = {
  name: "TrypL",
  reading: "トリプル",
  // SNS のプロフィールに貼る「母艦」。デプロイ後の本番 URL に合わせて
  // NEXT_PUBLIC_SITE_URL を設定すると OG 画像などが正しく解決されます。
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://trypl.vercel.app",
  tagline: "楽しく、遊ぶように。実践に挑戦する。",
  taglineEn: "Try × Practice × pLay",
  description:
    "TrypL（トリプル）は、REAPRA発の若年層向けインターンシップコミュニティ。REAPRAおよび投資先企業でのインターンを通じて、内発的動機から「社会と共創する熟達」への一歩を踏み出す場です。",
  // 連絡先。
  email: "trypl@reapra.sg",
  parent: {
    name: "REAPRA",
    description: "産業創造の研究実践",
    url: "https://reapra.com/",
  },
} as const;

export const nav: { label: string; href: string }[] = [
  { label: "TrypLとは", href: "/about" },
  { label: "募集一覧", href: "/internships" },
  { label: "イベント", href: "/events" },
  { label: "リンク", href: "/links" },
];

export const cta = { label: "参加する", href: "/join" } as const;

/**
 * トップ（ヒーロー）の背景動画クリップ。
 * 上から順に再生し、クリップ間はフロント側でクロスフェードする。
 * それぞれ独立したファイルなので、差し替えたいクリップのファイルを置き換えるだけでよい。
 *   1: ノートPCに向かう2人
 *   2: 4人のミーティング
 *   3: ノートPCのグラフを指す
 *   4: 屋外で語り合う若者たち
 *   5: ガラス板に書き出す
 */
export const heroClips = [
  "/media/video/hero/hero-1.mp4",
  "/media/video/hero/hero-2.mp4",
  "/media/video/hero/hero-3.mp4",
  "/media/video/hero/hero-4.mp4",
  "/media/video/hero/hero-5.mp4",
];

/** イベント情報。Luma で参加受付・カレンダーを公開している。 */
export const events = {
  lumaUrl: "https://luma.com/55yk6nif",
  /** 過去開催の様子（public/events 配下）。 */
  photos: [
    { src: "/media/image/events/event-8.jpg", alt: "TrypL イベント参加者の集合写真（Tポーズ）" },
    { src: "/media/image/events/event-5.jpg", alt: "TrypL イベントでの登壇・発表の様子" },
    { src: "/media/image/events/event-1.jpg", alt: "TrypL イベントでの発表の様子" },
    { src: "/media/image/events/event-6.jpg", alt: "TrypL イベントでの講演の様子" },
    { src: "/media/image/events/event-3.jpg", alt: "TrypL イベントでのグループ対話の様子" },
    { src: "/media/image/events/event-7.jpg", alt: "TrypL イベント会場の様子" },
    { src: "/media/image/events/event-2.jpg", alt: "TrypL イベントでの発表・質疑の様子" },
    { src: "/media/image/events/event-4.jpg", alt: "TrypL イベントでの交流の様子" },
  ],
} as const;

/** 名前に込めた3つの意味（3つのL） */
export const triple = [
  {
    letter: "L",
    key: "Learning",
    jp: "学び",
    line: "実践を通じた、本物の学び。",
    body: "知識や資格の取得ではなく、実際の現場に飛び込み、手を動かしながら「自分は何者か」「社会の中で何ができるか」を探っていく。",
  },
  {
    letter: "L",
    key: "Long-term",
    jp: "長期",
    line: "短期ではなく、長い時間軸で。",
    body: "目先の就活や報酬のためではなく、1年後・5年後・10年後というスケールで、社会と向き合い続ける姿勢を育てる。",
  },
  {
    letter: "L",
    key: "LifeMission",
    jp: "ライフミッション",
    line: "内発的動機から、人生の使命へ。",
    body: "「どう生きたいか」という内側から湧き出る動機を起点に、自分なりの貢献のかたちを深めていく。",
  },
] as const;

/** ブランドメッセージの核（マーキー等で使用） */
export const brandWords = [
  "社会とつながる",
  "やりながら学ぶ",
  "越境する",
  "実践する",
  "可能性を広げる",
] as const;

/** 既定で表示するニュース。管理画面の追加分と併せて表示される（管理画面で編集・削除可）。 */
export const defaultPress = [
  {
    id: "launch-2026",
    title: "TrypL公式サイトを公開しました。",
    outlet: "TrypL",
    url: "",
    date: "2026-06-29",
    summary:
      "REAPRA発・若年層向けインターンシップコミュニティ「TrypL」の公式サイトを公開しました。",
    body:
      "このたび、じぶんらしさ（内発的動機）を知り、社会の中で実践する探究の循環を生み出すインターンシップコミュニティ「TrypL（トリプル）」の公式サイトを公開しました。\n\n" +
      "TrypL は、「やってみたい」という内発的な動機を起点に、REAPRA および投資先企業での実践機会（インターン）を通じて社会とつながり、やりながら学ぶ若年層のためのコミュニティです。名前には Try（挑戦）× Practice（実践）× pLay（楽しむ）という3つの意味を込めています。\n\n" +
      "本サイトでは、募集中のインターン、イベントスケジュール、コミュニティへの参加方法などをご覧いただけます。会員登録（無料）のうえ、ぜひ最初の一歩を踏み出してください。\n\n" +
      "これからの TrypL の歩みに、どうぞご期待ください。",
    hidden: false,
    createdAt: "2026-06-29T00:00:00.000Z",
  },
];

/**
 * 既定のイベント（管理画面で編集・削除できる正規データとして KV へ一度だけ投入）。
 * 株式会社ジコウ（REAPRA 投資先）主催の実開催イベント。申込は Luma。
 */
export const defaultEvents = [
  {
    id: "jicou-growth-2026-06-30",
    title: "大成長‼︎劇的ビフォーアフター",
    date: "2026-06-30",
    startTime: "19:30",
    endTime: "21:30",
    place: "株式会社ジコウ 唐人町オフィス（福岡市中央区地行1-15-6）",
    online: false,
    description:
      "インターン参加者によるプレゼン、企業紹介、トークセッション＆Q&A、社会人との交流座談会。学生が「自分の成長」と社会との接点を見つけるためのキャリアイベントです。軽食付き・定員20名。",
    registerUrl: "https://luma.com/55yk6nif",
    hidden: false,
    createdAt: "2026-06-25T00:00:00.000Z",
  },
];
