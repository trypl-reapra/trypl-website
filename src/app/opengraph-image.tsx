import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "TrypL（トリプル）— 楽しく、遊ぶように。実践に挑戦する。REAPRA発・若年層向けインターンシップコミュニティ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0a0a0b";
const MUTE = "#a3a3ab";

export default async function OgImage() {
  const root = process.cwd();
  const [fontBold, fontMedium, mark, photo] = await Promise.all([
    readFile(join(root, "src/assets/og/ZenKakuGothicNew-Bold-subset.ttf")),
    readFile(join(root, "src/assets/og/ZenKakuGothicNew-Medium-subset.ttf")),
    readFile(join(root, "public/media/image/brand/trypl-mark-light.png")),
    readFile(join(root, "public/media/image/events/event-8.jpg")),
  ]);

  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: INK,
          fontFamily: "Zen",
          position: "relative",
        }}
      >
        {/* 右：コミュニティの実写（Tポーズの集合写真） */}
        <img
          src={photoSrc}
          width={620}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 580,
            width: 620,
            height: 630,
            objectFit: "cover",
          }}
        />
        {/* 写真を左の黒パネルへ溶かすグラデーション */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 580,
            width: 620,
            height: 630,
            background:
              "linear-gradient(90deg, #0a0a0b 0%, rgba(10,10,11,0.72) 26%, rgba(10,10,11,0.12) 62%, rgba(10,10,11,0.42) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 580,
            width: 620,
            height: 630,
            background:
              "linear-gradient(180deg, rgba(10,10,11,0.28) 0%, rgba(10,10,11,0) 32%, rgba(10,10,11,0) 58%, rgba(10,10,11,0.6) 100%)",
          }}
        />

        {/* 左：テキストパネル */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            color: "#ffffff",
          }}
        >
          {/* ロゴ＋ワードマーク */}
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <img src={markSrc} width={72} height={72} />
            <div
              style={{
                fontSize: 54,
                fontWeight: 700,
                letterSpacing: -2,
                display: "flex",
              }}
            >
              TrypL
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: MUTE,
                marginTop: 14,
                display: "flex",
              }}
            >
              トリプル
            </div>
          </div>

          {/* タグライン */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 62,
                fontWeight: 700,
                lineHeight: 1.32,
                letterSpacing: 1,
                textShadow: "0 2px 24px rgba(10,10,11,0.6)",
              }}
            >
              <span>楽しく、遊ぶように。</span>
              <span>実践に挑戦する。</span>
            </div>
            <div
              style={{
                marginTop: 30,
                fontSize: 27,
                fontWeight: 500,
                color: "#c9c9d2",
                display: "flex",
                textShadow: "0 1px 12px rgba(10,10,11,0.6)",
              }}
            >
              REAPRA発・若年層向けインターンシップコミュニティ
            </div>
          </div>

          {/* フッター行 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.16)",
              paddingTop: 26,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 27,
                fontWeight: 700,
              }}
            >
              <span>Try</span>
              <span style={{ color: MUTE, margin: "0 14px", fontWeight: 500 }}>
                ×
              </span>
              <span>Practice</span>
              <span style={{ color: MUTE, margin: "0 14px", fontWeight: 500 }}>
                ×
              </span>
              <span>pLay</span>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 500,
                color: MUTE,
                letterSpacing: 4,
              }}
            >
              REAPRA
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Zen", data: fontBold, weight: 700, style: "normal" },
        { name: "Zen", data: fontMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
