export interface CertificateData {
  participantName: string;
  teamName: string;
  eventName: string;
  eventDate: string;
}

const CERT_WIDTH = 1400;
const CERT_HEIGHT = 990;

export async function drawCertificate(
  canvas: HTMLCanvasElement,
  data: CertificateData
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = CERT_WIDTH;
  canvas.height = CERT_HEIGHT;

  // Load signature images (failures handled gracefully)
  const [abhirupResult, rupshaResult] = await Promise.allSettled([
    loadImage("/Abhirup_sign.svg"),
    loadImage("/Rupsha_Das.png"),
  ]);
  const abhirupImg = abhirupResult.status === "fulfilled" ? abhirupResult.value : null;
  const rupshaImg  = rupshaResult.status  === "fulfilled" ? rupshaResult.value  : null;

  // ── Background ────────────────────────────────────────────────────────────
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);

  // Circuit-board watermark (lower-right quadrant)
  drawCircuitBoard(ctx);

  // ── Borders ───────────────────────────────────────────────────────────────
  ctx.strokeStyle = "#cc0000";
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 15, CERT_WIDTH - 30, CERT_HEIGHT - 30);

  ctx.strokeStyle = "#880000";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 28, CERT_WIDTH - 56, CERT_HEIGHT - 56);

  // ── Magistics logo (top-left) ─────────────────────────────────────────────
  drawMagisticsLogo(ctx, 55, 42);

  // ── "HACKINVERSE 0.5" title ───────────────────────────────────────────────
  const titleY = 132;
  const titleStartX = 222;

  ctx.textAlign = "left";
  ctx.font = "bold 85px Impact, 'Arial Black', sans-serif";
  ctx.fillStyle = "#cc0000";
  ctx.shadowColor = "#ff3300";
  ctx.shadowBlur = 6;
  ctx.fillText("HACKINVERSE", titleStartX, titleY);
  const hackW = ctx.measureText("HACKINVERSE").width;
  ctx.shadowBlur = 0;

  ctx.font = "bold 75px Impact, 'Arial Black', sans-serif";
  ctx.fillStyle = "#c0c0c0";
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 3;
  ctx.fillText(" 0.5", titleStartX + hackW, titleY);
  const halfW = ctx.measureText(" 0.5").width;
  ctx.shadowBlur = 0;

  // Double underline beneath title
  const totalTitleW = hackW + halfW;
  ctx.strokeStyle = "#cc0000";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(titleStartX, titleY + 12);
  ctx.lineTo(titleStartX + totalTitleW, titleY + 12);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(titleStartX, titleY + 19);
  ctx.lineTo(titleStartX + totalTitleW, titleY + 19);
  ctx.stroke();

  // ── "Presents" ────────────────────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.font = "20px Georgia, serif";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fillText("Presents", CERT_WIDTH / 2, 192);

  // ── "CERTIFICATE OF PARTICIPATION" ────────────────────────────────────────
  ctx.font = "bold 42px 'Arial Black', Impact, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("CERTIFICATE OF PARTICIPATION", CERT_WIDTH / 2, 262);

  // ── "TO" ──────────────────────────────────────────────────────────────────
  ctx.font = "bold 22px Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("TO", CERT_WIDTH / 2, 318);

  // ── Participant name (large, centred on underline) ────────────────────────
  const nameFontSize = getFitFontSize(ctx, data.participantName, 870, 62, 28);
  ctx.font = `${nameFontSize}px Georgia, 'Times New Roman', serif`;
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillText(data.participantName, CERT_WIDTH / 2, 415);

  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(185, 430);
  ctx.lineTo(CERT_WIDTH - 185, 430);
  ctx.stroke();

  // ── "Of [team] has successfully participated…" ────────────────────────────
  ctx.font = "17px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.textAlign = "left";

  const bodyX = 78;
  const bodyY = 487;
  const ofPrefix = "Of  ";
  const ofSuffix = "  has successfully participated in HackInverse 0.5";

  ctx.fillText(ofPrefix, bodyX, bodyY);
  const prefixW = ctx.measureText(ofPrefix).width;

  ctx.fillText(data.teamName, bodyX + prefixW, bodyY);
  const teamNameW = ctx.measureText(data.teamName).width;

  // Underline team name
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bodyX + prefixW, bodyY + 3);
  ctx.lineTo(bodyX + prefixW + teamNameW, bodyY + 3);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(ofSuffix, bodyX + prefixW + teamNameW, bodyY);

  // ── Paragraph body ────────────────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.font = "16px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.fillText(
    "bringing together innovators, developers, and problem-solvers to build impactful technology",
    CERT_WIDTH / 2, 530
  );
  ctx.fillText(
    "solutions. Your enthusiasm, creativity, and commitment to innovation are truly appreciated. We",
    CERT_WIDTH / 2, 558
  );
  ctx.fillText(
    "commend your dedication and active involvement throughout the event.",
    CERT_WIDTH / 2, 586
  );
  ctx.fillText("We wish you continued success in your future endeavors.", CERT_WIDTH / 2, 614);

  // ── Signatures ────────────────────────────────────────────────────────────
  const sigLineY  = 790;
  const leftSigX  = 325;
  const rightSigX = 1075;
  const sigW = 170;
  const sigH = 130;

  if (abhirupImg) {
    const processed = processSignatureForDark(abhirupImg, sigW, sigH);
    ctx.drawImage(processed, leftSigX - sigW / 2, sigLineY - sigH - 5, sigW, sigH);
  }
  if (rupshaImg) {
    const processed = processSignatureForDark(rupshaImg, sigW, sigH);
    ctx.drawImage(processed, rightSigX - sigW / 2, sigLineY - sigH - 5, sigW, sigH);
  }

  // Signature lines
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1;
  for (const sx of [leftSigX, rightSigX]) {
    ctx.beginPath();
    ctx.moveTo(sx - 145, sigLineY);
    ctx.lineTo(sx + 145, sigLineY);
    ctx.stroke();
  }

  // Names & titles
  ctx.textAlign = "center";
  ctx.font = "15px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fillText("Abhirup Datta Khan", leftSigX, sigLineY + 26);
  ctx.font = "bold 15px Arial, sans-serif";
  ctx.fillText("Head Organizer", leftSigX, sigLineY + 48);

  ctx.font = "15px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fillText("Rupsha Das", rightSigX, sigLineY + 26);
  ctx.font = "bold 15px Arial, sans-serif";
  ctx.fillText("Co-Organizer", rightSigX, sigLineY + 48);

  // ── Certificate ID ────────────────────────────────────────────────────────
  const certId = generateCertId(data.participantName, data.teamName);
  ctx.font = "11px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.textAlign = "center";
  ctx.fillText(`Certificate ID: ${certId}`, CERT_WIDTH / 2, CERT_HEIGHT - 42);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

