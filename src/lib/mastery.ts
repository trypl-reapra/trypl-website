/**
 * 熟達タイプ診断（mastery-type）との連携。
 *
 * 診断サイト https://mastery-type.vercel.app が結果ペイロードを
 * /members/mastery?r=... に渡してくる。ここではその文字列を検証して
 * 表示に使える形に直す。タイプ名・軸ラベルは診断側 data.js の写しなので、
 * 向こうを変えたらここも合わせること（コードと%以外は保存しない）。
 *
 * ペイロードの3形態:
 *   クイック : CODE.d.i.x.l                      （24問）
 *   v1       : CODE.d.i.x.l.e                    （旧・60問）
 *   v2       : CODE.d.i.x.l.e.f×12.ef×2.conf     （60問）
 * いずれも先頭がタイプコード、続く4つが軸の%（pole1側の割合）。
 */

export const MASTERY_SITE = "https://mastery-type.vercel.app";

export type MasteryAxisKey = "d" | "i" | "x" | "l";

export const MASTERY_AXES: {
  key: MasteryAxisKey;
  name: string;
  pole1: { letter: string; label: string };
  pole2: { letter: string; label: string };
}[] = [
  { key: "d", name: "挑み方", pole1: { letter: "D", label: "飛び込む" }, pole2: { letter: "M", label: "見立てる" } },
  { key: "i", name: "決め方", pole1: { letter: "I", label: "内なる声" }, pole2: { letter: "A", label: "響き合い" } },
  { key: "x", name: "学び方", pole1: { letter: "X", label: "越境" }, pole2: { letter: "C", label: "深耕" } },
  { key: "l", name: "時間軸", pole1: { letter: "L", label: "遠くを見る" }, pole2: { letter: "N", label: "いまを生きる" } },
];

export const MASTERY_TYPES: Record<string, { name: string; en: string; catch: string }> = {
  DIXL: { name: "開拓者", en: "Pioneer", catch: "願いを羅針盤に、まだない道を歩き出す。" },
  DIXN: { name: "冒険家", en: "Adventurer", catch: "今日の好奇心が、明日の地図になる。" },
  DICL: { name: "求道者", en: "Seeker", catch: "ひとつの道を、長い時間をかけて磨き抜く。" },
  DICN: { name: "実践家", en: "Doer", catch: "手を動かした分だけ、世界がわかる。" },
  DAXL: { name: "先導者", en: "Trailblazer", catch: "仲間を乗せて、遠くへ舵を切る。" },
  DAXN: { name: "火付け役", en: "Igniter", catch: "飛び込んだ場に、熱を灯す。" },
  DACL: { name: "要", en: "Keystone", catch: "チームの真ん中で、回し続ける。" },
  DACN: { name: "相棒", en: "Partner", catch: "目の前の誰かのために、すぐ腕をふるう。" },
  MIXL: { name: "構想家", en: "Visionary", catch: "遠い未来から逆算して、越境の地図を描く。" },
  MIXN: { name: "発明家", en: "Inventor", catch: "ひらめきを、小さく試して確かめる。" },
  MICL: { name: "設計士", en: "Architect", catch: "長く続く仕組みを、静かに組み上げる。" },
  MICN: { name: "探究者", en: "Inquirer", catch: "目の前の問いを、納得いくまで掘る。" },
  MAXL: { name: "参謀", en: "Strategist", catch: "仲間の未来を見据えて、次の一手を描く。" },
  MAXN: { name: "翻訳家", en: "Bridger", catch: "人と人のあいだを、つなぎ直す。" },
  MACL: { name: "庭師", en: "Gardener", catch: "人と場が育つ土壌を、時間をかけて耕す。" },
  MACN: { name: "目利き", en: "Curator", catch: "ものごとの質を、静かに見極める。" },
};

/** 会員に保存する熟達タイプ（表示に必要な最小限だけ）。 */
export type MasteryRecord = {
  /** 4文字のタイプコード（例 DICN） */
  code: string;
  /** 軸ごとの pole1 側の割合（0-100） */
  pct: Record<MasteryAxisKey, number>;
  /** 情動の機微センサー（0-100）。クイック版では null */
  sensor: number | null;
  /** 'quick' | 'full' */
  mode: "quick" | "full";
  /** 記録した日時（ISO） */
  recordedAt: string;
};

const CODE_RE = /^[DM][IA][XC][LN]$/;

/**
 * 診断サイトから渡されたペイロードを検証する。
 * 不正なら null。名前などの表示情報はコードから引き直すので、
 * クライアントの申告をそのまま保存することはない。
 */
export function parseMasteryPayload(raw: unknown): MasteryRecord | null {
  if (typeof raw !== "string" || raw.length > 200) return null;
  const parts = raw.split(".");
  const code = parts[0];
  if (!CODE_RE.test(code) || !MASTERY_TYPES[code]) return null;

  const nums = parts.slice(1);
  if (nums.length !== 4 && nums.length !== 5 && nums.length !== 20) return null;
  // 軸の%（先頭4つ）だけを使う。整数 0-100 以外は不正リンクとして弾く。
  const vals: number[] = [];
  for (let i = 0; i < 5 && i < nums.length; i++) {
    if (!/^\d{1,3}$/.test(nums[i])) return null;
    const n = Number(nums[i]);
    if (n < 0 || n > 100) return null;
    vals.push(n);
  }

  const pct = { d: vals[0], i: vals[1], x: vals[2], l: vals[3] };
  // コードと%の向きが食い違うリンク（手で書き換えたもの）は受け取らない。
  for (let i = 0; i < MASTERY_AXES.length; i++) {
    const a = MASTERY_AXES[i];
    const isPole1 = pct[a.key] >= 50;
    const expected = isPole1 ? a.pole1.letter : a.pole2.letter;
    if (code[i] !== expected) return null;
  }

  return {
    code,
    pct,
    sensor: nums.length === 4 ? null : vals[4],
    mode: nums.length === 4 ? "quick" : "full",
    recordedAt: new Date().toISOString(),
  };
}

/** 表示用: 軸ごとの「優勢な極のラベルと%」。 */
export function masteryAxisView(rec: MasteryRecord) {
  return MASTERY_AXES.map((a) => {
    const p = rec.pct[a.key];
    const first = p >= 50;
    return {
      key: a.key,
      name: a.name,
      label: first ? a.pole1.label : a.pole2.label,
      pct: first ? p : 100 - p,
    };
  });
}

/** 診断サイトで結果を開き直すためのURL。 */
export function masteryResultUrl(rec: MasteryRecord): string {
  return `${MASTERY_SITE}/t/${rec.code}.html`;
}
