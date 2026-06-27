import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import InternshipsBrowser from "@/components/internships/InternshipsBrowser";
import { Container, Section, Button, Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion";
import {
  getAllInternships,
  getUsedCategories,
  type Internship,
} from "@/data/internships";
import { listPublicAdminInternships } from "@/lib/store";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "募集一覧",
  description:
    "REAPRA および投資先企業でのインターン募集要項。コミュニティ・事業開発・リサーチ・マーケティングなど、実践の現場を横断する機会を掲載しています。",
};

// 管理画面で追加した募集を反映するためリクエスト時に描画する。
export const dynamic = "force-dynamic";

export default async function InternshipsPage() {
  const adminItems = await listPublicAdminInternships();
  const mapped: Internship[] = adminItems.map((a) => ({
    slug: `admin-${a.id}`,
    company: a.company,
    companyTag: "管理画面で追加",
    title: a.title,
    category: "business",
    location: a.location || "—",
    workStyle: "remote",
    commitment: "—",
    duration: "—",
    compensation: a.compensation || "応相談",
    summary: a.summary || "",
    about: a.summary || "",
    responsibilities: [],
    requirements: [],
    welcome: [],
    tags: [],
    applyUrl: a.applyUrl || "#",
    applyLabel: "応募する",
    postedAt: a.createdAt.slice(0, 10),
    featured: false,
  }));
  const items = [...mapped, ...getAllInternships()].sort((x, y) =>
    y.postedAt.localeCompare(x.postedAt),
  );
  const categories = getUsedCategories();

  return (
    <>
      <PageHeader
        eyebrow="Internships · 募集一覧"
        title={["実践の、機会を。"]}
        lead="REAPRA および投資先企業での、選び抜かれたインターン。一つの現場に深く入り込むことも、半年単位で複数の現場を横断することもできます。"
        image="/internships-header.jpg"
      />

      <Section tone="light" topPad={false}>
        <Container>
          {/* notice */}
          <div className="mb-12 rounded-xl border border-line bg-fog px-5 py-4 text-sm leading-relaxed text-mute">
            「株式会社ジコウ」は実際に募集中のインターンです。それ以外は、REAPRA
            投資先企業を題材にした募集要項の例（サンプル）です。
          </div>

          <InternshipsBrowser items={items} categories={categories} />
        </Container>
      </Section>

      {/* CTA band */}
      <Section tone="dark">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow className="text-mute-dark">For students</Eyebrow>
              <Reveal>
                <h2 className="mt-6 font-jp text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                  気になる募集が、
                  <br />
                  見つからなくても。
                </h2>
              </Reveal>
              <p className="mt-6 max-w-md leading-relaxed text-mute-dark">
                まずはコミュニティに参加して、説明会や対話を通じて自分に合う実践機会を一緒に探せます。
              </p>
              <div className="mt-8">
                <Button href="/join" variant="inverse" size="lg">
                  TrypL に参加する
                </Button>
              </div>
            </div>

            <div className="lg:border-l lg:border-line-dark lg:pl-12">
              <Eyebrow className="text-mute-dark">For companies</Eyebrow>
              <Reveal>
                <h2 className="mt-6 font-jp text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                  募集を、
                  <br />
                  掲載しませんか。
                </h2>
              </Reveal>
              <p className="mt-6 max-w-md leading-relaxed text-mute-dark">
                REAPRA 投資先をはじめ、内発的動機を大切にする学生と出会いたい企業の方は、お気軽にご連絡ください。
              </p>
              <div className="mt-8">
                <Button
                  href={`mailto:${site.email}`}
                  variant="outline-invert"
                  size="lg"
                >
                  掲載について問い合わせる
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
