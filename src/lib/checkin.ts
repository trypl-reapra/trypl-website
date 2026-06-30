import "server-only";
import crypto from "node:crypto";

/**
 * イベント受付（QR）用の本人識別トークン。
 *
 * 会員のメールアドレスを AUTH_SECRET で HMAC 署名した値。
 * ・偽造不可（秘密鍵がないと作れない）
 * ・QR にはこのトークンだけを載せる＝メールアドレスは露出しない
 * ・メールから一意に定まる安定値なので、保存不要で都度再計算して照合できる
 */
// 本番では AUTH_SECRET 必須（未設定なら既知の弱い鍵でトークンを偽造され得るため
// フォールバックを使わない）。開発時のみ仮の鍵を許可。
const SECRET =
  process.env.AUTH_SECRET ||
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error("AUTH_SECRET is required in production for check-in tokens");
      })()
    : "trypl-dev-secret-do-not-use");

/** QR 文字列の接頭辞（他社QRの誤読を弾く識別子）。 */
export const QR_PREFIX = "TRYPL1:";

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

/** 会員メールから受付トークンを生成（24文字の base64url）。 */
export function memberCheckinToken(email: string): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update("trypl-checkin:" + normalize(email))
    .digest("base64url")
    .slice(0, 24);
}

/** 会員証の裏 QR に埋め込む文字列。 */
export function qrPayload(email: string): string {
  return QR_PREFIX + memberCheckinToken(email);
}

/** スキャンした文字列からトークンを取り出す（TrypL の QR でなければ null）。 */
export function tokenFromScan(raw: string): string | null {
  const s = (raw || "").trim();
  if (!s.startsWith(QR_PREFIX)) return null;
  const token = s.slice(QR_PREFIX.length).trim();
  return token || null;
}

/** トークンに一致する会員メールを候補一覧から探す（見つからなければ null）。 */
export function emailForToken(
  token: string,
  emails: string[],
): string | null {
  for (const email of emails) {
    if (memberCheckinToken(email) === token) return email;
  }
  return null;
}
