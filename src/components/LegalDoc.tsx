import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type P<T extends keyof React.JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>;

/** プライバシーポリシー等の長文 Markdown を、サイトのトーンで整形して表示。 */
export default function LegalDoc({ markdown }: { markdown: string }) {
  return (
    <div className="max-w-3xl text-[0.95rem]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: (p: P<"h2">) => (
            <h2
              className="mt-12 border-t border-line pt-8 font-jp text-xl font-bold tracking-tight text-ink first:mt-0 first:border-0 first:pt-0 sm:text-2xl"
              {...p}
            />
          ),
          h3: (p: P<"h3">) => (
            <h3 className="mt-8 font-jp text-base font-bold text-ink sm:text-lg" {...p} />
          ),
          p: (p: P<"p">) => (
            <p className="mt-4 leading-[1.95] text-ink/80" {...p} />
          ),
          ul: (p: P<"ul">) => (
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-ink/80" {...p} />
          ),
          ol: (p: P<"ol">) => (
            <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-ink/80" {...p} />
          ),
          li: (p: P<"li">) => <li className="leading-[1.85]" {...p} />,
          a: (p: P<"a">) => (
            <a
              className="link-underline break-all text-ink"
              target="_blank"
              rel="noopener noreferrer"
              {...p}
            />
          ),
          strong: (p: P<"strong">) => (
            <strong className="font-semibold text-ink" {...p} />
          ),
          hr: () => <hr className="mt-8 border-line" />,
          table: (p: P<"table">) => (
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-sm" {...p} />
            </div>
          ),
          thead: (p: P<"thead">) => (
            <thead className="bg-fog text-left" {...p} />
          ),
          th: (p: P<"th">) => (
            <th className="px-3 py-2 font-semibold text-ink" {...p} />
          ),
          td: (p: P<"td">) => (
            <td className="border-t border-line px-3 py-2 align-top text-ink/80" {...p} />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
