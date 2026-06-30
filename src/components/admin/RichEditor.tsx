"use client";

import { useEffect, useRef } from "react";

/**
 * 軽量リッチテキストエディタ（contentEditable）。
 * ツールバーで 太字 / 大見出し / 小見出し / 箇条書き / 区切り線 / 本文 を操作。
 * 値は HTML 文字列として onChange で親へ返す（非制御：初期値を一度だけ流し込む）。
 *
 * ツールバー操作で選択範囲が解除されないよう、選択範囲を保存して
 * コマンド実行前に復元する。
 */
export default function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);

  // 初期値を一度だけ流し込む（以後は contentEditable に任せ、カーソル飛びを防ぐ）。
  useEffect(() => {
    if (ref.current && !ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  // 現在の選択範囲（エディタ内のもの）を保存。
  function saveSelection() {
    const sel = window.getSelection();
    if (
      sel &&
      sel.rangeCount > 0 &&
      ref.current &&
      ref.current.contains(sel.anchorNode)
    ) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  }

  function exec(command: string, arg?: string) {
    const el = ref.current;
    if (!el) return;
    el.focus();
    // フォーカスで解除された選択範囲を復元してからコマンド実行。
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    document.execCommand(command, false, arg);
    saveSelection();
    emit();
  }

  const tools: { label: string; title: string; run: () => void }[] = [
    { label: "B", title: "太字", run: () => exec("bold") },
    { label: "見出し大", title: "大見出し", run: () => exec("formatBlock", "h2") },
    { label: "見出し小", title: "小見出し", run: () => exec("formatBlock", "h3") },
    { label: "本文", title: "本文（標準）", run: () => exec("formatBlock", "p") },
    { label: "・リスト", title: "箇条書き", run: () => exec("insertUnorderedList") },
    { label: "― 区切り線", title: "区切り線", run: () => exec("insertHorizontalRule") },
  ];

  return (
    <div className="rounded-xl border border-line bg-paper">
      <div className="flex flex-wrap items-center gap-1 border-b border-line p-1.5">
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.title}
            // mousedown で preventDefault → フォーカス移動を防ぎ、保存した選択範囲を保つ
            onMouseDown={(e) => {
              e.preventDefault();
              t.run();
            }}
            className={
              "rounded-md px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:bg-ink/[0.06]" +
              (t.label === "B" ? " font-bold" : "")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        data-placeholder="ここに募集本文を入力（ツールバーで見出し・太字・区切り線などを設定できます）"
        className="rich-editor min-h-[220px] w-full resize-y overflow-auto px-4 py-3 text-sm leading-relaxed outline-none [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold [&_hr]:my-4 [&_hr]:border-line [&_li]:ml-1 [&_p]:my-2 [&_strong]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
      />
    </div>
  );
}
