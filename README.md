# TrypL（トリプル）公式サイト

REAPRA発・若年層向け実践型インターンコミュニティ「TrypL」の公式サイト兼「母艦」。
SNS から流入したユーザーの導線（各種リンク・募集要項・参加フォーム）を一箇所に集約します。

- **デザイン**：白黒ベース・ジオメトリック・引き算（Apple ライク）。スクロール連動アニメーション。
- **構成**：ホーム / TrypLとは / 募集一覧 / 募集詳細 / 参加する / リンク集（バイオリンク）

---

## 技術スタック

| | |
|---|---|
| フレームワーク | Next.js 16（App Router）+ React 19 |
| 言語 | TypeScript |
| スタイル | Tailwind CSS v4 |
| アニメーション | Framer Motion + Lenis（スムーススクロール） |
| フォント | Inter / Space Grotesk / Zen Kaku Gothic New |
| ホスティング | Vercel |

---

## ローカルで動かす

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 本番ビルド
npm start        # 本番サーバー
```

---

## 📝 コンテンツの編集（運営メンバー向け）

ほとんどの更新は `src/data/` の中だけで完結します。コードを触る必要はありません。

### インターン募集を追加・編集する
`src/data/internships.ts` の `internships` 配列を編集します。

```ts
{
  slug: "company-role",        // URL になる一意の英数字
  company: "企業名",
  companyTag: "業種の一言説明",
  title: "募集職種",
  category: "business",        // community/business/marketing/research/design/data/engineering
  location: "東京 / リモート",
  workStyle: "remote",         // remote / hybrid / onsite
  commitment: "週2日〜",
  duration: "3か月〜",
  compensation: "時給1,300円〜",
  summary: "カード用の短い要約",
  about: "企業・チームの紹介",
  responsibilities: ["主な業務1", "主な業務2"],
  requirements: ["求める人物像1"],
  welcome: ["歓迎スキル1"],
  tags: ["タグ1", "タグ2"],
  applyUrl: "https://www.wantedly.com/...",  // Wantedly / 応募フォームの URL
  applyLabel: "応募する",
  featured: true,              // トップに大きく出すなら true
  postedAt: "2026-06-20",
}
```

> 現在の募集はすべて **サンプル（プレースホルダー）** です。実データに差し替えてください。
> 企業名に「（サンプル）」と付いているものは架空の企業です。

### SNS リンク・参加フォームを設定する
`src/data/socials.ts` を編集。各 SNS の `href` を実 URL に、`available` を `true` にすると
リンク集（`/links`）とフッターで有効化されます。参加フォームは `entryForm` を編集。

### サイト全体の設定
`src/data/site.ts`（サイト名・タグライン・連絡先メール・ナビ）と
`src/data/team.ts`（運営チーム・ロードマップ）を編集。

---

## 🚀 公開前のチェックリスト

1. **募集要項・SNS リンク・連絡先** を実データに差し替える（`src/data/`）。
2. **検索インデックスを有効化**：`src/app/layout.tsx` の `robots` を
   `{ index: true, follow: true }` に変更。
3. **本番 URL を設定**：Vercel の環境変数に `NEXT_PUBLIC_SITE_URL`（例：`https://trypl.jp`）を設定。
   OG 画像や canonical URL が正しく解決されます。
4. **独自ドメイン**（任意）：Vercel のプロジェクト設定 → Domains から追加。

---

## デプロイ（Vercel）

`main` ブランチへ push すると Vercel が自動でビルド・デプロイします。

```bash
git add -A
git commit -m "update content"
git push
```

手動デプロイ：`vercel --prod`

---

## ディレクトリ構成

```
src/
├── app/                     # ルーティング（App Router）
│   ├── page.tsx             # ホーム
│   ├── about/               # TrypLとは
│   ├── internships/         # 募集一覧 + [slug] 詳細
│   ├── join/                # 参加する
│   ├── links/               # リンク集（バイオリンク母艦）
│   ├── opengraph-image.tsx  # SNS シェア用 OG 画像（動的生成）
│   └── icon.svg             # ファビコン
├── components/
│   ├── home/                # トップページ各セクション
│   ├── internships/         # 募集カード・フィルタ
│   ├── layout/              # ナビ・フッター・スムーススクロール
│   ├── motion.tsx           # アニメーション部品（Reveal等）
│   ├── ui.tsx               # ボタン・セクション等の共通UI
│   ├── logo.tsx / decor.tsx # ロゴ・幾何モチーフ
│   └── PageHeader.tsx
├── data/                    # ★ コンテンツはここ
└── lib/
```
