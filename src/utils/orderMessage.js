// src/utils/orderMessage.js
// PURE function that builds the WhatsApp order text (MENU-SPEC §7, PHASE-FINAL Part E).
// No browser APIs, no side effects — tested by `npm run test:message`.
//
// order = {
//   items:       cart lines [{ name, size, qty, unit, lineTotal, toppings?, notes?, deal? }]
//   orderType:   "Delivery" | "Pickup"
//   deliveryFee: number (used for Delivery only)
//   distanceKm:  number | null   (from the GPS check)
//   customer:    { name, phone, address }   address may contain "My location: <maps url>"
//   now:         Date   (optional, for tests)
//   random:      () => number in [0,1)   (optional, for tests)
//   timeZone:    default "Asia/Karachi"
// }
// Deal lines carry `deal: { choices: [...], includes: "...", note }`.

const PIZZA_SIZES = { S: "Small", M: "Medium", L: "Large", XL: "XL" };
const DRINK_SIZES = new Set(["NR", "500 ml", "1 L", "1.5 L"]);
// Water sizes print the same way as the drinks above: "Water Small", "Water Large"
const WATER_SIZES = new Set(["Small", "Large"]);

export const rs = (n) => `Rs. ${Math.round(Number(n) || 0).toLocaleString("en-US")}`;

// "Chicken Tikka" + "L" -> "Chicken Tikka Pizza (Large)"; "Cola Next" + "1.5 L" -> "Cola Next 1.5 L"
export function itemTitle(line) {
  const { name, size } = line;
  if (!size) return name;
  if (PIZZA_SIZES[size]) return `${/pizza$/i.test(name) ? name : `${name} Pizza`} (${PIZZA_SIZES[size]})`;
  if (DRINK_SIZES.has(size) || (name === "Water" && WATER_SIZES.has(size))) return `${name} ${size}`;
  return `${name} (${size})`;
}

function parts(date, timeZone) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .formatToParts(date)
      .map((x) => [x.type, x.value])
  );
  const dd = new Intl.DateTimeFormat("en-GB", { timeZone, day: "2-digit" }).format(date);
  const mm = new Intl.DateTimeFormat("en-GB", { timeZone, month: "2-digit" }).format(date);
  return { ...p, dd, mm };
}

// Splits "House 12\nMy location: https://maps..." into address + map link.
export function splitAddress(address = "") {
  const m = address.match(/My location:\s*(https?:\/\/\S+)/i);
  const map = m ? m[1] : "";
  const text = address
    .replace(/My location:\s*https?:\/\/\S+/gi, "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
  return { text, map };
}

export function buildOrderMessage(order) {
  const {
    items = [],
    orderType = "Pickup",
    deliveryFee = 0,
    distanceKm = null,
    customer = {},
    now = new Date(),
    random = Math.random,
    timeZone = "Asia/Karachi",
  } = order;

  const isDelivery = orderType === "Delivery";
  const t = parts(now, timeZone);
  const orderId = `TP-${t.dd}${t.mm}-${String(Math.floor(random() * 1000)).padStart(3, "0")}`;
  const when = `${t.day} ${t.month} ${t.year}, ${t.hour}:${t.minute} ${String(t.dayPeriod || "").toUpperCase()}`.trim();

  const subtotal = items.reduce((s, l) => s + (Number(l.lineTotal) || 0), 0);
  const fee = isDelivery ? Number(deliveryFee) || 0 : 0;
  const total = subtotal + fee;

  const out = [];
  out.push("🍕 *TASTO PIZZA — NEW ORDER*");
  out.push(`Order #${orderId} · ${when}`);
  out.push("");
  out.push("*ITEMS*");
  items.forEach((l, i) => {
    out.push(`${i + 1}. ${itemTitle(l)} × ${l.qty} — ${rs(l.lineTotal)}`);
    if (l.deal) {
      (l.deal.choices || []).forEach((c) => out.push(`   ${c}`));
      if (l.deal.includes) out.push(`   Includes: ${l.deal.includes}`);
      if (l.deal.note) out.push(`   Note: ${l.deal.note}`);
    } else {
      if (l.toppings?.length) out.push(`   Extra: ${l.toppings.join(", ")}`);
      if (l.notes) out.push(`   Note: ${l.notes}`);
    }
  });
  out.push("");
  out.push(`*Subtotal:* ${rs(subtotal)}`);
  if (isDelivery) out.push(`*Delivery fee:* ${rs(fee)}`);
  out.push(`*TOTAL: ${rs(total)}*`);
  out.push("");

  if (isDelivery) {
    const km = typeof distanceKm === "number" ? ` (${distanceKm.toFixed(1)} km from branch)` : "";
    out.push(`*ORDER TYPE:* 🛵 Delivery${km}`);
  } else {
    out.push("*ORDER TYPE:* 🏪 Pick-up");
  }
  if (customer.name?.trim()) out.push(`*Name:* ${customer.name.trim()}`);
  if (customer.phone?.trim()) out.push(`*Phone:* ${customer.phone.trim()}`);
  if (isDelivery) {
    const { text, map } = splitAddress(customer.address || "");
    if (text) out.push(`*Address:* ${text}`);
    if (map) out.push(`*Map:* ${map}`);
  }

  return out.join("\n");
}
