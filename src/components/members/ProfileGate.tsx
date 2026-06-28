"use client";

import { Container, Section } from "@/components/ui";
import MembershipCard from "@/components/members/MembershipCard";
import MemberProfileForm from "@/components/members/MemberProfileForm";
import MemberLogout from "@/components/members/MemberLogout";
import { usePages } from "@/i18n/pages";
import type { MemberProfile } from "@/lib/profile";

export default function ProfileGate({
  name,
  email,
  image,
  memberId,
  memberSince,
  profile,
}: {
  name: string | null;
  email: string | null;
  image: string | null;
  memberId: string | null;
  memberSince: string | null;
  profile: MemberProfile | null;
}) {
  const t = usePages();
  const mp = t.memberProfile;
  return (
    <Section tone="light">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-mute">Welcome to TrypL</span>
          <h1 className="mt-5 font-jp text-[clamp(1.7rem,4.5vw,2.6rem)] font-bold tracking-[-0.02em]">
            {mp.registerTitle}
          </h1>
          <p className="mt-4 leading-relaxed text-mute">{mp.registerLead}</p>
        </div>

        <div className="mx-auto mt-12 flex max-w-md justify-center">
          <MembershipCard
            variant="unregistered"
            name={name}
            email={email}
            image={image}
            memberId={memberId}
            memberSince={memberSince}
            unregisteredLabel={mp.unregistered}
          />
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          <MemberProfileForm
            email={email ?? ""}
            profile={profile}
            defaultName={name ?? ""}
          />
          <div className="mt-8 flex justify-center">
            <MemberLogout label={t.members.logout} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
