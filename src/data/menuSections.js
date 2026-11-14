// src/data/menuSections.js
// Turns src/data/menu.js into the rows the menu screen shows.
// Pure data shaping only: every price here comes straight from menu.js.
//
// Row shape:
//   { id, name, desc, image, toppings, options: [{ key, label, price, cartName, cartSize }] }
//   - 1 option  -> "+" adds straight to the basket
//   - 2+ options -> "+" opens the add sheet (size chips)

import {
  PIZZAS,
  SPECIALS,
  PASTA,
  BURGERS,
  WRAPS,
  NUGGETS_WINGS,
  PIECE_LABELS,
  FRIES,
  DRINKS,
  DRINK_SIZE_ORDER,
  DRINK_EXTRAS,
  DIPS,
} from "./menu.js";

const PIZZA_SIZE_ORDER = ["S", "M", "L", "XL"];
const PIZZA_CHIP_LABELS = { S: "Small", M: "Medium", L: "Large", XL: "XL" };

// Pizza lines keep the old basket size codes (S/M/L/XL) so the WhatsApp text is unchanged.
const pizzaRow = (p) => ({
  id: p.id,
  name: p.name,
  desc: p.desc || "",
  image: p.image || null,
  toppings: true,
  options: PIZZA_SIZE_ORDER.filter((s) => p.prices[s] != null).map((s) => ({
    key: s,
    label: PIZZA_CHIP_LABELS[s],
    price: p.prices[s],
    cartName: p.name,
    cartSize: s,
  })),
});

const pastaRow = (p) => ({
  id: p.id,
  name: p.name,
  desc: p.desc || "",
  image: p.image || null,
  options: ["S", "L"].filter((s) => p.prices[s] != null).map((s) => ({
    key: s,
    label: PIZZA_CHIP_LABELS[s],
    price: p.prices[s],
    cartName: p.name,
    cartSize: PIZZA_CHIP_LABELS[s],
  })),
});

const piecesRow = (p) => ({
  id: p.id,
  name: p.name,
  desc: p.desc || "",
  image: p.image || null,
  options: Object.keys(p.prices)
    .sort((a, b) => a - b)
    .map((pcs) => ({
      key: pcs,
      label: PIECE_LABELS[pcs],
      price: p.prices[pcs],
      cartName: p.name,
      cartSize: PIECE_LABELS[pcs],
    })),
});

const drinkRow = (d) => ({
  id: d.id,
  name: d.name,
  desc: "",
  image: d.images?.["1.5 L"] || d.images?.["500 ml"] || null,
  options: (d.sizeOrder || DRINK_SIZE_ORDER).filter((s) => d.prices[s] != null).map((s) => ({
    key: s,
    label: s,
    price: d.prices[s],
    cartName: d.name,
    cartSize: s,
  })),
});

const singleRow = (p) => ({
  id: p.id,
  name: p.name,
  desc: p.desc || "",
  image: p.image || null,
  options: [{ key: "one", label: p.name, price: p.price, cartName: p.name, cartSize: null }],
});

const byId = (list, id) => list.find((x) => x.id === id);

export const MENU_SECTIONS = [
  {
    id: "pizza",
    title: "Pizza",
    groups: [
      { id: "regular-pizza", title: "Regular Pizza", rows: PIZZAS.map(pizzaRow) },
      { id: "specials", title: "Special Pizza", rows: SPECIALS.map(pizzaRow) },
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    groups: [{ id: "pasta-all", title: null, rows: PASTA.map(pastaRow) }],
  },
  {
    id: "burgers",
    title: "Burgers",
    groups: [{ id: "burgers-all", title: null, rows: BURGERS.map(singleRow) }],
  },
  {
    id: "wraps",
    title: "Wraps & Paratha",
    groups: [{ id: "wraps-all", title: null, rows: WRAPS.map(singleRow) }],
  },
  {
    id: "sides",
    title: "Appetizers",
    groups: [
      { id: "nuggets-wings", title: "Nuggets & Wings", rows: NUGGETS_WINGS.map(piecesRow) },
      {
        id: "fries",
        title: "Fries",
        // One row per fries item so each shows its own photo (basket line unchanged: same name, no size)
        rows: FRIES.map(singleRow),
      },
    ],
  },
  {
    id: "drinks",
    title: "Drinks & Dips",
    groups: [
      {
        id: "drinks-all",
        title: "Drinks",
        rows: [
          ...DRINKS.map(drinkRow),
          singleRow(byId(DRINK_EXTRAS, "disposable-glass")),
          singleRow(byId(DRINK_EXTRAS, "extra-ketchup")),
        ],
      },
      { id: "dips", title: "Dips", rows: DIPS.map(singleRow) },
    ],
  },
];
