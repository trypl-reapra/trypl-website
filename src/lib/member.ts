/**
 * メールアドレスから安定した会員番号（表示用）を作る。
 * 例: TRYPL-AB12CD
 */
export function memberCode(email: string): string {
  let h = 0;
  for (let i = 0; i < email.length; i++) {
    h = (h * 31 + email.charCodeAt(i)) >>> 0;
  }
  return "TRYPL-" + h.toString(36).toUpperCase().padStart(6, "0").slice(-6);
}
