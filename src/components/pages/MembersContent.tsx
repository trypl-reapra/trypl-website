"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Container, Section } from "@/components/ui";
import MemberLogout from "@/components/members/MemberLogout";
import MembershipCard from "@/components/members/MembershipCard";
import DeleteAccountButton from "@/components/members/DeleteAccountButton";
import { events } from "@/data/site";
import { usePages } from "@/i18n/pages";

export default function MembersContent({
  name,
  email,
  image,
  memberId,
  memberSince,
}: {
  name: string | null;
  email: string | null;
  image: string | null;
  memberId: string | null;
  memberSince: string | null;
}) {
  const t = usePages();
  const m = t.members;

  return (
    <>
      <PageHeader
        eyebrow={t.headers.members.eyebrow}
        title={t.headers.members.title}
        lead={t.headers.members.lead}
      />
      <Section tone="light" topPad={false}>
        <Container>
          {/* 会員証 */}
          <div className="mb-14 flex flex-col items-center text-center">
            <p className="eyebrow mb-5 text-mute">{m.cardHeading}</p>
            <MembershipCard
              name={name}
              email={email}
              image={image}
              memberId={memberId}
              memberSince={memberSince}
            />
          </div>

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
            <MemberLogout label={m.logout} />
          </div>

          {/* 退会 */}
          <div className="mt-16 border-t border-line pt-8">
            <DeleteAccountButton />
          </div>
        </Container>
      </Section>
    </>
  );
}
