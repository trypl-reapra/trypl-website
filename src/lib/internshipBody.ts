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

/**
 * href は http(s)/mailto/同一サイト相対(/path, ./x, #anchor) のみ許可。
 * それ以外（javascript:/data:/vbscript: や プロトコル相対 //evil.com）は # に。
 */
function safeUrl(url: string): string {
  const decoded = decodeEntities(url).toLowerCase();
  return /^(https?:|mailto:|#|\.|\/(?!\/))/.test(decoded) ? url : "#";
}

/** 外部リンク href の安全化（会社HP等、管理者入力URLの描画用）。空はそのまま空。 */
export function safeHref(url: string | undefined | null): string {
  if (!url) return "";
  return safeUrl(String(url));
}

/** タグの属性文字列から href の値を取り出す（引用あり/なし両対応）。 */
function extractHref(attrs: string): string {
  const m = attrs.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
  if (!m) return "";
  return m[2] ?? m[3] ?? m[4] ?? "";
}

/**
 * 管理者が入力したHTMLのサニタイズ（許可リスト＋タグ再構築方式）。
 * - 危険なブロック要素・コメントを除去
 * - 許可タグのみ残し、各タグを「属性なし」で再構築（イベントhandler・style・未引用属性等の全ベクタを封鎖）
 * - 例外として <a> の href のみ、スキーム検証（http/https/mailto/相対のみ）して保持
 * ※ body は管理者のみ編集可能だが公開ページに描画されるため、属性を一切残さない再構築で多層防御する。
 */
export function sanitizeBodyHtml(html: string): string {
  if (!html) return "";
  let s = html;
  // HTMLコメント（条件付きコメント含む）を除去
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  // 危険なブロック要素（開閉ペア＋単独タグ）を中身ごと除去
  const DANGER =
    "script|style|iframe|object|embed|link|meta|form|input|button|svg|math|template|noscript";
  s = s.replace(new RegExp(`<(${DANGER})[\\s\\S]*?<\\/\\1>`, "gi"), "");
  s = s.replace(new RegExp(`<\\/?(${DANGER})[^>]*>`, "gi"), "");
  // すべてのタグを再構築：許可タグ以外は除去。許可タグは属性を捨てて再生成
  // （<a> だけ検証済み href を残す）。これにより未引用属性・on*・style 等を一掃。
  s = s.replace(
    /<(\/?)([a-z][a-z0-9]*)\b([^>]*)>/gi,
    (_m, slash: string, tagRaw: string, attrs: string) => {
      const tag = tagRaw.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (slash) return `</${tag}>`;
      if (tag === "a") {
        const raw = extractHref(attrs);
        const href = raw ? safeUrl(raw) : "";
        return href
          ? `<a href="${href.replace(/"/g, "&quot;")}" rel="noopener noreferrer">`
          : "<a>";
      }
      return `<${tag}>`;
    },
  );
  return s;
}
