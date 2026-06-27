import Link from "next/link";
import {
  CATEGORIES,
  WORK_STYLE_LABEL,
  type Internship,
} from "@/data/internships";
import { cn } from "@/lib/cn";

export default function InternshipCard({
  internship: i,
  className,
}: {
  internship: Internship;
  className?: string;
}) {
  return (
    <Link
      href={`/internships/${i.slug}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-line bg-paper p-7 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ink hover:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.45)] sm:p-8",
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full border border-line px-3 py-1 text-xs text-mute">
            {CATEGORIES[i.category]}
          </span>
          {i.featured && (
            <span className="eyebrow text-[0.625rem] text-ink">Featured</span>
          )}
        </div>

        <p className="mt-6 text-sm text-mute">
          {i.company} · {i.companyTag}
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
          {i.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mute">
          {i.summary}
        </p>
      </div>

      <div className="mt-7">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-mute">
          <span>{i.location}</span>
          <span aria-hidden>·</span>
          <span>{WORK_STYLE_LABEL[i.workStyle]}</span>
          <span aria-hidden>·</span>
          <span>{i.commitment}</span>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
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
    </Link>
  );
}
