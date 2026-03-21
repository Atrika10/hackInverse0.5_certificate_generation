"use client";

import { useEffect, useRef, useState } from "react";
import { drawCertificate, type CertificateData } from "@/lib/certificate";

interface Props {
  data: CertificateData;
}

export default function CertificateCanvas({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCertificate(canvas, data);
    setIsReady(true);
  }, [data]);

  function getSafeFilename(name: string) {
    return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  }

  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDownloadingPng(true);
    try {
      const link = document.createElement("a");
      link.download = `HackInverse_${getSafeFilename(data.participantName)}_certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setTimeout(() => setIsDownloadingPng(false), 800);
    }
  }

  async function downloadPDF() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDownloadingPdf(true);
    try {
      const jsPDF = (await import("jspdf")).default;
      const imgData = canvas.toDataURL("image/png");
      // A4 landscape: 297 x 210 mm
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pageW, pageH);
      pdf.save(`HackInverse_${getSafeFilename(data.participantName)}_certificate.pdf`);
    } finally {
      setTimeout(() => setIsDownloadingPdf(false), 800);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Canvas preview */}
      <div className="w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-pink-500/10">
        <canvas
          ref={canvasRef}
          className="w-full h-auto block"
          aria-label={`Certificate for ${data.participantName}`}
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-white/50 text-sm">Generating…</span>
          </div>
        )}
      </div>

      {/* Download buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={downloadPNG}
          disabled={!isReady || isDownloadingPng}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
            bg-linear-to-r from-pink-600 to-pink-500
            hover:from-pink-500 hover:to-pink-400
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95 transition-all duration-150 text-white shadow-lg shadow-pink-500/20 cursor-pointer"
        >
          <DownloadIcon />
          {isDownloadingPng ? "Downloading…" : "Download PNG"}
        </button>

        <button
          onClick={downloadPDF}
          disabled={!isReady || isDownloadingPdf}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
            bg-linear-to-r from-cyan-600 to-cyan-500
            hover:from-cyan-500 hover:to-cyan-400
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-95 transition-all duration-150 text-white shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <DownloadIcon />
          {isDownloadingPdf ? "Downloading…" : "Download PDF"}
        </button>
      </div>

      <p className="text-xs text-white/25 text-center max-w-sm">
        This certificate is generated for <span className="text-white/40">{data.participantName}</span> from team{" "}
        <span className="text-white/40">{data.teamName}</span>.
      </p>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15" height="15"
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
