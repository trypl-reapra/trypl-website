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

/** 募集本文で許可するタグ（これ以外は中身だけ残して除去）。 */
const ALLOWED_TAGS = new Set([
  "a", "b", "strong", "em", "i", "u", "s", "p", "br",
  "h1", "h2", "h3", "h4", "ul", "ol", "li", "hr", "blockquote", "span", "div",
]);

/** URL の数値実体参照をデコードしてスキームを判定するためのヘルパ。 */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);?/gi, (_, h) => {
      try { return String.fromCodePoint(parseInt(h, 16)); } catch { return ""; }
    })
    .replace(/&#(\d+);?/g, (_, d) => {
      try { return String.fromCodePoint(parseInt(d, 10)); } catch { return ""; }
    })
    .replace(/\s+/g, "");
}

/** href/src は http(s)/mailto/相対(/,#) のみ許可。それ以外（javascript: data: 等）は # に。 */
function safeUrl(url: string): string {
  const decoded = decodeEntities(url).toLowerCase();
  return /^(https?:|mailto:|\/|#|\.)/.test(decoded) ? url : "#";
}

/** 外部リンク href の安全化（会社HP等、管理者入力URLの描画用）。空はそのまま空。 */
export function safeHref(url: string | undefined | null): string {
  if (!url) return "";
  return safeUrl(String(url));
}

/**
 * 管理者が入力したHTMLのサニタイズ（許可リスト方式）。
 * - 危険なブロック要素（script/style/svg 等）を除去
 * - on* ハンドラ・style 属性を除去
 * - href/src のスキームを許可リスト化（javascript:/data: 等を無効化、実体参照も考慮）
 * - 許可タグ以外は中身だけ残して除去
 * ※ body は管理者のみ編集可能だが、公開ページに描画されるため多層で防御する。
 *   さらなる堅牢化が必要なら DOMPurify 等の導入を推奨。
 */
export function sanitizeBodyHtml(html: string): string {
  if (!html) return "";
  let s = html;
  // HTMLコメント（条件付きコメント含む）を除去
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  // 危険なブロック要素（開閉ペア＋単独タグ）
  const DANGER = "script|style|iframe|object|embed|link|meta|form|input|button|svg|math|template|noscript";
  s = s.replace(new RegExp(`<(${DANGER})[\\s\\S]*?<\\/\\1>`, "gi"), "");
  s = s.replace(new RegExp(`<\\/?(${DANGER})[^>]*>`, "gi"), "");
  // on* イベントハンドラ・style 属性を除去
  s = s.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  s = s.replace(/\sstyle\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // href/src のスキーム検証
  s = s.replace(/\s(href|src)\s*=\s*"([^"]*)"/gi, (_m, a, v) => ` ${a}="${safeUrl(v)}"`);
  s = s.replace(/\s(href|src)\s*=\s*'([^']*)'/gi, (_m, a, v) => ` ${a}='${safeUrl(v)}'`);
  // 許可タグ以外は除去（中身テキストは保持）
  s = s.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (m, tag) =>
    ALLOWED_TAGS.has(String(tag).toLowerCase()) ? m : "",
  );
  return s;
}
