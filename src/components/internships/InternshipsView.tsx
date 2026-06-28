"use client";

import { Fragment, type ComponentProps } from "react";
import PageHeader from "@/components/PageHeader";
import InternshipsBrowser from "@/components/internships/InternshipsBrowser";
import JoinCtaButton from "@/components/JoinCtaButton";
import { Container, Section, Button, Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { site } from "@/data/site";
import { usePages } from "@/i18n/pages";

type BrowserProps = ComponentProps<typeof InternshipsBrowser>;

function Lines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {l}
        </Fragment>
      ))}
    </>
  );
}

export default function InternshipsView({ items, categories }: BrowserProps) {
  const t = usePages();
  const h = t.headers.internships;
  const c = t.internshipsCta;

  return (
    <>
      <PageHeader eyebrow={h.eyebrow} title={h.title} lead={h.lead} />

      <Section tone="light" topPad={false}>
        <Container>
          <InternshipsBrowser items={items} categories={categories} />
        </Container>
      </Section>

      {/* CTA band */}
      <Section tone="dark">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow className="text-mute-dark">{c.forStudents}</Eyebrow>
              <Reveal>
                <h2 className="mt-6 font-jp text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                  <Lines lines={c.studentsHeading} />
                </h2>
              </Reveal>
              <p className="mt-6 max-w-md leading-relaxed text-mute-dark">
                {c.studentsBody}
              </p>
              <div className="mt-8">
                <JoinCtaButton
                  variant="inverse"
                  size="lg"
                  loggedOutLabel={c.studentsCta}
                />
              </div>
            </div>

            <div className="lg:border-l lg:border-line-dark lg:pl-12">
              <Eyebrow className="text-mute-dark">{c.forCompanies}</Eyebrow>
              <Reveal>
                <h2 className="mt-6 font-jp text-3xl font-bold tracking-tight text-paper sm:text-4xl">
                  <Lines lines={c.companiesHeading} />
                </h2>
              </Reveal>
              <p className="mt-6 max-w-md leading-relaxed text-mute-dark">
                {c.companiesBody}
              </p>
              <div className="mt-8">
                <Button
                  href={`mailto:${site.email}`}
                  variant="outline-invert"
                  size="lg"
                >
                  {c.companiesCta}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
