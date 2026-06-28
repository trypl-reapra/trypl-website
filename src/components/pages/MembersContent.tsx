"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Container, Section } from "@/components/ui";
import MemberLogout from "@/components/members/MemberLogout";
import { events } from "@/data/site";
import { usePages } from "@/i18n/pages";

export default function MembersContent({
  isAdmin,
  viaOAuth,
  name,
  email,
}: {
  isAdmin: boolean;
  viaOAuth: boolean;
  name: string | null;
  email: string | null;
}) {
  const t = usePages();
  const m = t.members;
  const who = name || email;

  return (
    <>
      <PageHeader
        eyebrow={t.headers.members.eyebrow}
        title={t.headers.members.title}
        lead={t.headers.members.lead}
      />
      <Section tone="light" topPad={false}>
        <Container>
          {who && (
            <p className="mb-10 text-sm text-mute">
              {m.welcome}
              <span className="font-medium text-ink">{who}</span>
              {m.welcomeSuffix}
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href="/internships"
              className="rounded-2xl border border-line p-7 transition-colors hover:border-ink"
            >
              <h3 className="font-jp text-xl font-bold">{m.internships}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">
                {m.internshipsSub}
              </p>
            </Link>
            <a
              href={events.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-line p-7 transition-colors hover:border-ink"
            >
              <h3 className="font-jp text-xl font-bold">{m.events}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">
                {m.eventsSub}
              </p>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-ink-soft"
              >
                {m.toAdmin}
              </Link>
            )}
            <MemberLogout viaOAuth={viaOAuth} label={m.logout} />
          </div>
        </Container>
      </Section>
    </>
  );
}
