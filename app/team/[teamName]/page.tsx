import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { findTeamByName, isTopRankedTeam, decodeSegment, encodeSegment } from "@/lib/teams";

interface Props {
  params: Promise<{ teamName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { teamName } = await params;
  const name = decodeSegment(teamName);
  return {
    title: `${name} — HackInverse Certificates`,
    description: `Download participation certificates for team ${name}.`,
  };
}

export default async function TeamPage({ params }: Props) {
  const { teamName } = await params;
  const decodedName = decodeSegment(teamName);
  const team = findTeamByName(decodedName);

  if (!team) {
    notFound();
  }

  const isWinner = isTopRankedTeam(team);

  return (
    <main className="flex-1 px-6 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors mb-10"
        >
          <ArrowLeftIcon />
          Back to search
        </Link>

        {/* Team card */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-8 mb-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Team</p>
              <h1 className="text-3xl font-bold text-white">{team.name}</h1>
            </div>
            {isWinner && (
              <span className="shrink-0 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/40 bg-amber-500/10 text-amber-400 uppercase tracking-wider">
                #{team.rank} Place
              </span>
            )}
          </div>

          {/* Winner notice */}
          {isWinner ? (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-amber-300/80 leading-relaxed">
              <p className="font-semibold text-amber-400 mb-1">
                Congratulations on your achievement!
              </p>
              Your team finished in <strong>#{team.rank} place</strong>. As a top-ranked team,
              your certificates have been sent individually to each member&apos;s registered email address.
              Please check your inbox (and spam folder).
            </div>
          ) : (
            <p className="text-white/40 text-sm mb-6">
              Select your name below to generate and download your participation certificate.
            </p>
          )}
        </div>

        {/* Members list */}
        {!isWinner && (
          <div>
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
              Team Members &mdash; {team.members.length}
            </h2>
            <ul className="flex flex-col gap-3">
              {team.members.map((member) => (
                <li key={member}>
                  <Link
                    href={`/certificate/${encodeSegment(team.name)}/${encodeSegment(member)}`}
                    className="group flex items-center justify-between w-full rounded-xl border border-white/8
                      bg-white/2 hover:bg-white/5 hover:border-pink-500/30
                      px-5 py-4 transition-all duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center
                        bg-linear-to-br from-pink-500/20 to-cyan-500/20 border border-white/10
                        text-sm font-semibold text-white/60 group-hover:text-white/80 transition-colors">
                        {member[0].toUpperCase()}
                      </span>
                      <span className="text-white/70 group-hover:text-white transition-colors font-medium">
                        {member}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-white/25 group-hover:text-pink-400 transition-colors">
                      Get certificate
                      <ChevronRightIcon />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
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

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
