// scripts/test-order-message.mjs   —   npm run test:message
// Builds the example order from MENU-SPEC §7 with the real buildOrderMessage()
// and checks the result. Exit code 1 if any check fails.
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (p) => import(pathToFileURL(path.join(root, p)).href);
const { buildOrderMessage } = await load("src/utils/orderMessage.js");
const { DEALS, choiceText, includesText } = await load("src/data/deals.js");
const { REGULAR_PIZZA_PRICES, DRINKS, EXTRA_TOPPINGS } = await load("src/data/menu.js");

const deal01 = DEALS.find((d) => d.id === "deal-01");
const colaNext = DRINKS.find((d) => d.id === "cola-next");

// Cart lines exactly as the site creates them (addLine shape)
const items = [
  { name: "Chicken Tikka", size: "L", qty: 1, unit: REGULAR_PIZZA_PRICES.L, lineTotal: REGULAR_PIZZA_PRICES.L, toppings: [], notes: "less spicy" },
  {
    name: deal01.label, size: null, qty: 1, unit: deal01.price, lineTotal: deal01.price, toppings: [], notes: "",
    deal: { id: deal01.id, choices: [choiceText(deal01.choices[0], "Chicken Fajita")], includes: includesText(deal01), note: "" },
  },
  { name: "Cola Next", size: "1.5 L", qty: 2, unit: colaNext.prices["1.5 L"], lineTotal: colaNext.prices["1.5 L"] * 2, toppings: [], notes: "" },
];

// Fixed time + random digits so the output is predictable: 9 Nov 2026, 6:21 PM in Karachi
const fixed = { now: new Date("2026-11-09T13:21:00Z"), random: () => 0.482 };

const delivery = buildOrderMessage({
  ...fixed,
  items,
  orderType: "Delivery",
  deliveryFee: 150,
  distanceKm: 2.1,
  customer: {
    name: "Ali",
    phone: "0300 1234567",
    address: "House 12, Street 4, Adyala Road\nMy location: https://maps.google.com/?q=33.5497,73.0563",
  },
});

const expected = `🍕 *TASTO PIZZA — NEW ORDER*
Order #TP-0911-482 · 9 Nov 2026, 6:21 PM

*ITEMS*
1. Chicken Tikka Pizza (Large) × 1 — Rs. 1,090
   Note: less spicy
2. Deal 01 × 1 — Rs. 1,990
   Pizza: Medium · Chicken Fajita
   Includes: 2 Zinger Burger, Regular Fries, 6 pcs Oven Wings, 1.5 L Cola Next
3. Cola Next 1.5 L × 2 — Rs. 360

*Subtotal:* Rs. 3,440
*Delivery fee:* Rs. 150
*TOTAL: Rs. 3,590*

*ORDER TYPE:* 🛵 Delivery (2.1 km from branch)
*Name:* Ali
*Phone:* 0300 1234567
*Address:* House 12, Street 4, Adyala Road
*Map:* https://maps.google.com/?q=33.5497,73.0563`;

const checks = [
  ["subtotal is Rs. 3,440", () => assert.ok(delivery.includes("*Subtotal:* Rs. 3,440"))],
  ["total is Rs. 3,590", () => assert.ok(delivery.includes("*TOTAL: Rs. 3,590*"))],
  ["delivery message matches MENU-SPEC §7 exactly", () => assert.equal(delivery, expected)],
  ["deal choices are not printed as 'Note: Pizza…'", () => assert.ok(!/Note: Pizza/.test(delivery))],
  ["only the 3 allowed emojis", () => {
    const emoji = delivery.match(/\p{Extended_Pictographic}/gu) || [];
    assert.ok(emoji.every((e) => ["🍕", "🛵", "🏪"].includes(e)), `found ${emoji.join(" ")}`);
  }],
];

const pickup = buildOrderMessage({ ...fixed, items, orderType: "Pickup", deliveryFee: 150, customer: { name: "Ali", phone: "0300 1234567", address: "House 12" } });
checks.push(
  ["pick-up: says 🏪 Pick-up", () => assert.ok(pickup.includes("*ORDER TYPE:* 🏪 Pick-up"))],
  ["pick-up: no delivery fee, address or map", () => assert.ok(!/Delivery fee|\*Address:\*|\*Map:\*/.test(pickup))],
  ["pick-up: total = subtotal = Rs. 3,440", () => assert.ok(pickup.includes("*TOTAL: Rs. 3,440*"))],
);

// Large pizza with BOTH extra toppings: 1,090 + Mayo 150 + Chicken & cheese 180 = 1,420
// Line built the same way as the pizza sheet (AddSheet.jsx) builds it.
const mayo = EXTRA_TOPPINGS.find((t) => t.id === "mayo");
const chickenCheese = EXTRA_TOPPINGS.find((t) => t.id === "chicken-cheese");
const toppedUnit = REGULAR_PIZZA_PRICES.L + mayo.prices.L + chickenCheese.prices.L;
const toppedLine = {
  name: "Chicken Fajita", size: "L", qty: 1, unit: toppedUnit, lineTotal: toppedUnit,
  toppings: [mayo.name, chickenCheese.name], notes: "",
};
const topped = buildOrderMessage({
  ...fixed,
  items: [toppedLine],
  orderType: "Delivery",
  deliveryFee: 150,
  distanceKm: 1.0,
  customer: { name: "Ali", phone: "0300 1234567", address: "House 12" },
});
checks.push(
  ["toppings: Large prices are Mayo 150 + Chicken & cheese 180", () => {
    assert.equal(mayo.prices.L, 150);
    assert.equal(chickenCheese.prices.L, 180);
  }],
  ["toppings: line total is Rs. 1,420", () => {
    assert.equal(toppedLine.lineTotal, 1420);
    assert.ok(topped.includes("1. Chicken Fajita Pizza (Large) × 1 — Rs. 1,420"));
  }],
  ["toppings: subtotal is Rs. 1,420", () => assert.ok(topped.includes("*Subtotal:* Rs. 1,420"))],
  ["toppings: total is Rs. 1,570 (with Rs. 150 delivery)", () => assert.ok(topped.includes("*TOTAL: Rs. 1,570*"))],
  ["toppings: both topping names are in the message", () =>
    assert.ok(topped.includes("   Extra: Mayo topping, Chicken & cheese topping"))],
);

let failed = 0;
for (const [name, fn] of checks) {
  try { fn(); console.log(`PASS  ${name}`); }
  catch (e) { failed++; console.log(`FAIL  ${name}\n      ${e.message.split("\n").slice(0, 6).join("\n      ")}`); }
}

console.log("\n----- DELIVERY MESSAGE -----\n" + delivery);
console.log("\n----- PICK-UP MESSAGE -----\n" + pickup);
console.log(`\nURL-encoded length (delivery): ${encodeURIComponent(delivery).length} characters`);
console.log(`URL-encoded length (pick-up):  ${encodeURIComponent(pickup).length} characters`);
console.log(failed ? `\n${failed} check(s) FAILED` : `\nAll ${checks.length} checks passed.`);
process.exit(failed ? 1 : 0);
