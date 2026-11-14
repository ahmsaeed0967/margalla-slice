// scripts/check-contrast.mjs   —   npm run check-contrast
//
// 1. Computes WCAG contrast ratios for every colour pair the design ALLOWS and
//    fails (exit 1) if one is below its minimum.
// 2. Prints the FORBIDDEN pairs (warning only) so it is clear why they are banned.
// 3. Scans src/ for class combinations that break the colour rules and fails if any.
//
// Colours are read from tailwind.config.js, so this check always uses the real palette.

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { PALETTE } = await import(pathToFileURL(path.join(root, "tailwind.config.js")).href);
const C = { ...PALETTE, white: "#FFFFFF" };

// ---------- WCAG maths ----------
function luminance(hex) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function ratio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// [text, background, minimum, note]
const ALLOWED = [
  ["ink", "brand", 4.5],
  ["ink", "cream", 4.5],
  ["ink", "cream-deep", 4.5],
  ["ink", "white", 4.5],
  ["ink", "brand-tint", 4.5],
  ["white", "night", 4.5],
  ["brand-tint", "night", 4.5],
  ["brand-deep", "white", 4.5],
  ["brand-deep", "cream", 4.5],
  ["brand-deep", "cream-deep", 4.5],
  ["brand-deep", "brand-tint", 4.5],
  ["white", "brand-deep", 4.5],
  ["white", "primary", 4.5, "category boxes, menu chips, Add buttons"],
  ["white", "primary-dark", 4.5, "Add button hover / pressed"],
  ["night", "white", 4.5],
  ["muted", "white", 4.5],
  ["muted", "cream", 4.5],
  ["muted", "cream-deep", 4.5],
  ["brand", "night", 3.0, "LARGE text only (24px+ bold) or decorative"],
  ["ink", "whatsapp", 4.5],
  ["error", "white", 4.5],
  ["error", "cream", 4.5],
  ["error", "cream-deep", 4.5],
];

const FORBIDDEN = [
  ["white", "brand", "white text on brand blue"],
  ["brand", "white", "brand blue text on white (use brand-deep)"],
  ["brand", "cream", "brand blue text on cream (use brand-deep)"],
  ["ink", "night", "ink text on night (use white or brand-tint)"],
  ["muted", "night", "muted text on night (use brand-tint)"],
  ["white", "whatsapp", "white text on WhatsApp green (use ink)"],
];

let failed = 0;
console.log("ALLOWED colour pairs (text on background)");
console.log("-".repeat(72));
for (const [fg, bg, min, note] of ALLOWED) {
  const r = ratio(C[fg], C[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${fg.padEnd(11)} on ${bg.padEnd(11)} ${r.toFixed(2).padStart(6)} : 1   (min ${min})${note ? "  " + note : ""}`
  );
}

console.log("\nFORBIDDEN pairs (shown for information — never use these)");
console.log("-".repeat(72));
for (const [fg, bg, why] of FORBIDDEN) {
  console.log(`WARN  ${fg.padEnd(11)} on ${bg.padEnd(11)} ${ratio(C[fg], C[bg]).toFixed(2).padStart(6)} : 1   ${why}`);
}

// ---------- class rules in src/ ----------
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(jsx?|tsx?)$/.test(f)) files.push(p);
  }
})(path.join(root, "src"));

// class strings: "..." '...' `...` that look like Tailwind class lists
const CLASS_STRING = /(["'`])((?:(?!\1)[^\n])*?\b(?:bg|text|border)-[^\n]*?)\1/g;
const RULES = [
  {
    name: 'white text on bg-brand (use ink, or bg-night / bg-brand-deep)',
    test: (s) => /(^|\s)(?:[\w-]+:)*text-white(\/\d+)?(\s|$)/.test(s) && /(^|\s)(?:[\w-]+:)*bg-brand(\/\d+)?(\s|$)/.test(s),
  },
  {
    name: "brand blue text on a light background (use text-brand-deep)",
    test: (s, file) =>
      /(^|\s)(?:[\w-]+:)*text-brand(\s|$)/.test(s) &&
      (/(^|\s)bg-(paper|white|cream|cream-deep|brand-tint)(\s|$)/.test(s) || !/bg-night/.test(file)),
  },
  {
    name: "light grey text (gray/stone/slate 300-400) — use text-muted",
    test: (s) => /text-(gray|stone|slate|zinc|neutral)-(300|400)\b/.test(s),
  },
  {
    name: "faded ink text (text-ink/NN) — use text-muted for secondary text",
    test: (s) => /(^|\s)(?:[\w-]+:)*text-ink\/\d+/.test(s),
  },
];

let violations = 0;
console.log("\nClass rules in src/");
console.log("-".repeat(72));
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const lines = src.split("\n");
  for (const m of src.matchAll(CLASS_STRING)) {
    const s = m[2];
    for (const rule of RULES) {
      if (rule.test(s, src)) {
        const line = src.slice(0, m.index).split("\n").length;
        violations++;
        console.log(`FAIL  ${path.relative(root, f)}:${line}  ${rule.name}\n      ${lines[line - 1].trim().slice(0, 140)}`);
      }
    }
  }
}
if (!violations) console.log("PASS  no rule violations");

console.log(
  `\n${failed ? `${failed} allowed pair(s) below minimum. ` : "All allowed pairs pass. "}${
    violations ? `${violations} class rule violation(s).` : "No class rule violations."
  }`
);
process.exit(failed || violations ? 1 : 0);
