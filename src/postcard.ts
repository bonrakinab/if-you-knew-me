import { poetQuotes } from "./quotes";

/**
 * Compose a shareable postcard from a world snapshot:
 * the photo on top, a poet's line and the world's name below.
 */
export async function composePostcard(
  snapshotUrl: string,
  placeLabel: string,
): Promise<string> {
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("snapshot failed to load"));
    img.src = snapshotUrl;
  });

  const W = 1080;
  const photoH = Math.round((img.height / img.width) * W);
  const footerH = 260;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = photoH + footerH;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(img, 0, 0, W, photoH);

  // Soft vignette over the photo
  const vignette = ctx.createLinearGradient(0, photoH - 160, 0, photoH);
  vignette.addColorStop(0, "rgba(24,20,28,0)");
  vignette.addColorStop(1, "rgba(24,20,28,0.55)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, photoH - 160, W, 160);

  // Footer card
  const footer = ctx.createLinearGradient(0, photoH, 0, photoH + footerH);
  footer.addColorStop(0, "#221c2a");
  footer.addColorStop(1, "#16121e");
  ctx.fillStyle = footer;
  ctx.fillRect(0, photoH, W, footerH);

  ctx.strokeStyle = "rgba(255, 214, 226, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, W - 48, photoH + footerH - 48);

  const quote = poetQuotes[Math.floor(Math.random() * poetQuotes.length)]!;
  const line =
    quote.text.length > 110 ? `${quote.text.slice(0, 107)}…` : quote.text;

  ctx.textAlign = "center";
  ctx.fillStyle = "#f6e8ee";
  ctx.font =
    '32px "Noto Serif Bengali", "Newsreader", Georgia, serif';
  wrapText(ctx, line, W / 2, photoH + 78, W - 160, 44);

  ctx.fillStyle = "rgba(246, 232, 238, 0.75)";
  ctx.font = '26px "Noto Serif Bengali", Georgia, serif';
  ctx.fillText(`— ${quote.poet}`, W / 2, photoH + 182);

  ctx.fillStyle = "rgba(255, 214, 226, 0.85)";
  ctx.font = '28px "Noto Serif Bengali", Georgia, serif';
  const date = new Date().toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  ctx.fillText(`প্রেয়সীপাড় · ${placeLabel} · ${date}`, W / 2, photoH + 228);

  return canvas.toDataURL("image/png");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): void {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const attempt = line ? `${line} ${word}` : word;
    if (ctx.measureText(attempt).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = attempt;
    }
  }
  if (line) ctx.fillText(line, x, cursorY);
}