/**
 * Renders the signature image onto an off-screen canvas, converting the
 * black ink to white (transparent background) so it reads on a dark cert.
 */
function processSignatureForDark(
  img: HTMLImageElement,
  w: number,
  h: number
): HTMLCanvasElement {
  const off = document.createElement("canvas");
  off.width  = w;
  off.height = h;
  const offCtx = off.getContext("2d")!;
  offCtx.drawImage(img, 0, 0, w, h);

  try {
    const imageData = offCtx.getImageData(0, 0, w, h);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const brightness = (d[i] + d[i + 1] + d[i + 2]) / 3;
      if (brightness > 190) {
        d[i + 3] = 0; // near-white background → transparent
      } else {
        // dark ink → white
        const strength = 1 - brightness / 190;
        d[i]     = 255;
        d[i + 1] = 255;
        d[i + 2] = 255;
        d[i + 3] = Math.round(strength * 230);
      }
    }
    offCtx.putImageData(imageData, 0, 0);
  } catch {
    // CORS fallback: invert colours (white bg→black blends into dark cert)
    offCtx.clearRect(0, 0, w, h);
    offCtx.filter = "invert(1)";
    offCtx.drawImage(img, 0, 0, w, h);
    offCtx.filter = "none";
  }

  return off;
}

/** Draws a subtle circuit-board trace pattern as a dark watermark. */
function drawCircuitBoard(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  const a = 0.12; // alpha
  ctx.strokeStyle = `rgba(180,20,20,${a})`;
  ctx.fillStyle   = `rgba(180,20,20,${a})`;
  ctx.lineWidth   = 1.2;

  const ox       = CERT_WIDTH  * 0.37;
  const oy       = CERT_HEIGHT * 0.22;
  const cellSize = 48;
  const cols     = 20;
  const rows     = 17;

  // Deterministic pseudo-random (LCG)
  let seed = 7919;
  const rand = () => {
    seed = ((seed * 1664525) + 1013904223) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = ox + c * cellSize;
      const y = oy + r * cellSize;

      if (rand() > 0.42 && c < cols - 1) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cellSize, y); ctx.stroke();
      }
      if (rand() > 0.42 && r < rows - 1) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + cellSize); ctx.stroke();
      }
      if (rand() > 0.62) {
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // IC chip outlines with pins
  ctx.lineWidth = 1.5;
  const ics = [
    { x: ox + 45,  y: oy + 65,  w: 88, h: 48  },
    { x: ox + 260, y: oy + 220, w: 72, h: 100 },
    { x: ox + 490, y: oy + 145, w: 80, h: 58  },
    { x: ox + 385, y: oy + 400, w: 96, h: 42  },
    { x: ox + 655, y: oy + 305, w: 64, h: 80  },
  ];
  for (const { x, y, w, h } of ics) {
    ctx.strokeRect(x, y, w, h);
    const topPins = Math.floor(w / 18);
    for (let p = 0; p < topPins; p++) {
      const px = x + 9 + p * 18;
      ctx.beginPath(); ctx.moveTo(px, y);     ctx.lineTo(px, y - 9);     ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, y + h); ctx.lineTo(px, y + h + 9); ctx.stroke();
    }
  }

  ctx.restore();
}

