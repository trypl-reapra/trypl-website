/**
 * 熟達タイプ診断 ↔ TrypL のペイロード契約を検証する。
 *
 *   node scripts/verify-mastery-contract.mjs [mastery-type のパス]
 *
 * 診断側（mastery-type）が生成しうる全パターンのペイロードを実際に作り、
 * TrypL 側の parseMasteryPayload がそれを受け取れるかを確かめる。
 * どちらかのフォーマットが変わったらここで落ちる。
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { parseMasteryPayload, MASTERY_TYPES, MASTERY_AXES } from "../src/lib/mastery.ts";

const MT = process.argv[2] || path.join(os.homedir(), "mastery-type");

let fails = 0;
const ok = (cond, label, detail) => {
  if (cond) return;
  fails++;
  console.log(`  ✗ ${label}${detail ? `  — ${detail}` : ""}`);
};

if (!fs.existsSync(path.join(MT, "data.js"))) {
  console.log(`\n診断側が見つかりません: ${MT}\n（パスを引数で渡してください）\n`);
  process.exit(2);
}

/* 診断側の data.js / scoring.js を、ブラウザと同じ classic script として読む */
const read = (f) => fs.readFileSync(path.join(MT, f), "utf8");
const { QUIZ, S } = new Function(
  read("data.js") + "\n" + read("scoring.js") + "\n;return {QUIZ, S: MTScoring};"
)();

/* app.js の encodePayload と同じ組み立て（形式が変わったらここも直す） */
const AXIS_ORDER = S.AXIS_ORDER;
const FACET_ORDER = S.FACET_ORDER;
function encodePayload(res) {
  const axes = AXIS_ORDER.map((k) => res.pct[k]).join(".");
  if (res.e === null || res.e === undefined) return `${res.code}.${axes}`;
  const head = `${res.code}.${axes}.${res.e}`;
  if (!res.facets) return head;
  const f = FACET_ORDER.map((k) => res.facets[k]).join(".");
  const ef = QUIZ.sensor.facets.map((x) => res.eFacets[x.key]).join(".");
  const confToInt = (c) => AXIS_ORDER.reduce((n, k) => n * 3 + (c[k] ?? 1), 0);
  return `${head}.${f}.${ef}.${confToInt(res.conf)}`;
}

console.log("\nタイプ表の一致");
{
  const mtCodes = Object.keys(QUIZ.types).sort();
  const tryplCodes = Object.keys(MASTERY_TYPES).sort();
  ok(mtCodes.join() === tryplCodes.join(), "16タイプのコードが一致");
  mtCodes.forEach((c) => {
    ok(QUIZ.types[c].name === MASTERY_TYPES[c]?.name, `${c}: タイプ名が一致`,
      `${QUIZ.types[c].name} vs ${MASTERY_TYPES[c]?.name}`);
    ok(QUIZ.types[c].en === MASTERY_TYPES[c]?.en, `${c}: 英名が一致`);
    ok(QUIZ.types[c].catch === MASTERY_TYPES[c]?.catch, `${c}: キャッチが一致`);
  });
  QUIZ.axes.forEach((a, i) => {
    const b = MASTERY_AXES[i];
    ok(a.key === b.key && a.name === b.name, `軸 ${a.key}: 名前と並びが一致`);
    ok(a.pole1.letter === b.pole1.letter && a.pole1.label === b.pole1.label, `軸 ${a.key}: pole1 が一致`);
    ok(a.pole2.letter === b.pole2.letter && a.pole2.label === b.pole2.label, `軸 ${a.key}: pole2 が一致`);
  });
}

console.log("\n実際の回答から作ったペイロードが通ること");
{
  /* 16タイプすべてを、クイック・精密の両モードで作って渡す */
  const wants = [];
  for (const d of [1, -1])
    for (const i of [1, -1])
      for (const x of [1, -1])
        for (const l of [1, -1]) wants.push({ d, i, x, l, e: 1 });

  for (const mode of ["quick", "full"]) {
    const items = S.itemsFor(mode);
    const seen = new Set();
    for (const want of wants) {
      const ans = items.map((q) =>
        Math.max(-3, Math.min(3, (want[q.axis] || 0) * q.dir * 3))
      );
      const res = S.computeResult(items, ans);
      const payload = encodePayload(res);
      const rec = parseMasteryPayload(payload);
      ok(!!rec, `${mode}: ${res.code} のペイロードが通る`, payload);
      if (!rec) continue;
      seen.add(rec.code);
      ok(rec.code === res.code, `${mode}: ${res.code} のコードが往復する`, rec.code);
      ok(rec.mode === mode, `${mode}: モード判定が一致`, rec.mode);
      AXIS_ORDER.forEach((k) => {
        ok(rec.pct[k] === res.pct[k], `${mode}: ${res.code} の ${k} 軸%が一致`,
          `${rec.pct[k]} vs ${res.pct[k]}`);
      });
      ok(
        mode === "quick" ? rec.sensor === null : rec.sensor === res.e,
        `${mode}: センサー値の扱いが一致`,
        `${rec.sensor} vs ${res.e}`
      );
    }
    ok(seen.size === 16, `${mode}: 16タイプすべてを生成・受理できた`, `${seen.size}種`);
  }

  /* 切り替え（flipResult）後のペイロードも通ること */
  const items = S.itemsFor("full");
  const base = S.computeResult(items, items.map((q) => (q.dir === 1 ? 1 : -1)));
  for (const axis of AXIS_ORDER) {
    const flipped = S.flipResult(base, axis);
    const rec = parseMasteryPayload(encodePayload(flipped));
    ok(!!rec && rec.code === flipped.code, `切り替え後（${axis}）のペイロードが通る`, flipped.code);
  }
}

console.log("\n壊れた・書き換えられたペイロードを弾くこと");
{
  const bad = [
    ["", "空文字"],
    [null, "null"],
    [123, "数値"],
    ["DICN", "%が無い"],
    ["DICN.60.60.40", "軸が3つしかない"],
    ["DICN.60.60.40.40.70.1", "既知のどの長さでもない"],
    ["ZZZZ.60.60.40.40", "存在しないコード"],
    ["DIXN.60.60.40.40", "コードと%の向きが食い違う（X なのに x=40）"],
    ["DICN.60.60.40.140", "%が範囲外"],
    ["DICN.60.60.40.-4", "%が負"],
    ["DICN.60.60.40.4a", "%が数字でない"],
    ["DICN.60.60.40.40.70" + ".1".repeat(200), "長すぎる"],
  ];
  for (const [payload, label] of bad) {
    ok(parseMasteryPayload(payload) === null, `弾く: ${label}`, JSON.stringify(payload)?.slice(0, 50));
  }
  /* 境界値は通す */
  ok(!!parseMasteryPayload("DICN.50.50.49.49"), "50%ちょうど（pole1側）は通る");
  ok(!!parseMasteryPayload("MACN.0.0.0.0"), "0%は通る");
  ok(!!parseMasteryPayload("DIXL.100.100.100.100"), "100%は通る");
}

console.log(`\n${fails === 0 ? "✓ 契約は保たれています" : `✗ ${fails}件 失敗`}\n`);
process.exit(fails ? 1 : 0);
