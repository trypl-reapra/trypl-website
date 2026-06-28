"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** ルート変更ごとにページビューを1件計測する（sendBeacon 優先）。 */
export default function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return; // 管理画面は計測対象外
    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/track");
        return;
      }
    } catch {}
    fetch("/api/track", { method: "POST", keepalive: true }).catch(() => {});
  }, [pathname]);
  return null;
}
