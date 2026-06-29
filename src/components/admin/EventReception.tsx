"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Registration = {
  email: string;
  name: string;
  memberId: string;
  registeredAt: string;
  attended: boolean;
  attendedAt?: string;
  walkIn?: boolean;
};

type CheckinResult = {
  ok: boolean;
  email?: string;
  name?: string;
  memberId?: string;
  image?: string;
  founder?: boolean;
  attended?: boolean;
  alreadyAttended?: boolean;
  hadRsvp?: boolean;
  walkIn?: boolean;
  registeredAt?: string;
  attendedAt?: string;
  reason?: string;
};

const REASON_MSG: Record<string, string> = {
  invalid_qr: "TrypL の会員証QRではありません。",
  unknown: "該当する会員が見つかりません（未登録）。",
  event_not_found: "イベントが見つかりません。",
  no_target: "読み取れませんでした。もう一度お試しください。",
};

/* ------------------------------------------------------------ 受付音 */
// 受付完了 / 受付済み / 未登録 をそれぞれ別の音で知らせる（Web Audio で生成）。
type SoundKind = "success" | "warn" | "error";

function useBeeper() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensure = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC: typeof AudioContext | undefined =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    const ctx = ctxRef.current;
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }, []);

  const tone = useCallback(
    (
      ctx: AudioContext,
      freq: number,
      start: number,
      dur: number,
      type: OscillatorType,
      gain: number,
    ) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + start;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    },
    [],
  );

  const play = useCallback(
    (kind: SoundKind) => {
      const ctx = ensure();
      if (!ctx) return;
      if (kind === "success") {
        // 受付完了：明るい上昇2音（ピンポン↑）
        tone(ctx, 880, 0, 0.13, "sine", 0.18);
        tone(ctx, 1318, 0.12, 0.2, "sine", 0.18);
      } else if (kind === "warn") {
        // 受付済み：同音2連（注意）
        tone(ctx, 660, 0, 0.1, "triangle", 0.16);
        tone(ctx, 660, 0.17, 0.1, "triangle", 0.16);
      } else {
        // 未登録／エラー：低い下降ブザー
        tone(ctx, 320, 0, 0.18, "sawtooth", 0.13);
        tone(ctx, 196, 0.18, 0.3, "sawtooth", 0.13);
      }
    },
    [ensure, tone],
  );

  // クリック等のユーザー操作時に AudioContext を起こしておく（自動再生制限対策）。
  const warmUp = useCallback(() => {
    ensure();
  }, [ensure]);

  return { play, warmUp };
}

