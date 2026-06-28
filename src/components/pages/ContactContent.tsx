"use client";

import PageHeader from "@/components/PageHeader";
import { Container, Section } from "@/components/ui";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/data/site";
import { usePages } from "@/i18n/pages";

export default function ContactContent() {
  const t = usePages();
  return (
    <>
      <PageHeader
        eyebrow={t.headers.contact.eyebrow}
        title={t.headers.contact.title}
        lead={t.headers.contact.lead}
      />

      <Section tone="light" topPad={false}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <h2 className="font-jp text-2xl font-bold tracking-tight">
                {t.contact.directHeading}
              </h2>
              <p className="mt-5 leading-relaxed text-mute">
                {t.contact.directBody}
              </p>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-6 inline-block font-medium"
              >
                {site.email}
              </a>
            </div>

            <div className="rounded-3xl border border-line bg-fog p-6 sm:p-9">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
