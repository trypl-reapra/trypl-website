# media — サイトで使う動画・画像

サイト内で使用している動画・画像はすべてこのフォルダにまとめています。
ここのファイルを差し替えれば、サイトの該当箇所が更新されます（ファイル名は変えないでください。変える場合はコード側の参照も要修正）。

URL は `public/` 起点なので、例：`public/media/video/hero.mp4` → サイト上は `/media/video/hero.mp4`。

## 構成と用途

```
media/
├── video/
│   ├── hero.mp4 / hero-poster.jpg   … トップのヒーロー背景動画＋静止画
│   └── who.mp4  / who-poster.jpg    … 「求める人物像」セクションの背景動画＋静止画
└── image/
    ├── events/event-1〜7.jpg        … 活動の様子（ホームの写真ストリップ／イベントのギャラリー）
    ├── internship/1〜9.jpg          … 募集ポップアップのヘッダー画像（募集ごとに別の自然画像）
    ├── team/yamada-akiyoshi.webp    … 代表（About の代表メッセージ）のポートレート
    ├── brand/trypl-mark-dark.png    … TrypL マーク（明るい背景用・黒）
    ├── brand/trypl-mark-light.png   … TrypL マーク（暗い背景用・白）
    └── internships-header.jpg       … 予備（現在サイト未使用）
```

## 差し替えのコツ
- **動画**：mp4（H.264 / 音声なし推奨）。差し替えたら poster 画像も合わせると見栄えが良いです。
- **画像**：jpg / png / webp。サイズは元と同程度（横長は 16:9 や 4:3 推奨）。
- 募集ごとのヘッダー画像の割り当ては `src/data/internships.ts` の `HEADER_BY_SLUG` を参照。

> 補足：ブラウザのタブに出るファビコン（サイトアイコン）は Next.js の仕様上 `src/app/icon.png` / `apple-icon.png` / `favicon.ico` に置いています（このフォルダではありません）。
