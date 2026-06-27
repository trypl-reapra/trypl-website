import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-paper px-page text-center text-ink">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />
      <div className="relative">
        <LogoMark className="mx-auto h-12 w-12 text-ink" />
        <p className="mt-8 font-display text-7xl font-bold tracking-tight sm:text-8xl">
          404
        </p>
        <p className="mt-4 text-mute">
          お探しのページは見つかりませんでした。
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/" size="lg">
            ホームへ戻る
          </Button>
          <Button href="/internships" variant="outline" size="lg">
            募集を見る
          </Button>
        </div>
      </div>
    </section>
  );
}