/* ------------------------------------------------------------ 表示用ヘルパ */
function fmtTime(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}
function fmtDateTime(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type View = {
  kind: SoundKind;
  label: string;
  cls: string;
  badgeCls: string;
};

function viewFor(r: CheckinResult): View {
  if (r.ok && r.attended && !r.alreadyAttended)
    return {
      kind: "success",
      label: "受付完了",
      cls: "bg-emerald-50 border-emerald-200 text-emerald-900",
      badgeCls: "bg-emerald-600 text-white",
    };
  if (r.ok && r.alreadyAttended)
    return {
      kind: "warn",
      label: "既に受付済み",
      cls: "bg-amber-50 border-amber-200 text-amber-900",
      badgeCls: "bg-amber-500 text-white",
    };
  if (r.ok && r.attended === false)
    return {
      kind: "warn",
      label: "受付を取り消しました",
      cls: "bg-stone-100 border-stone-200 text-stone-700",
      badgeCls: "bg-stone-500 text-white",
    };
  return {
    kind: "error",
    label: "未登録・エラー",
    cls: "bg-red-50 border-red-200 text-red-800",
    badgeCls: "bg-red-600 text-white",
  };
}

type ZoomCaps = { min: number; max: number; step: number };

export default function EventReception({
  eventId,
  title,
}: {
  eventId: string;
  title: string;
}) {
  const [regs, setRegs] = useState<Registration[] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<CheckinResult | null>(null);
  const [camError, setCamError] = useState("");
  const [manualId, setManualId] = useState("");
  const [zoom, setZoom] = useState(1);
  const [zoomCaps, setZoomCaps] = useState<ZoomCaps | null>(null);

  const { play, warmUp } = useBeeper();

  // html5-qrcode インスタンスと重複スキャン抑止
  const scannerRef = useRef<unknown>(null);
  const lastScanRef = useRef<{ text: string; at: number }>({ text: "", at: 0 });
  const resultTimer = useRef<number | null>(null);

  const elementId = `qr-reader-${eventId}`;

  const loadRegs = useCallback(async () => {
    const r = await fetch(
      `/api/admin/events/registrations?eventId=${encodeURIComponent(eventId)}`,
    ).then((x) => x.json());
    setRegs(r.registrations ?? []);
  }, [eventId]);

  useEffect(() => {
    loadRegs();
  }, [loadRegs]);

  function flashResult(res: CheckinResult) {
    setResult(res);
    play(viewFor(res).kind); // 結果に応じて音を鳴らす
    if (resultTimer.current) window.clearTimeout(resultTimer.current);
    // 受付係が情報を読めるよう少し長めに表示
    resultTimer.current = window.setTimeout(() => setResult(null), 6000);
  }

  const submitCheckin = useCallback(
    async (body: Record<string, unknown>) => {
      setBusy(true);
      try {
        const res: CheckinResult = await fetch("/api/admin/events/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, ...body }),
        }).then((x) => x.json());
        flashResult(res);
        if (res.ok) await loadRegs();
        return res;
      } finally {
        setBusy(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventId, loadRegs],
  );

  // QR 読み取りハンドラ（重複抑止つき）
  const onScan = useCallback(
    (text: string) => {
      const now = Date.now();
      if (
        lastScanRef.current.text === text &&
        now - lastScanRef.current.at < 3000
      ) {
        return;
      }
      lastScanRef.current = { text, at: now };
      submitCheckin({ token: text });
    },
    [submitCheckin],
  );

  // 端末がズームに対応していればハードウェアズームを適用。
  const applyZoom = useCallback(
    async (next: number, caps: ZoomCaps | null) => {
      const c = caps ?? zoomCaps;
      const s = scannerRef.current as
        | { applyVideoConstraints: (v: MediaTrackConstraints) => Promise<void> }
        | null;
      if (!c || !s?.applyVideoConstraints) return;
      const clamped = Math.min(c.max, Math.max(c.min, next));
      setZoom(clamped);
      try {
        await s.applyVideoConstraints({
          advanced: [{ zoom: clamped } as MediaTrackConstraintSet],
        } as MediaTrackConstraints);
      } catch {
        /* 未対応端末は無視 */
      }
    },
    [zoomCaps],
  );

  async function startScan() {
    setCamError("");
    warmUp(); // ユーザー操作のうちに音声を有効化
    // 先にカメラ表示領域を見せる（start 時に要素が display:none だと
    // 映像が 0 サイズになり見えないため）。
    setScanning(true);
    await new Promise((r) => window.setTimeout(r, 80));
    try {
      const mod = await import("html5-qrcode");
      const Html5Qrcode = mod.Html5Qrcode;
      const scanner = new Html5Qrcode(elementId, { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 12,
          // スキャン枠を大きめ（QRが画面いっぱいに近いほど読みやすい）。
          qrbox: (w: number, h: number) => {
            const m = Math.floor(Math.min(w, h) * 0.85);
            return { width: m, height: m };
          },
        },
        (decoded: string) => onScan(decoded),
        () => {},
      );

      // 端末がズーム対応なら、初期値として 2倍（不可なら上限）にズームイン。
      try {
        const caps = (
          scanner as unknown as {
            getRunningTrackCapabilities?: () => {
              zoom?: { min?: number; max?: number; step?: number };
            };
          }
        ).getRunningTrackCapabilities?.();
        const z = caps?.zoom;
        if (z && typeof z.max === "number" && z.max > (z.min ?? 1)) {
          const caps2: ZoomCaps = {
            min: z.min ?? 1,
            max: z.max,
            step: z.step && z.step > 0 ? z.step : 0.1,
          };
          setZoomCaps(caps2);
          const initial = Math.min(caps2.max, Math.max(caps2.min, 2));
          await applyZoom(initial, caps2);
        } else {
          setZoomCaps(null);
        }
      } catch {
        setZoomCaps(null);
      }
    } catch (err) {
      setScanning(false);
      scannerRef.current = null;
      setCamError(
        "カメラを起動できませんでした。権限を許可するか、下の手入力をご利用ください。",
      );
      console.error(err);
    }
  }

  const stopScan = useCallback(async () => {
    const s = scannerRef.current as
      | { stop: () => Promise<void>; clear: () => void }
      | null;
    if (s) {
      try {
        await s.stop();
        s.clear();
      } catch {}
    }
    scannerRef.current = null;
    setScanning(false);
    setZoomCaps(null);
  }, []);

  // アンマウント時にカメラを停止
  useEffect(() => {
    return () => {
      const s = scannerRef.current as { stop?: () => Promise<void> } | null;
      if (s?.stop) s.stop().catch(() => {});
      if (resultTimer.current) window.clearTimeout(resultTimer.current);
    };
  }, []);

  const attendedCount = (regs ?? []).filter((r) => r.attended).length;
  const view = result ? viewFor(result) : null;

  return (
    <div className="mt-3 rounded-2xl border border-line bg-fog/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">受付・出席 — {title}</p>
          <p className="mt-0.5 text-xs text-mute">
            申込 {regs?.length ?? "…"} 名 / 受付済み {attendedCount} 名
          </p>
        </div>
        {!scanning ? (
          <button
            type="button"
            onClick={startScan}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper hover:bg-ink-soft"
          >
            QR受付を開始
          </button>
        ) : (
          <button
            type="button"
            onClick={stopScan}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium hover:border-ink"
          >
            受付を終了
          </button>
        )}
      </div>

      {/* 読み取り結果：その人の情報カード */}
      {result && view && (
        <div
          className={cn(
            "mt-4 flex items-start gap-4 rounded-2xl border p-4",
            view.cls,
          )}
        >
          {result.ok ? (
            <>
              {/* アバター */}
              {result.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.image}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white/70"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/70 text-xl font-bold">
                  {(result.name || "?").trim().charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                    view.badgeCls,
                  )}
                >
                  {view.label}
                </span>
                <p className="mt-1.5 truncate text-lg font-bold leading-tight">
                  {result.name || result.email?.split("@")[0] || "—"}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span className="font-mono">{result.memberId}</span>
                  {result.email && (
                    <span className="truncate opacity-70">{result.email}</span>
                  )}
                </div>
                {/* 属性バッジ */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.founder && (
                    <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                      ★ 創設メンバー
                    </span>
                  )}
                  {result.walkIn ? (
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium">
                      当日受付
                    </span>
                  ) : result.hadRsvp ? (
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium">
                      事前申込あり
                    </span>
                  ) : null}
                </div>
                {/* 日時 */}
                <p className="mt-2 text-[11px] opacity-80">
                  {result.attended
                    ? `受付 ${fmtTime(result.attendedAt)}`
                    : "未受付"}
                  {" ・ "}
                  申込 {fmtDateTime(result.registeredAt)}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/70 text-2xl font-bold">
                ✕
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                    view.badgeCls,
                  )}
                >
                  {view.label}
                </span>
                <p className="mt-1.5 text-sm font-semibold">
                  {REASON_MSG[result.reason ?? ""] ?? "受付できませんでした。"}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* カメラ表示エリア（スキャン中のみ） */}
      <div className={cn("mt-4", scanning ? "block" : "hidden")}>
        <div
          id={elementId}
          className="mx-auto min-h-[260px] w-full max-w-[340px] overflow-hidden rounded-xl border border-line bg-black [&_video]:block [&_video]:!h-auto [&_video]:!w-full [&_video]:rounded-xl"
        />
        {/* ズーム調整（対応端末のみ表示） */}
        {zoomCaps && (
          <div className="mx-auto mt-3 flex max-w-[340px] items-center gap-3">
            <button
              type="button"
              onClick={() => applyZoom(zoom - (zoomCaps.step || 0.1) * 4, null)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-lg leading-none hover:border-ink"
              aria-label="ズームアウト"
            >
              −
            </button>
            <input
              type="range"
              min={zoomCaps.min}
              max={zoomCaps.max}
              step={zoomCaps.step}
              value={zoom}
              onChange={(e) => applyZoom(Number(e.target.value), null)}
              className="h-1.5 flex-1 cursor-pointer accent-ink"
              aria-label="カメラのズーム"
            />
            <button
              type="button"
              onClick={() => applyZoom(zoom + (zoomCaps.step || 0.1) * 4, null)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-lg leading-none hover:border-ink"
              aria-label="ズームイン"
            >
              ＋
            </button>
            <span className="w-12 text-right font-mono text-xs text-mute">
              {zoom.toFixed(1)}×
            </span>
          </div>
        )}
        <p className="mt-2 text-center text-xs text-mute">
          会員証の裏面QRをカメラにかざしてください。
        </p>
      </div>

      {camError && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
          {camError}
        </p>
      )}

      {/* 手入力フォールバック */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          warmUp();
          const id = manualId.trim();
          if (!id) return;
          submitCheckin({ memberId: id });
          setManualId("");
        }}
        className="mt-4 flex flex-wrap items-center gap-2"
      >
        <input
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          placeholder="会員番号で受付（例：TRYPL-AB12CD）"
          className="h-10 min-w-[220px] flex-1 rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-10 rounded-full border border-line px-4 text-sm font-medium hover:border-ink disabled:opacity-60"
        >
          手入力で受付
        </button>
      </form>

      {/* 申込・出席一覧 */}
      <div className="mt-5">
        {regs === null ? (
          <p className="text-sm text-mute">読み込み中…</p>
        ) : regs.length === 0 ? (
          <p className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-mute">
            まだ申込・受付がありません。
          </p>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper">
            {regs.map((r) => (
              <li
                key={r.email}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <span className="font-medium">
                    {r.name || r.email.split("@")[0]}
                  </span>
                  <span className="ml-2 font-mono text-xs text-mute">
                    {r.memberId}
                  </span>
                  {r.walkIn && (
                    <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-600">
                      当日
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {r.attended ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      ✓ 受付済み
                    </span>
                  ) : (
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">
                      未受付
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      submitCheckin({ email: r.email, attended: !r.attended })
                    }
                    className="rounded-full border border-line px-3 py-1 text-xs hover:border-ink disabled:opacity-60"
                  >
                    {r.attended ? "取消" : "受付"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
