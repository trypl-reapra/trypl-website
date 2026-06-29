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
  name?: string;
  memberId?: string;
  attended?: boolean;
  alreadyAttended?: boolean;
  hadRsvp?: boolean;
  walkIn?: boolean;
  reason?: string;
};

const REASON_MSG: Record<string, string> = {
  invalid_qr: "TrypL の会員証QRではありません。",
  unknown: "該当する会員が見つかりません。",
  event_not_found: "イベントが見つかりません。",
  no_target: "読み取れませんでした。もう一度お試しください。",
};

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
    if (resultTimer.current) window.clearTimeout(resultTimer.current);
    resultTimer.current = window.setTimeout(() => setResult(null), 4000);
  }

  const submitCheckin = useCallback(
    async (body: Record<string, unknown>) => {
      setBusy(true);
      try {
        const res: CheckinResult = await fetch(
          "/api/admin/events/checkin",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventId, ...body }),
          },
        ).then((x) => x.json());
        flashResult(res);
        if (res.ok) await loadRegs();
        return res;
      } finally {
        setBusy(false);
      }
    },
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

  async function startScan() {
    setCamError("");
    try {
      const mod = await import("html5-qrcode");
      const Html5Qrcode = mod.Html5Qrcode;
      const scanner = new Html5Qrcode(elementId, { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 230, height: 230 } },
        (decoded: string) => onScan(decoded),
        () => {},
      );
      setScanning(true);
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

  const banner = (() => {
    if (!result) return null;
    if (result.ok && result.attended && !result.alreadyAttended) {
      return {
        cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
        text: `受付完了：${result.name}（${result.memberId}）${result.walkIn ? "・当日受付" : ""}`,
      };
    }
    if (result.ok && result.alreadyAttended) {
      return {
        cls: "bg-amber-50 text-amber-800 border-amber-200",
        text: `既に受付済み：${result.name}（${result.memberId}）`,
      };
    }
    if (result.ok && result.attended === false) {
      return {
        cls: "bg-stone-100 text-stone-700 border-stone-200",
        text: `受付を取り消しました：${result.name}`,
      };
    }
    return {
      cls: "bg-red-50 text-red-700 border-red-200",
      text: REASON_MSG[result.reason ?? ""] ?? "受付できませんでした。",
    };
  })();

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

      {banner && (
        <div className={cn("mt-4 rounded-xl border px-4 py-3 text-sm font-medium", banner.cls)}>
          {banner.text}
        </div>
      )}

      {/* カメラ表示エリア（スキャン中のみ） */}
      <div className={cn("mt-4", scanning ? "block" : "hidden")}>
        <div
          id={elementId}
          className="mx-auto w-full max-w-[320px] overflow-hidden rounded-xl border border-line bg-black [&_video]:rounded-xl"
        />
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
                  <span className="font-medium">{r.name || r.email.split("@")[0]}</span>
                  <span className="ml-2 font-mono text-xs text-mute">{r.memberId}</span>
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
