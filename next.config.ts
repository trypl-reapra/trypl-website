import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 管理画面でプレス／イベントに任意の画像URLを設定できるよう、外部HTTPS画像を許可。
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
