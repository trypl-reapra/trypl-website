import type { NextConfig } from "next";

// 全ルートに付与するセキュリティヘッダ。
// クリックジャッキング（/admin・/members の UI redress）対策として frame-ancestors を制限し、
// MIME スニッフィング抑止・リファラ制限・HSTS を付与する。
// ※ script-src 等の制限は Next の inline と競合し得るため、CSP は frame-ancestors のみに留める。
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    // 管理画面でプレス／イベントに任意の画像URLを設定できるよう、外部HTTPS画像を許可。
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
