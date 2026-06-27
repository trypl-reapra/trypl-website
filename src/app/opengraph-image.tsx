import { ImageResponse } from "next/og";

export const alt = "TrypL — Try × Practice × pLay";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const ring = {
    width: 76,
    height: 76,
    borderRadius: 76,
    border: "5px solid #ffffff",
  } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          color: "#ffffff",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 20 }}>
          <div style={ring} />
          <div style={ring} />
          <div style={ring} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 150,
              fontWeight: 700,
              letterSpacing: -6,
              lineHeight: 1,
            }}
          >
            TrypL
          </div>
          <div style={{ fontSize: 40, color: "#9a9aa2", marginTop: 16 }}>
            Try × Practice × pLay
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#9a9aa2",
          }}
        >
          <span>Learning · Long-term · LifeMission</span>
          <span style={{ letterSpacing: 2 }}>REAPRA</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
