import Link from "next/link";
import Image from "next/image";
import {
  CATEGORIES,
  WORK_STYLE_LABEL,
  headerImageFor,
  type Internship,
} from "@/data/internships";
import { cn } from "@/lib/cn";

export default function InternshipCard({
  internship: i,
  className,
  onSelect,
}: {
  internship: Internship;
  className?: string;
  /** 指定時は遷移せずボタンとして振る舞う（ポップアップ展開用）。 */
  onSelect?: () => void;
}) {
  const classes = cn(
    "group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-paper p-7 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ink hover:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.5)] sm:p-8",
    className,
  );
  const inner = (
    <>
      {/* ホバー時に、この募集のヘッダー画像を背景として表示 */}
      <Image
        src={headerImageFor(i.slug)}
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="pointer-events-none scale-105 object-cover opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
      />
      {/* 文字を読めるようにする暗いスクリム（ホバー時のみ） */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/35 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative z-10 transition-colors duration-500 group-hover:text-paper">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full border border-line px-3 py-1 text-xs text-mute transition-colors duration-500 group-hover:border-paper/40 group-hover:text-paper/85">
            {CATEGORIES[i.category]}
          </span>
          {i.featured && (
            <span className="eyebrow text-[0.625rem] text-ink transition-colors duration-500 group-hover:text-paper">
              Featured
            </span>
          )}
        </div>

        <p className="mt-6 text-sm text-mute transition-colors duration-500 group-hover:text-paper/85">
          {i.company} · {i.companyTag}
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
          {i.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mute transition-colors duration-500 group-hover:text-paper/85">
          {i.summary}
        </p>
      </div>

      <div className="relative z-10 mt-7 transition-colors duration-500 group-hover:text-paper">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-mute transition-colors duration-500 group-hover:text-paper/80">
          <span>{i.location}</span>
          <span aria-hidden>·</span>
          <span>{WORK_STYLE_LABEL[i.workStyle]}</span>
          <span aria-hidden>·</span>
          <span>{i.commitment}</span>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-line pt-5 transition-colors duration-500 group-hover:border-paper/25">
          <span className="text-sm font-medium">詳細を見る</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={classes}>
        {inner}
      </button>
    );
  }
  return (
    <Link href={`/internships/${i.slug}`} className={classes}>
      {inner}
    </Link>
  );
}
