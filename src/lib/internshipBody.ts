/**
 * 募集本文（リッチHTML）のユーティリティ。
 * - body が設定されていればそれを表示。
 * - 未設定（旧来の about / responsibilities 等）の場合は、それらから本文HTMLを自動生成。
 * - 表示時は管理者入力のHTMLを最小限サニタイズする。
 */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function ul(items: string[]): string {
  return `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
}

type Legacyish = {
  about?: string;
  responsibilities?: string[];
  requirements?: string[];
  welcome?: string[];
};

/** 旧来のフィールドから本文HTMLを生成（見出し＋本文＋箇条書き）。 */
export function legacyBodyHtml(i: Legacyish): string {
  const parts: string[] = [];
  if (i.about && i.about.trim())
    parts.push(`<h2>この企業・チームについて</h2><p>${esc(i.about)}</p>`);
  if (i.responsibilities?.length)
    parts.push(`<h2>主な業務</h2>${ul(i.responsibilities)}`);
  if (i.requirements?.length)
    parts.push(`<h2>求める人物像</h2>${ul(i.requirements)}`);
  if (i.welcome?.length)
    parts.push(`<h2>歓迎する経験・スキル</h2>${ul(i.welcome)}`);
  return parts.join("\n");
}

/** body 優先、無ければ旧来フィールドから自動生成。 */
export function internshipBodyHtml(i: Legacyish & { body?: string }): string {
  return i.body && i.body.trim() ? i.body : legacyBodyHtml(i);
}

/**
 * 管理者が入力したHTMLの最小サニタイズ。
 * script/style/iframe 等のブロック、on* ハンドラ、javascript: を除去。
 */
export function sanitizeBodyHtml(html: string): string {
  if (!html) return "";
  let s = html;
  s = s.replace(
    /<(script|style|iframe|object|embed|link|meta|form|input|button)[\s\S]*?<\/\1>/gi,
    "",
  );
  s = s.replace(
    /<(script|style|iframe|object|embed|link|meta|form|input|button)[^>]*>/gi,
    "",
  );
  // イベントハンドラ属性を除去
  s = s.replace(/\son\w+\s*=\s*"[^"]*"/gi, "");
  s = s.replace(/\son\w+\s*=\s*'[^']*'/gi, "");
  s = s.replace(/\son\w+\s*=\s*[^\s>]+/gi, "");
  // javascript: スキームを無効化
  s = s.replace(/(href|src)\s*=\s*"javascript:[^"]*"/gi, '$1="#"');
  s = s.replace(/(href|src)\s*=\s*'javascript:[^']*'/gi, "$1='#'");
  return s;
}
