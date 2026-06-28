"use client";

import PageHeader from "@/components/PageHeader";
import { Container, Section, Button, Eyebrow } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import { usePages } from "@/i18n/pages";

export default function JoinContent() {
  const t = usePages();
  const j = t.join;
  const line = socials.find((s) => s.key === "line");
  const slack = socials.find((s) => s.key === "slack");

  return (
    <>
      <PageHeader
        eyebrow={t.headers.join.eyebrow}
        title={t.headers.join.title}
        lead={t.headers.join.lead}
      />

      {/* steps */}
      <Section tone="light" topPad={false}>
        <Container>
          <Eyebrow>{j.howEyebrow}</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
              {j.howHeading}
            </h2>
          </Reveal>

          <Stagger className="mt-12">
            <ol>
              {j.steps.map((s, i) => (
                <StaggerItem key={s.title}>
                  <li className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-line py-7 sm:gap-10 sm:py-8">
                    <span className="font-display text-2xl tabular-nums text-mute sm:text-3xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-jp text-xl font-bold sm:text-2xl">
                        {s.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-mute">{s.body}</p>
                    </div>
                  </li>
                </StaggerItem>
              ))}
            </ol>
          </Stagger>
        </Container>
      </Section>

      {/* entry CTA */}
      <Section tone="dark">
        <Container>
          <div className="rounded-3xl border border-line-dark p-8 sm:p-12">
            <Eyebrow className="text-mute-dark">{j.getStartedEyebrow}</Eyebrow>
            <h2 className="mt-6 font-jp text-3xl font-bold tracking-tight text-paper sm:text-4xl">
              {j.getStartedHeading}
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-mute-dark">
              {j.getStartedBody}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/members" variant="inverse" size="lg">
                {t.memberAuth.title}
              </Button>
              <Button href="/internships" variant="outline-invert" size="lg">
                {j.seeInternships}
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-mute-dark">
              <span>
                {j.lineLabel}
                {line?.available ? (
                  <a
                    href={line.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-paper-dim"
                  >
                    {j.lineAction}
                  </a>
                ) : (
                  <span className="text-paper-dim/50">{j.prep}</span>
                )}
              </span>
              <span>
                {j.slackLabel}
                {slack?.available ? (
                  <a
                    href={slack.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-paper-dim"
                  >
                    {j.slackAction}
                  </a>
                ) : (
                  <span className="text-paper-dim/50">{j.prep}</span>
                )}
              </span>
              <span>
                {j.contactLabel}
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline text-paper-dim"
                >
                  {site.email}
                </a>
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="light">
        <Container>
          <Eyebrow>{j.faqEyebrow}</Eyebrow>
          <Reveal>
            <h2 className="mt-7 font-jp text-[clamp(1.8rem,4.5vw,3rem)] font-bold tracking-[-0.02em]">
              {j.faqHeading}
            </h2>
          </Reveal>
          <div className="mt-10 max-w-3xl">
            {j.faqs.map((f) => (
              <details
                key={f.q}
                className="group border-t border-line py-5 last:border-b"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                  <span className="font-medium">{f.q}</span>
                  <span className="relative h-4 w-4 shrink-0 text-mute">
                    <span className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-300 group-open:rotate-90 group-open:scale-0" />
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-mute">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
