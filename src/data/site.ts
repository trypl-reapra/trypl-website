/**
 * Global site configuration.
 * 編集ポイント: サイト名・連絡先・SNS の正式 URL が決まったらここを更新。
 */

export const site = {
  name: "TrypL",
  reading: "トリプル",
  // SNS のプロフィールに貼る「母艦」。デプロイ後の本番 URL に合わせて
  // NEXT_PUBLIC_SITE_URL を設定すると OG 画像などが正しく解決されます。
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://trypl-website.vercel.app",
  tagline: "楽しく、遊ぶように。実践に挑戦する。",
  taglineEn: "Try × Practice × pLay",
  description:
    "TrypL（トリプル）は、REAPRA発の若年層向け実践型インターンコミュニティ。社会とつながり、やりながら学ぶ。REAPRAおよび投資先企業でのインターンを通じて、内発的動機から「社会と共創する熟達」への一歩を踏み出す場です。",
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

/** イベント情報。Luma で参加受付・カレンダーを公開している。 */
export const events = {
  lumaUrl: "https://luma.com/55yk6nif",
  /** 過去開催の様子（public/events 配下）。 */
  photos: [
    { src: "/events/event-5.jpg", alt: "TrypL イベントでの登壇・発表の様子" },
    { src: "/events/event-1.jpg", alt: "TrypL イベントでの発表の様子" },
    { src: "/events/event-6.jpg", alt: "TrypL イベントでの講演の様子" },
    { src: "/events/event-3.jpg", alt: "TrypL イベントでのグループ対話の様子" },
    { src: "/events/event-7.jpg", alt: "TrypL イベント会場の様子" },
    { src: "/events/event-2.jpg", alt: "TrypL イベントでの発表・質疑の様子" },
    { src: "/events/event-4.jpg", alt: "TrypL イベントでの交流の様子" },
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
    body: "「どう社会と関わりたいか」という内側から湧き出る動機を起点に、自分なりの貢献のかたちを深めていく。",
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
