"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** ルート変更ごとにページビューを1件計測する（軽量ビーコン）。 */
export default function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    // 管理画面は計測対象外。
    if (pathname.startsWith("/admin")) return;
    const c = new AbortController();
    fetch("/api/track", {
      method: "POST",
      keepalive: true,
      signal: c.signal,
    }).catch(() => {});
    return () => c.abort();
  }, [pathname]);
  return null;
}
