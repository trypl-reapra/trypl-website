import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Statement from "@/components/home/Statement";
import PhotoStrip from "@/components/home/PhotoStrip";
import Triple from "@/components/home/Triple";
import Why from "@/components/home/Why";
import Who from "@/components/home/Who";
import InternshipPreview from "@/components/home/InternshipPreview";
import Press from "@/components/home/Press";
import JoinCTA from "@/components/home/JoinCTA";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <PhotoStrip />
      <Triple />
      <Why />
      <Who />
      <InternshipPreview />
      <Press />
      <JoinCTA />
    </>
  );
}
