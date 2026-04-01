import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  findTeamByName,
  isMemberOfTeam,
  isTopRankedTeam,
  decodeSegment,
  encodeSegment,
} from "@/lib/teams";
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

const winStyles = {
  fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif",
  fontSize: "11px",
} as const;

export default async function CertificatePage({ params }: Props) {
  const { teamName, memberName } = await params;
  const decodedTeam = decodeSegment(teamName);
  const decodedMember = decodeSegment(memberName);

  const team = findTeamByName(decodedTeam);

  if (!team) notFound();

  // Top-ranked teams get certs via email
  if (isTopRankedTeam(team)) {
    return (
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#008080",
          ...winStyles,
        }}
      >
        {/* Dialog window */}
        <div
          style={{
            background: "#d4d0c8",
            borderTop: "2px solid #fff",
            borderLeft: "2px solid #fff",
            borderRight: "2px solid #404040",
            borderBottom: "2px solid #404040",
            outline: "1px solid #808080",
            maxWidth: "380px",
            width: "100%",
          }}
        >
          {/* Titlebar */}
          <div
            style={{
              background: "linear-gradient(to right, #000080, #1084d0)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "11px",
              padding: "3px 4px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <TrophyDialogIcon />
            <span>Certificate Information</span>
          </div>

          {/* Content */}
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <TrophyBigIcon />
              <div>
                <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Certificate sent via email</div>
                <div style={{ lineHeight: "1.6", color: "#000" }}>
                  Team <strong style={{ color: "#000080" }}>{team.name}</strong> finished in{" "}
                  <strong style={{ color: "#000080" }}>#{team.rank} place</strong>. Certificates for
                  top teams are sent individually to each member&apos;s registered email.
                </div>
                <div style={{ marginTop: "8px", color: "#000" }}>
                  Please check your inbox.
                </div>
              </div>
            </div>

            {/* Horizontal rule */}
            <div
              style={{
                borderTop: "1px solid #808080",
                borderBottom: "1px solid #fff",
              }}
            />

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    background: "#d4d0c8",
                    borderTop: "2px solid #fff",
                    borderLeft: "2px solid #fff",
                    borderRight: "2px solid #808080",
                    borderBottom: "2px solid #808080",
                    fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif",
                    fontSize: "11px",
                    padding: "4px 24px",
                    cursor: "pointer",
                    minWidth: "80px",
                    color: "#000",
                  }}
                >
                  OK
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isMemberOfTeam(team, decodedMember)) notFound();

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
    <main
      style={{
        flex: 1,
        padding: "16px",
        background: "#008080",
        ...winStyles,
        minHeight: "calc(100vh - 80px)",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>

        {/* Explorer-style address bar / breadcrumb */}
        <div
          style={{
            background: "#d4d0c8",
            borderTop: "2px solid #fff",
            borderLeft: "2px solid #fff",
            borderRight: "2px solid #404040",
            borderBottom: "2px solid #404040",
            outline: "1px solid #808080",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 8px",
          }}
        >
          <Link
            href={`/team/${encodeSegment(team.name)}`}
            style={{
              textDecoration: "none",
              color: "#000080",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <BackArrowIcon />
            Back to {team.name}
          </Link>
          <span style={{ color: "#808080" }}>|</span>
          <span style={{ color: "#000" }}>
            Certificates &gt; {team.name} &gt; {canonicalMember}
          </span>
        </div>

        {/* Main window */}
        <div
          style={{
            background: "#d4d0c8",
            borderTop: "2px solid #fff",
            borderLeft: "2px solid #fff",
            borderRight: "2px solid #404040",
            borderBottom: "2px solid #404040",
            outline: "1px solid #808080",
          }}
        >
          {/* Titlebar */}
          <div
            style={{
              background: "linear-gradient(to right, #000080, #1084d0)",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "11px",
              padding: "3px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <CertSmallIcon />
              <span>
                {canonicalMember} — HackInverse Certificate Portal
              </span>
            </div>
            <div style={{ display: "flex", gap: "2px" }}>
              <TitleBtn label="─" />
              <TitleBtn label="□" />
              <TitleBtn label="✕" />
            </div>
          </div>

          {/* Menu bar inside window */}
          <div
            style={{
              background: "#d4d0c8",
              borderBottom: "1px solid #a0998c",
              padding: "2px 4px",
              display: "flex",
              gap: "0px",
            }}
          >
            {["File", "Edit", "View", "Help"].map((item) => (
              <span
                key={item}
                style={{
                  padding: "2px 8px",
                  fontSize: "11px",
                  cursor: "default",
                  color: "#000",
                }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* Body: sidebar + content */}
          <div style={{ display: "flex", gap: "0" }}>
            {/* Left sidebar */}
            <div
              style={{
                width: "160px",
                flexShrink: 0,
                background: "#d4d0c8",
                borderRight: "2px solid #808080",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Info panel */}
              <div>
                <div
                  style={{
                    background: "linear-gradient(to right, #000080, #1084d0)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                    padding: "2px 6px",
                    marginBottom: "6px",
                  }}
                >
                  Certificate Details
                </div>
                <div
                  style={{
                    borderTop: "1px solid #808080",
                    borderLeft: "1px solid #808080",
                    borderRight: "1px solid #fff",
                    borderBottom: "1px solid #fff",
                    background: "#fff",
                    padding: "6px",
                    fontSize: "11px",
                    lineHeight: "1.8",
                  }}
                >
                  <div>
                    <span style={{ color: "#808080" }}>Name:</span>
                    <br />
                    <strong>{canonicalMember}</strong>
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    <span style={{ color: "#808080" }}>Team:</span>
                    <br />
                    <strong>{team.name}</strong>
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    <span style={{ color: "#808080" }}>Event:</span>
                    <br />
                    <strong>HackInverse 0.5</strong>
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    <span style={{ color: "#808080" }}>Date:</span>
                    <br />
                    <strong>{EVENT_DATE}</strong>
                  </div>
                </div>
              </div>

              {/* Tasks panel */}
              <div>
                <div
                  style={{
                    background: "linear-gradient(to right, #000080, #1084d0)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                    padding: "2px 6px",
                    marginBottom: "6px",
                  }}
                >
                  File and Folder Tasks
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <SidebarLink label="Save as PNG" />
                  <SidebarLink label="Save as PDF" />
                  <SidebarLink label="Share certificate" />
                </div>
              </div>
            </div>

            {/* Main content */}
            <div
              style={{
                flex: 1,
                padding: "12px",
                background: "#fff",
                borderTop: "2px solid #808080",
                borderLeft: "2px solid #808080",
                borderRight: "2px solid #fff",
                borderBottom: "2px solid #fff",
                margin: "6px",
                overflow: "hidden",
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #d4d0c8",
                }}
              >
                <CertBigIcon />
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                    {canonicalMember}
                  </div>
                  <div style={{ color: "#808080", fontSize: "11px" }}>
                    Participation Certificate &bull; Team: {team.name}
                  </div>
                </div>
              </div>

              <CertificateCanvas data={certData} />
            </div>
          </div>

          {/* Status bar */}
          <div
            style={{
              background: "#d4d0c8",
              borderTop: "1px solid #808080",
              padding: "2px 8px",
              display: "flex",
              gap: "8px",
              fontSize: "11px",
            }}
          >
            <StatusCell text="1 object(s)" flex={1} />
            <StatusCell text="Certificate — PNG/PDF" />
            <StatusCell text="HackInverse 0.5" />
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function TitleBtn({ label }: { label: string }) {
  return (
    <div
      style={{
        width: "16px",
        height: "14px",
        background: "#d4d0c8",
        borderTop: "1px solid #fff",
        borderLeft: "1px solid #fff",
        borderRight: "1px solid #404040",
        borderBottom: "1px solid #404040",
        fontSize: "9px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        fontWeight: "bold",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  );
}

function StatusCell({ text, flex }: { text: string; flex?: number }) {
  return (
    <div
      style={{
        flex: flex ?? undefined,
        borderTop: "1px solid #808080",
        borderLeft: "1px solid #808080",
        borderRight: "1px solid #fff",
        borderBottom: "1px solid #fff",
        padding: "1px 6px",
        fontSize: "11px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
}

function SidebarLink({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: "11px",
        color: "#000080",
        textDecoration: "underline",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "1px 4px",
      }}
    >
      <span style={{ fontSize: "10px" }}>»</span>
      {label}
    </div>
  );
}

function BackArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8 2L4 6L8 10" stroke="#000080" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CertSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1" width="12" height="14" fill="#fff" stroke="#c8c8c8" strokeWidth="1" />
      <rect x="4" y="4" width="8" height="1" fill="#000080" />
      <rect x="4" y="6" width="8" height="1" fill="#000080" />
      <rect x="4" y="8" width="5" height="1" fill="#000080" />
      <circle cx="8" cy="12" r="2" fill="#ffd700" stroke="#c8a000" strokeWidth="0.5" />
    </svg>
  );
}

function CertBigIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="2" width="24" height="28" fill="#fff" stroke="#c8c8c8" strokeWidth="1" />
      <rect x="6" y="5" width="14" height="2" fill="#000080" />
      <rect x="6" y="9" width="20" height="1.5" fill="#d0d0d0" />
      <rect x="6" y="12" width="20" height="1.5" fill="#d0d0d0" />
      <rect x="6" y="15" width="14" height="1.5" fill="#d0d0d0" />
      <circle cx="16" cy="24" r="5" fill="#ffd700" stroke="#c8a000" strokeWidth="1" />
      <text x="16" y="27.5" textAnchor="middle" fontSize="7" fill="#c8a000" fontWeight="bold">★</text>
    </svg>
  );
}

function TrophyDialogIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M4 2h8l-1 6H5L4 2z" fill="#ffd700" stroke="#c8a000" strokeWidth="0.5" />
      <rect x="7" y="8" width="2" height="3" fill="#c8a000" />
      <rect x="5" y="11" width="6" height="2" fill="#c8a000" />
    </svg>
  );
}

function TrophyBigIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
      <path d="M12 6h24l-3 18H15L12 6z" fill="#ffd700" stroke="#c8a000" strokeWidth="1" />
      <rect x="22" y="24" width="4" height="8" fill="#c8a000" />
      <rect x="16" y="32" width="16" height="4" fill="#c8a000" />
      <path d="M6 8h6l2 10H6V8z" fill="#ffd700" stroke="#c8a000" strokeWidth="1" />
      <path d="M42 8h-6l-2 10h8V8z" fill="#ffd700" stroke="#c8a000" strokeWidth="1" />
    </svg>
  );
}
