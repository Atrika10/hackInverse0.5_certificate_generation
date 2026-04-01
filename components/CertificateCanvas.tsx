"use client";

import { useEffect, useRef, useState } from "react";
import { drawCertificate, type CertificateData } from "@/lib/certificate";

interface Props {
  data: CertificateData;
}

export default function CertificateCanvas({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    setIsReady(false);

    drawCertificate(canvas, data).then(() => {
      if (!cancelled) setIsReady(true);
    });

    return () => { cancelled = true; };
  }, [data]);

  function getSafeFilename(name: string) {
    return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  }

  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDownloadingPng(true);
    const link = document.createElement("a");
    link.download = `HackInverse-0.5_${getSafeFilename(data.participantName)}_certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setTimeout(() => setIsDownloadingPng(false), 800);
  }

  async function downloadPDF() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDownloadingPdf(true);
    const jsPDF = (await import("jspdf")).default;
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, pageW, pageH);
    pdf.save(`HackInverse_${getSafeFilename(data.participantName)}_certificate.pdf`);
    setTimeout(() => setIsDownloadingPdf(false), 800);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif",
        fontSize: "11px",
      }}
    >
      {/* Canvas Window */}
      <div
        style={{
          width: "100%",
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
            padding: "3px 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CertIcon />
            <span>Certificate Preview — {data.participantName}</span>
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            <WinBtn label="─" />
            <WinBtn label="□" />
            <WinBtn label="✕" accent />
          </div>
        </div>

        {/* Canvas area */}
        <div
          ref={wrapperRef}
          style={{
            position: "relative",
            borderTop: "2px solid #808080",
            borderLeft: "2px solid #808080",
            borderRight: "2px solid #fff",
            borderBottom: "2px solid #fff",
            margin: "6px",
            background: "#fff",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "auto", display: "block" }}
          />

          {!isReady && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(212,208,200,0.85)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <HourglassIcon />
              <span style={{ fontSize: "11px", color: "#000" }}>
                Generating Certificate... Please wait.
              </span>
              {/* Win2000 progress bar */}
              <div
                style={{
                  width: "200px",
                  height: "16px",
                  borderTop: "2px solid #808080",
                  borderLeft: "2px solid #808080",
                  borderRight: "2px solid #fff",
                  borderBottom: "2px solid #fff",
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "60%",
                    background: "repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #1084d0 8px, #1084d0 16px)",
                    animation: "win-progress 1s linear infinite",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div
          style={{
            background: "#d4d0c8",
            borderTop: "1px solid #808080",
            fontSize: "11px",
            padding: "2px 8px",
            display: "flex",
            gap: "8px",
            color: "#000",
          }}
        >
          <StatusCell text={isReady ? "Done" : "Loading..."} flex={1} />
          <StatusCell text={`${data.teamName}`} />
          <StatusCell text="HackInverse 0.5" />
        </div>
      </div>

      {/* Buttons panel */}
      <div
        style={{
          width: "100%",
          background: "#d4d0c8",
          borderTop: "2px solid #fff",
          borderLeft: "2px solid #fff",
          borderRight: "2px solid #404040",
          borderBottom: "2px solid #404040",
          outline: "1px solid #808080",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <FolderIcon />
          <span style={{ fontWeight: "bold", fontSize: "11px" }}>Save Certificate As...</span>
        </div>

        {/* Horizontal divider */}
        <div
          style={{
            borderTop: "1px solid #808080",
            borderBottom: "1px solid #fff",
            margin: "0 0 4px 0",
          }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <DownloadButton
            onClick={downloadPNG}
            disabled={!isReady || isDownloadingPng}
            label={isDownloadingPng ? "Saving..." : "💾  Save as PNG"}
          />
          <DownloadButton
            onClick={downloadPDF}
            disabled={!isReady || isDownloadingPdf}
            label={isDownloadingPdf ? "Saving..." : "🖨️  Save as PDF"}
          />
        </div>

        {/* Info text */}
        <div
          style={{
            marginTop: "4px",
            padding: "6px 8px",
            borderTop: "1px solid #808080",
            borderLeft: "1px solid #808080",
            borderRight: "1px solid #fff",
            borderBottom: "1px solid #fff",
            background: "#fff",
            fontSize: "11px",
            color: "#000",
            lineHeight: "1.6",
          }}
        >
          <strong>Participant:</strong> {data.participantName} &nbsp;|&nbsp;
          <strong>Team:</strong> {data.teamName} &nbsp;|&nbsp;
          <strong>Event:</strong> {data.eventName}
        </div>
      </div>

      <style>{`
        @keyframes win-progress {
          from { background-position: 0 0; }
          to { background-position: 32px 0; }
        }
      `}</style>
    </div>
  );
}

function DownloadButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "#d4d0c8",
        color: disabled ? "#808080" : "#000",
        borderTop: disabled ? "2px solid #808080" : "2px solid #fff",
        borderLeft: disabled ? "2px solid #808080" : "2px solid #fff",
        borderRight: disabled ? "2px solid #fff" : "2px solid #808080",
        borderBottom: disabled ? "2px solid #fff" : "2px solid #808080",
        outlineOffset: "-1px",
        fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif",
        fontSize: "11px",
        padding: "4px 16px",
        cursor: disabled ? "default" : "pointer",
        minWidth: "100px",
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          const el = e.currentTarget;
          el.style.borderTop = "2px solid #808080";
          el.style.borderLeft = "2px solid #808080";
          el.style.borderRight = "2px solid #fff";
          el.style.borderBottom = "2px solid #fff";
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          const el = e.currentTarget;
          el.style.borderTop = "2px solid #fff";
          el.style.borderLeft = "2px solid #fff";
          el.style.borderRight = "2px solid #808080";
          el.style.borderBottom = "2px solid #808080";
        }
      }}
    >
      {label}
    </button>
  );
}

function WinBtn({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <div
      style={{
        width: "16px",
        height: "14px",
        background: accent ? "#d4d0c8" : "#d4d0c8",
        borderTop: "1px solid #fff",
        borderLeft: "1px solid #fff",
        borderRight: "1px solid #404040",
        borderBottom: "1px solid #404040",
        fontSize: "9px",
        lineHeight: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        fontWeight: "bold",
        cursor: "pointer",
        flexShrink: 0,
        fontFamily: "Marlett, 'Tahoma', Arial, sans-serif",
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

function CertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1" width="12" height="14" fill="#fff" stroke="#000080" strokeWidth="1" />
      <rect x="4" y="4" width="8" height="1" fill="#000080" />
      <rect x="4" y="6" width="8" height="1" fill="#000080" />
      <rect x="4" y="8" width="5" height="1" fill="#000080" />
      <circle cx="8" cy="12" r="2" fill="#ffd700" stroke="#c8a000" strokeWidth="0.5" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 4h5l1.5 2H15v8H1V4z" fill="#ffd700" stroke="#c8a000" strokeWidth="1" />
      <path d="M1 4h5l1-1.5H1V4z" fill="#e8c000" />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="8" y="4" width="16" height="2" fill="#000" />
      <rect x="8" y="26" width="16" height="2" fill="#000" />
      <path d="M9 6 L16 16 L9 26 L23 26 L16 16 L23 6 Z" fill="#c8c8c8" stroke="#000" strokeWidth="1" />
      <path d="M9 6 L23 6 L16 14 Z" fill="#ffd700" />
      <path d="M16 18 L20 26 L12 26 Z" fill="#ffd700" />
    </svg>
  );
}
