// scripts/photo-report.mjs   —   npm run photos
// Lists every menu item, its section, the photo file it expects in
// src/assets/menu/, whether that photo exists, and any extra files that match no item.
import { readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "src/assets/menu");
const { MENU_SECTIONS } = await import(pathToFileURL(path.join(root, "src/data/menuSections.js")).href);

const files = existsSync(dir) ? readdirSync(dir).filter((f) => /\.(webp|jpe?g|png)$/i.test(f)) : [];
const byId = new Map(files.map((f) => [f.replace(/\.[^.]+$/, ""), f]));
const used = new Set();

console.log(`Photo folder: src/assets/menu/  (${files.length} photo file(s))\n`);
console.log("SECTION   ITEM ID              EXPECTED FILE              PHOTO");
for (const s of MENU_SECTIONS) {
  const rows = s.groups.flatMap((g) => g.rows);
  let have = 0;
  for (const r of rows) {
    const file = byId.get(r.id);
    const fallback = !file && r.image && existsSync(path.join(root, "public", r.image));
    if (file) used.add(file);
    if (file || fallback) have++;
    const status = file ? `yes (${file})` : fallback ? `old photo ${r.image}` : "MISSING";
    console.log(`${s.id.padEnd(9)} ${r.id.padEnd(20)} ${(r.id + ".webp").padEnd(26)} ${status}`);
  }
  const pct = Math.round((have / rows.length) * 100);
  console.log(`  -> ${s.title}: ${have}/${rows.length} with photo (${pct}%) — ${pct >= 80 ? "PHOTOS SHOWN" : "text-only (needs 80%)"}\n`);
}
const extra = files.filter((f) => !used.has(f));
console.log(extra.length ? `Extra files that match no item: ${extra.join(", ")}` : "No extra files.");
