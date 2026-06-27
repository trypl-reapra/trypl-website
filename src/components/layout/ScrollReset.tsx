"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

/** ページ遷移のたびに先頭へスクロールする（Lenis 使用時も確実に）。 */
export default function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}
