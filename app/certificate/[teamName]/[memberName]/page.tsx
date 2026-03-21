import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { findTeamByName, isMemberOfTeam, isTopRankedTeam, decodeSegment, encodeSegment } from "@/lib/teams";
import CertificateCanvas from "@/components/CertificateCanvas";

const EVENT_DATE = "March 21, 2026";
const EVENT_NAME = "HackInverse Hackathon";

interface Props {
  params: Promise<{ teamName: string; memberName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { teamName, memberName } = await params;
  const name = decodeSegment(memberName);
  const team = decodeSegment(teamName);
  return {
    title: `${name}'s Certificate — HackInverse`,
    description: `Download ${name}'s participation certificate from team ${team} at HackInverse Hackathon.`,
  };
}

export default async function CertificatePage({ params }: Props) {
  const { teamName, memberName } = await params;
  const decodedTeam = decodeSegment(teamName);
  const decodedMember = decodeSegment(memberName);

  const team = findTeamByName(decodedTeam);

  // Team not found
  if (!team) {
    notFound();
  }

  // Top-ranked teams get certs via email, block direct URL access
  if (isTopRankedTeam(team)) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center
            bg-amber-500/10 border border-amber-500/20 text-2xl">
            🏆
          </div>
          <h1 className="text-xl font-bold text-white mb-3">Certificate sent via email</h1>
          <p className="text-white/45 text-sm leading-relaxed mb-8">
            Team <span className="text-amber-400 font-medium">{team.name}</span> finished in{" "}
            <strong className="text-amber-400">#{team.rank} place</strong>. Certificates for top teams
            are sent individually to each member&apos;s registered email. Please check your inbox.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
              border border-white/10 text-white/60 hover:text-white hover:border-white/20
              transition-all duration-150"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // Member not registered under this team
  if (!isMemberOfTeam(team, decodedMember)) {
    notFound();
  }

  // Find the canonical member name (preserving correct casing from data)
  const canonicalMember =
    team.members.find(
      (m) => m.toLowerCase().trim() === decodedMember.toLowerCase().trim()
    ) ?? decodedMember;

  const certData = {
    participantName: canonicalMember,
    teamName: team.name,
    eventName: EVENT_NAME,
    eventDate: EVENT_DATE,
  };

  return (
    <main className="flex-1 px-6 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href={`/team/${encodeSegment(team.name)}`}
          className="inline-flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors mb-10"
        >
          <ArrowLeftIcon />
          Back to {team.name}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Certificate ready</p>
          <h1 className="text-2xl font-bold text-white">
            {canonicalMember}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Team: <span className="text-white/60">{team.name}</span>
          </p>
        </div>

        {/* Certificate canvas + download buttons */}
        <CertificateCanvas data={certData} />
      </div>
    </main>
  );
}

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
