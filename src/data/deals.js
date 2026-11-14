// src/data/deals.js
// Deals and combos — MENU-SPEC.md §3. Prices exactly as the spec, no
// "original price", no "Save %". Drink in every deal = Cola Next (fixed).
//
// Deal shape:
//   id, tab ("deals" | "family" | "combos"), label, price, image,
//   includes[]  short strings, also used for the WhatsApp "Includes:" line
//   choices[]   { id, label, detail, options[], default, covers }
//               label + detail + picked option -> "Pizza: Medium · Chicken Fajita"
//               covers = the includes[] entry this choice spells out (left out of "Includes:")
//
// Pre-selected `default` options are a UI convenience (first option, or one of
// each kind for pairs). The spec does not name a preferred flavour.

import { PIZZAS, PASTA } from "./menu.js";

const FLAVOURS = PIZZAS.map((p) => p.name);
const PASTAS = PASTA.map((p) => p.name);
const WRAPS = ["Malai Boti Wrap", "Chicken Grill Wrap"];

export const DEAL_TABS = [
  { id: "deals", label: "Deals" },
  { id: "family", label: "Family" },
  { id: "combos", label: "Combos" },
];

const img = (id) => `/pics/deals/${id}.webp`;

export const DEALS = [
  {
    id: "deal-01",
    tab: "deals",
    label: "Deal 01",
    price: 1990,
    image: img("deal-01"),
    includes: [
      "Medium Pizza",
      "2 Zinger Burger",
      "Regular Fries",
      "6 pcs Oven Wings", // CONFIRM: Oven or Crunchy (default Oven)
      "1.5 L Cola Next",
    ],
    choices: [
      { id: "pizza", label: "Pizza", detail: "Medium", options: FLAVOURS, default: FLAVOURS[0], covers: "Medium Pizza" },
    ],
  },
  {
    id: "deal-02",
    tab: "deals",
    label: "Deal 02",
    price: 1990,
    image: img("deal-02"),
    includes: ["4 Zinger Burger", "Stuff Paratha", "Regular Fries", "Mayo Dip", "1.5 L Cola Next"],
    choices: [],
  },
  {
    id: "deal-03",
    tab: "deals",
    label: "Deal 03",
    price: 1990,
    image: img("deal-03"),
    includes: [
      "2 Patty Burger",
      "Stuff Paratha",
      "Loaded Fries",
      "Regular Fries",
      "Zinger Paratha",
      "6 pcs Nuggets",
      "1.5 L Cola Next",
    ],
    choices: [],
  },
  {
    id: "deal-04",
    tab: "deals",
    label: "Deal 04",
    price: 1990,
    image: img("deal-04"),
    includes: [
      "Large Pizza",
      "Small Pasta", // CONFIRM: which pasta / size (default: customer picks, Small)
      "6 pcs Oven Wings", // CONFIRM: Oven or Crunchy (default Oven)
      "Regular Fries",
      "1.5 L Cola Next",
    ],
    choices: [
      { id: "pizza", label: "Pizza", detail: "Large", options: FLAVOURS, default: FLAVOURS[0], covers: "Large Pizza" },
      { id: "pasta", label: "Pasta", detail: "Small", options: PASTAS, default: PASTAS[0], covers: "Small Pasta" },
    ],
  },
  {
    id: "deal-05",
    tab: "deals",
    label: "Deal 05",
    price: 1990,
    image: img("deal-05"),
    includes: [
      "Zinger Paratha",
      "Stuff Paratha",
      "Malai Boti Wrap",
      "Chicken Grill Wrap",
      "6 pcs Oven Wings", // CONFIRM: Oven or Crunchy (default Oven)
      "Regular Fries",
      "1.5 L Cola Next",
    ],
    choices: [],
  },
  {
    id: "family-01",
    tab: "family",
    label: "Family Deal 01",
    price: 4990,
    image: img("family-01"),
    includes: [
      "XL Pizza",
      "2 Patty Burger",
      "2 Stuff Paratha",
      "2 Wraps", // CONFIRM: customer picks from the two types
      "Large Alfredo Pasta", // fixed (owner, Nov 2026)
      "12 pcs Nuggets",
      "2 Regular Fries",
      "2 × 1.5 L Cola Next",
      "Mayo Dip", // fixed: 1 Mayo Dip + 1 Dynamite Sauce (owner, Nov 2026)
      "Dynamite Sauce",
    ],
    choices: [
      // Regular flavours only (spec default)
      { id: "pizza", label: "Pizza", detail: "XL", options: FLAVOURS, default: FLAVOURS[0], covers: "XL Pizza" },
      { id: "wrap1", label: "Wrap 1", detail: "", options: WRAPS, default: WRAPS[0], covers: "2 Wraps" },
      { id: "wrap2", label: "Wrap 2", detail: "", options: WRAPS, default: WRAPS[1], covers: "2 Wraps" },
    ],
  },
  {
    id: "family-02",
    tab: "family",
    label: "Family Deal 02",
    price: 4990,
    image: img("family-02"),
    includes: [
      "XL Crown Crust Pizza",
      "2 Zinger Burger",
      "Zinger Paratha", // CONFIRM: 1 Zinger Paratha (default)
      "2 Wraps",
      "12 pcs Nuggets",
      "2 Loaded Fries",
      "2 × 1.5 L Cola Next",
    ],
    choices: [
      { id: "wrap1", label: "Wrap 1", detail: "", options: WRAPS, default: WRAPS[0], covers: "2 Wraps" },
      { id: "wrap2", label: "Wrap 2", detail: "", options: WRAPS, default: WRAPS[1], covers: "2 Wraps" },
    ],
  },
  {
    id: "kids-meal",
    tab: "combos",
    label: "Kids Meal",
    price: 990,
    image: img("kids-meal"),
    includes: ["2 Patty Burger", "6 pcs Nuggets", "Regular Fries", "500 ml Cola Next"],
    choices: [],
  },
  {
    id: "combo-wrap",
    tab: "combos",
    label: "Wrap Combo", // CONFIRM: name (poster has none)
    price: 990,
    image: img("combo-wrap"),
    includes: ["2 Wraps", "Regular Fries", "500 ml Cola Next"],
    choices: [
      // Any mix (spec §3 point 7)
      { id: "wrap1", label: "Wrap 1", detail: "", options: WRAPS, default: WRAPS[0], covers: "2 Wraps" },
      { id: "wrap2", label: "Wrap 2", detail: "", options: WRAPS, default: WRAPS[1], covers: "2 Wraps" },
    ],
  },
  {
    id: "combo-burger",
    tab: "combos",
    label: "Burger Combo", // CONFIRM: name (poster has none)
    price: 990,
    image: img("combo-burger"),
    includes: ["2 Patty Burger", "Loaded Fries", "500 ml Cola Next"],
    choices: [],
  },
];

// "Pizza: Medium · Chicken Fajita"
export function choiceText(choice, picked) {
  return `${choice.label}: ${choice.detail ? `${choice.detail} · ` : ""}${picked}`;
}

// Includes line for the order message: everything the choices don't already spell out.
export function includesText(deal) {
  const covered = new Set(deal.choices.map((c) => c.covers));
  return deal.includes.filter((s) => !covered.has(s)).join(", ");
}
