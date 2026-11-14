// scripts/make-logo-assets.mjs   —   node scripts/make-logo-assets.mjs
// Builds all logo files in public/ from menu-source/logo.jpeg (910x900, white background):
//   logo-512.png          512x512 circular logo, transparent corners
//   favicon-32.png        32x32 TP monogram only (the ring text is unreadable that small)
//   favicon.ico           16/32/48 px monogram (PNG-in-ICO)
//   apple-touch-icon.png  180x180, solid brand blue, logo centred
//   og-image.jpg          1200x630 share image: brand blue, logo, "TASTO PIZZA — The Key of Taste"
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "menu-source/logo.jpeg");
const OUT = (f) => path.join(root, "public", f);
const BRAND = "#00ACEE";
const INK = "#0A0A0A";

const circleMask = (size, r = size / 2) =>
  Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="#fff"/></svg>`);

// 1. Circle: auto-trim the white margin, then cut a circle so the corners are transparent
const { data: trimmed, info } = await sharp(SRC).trim({ threshold: 30 }).toBuffer({ resolveWithObject: true });
const side = Math.min(info.width, info.height);
const circle = await sharp(trimmed)
  .extract({ left: 0, top: 0, width: side, height: side })
  .resize(1024, 1024)
  .ensureAlpha()
  .composite([{ input: circleMask(1024, 511), blend: "dest-in" }])
  .png()
  .toBuffer();
await sharp(circle).resize(512, 512).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(OUT("logo-512.png"));

// 2. Monogram: the TP mark inside the ring (original image coordinates), on white,
//    with a circular cut so no part of the blue ring shows in the corners.
const MONO = { left: 207, top: 185, width: 520, height: 520 };
// (sharp applies flatten BEFORE composite in one pipeline, so these are two separate steps)
const monogramCut = await sharp(SRC)
  .extract(MONO)
  .resize(512, 512)
  .ensureAlpha()
  .composite([{ input: circleMask(512, 250), blend: "dest-in" }])
  .png()
  .toBuffer();
const monogram = await sharp(monogramCut).flatten({ background: "#FFFFFF" }).png().toBuffer();

// Simplified monogram for tiny icons: a SOLID silhouette of the blue TP shapes.
// - keep only blue pixels (low red channel) -> the gold crown drops out
// - blur + threshold closes the thin white pizza-slice lines inside the P
// - painted in brand-deep (#006A9E), which stays readable on white at 16-32 px
const redInverted = await sharp(monogram).extractChannel("red").negate().png().toBuffer();
const blueOnly = await sharp(redInverted).threshold(128).png().toBuffer();
const silhouetteMask = await sharp(blueOnly).blur(7).threshold(90).toColourspace("b-w").png().toBuffer();
const silhouette = await sharp({ create: { width: 512, height: 512, channels: 3, background: "#006A9E" } })
  .joinChannel(silhouetteMask)
  .png()
  .toBuffer();

// White rounded square + silhouette
const roundedWhite = (size) =>
  Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#fff"/></svg>`);
async function iconPng(size) {
  const inner = await sharp(silhouette).resize(Math.round(size * 0.96)).png().toBuffer();
  return sharp(roundedWhite(size)).composite([{ input: inner, gravity: "center" }]).png().toBuffer();
}
const ico16 = await iconPng(16);
const ico32 = await iconPng(32);
const ico48 = await iconPng(48);
writeFileSync(OUT("favicon-32.png"), ico32);

// PNG-in-ICO container (supported by all current browsers)
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, buf }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}
writeFileSync(OUT("favicon.ico"), ico([{ size: 16, buf: ico16 }, { size: 32, buf: ico32 }, { size: 48, buf: ico48 }]));

// 3. Apple touch icon: solid brand blue, logo centred (iOS rounds the corners itself)
const logo150 = await sharp(circle).resize(150, 150).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: BRAND } })
  .composite([{ input: logo150, gravity: "center" }])
  .flatten({ background: BRAND })
  .png()
  .toFile(OUT("apple-touch-icon.png"));

// 4. Share image 1200x630: brand blue, logo left, ink text right
const logo410 = await sharp(circle).resize(410, 410).png().toBuffer();
const text = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <circle cx="295" cy="315" r="222" fill="#FFFFFF"/>
  <text x="570" y="300" textLength="560" lengthAdjust="spacingAndGlyphs" font-family="Arial Black, Segoe UI Black, Arial, sans-serif" font-weight="900" font-style="italic" font-size="80" fill="${INK}">TASTO PIZZA</text>
  <rect x="572" y="332" width="120" height="8" rx="4" fill="${INK}"/>
  <text x="570" y="410" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="50" fill="${INK}">The Key of Taste</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: BRAND } })
  .composite([{ input: text, left: 0, top: 0 }, { input: logo410, left: 90, top: 110 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(OUT("og-image.jpg"));

console.log("Wrote public/logo-512.png, favicon-32.png, favicon.ico, apple-touch-icon.png, og-image.jpg");
