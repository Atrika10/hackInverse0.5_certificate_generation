export interface CertificateData {
  participantName: string;
  teamName: string;
  eventName: string;
  eventDate: string;
}

const CERT_WIDTH = 1200;
const CERT_HEIGHT = 848;

/**
 * Draws the HackInverse participation certificate on a given canvas element.
 * Returns the canvas for further use (download, preview).
 */
export function drawCertificate(
  canvas: HTMLCanvasElement,
  data: CertificateData
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = CERT_WIDTH;
  canvas.height = CERT_HEIGHT;

  // ── Background ────────────────────────────────────────────────────────────
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);

  // Subtle radial glow in the center
  const radialGrad = ctx.createRadialGradient(
    CERT_WIDTH / 2, CERT_HEIGHT / 2, 100,
    CERT_WIDTH / 2, CERT_HEIGHT / 2, 600
  );
  radialGrad.addColorStop(0, "rgba(236, 72, 153, 0.07)");
  radialGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.04)");
  radialGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = radialGrad;
  ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);

  // ── Outer border ─────────────────────────────────────────────────────────
  const borderGrad = ctx.createLinearGradient(0, 0, CERT_WIDTH, CERT_HEIGHT);
  borderGrad.addColorStop(0, "#ec4899");
  borderGrad.addColorStop(0.5, "#06b6d4");
  borderGrad.addColorStop(1, "#ec4899");
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 3;
  roundRect(ctx, 24, 24, CERT_WIDTH - 48, CERT_HEIGHT - 48, 16);
  ctx.stroke();

  // Inner border (subtle)
  ctx.strokeStyle = "rgba(236, 72, 153, 0.2)";
  ctx.lineWidth = 1;
  roundRect(ctx, 36, 36, CERT_WIDTH - 72, CERT_HEIGHT - 72, 12);
  ctx.stroke();

  // ── Corner decorations ────────────────────────────────────────────────────
  drawCornerDecoration(ctx, 24, 24, 80);
  drawCornerDecoration(ctx, CERT_WIDTH - 24, 24, 80, true, false);
  drawCornerDecoration(ctx, 24, CERT_HEIGHT - 24, 80, false, true);
  drawCornerDecoration(ctx, CERT_WIDTH - 24, CERT_HEIGHT - 24, 80, true, true);

  // ── HackInverse logo / branding ───────────────────────────────────────────
  ctx.font = "bold 22px 'Arial', sans-serif";
  ctx.textAlign = "center";
  const logoGrad = ctx.createLinearGradient(CERT_WIDTH / 2 - 120, 0, CERT_WIDTH / 2 + 120, 0);
  logoGrad.addColorStop(0, "#ec4899");
  logoGrad.addColorStop(1, "#06b6d4");
  ctx.fillStyle = logoGrad;
  ctx.fillText("HackInverse", CERT_WIDTH / 2, 90);

  // Thin divider line under logo
  const divGrad = ctx.createLinearGradient(CERT_WIDTH / 2 - 200, 0, CERT_WIDTH / 2 + 200, 0);
  divGrad.addColorStop(0, "transparent");
  divGrad.addColorStop(0.3, "#ec4899");
  divGrad.addColorStop(0.7, "#06b6d4");
  divGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(CERT_WIDTH / 2 - 200, 105);
  ctx.lineTo(CERT_WIDTH / 2 + 200, 105);
  ctx.stroke();

  // ── "Certificate of Participation" heading ────────────────────────────────
  ctx.font = "300 18px 'Arial', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICATE OF PARTICIPATION", CERT_WIDTH / 2, 155);

  // ── "This is to certify that" ─────────────────────────────────────────────
  ctx.font = "16px 'Arial', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText("This is to certify that", CERT_WIDTH / 2, 230);

  // ── Participant name ──────────────────────────────────────────────────────
  const nameGrad = ctx.createLinearGradient(CERT_WIDTH / 2 - 300, 0, CERT_WIDTH / 2 + 300, 0);
  nameGrad.addColorStop(0, "#f9a8d4");
  nameGrad.addColorStop(0.5, "#ffffff");
  nameGrad.addColorStop(1, "#67e8f9");
  ctx.fillStyle = nameGrad;

  const nameFontSize = getFitFontSize(ctx, data.participantName, 700, 56, 28);
  ctx.font = `bold ${nameFontSize}px 'Arial', sans-serif`;
  ctx.fillText(data.participantName, CERT_WIDTH / 2, 310);

  // Name underline
  ctx.strokeStyle = "rgba(236, 72, 153, 0.4)";
  ctx.lineWidth = 1.5;
  const nameWidth = ctx.measureText(data.participantName).width;
  ctx.beginPath();
  ctx.moveTo(CERT_WIDTH / 2 - nameWidth / 2, 325);
  ctx.lineTo(CERT_WIDTH / 2 + nameWidth / 2, 325);
  ctx.stroke();

  // ── Body text ─────────────────────────────────────────────────────────────
  ctx.font = "16px 'Arial', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText("has successfully participated in", CERT_WIDTH / 2, 380);

  // ── Event name ────────────────────────────────────────────────────────────
  const eventGrad = ctx.createLinearGradient(CERT_WIDTH / 2 - 200, 0, CERT_WIDTH / 2 + 200, 0);
  eventGrad.addColorStop(0, "#ec4899");
  eventGrad.addColorStop(1, "#06b6d4");
  ctx.fillStyle = eventGrad;
  ctx.font = "bold 36px 'Arial', sans-serif";
  ctx.fillText(data.eventName, CERT_WIDTH / 2, 435);

  // ── Team name ─────────────────────────────────────────────────────────────
  ctx.font = "16px 'Arial', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText("as a member of team", CERT_WIDTH / 2, 490);

  ctx.font = "bold 24px 'Arial', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText(data.teamName, CERT_WIDTH / 2, 530);

  // ── Horizontal divider ────────────────────────────────────────────────────
  const midDivGrad = ctx.createLinearGradient(200, 0, CERT_WIDTH - 200, 0);
  midDivGrad.addColorStop(0, "transparent");
  midDivGrad.addColorStop(0.2, "rgba(236,72,153,0.3)");
  midDivGrad.addColorStop(0.8, "rgba(6,182,212,0.3)");
  midDivGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = midDivGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, 565);
  ctx.lineTo(CERT_WIDTH - 200, 565);
  ctx.stroke();

  // ── Date ──────────────────────────────────────────────────────────────────
  ctx.font = "14px 'Arial', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.textAlign = "center";
  ctx.fillText(data.eventDate, CERT_WIDTH / 2, 600);

  // ── Signature section ─────────────────────────────────────────────────────
  // Left signature
  drawSignatureBlock(ctx, 260, 700, "Organizer", "HackInverse Team");
  // Right signature
  drawSignatureBlock(ctx, CERT_WIDTH - 260, 700, "Co-Organizer", "HackInverse Team");

  // ── Certificate ID (bottom center) ───────────────────────────────────────
  const certId = generateCertId(data.participantName, data.teamName);
  ctx.font = "11px 'Arial', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.textAlign = "center";
  ctx.fillText(`Certificate ID: ${certId}`, CERT_WIDTH / 2, CERT_HEIGHT - 45);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCornerDecoration(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  flipX = false, flipY = false
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "rgba(236, 72, 153, 0.7)");
  grad.addColorStop(1, "rgba(6, 182, 212, 0.0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(8, 8 + 40);
  ctx.lineTo(8, 8);
  ctx.lineTo(8 + 40, 8);
  ctx.stroke();

  ctx.restore();
}

function drawSignatureBlock(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  title: string,
  subtitle: string
): void {
  // Signature line
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 80, y - 20);
  ctx.lineTo(x + 80, y - 20);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.font = "bold 14px 'Arial', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText(title, x, y);

  ctx.font = "12px 'Arial', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText(subtitle, x, y + 18);
}

/**
 * Finds the largest font size that fits the text within maxWidth.
 */
function getFitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number
): number {
  let size = maxSize;
  while (size >= minSize) {
    ctx.font = `bold ${size}px 'Arial', sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return minSize;
}

/**
 * Generates a deterministic short certificate ID from name + team.
 */
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