/** Draws an approximation of the Magistics "M" logo box. */
function drawMagisticsLogo(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const lw = 100;
  const lh = 78;

  // Background box
  ctx.fillStyle = "#111111";
  ctx.fillRect(x, y, lw, lh);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, lw, lh);

  // M geometry
  const ml    = x + 9;
  const mr    = x + lw - 9;
  const mt    = y + 10;
  const mb    = y + lh - 10;
  const bw    = 11; // bar width
  const cx    = x + lw / 2;
  const peakY = mt + (mb - mt) * 0.44;

  ctx.fillStyle = "#ffffff";

  // Left vertical bar
  ctx.fillRect(ml, mt, bw, mb - mt);
  // Right vertical bar
  ctx.fillRect(mr - bw, mt, bw, mb - mt);

  // Left diagonal arm → centre peak
  ctx.beginPath();
  ctx.moveTo(ml, mt);
  ctx.lineTo(ml + bw, mt);
  ctx.lineTo(cx - 1, peakY);
  ctx.lineTo(cx - 2, peakY);
  ctx.closePath();
  ctx.fill();

  // Right diagonal arm → centre peak
  ctx.beginPath();
  ctx.moveTo(mr, mt);
  ctx.lineTo(mr - bw, mt);
  ctx.lineTo(cx + 1, peakY);
  ctx.lineTo(cx + 2, peakY);
  ctx.closePath();
  ctx.fill();

  // Diagonal stripe details on left bar
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(ml, mt + 13); ctx.lineTo(ml + bw, mt + 6);  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ml, mt + 24); ctx.lineTo(ml + bw, mt + 17); ctx.stroke();

  // Label
  ctx.fillStyle = "#bbbbbb";
  ctx.font = "bold 9px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("MAGISTICS", x + lw / 2, y + lh + 15);
}

/** Returns the largest font size (Georgia) that fits `text` inside `maxWidth`. */
function getFitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number
): number {
  let size = maxSize;
  while (size >= minSize) {
    ctx.font = `${size}px Georgia, 'Times New Roman', serif`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return minSize;
}

/** Deterministic short certificate ID. */
function generateCertId(participantName: string, teamName: string): string {
  const raw = `${participantName}::${teamName}::HackInverse2026`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return `HI2026-${hex}`;
}
