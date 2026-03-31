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
    data: CertificateData,
): Promise<void> {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    await loadFont("StrangerThings", "/fonts/Stranger-Things.ttf");
    await loadFont("altron", "/fonts/altron.ttf");

    canvas.width = CERT_WIDTH;
    canvas.height = CERT_HEIGHT;

    // Load signatures
    const [abhirupResult, rupshaResult] = await Promise.allSettled([
        loadImage("/Abhirup_sign.svg"),
        loadImage("/Rupsha_Das.png"),
    ]);

    const abhirupImg =
        abhirupResult.status === "fulfilled" ? abhirupResult.value : null;
    const rupshaImg =
        rupshaResult.status === "fulfilled" ? rupshaResult.value : null;

    // ── Background Image ─────────────────────
    const bgImg = await loadImage("/bg2.svg");

    // Draw full image
    ctx.drawImage(bgImg, 0, 0, CERT_WIDTH, CERT_HEIGHT);

    drawCircuitBoard(ctx);

    // ── Borders ────────────────────────
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, CERT_WIDTH - 24, CERT_HEIGHT - 24);

    ctx.strokeStyle = "#990000";
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, CERT_WIDTH - 56, CERT_HEIGHT - 56);

    // ── Logo ───────────────────────────
    await drawMagisticsLogo(ctx, 90, 90);

    // // ── Title ──────────────────────────
    const title = "HACKINVERSE";
    const firstChar = title[0];
    const lastChar = title[title.length - 1];
    const middleChars = title.slice(1, -1);

    const baseX = 300;
    const y = 160;

    ctx.textAlign = "left";

    // First char (bigger)
    ctx.font = "100px StrangerThings";
    ctx.fillStyle = "#ff1a1a";
    ctx.shadowColor = "#a00000";
    ctx.shadowBlur = 50;

    ctx.fillText(firstChar, baseX, y + 15);

    const firstW = ctx.measureText(firstChar).width;

    // Middle text
    ctx.font = "80px StrangerThings";
    ctx.shadowBlur = 50;

    const middleX = baseX + firstW;

    ctx.fillText(middleChars, middleX, y);

    const middleW = ctx.measureText(middleChars).width;

    // Double underline (only middle)
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#ff1a1a";

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(middleX, y + 8);
    ctx.lineTo(middleX + middleW, y + 8);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(middleX, y + 16);
    ctx.lineTo(middleX + middleW, y + 16);
    ctx.stroke();

    // Last char (bigger)
    ctx.font = "100px StrangerThings";
    ctx.shadowBlur = 50;

    const lastX = middleX + middleW;

    ctx.fillText(lastChar, lastX, y + 15);

    ctx.shadowBlur = 0;

    // ── Add "0.5" ──
    ctx.font = "90px altron";
    const text05 = "0.5";
    const startX = lastX + 60 + ctx.measureText(lastChar).width;
    const textWidth = ctx.measureText(text05).width;

    // Create a horizontal linear gradient across the exact width of the text
    const gradient = ctx.createLinearGradient(startX, 0, startX + textWidth, 0);
    
    // Add color stops to mimic the metallic reflection
    gradient.addColorStop(0, "#4a4a4a");    // Darker gray on the far left
    gradient.addColorStop(0.35, "#ffffff"); // Peaking to pure white
    gradient.addColorStop(0.65, "#ffffff"); // Holding the white across the middle
    gradient.addColorStop(1, "#333333");    // Dropping to dark gray on the far right

    ctx.fillStyle = gradient;
    ctx.fillText(text05, startX, y + 5);

    // ── Subtitle ───────────────────────
    ctx.textAlign = "center";
    ctx.font = "30px Open Sans";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("Presents", CERT_WIDTH / 2, 240);

    ctx.font = "bold 50px altron, Arial Black";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("CERTIFICATE OF APPRECIATION", CERT_WIDTH / 2, 320);

    ctx.font = "bold 32px Open Sans";
    ctx.fillText("TO", CERT_WIDTH / 2, 370);

    // ── Name ───────────────────────────
    const nameFontSize = getFitFontSize(ctx, data.participantName, 900, 64, 30);

    ctx.font = `bold ${nameFontSize}px Instrument Sans`;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#696969";
    ctx.shadowBlur = 20;

    ctx.fillText(data.participantName, CERT_WIDTH / 2, 460);

    ctx.shadowBlur = 0;

    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(180, 480);
    ctx.lineTo(CERT_WIDTH - 180, 480);
    ctx.stroke();

    // ── Body ───────────────────────────
    ctx.textAlign = "left";
    ctx.font = "18px Instrument Sans";
    ctx.fillStyle = "rgba(255,255,255,0.9)";

    const bodyX = CERT_WIDTH / 2 - 450;
    const bodyY = 520;

    const prefix = "Of ";
    const suffix = " for their valuable support, participation, and";

    const end = " contribution to the successful conduct of HackInverse 0.5.";

    ctx.font = "22px Instrument Sans";
    ctx.fillText(prefix, bodyX, bodyY);

    const prefixW = ctx.measureText(prefix).width;

    ctx.font = "bold 30px Open Sans";
    ctx.fillText(data.teamName, bodyX + 100 + prefixW, bodyY);

    const teamW = ctx.measureText(data.teamName).width;

    ctx.font = "22px Instrument Sans";

    ctx.beginPath();
    ctx.moveTo(bodyX + prefixW, bodyY + 5);
    ctx.lineTo(bodyX + prefixW + teamW + 200, bodyY + 5);
    ctx.stroke();

    ctx.fillText(suffix, bodyX + 200 + prefixW + teamW, bodyY);

    ctx.textAlign = "center";
    ctx.fillText(end, CERT_WIDTH / 2, bodyY + 35);

    // paragraph
    ctx.fillStyle = "rgba(255,255,255,0.8)";

    const paraY = 590;

    ctx.fillText(
        "Your institution’s encouragement of innovation, technology, and student excellence played a",
        CERT_WIDTH / 2,
        paraY,
    );
    ctx.fillText(
        "significant role in fostering a competitive and inspiring environment throughout the hackathon.",
        CERT_WIDTH / 2,
        paraY + 30,
    );
    ctx.fillText(
        "We sincerely appreciate your continued commitment to empowering young innovators and",
        CERT_WIDTH / 2,
        paraY + 60,
    );
    ctx.fillText(
        "promoting technological advancement.",
        CERT_WIDTH / 2,
        paraY + 90,
    );

    // ── Signatures ─────────────────────
    const sigY = 890;
    const leftX = 330;
    const rightX = 1070;

    ctx.filter = "brightness(0) invert(1)";

    if (abhirupImg) {
        ctx.drawImage(abhirupImg, leftX - 80, sigY - 120, 160, 100);
    }

    if (rupshaImg) {
        ctx.drawImage(rupshaImg, rightX - 80, sigY - 120, 160, 100);
    }

    ctx.filter = "none";

    ctx.strokeStyle = "rgba(255,255,255,0.6)";

    ctx.beginPath();
    ctx.moveTo(leftX - 140, sigY);
    ctx.lineTo(leftX + 140, sigY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightX - 140, sigY);
    ctx.lineTo(rightX + 140, sigY);
    ctx.stroke();

    ctx.textAlign = "center";

    ctx.font = "15px Arial";
    ctx.fillText("Abhirup Datta Khan", leftX, sigY + 25);
    ctx.font = "bold 15px Arial";
    ctx.fillText("Head Organizer", leftX, sigY + 45);

    ctx.font = "15px Arial";
    ctx.fillText("Rupsha Das", rightX, sigY + 25);
    ctx.font = "bold 15px Arial";
    ctx.fillText("Co-Organizer", rightX, sigY + 45);

    // ── Certificate ID ────────────────
    const certId = generateCertId(data.participantName, data.teamName);

    ctx.font = "11px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillText(`Certificate ID: ${certId}`, CERT_WIDTH / 2, CERT_HEIGHT - 40);
}

// ── Helpers ─────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function loadFont(name: string, url: string) {
    const font = new FontFace(name, `url(${url})`);
    await font.load();
    document.fonts.add(font);
}

function getFitFontSize(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxSize: number,
    minSize: number,
) {
    let size = maxSize;
    while (size >= minSize) {
        ctx.font = `${size}px Georgia`;
        if (ctx.measureText(text).width <= maxWidth) return size;
        size -= 2;
    }
    return minSize;
}

function generateCertId(name: string, team: string) {
    return (
        "HI2026-" +
        Math.abs(
            [...(name + team)].reduce((acc, c) => acc + c.charCodeAt(0), 0),
        )
            .toString(16)
            .toUpperCase()
    );
}

function drawCircuitBoard(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "rgba(255,0,0,0.08)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(400 + i * 50, 200);
        ctx.lineTo(400 + i * 50, 800);
        ctx.stroke();
    }
}

async function drawMagisticsLogo(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
) {
    const logoImg = await loadImage("/magistics_logo.svg");
    ctx.drawImage(logoImg, x, y, 150, 100);
}