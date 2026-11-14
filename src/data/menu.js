// src/data/menu.js
// Single source of truth for the Tasto Pizza menu (see MENU-SPEC.md, Nov 2026).
// Prices are PKR and come ONLY from MENU-SPEC.md. Do not invent prices,
// strike-through "original" prices or "Save %" badges.
// Items marked CONFIRM use the spec's DEFAULT until the client confirms.

const PLACEHOLDER = null; // no photo yet -> UI shows the brand placeholder

// ---------------------------------------------------------------------------
// Category chips (MENU-SPEC §1), in display order
// ---------------------------------------------------------------------------
export const CATEGORIES = [
  { id: "deals", name: "Deals" },
  { id: "pizza", name: "Pizza" },
  { id: "pasta", name: "Pasta" },
  { id: "burgers", name: "Burgers" },
  { id: "wraps", name: "Wraps & Paratha" },
  { id: "sides", name: "Appetizers" },
  { id: "drinks", name: "Drinks & Dips" },
];

// Size labels used by the price maps below
export const SIZE_LABELS = {
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "XL (Extra Large)",
};

// ---------------------------------------------------------------------------
// 2.1 Pizza (regular) — same price for every flavour
// ---------------------------------------------------------------------------
export const REGULAR_PIZZA_PRICES = { S: 390, M: 790, L: 1090, XL: 1650 };

// Extra toppings — ONE place for these prices. Used by the "Extra Toppings"
// info block under the pizzas AND by the pizza option sheet, so they can never differ.
// Keys are the pizza size keys used everywhere else (S / M / L / XL).
//   name  = what the basket line and WhatsApp message print
//   title = card heading in the info block
export const TOPPING_SIZE_ORDER = ["S", "M", "L", "XL"];
export const TOPPING_SIZE_LABELS = { S: "Small", M: "Medium", L: "Large", XL: "X Large" };
export const EXTRA_TOPPINGS = [
  {
    id: "mayo",
    name: "Mayo topping",
    title: "Mayo Topping",
    prices: { S: 50, M: 100, L: 150, XL: 200 },
  },
  {
    id: "chicken-cheese",
    name: "Chicken & cheese topping",
    title: "Chicken & Cheese Topping",
    prices: { S: 60, M: 120, L: 180, XL: 240 },
  },
];

// Flavour names, descriptions and photos kept from the existing site (§2.1)
export const PIZZAS = [
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    category: "pizza",
    group: "regular",
    desc: "Made with Pizza Sauce, Cheese mix, topped with tasty tika and Onion for a delightful taste experience.",
    prices: { ...REGULAR_PIZZA_PRICES },
    image: "/pics/tikka.jpg",
  },
  {
    id: "chicken-fajita",
    name: "Chicken Fajita",
    category: "pizza",
    group: "regular",
    desc: "An Authetic taste of fajita Marinated Chicken Onion, Bell peppers capsicum.",
    prices: { ...REGULAR_PIZZA_PRICES },
    image: "/pics/Fajita.jpg",
  },
  {
    id: "chicken-tandoori",
    name: "Chicken Tandoori",
    category: "pizza",
    group: "regular",
    desc: "A sizzling Tandoori flavour with pizza sauce Cheez, Tikka with delicious toping of Onion, Jalapeno and Black Olives.",
    prices: { ...REGULAR_PIZZA_PRICES },
    image: "/pics/tandoori.jpeg",
  },
  {
    id: "chicken-bar-bq",
    name: "Chicken Bar BQ",
    category: "pizza",
    group: "regular",
    desc: "Smoky BBQ Chicken, Gooey Cheez, Onion with green peppers for bold and savory bite.",
    prices: { ...REGULAR_PIZZA_PRICES },
    image: "/pics/BarBQ.jpg",
  },
  {
    id: "hot-and-spicy",
    name: "Hot & Spicy",
    category: "pizza",
    group: "regular",
    desc: "Fiery fajita, onion & jalapenos Pizza sauce, Toped with Tentalizing Cheeze mix and Tomatoes.",
    prices: { ...REGULAR_PIZZA_PRICES },
    image: "/pics/hon_n_spicy.jpg",
  },
];

// ---------------------------------------------------------------------------
// 2.2 Special Pizza — no Small size. "Smoky Kabab" removed (CONFIRM).
// ---------------------------------------------------------------------------
export const SPECIALS = [
  {
    id: "crown-crust",
    name: "Crown Crust",
    category: "pizza",
    group: "special",
    desc: "Signature crown crust stuffed with cheese & kebabs, loaded with smoked chicken and chef's special secret sauce.",
    prices: { M: 990, L: 1490, XL: 2150 },
    image: "/pics/crown.jpeg",
  },
  {
    id: "malai-boti-pizza",
    name: "Malai Boti Pizza",
    category: "pizza",
    group: "special",
    // CONFIRM: draft description, client gave none
    desc: "Creamy malai boti chicken on our signature crust.",
    prices: { M: 990, L: 1490, XL: 2150 },
    image: PLACEHOLDER,
  },
];

// ---------------------------------------------------------------------------
// 2.3 Pasta (new category)
// ---------------------------------------------------------------------------
export const PASTA = [
  { id: "alfredo-pasta", name: "Alfredo Pasta", category: "pasta", prices: { S: 420, L: 800 }, image: PLACEHOLDER },
  { id: "crunchy-pasta", name: "Crunchy Pasta", category: "pasta", prices: { S: 450, L: 850 }, image: PLACEHOLDER },
];

// ---------------------------------------------------------------------------
// 2.4 Burgers — "Patty" spelling is the DEFAULT (CONFIRM)
// ---------------------------------------------------------------------------
export const BURGERS = [
  { id: "patty-burger", name: "Patty Burger", category: "burgers", price: 280, image: PLACEHOLDER },
  { id: "zinger-burger", name: "Zinger Burger", category: "burgers", price: 380, image: PLACEHOLDER },
  { id: "mighty-burger", name: "Mighty Burger", category: "burgers", price: 580, image: PLACEHOLDER },
];

// ---------------------------------------------------------------------------
// 2.5 Paratha & Wraps
// ---------------------------------------------------------------------------
export const WRAPS = [
  { id: "zinger-paratha", name: "Zinger Paratha", category: "wraps", price: 330, image: PLACEHOLDER },
  { id: "stuff-paratha", name: "Stuff Paratha", category: "wraps", price: 450, image: PLACEHOLDER },
  { id: "malai-boti-wrap", name: "Malai Boti Wrap", category: "wraps", price: 380, image: PLACEHOLDER },
  { id: "chicken-grill-wrap", name: "Chicken Grill Wrap", category: "wraps", price: 380, image: PLACEHOLDER },
];

// ---------------------------------------------------------------------------
// 2.6 Nuggets & Wings — prices by piece count
// Oven Wings are lower than the old site (490/890). CONFIRM it is intentional.
// ---------------------------------------------------------------------------
export const PIECE_LABELS = { 6: "6 pcs", 12: "12 pcs" };

export const NUGGETS_WINGS = [
  { id: "nuggets", name: "Nuggets", category: "sides", group: "nuggets-wings", prices: { 6: 270, 12: 480 }, image: PLACEHOLDER },
  { id: "oven-wings", name: "Oven Wings", category: "sides", group: "nuggets-wings", prices: { 6: 390, 12: 750 }, image: "/pics/wings.jpg" },
  { id: "crunchy-wings", name: "Crunchy Wings", category: "sides", group: "nuggets-wings", prices: { 6: 420, 12: 800 }, image: PLACEHOLDER },
];

// ---------------------------------------------------------------------------
// 2.7 Fries
// ---------------------------------------------------------------------------
export const FRIES = [
  { id: "small-fries", name: "Small Fries", category: "sides", group: "fries", price: 120, image: PLACEHOLDER },
  { id: "regular-fries", name: "Regular Fries", category: "sides", group: "fries", price: 200, image: PLACEHOLDER },
  { id: "loaded-fries", name: "Loaded Fries", category: "sides", group: "fries", price: 380, image: PLACEHOLDER },
];

// ---------------------------------------------------------------------------
// 2.8 Drinks — Cola Next and Pepsi. "NR" stays as "NR" (CONFIRM).
// ---------------------------------------------------------------------------
export const DRINK_SIZE_ORDER = ["NR", "500 ml", "1 L", "1.5 L"];

export const DRINKS = [
  {
    id: "cola-next",
    name: "Cola Next",
    category: "drinks",
    group: "drinks",
    prices: { NR: 80, "500 ml": 120, "1 L": 150, "1.5 L": 180 },
    images: {},
  },
  {
    id: "pepsi",
    name: "Pepsi",
    category: "drinks",
    group: "drinks",
    prices: { NR: 100, "500 ml": 130, "1 L": 170, "1.5 L": 220 },
    // Existing photos. No NR photo (the old "can" photo is not an NR bottle).
    images: {
      "500 ml": "/pics/pepsi 500 ml.webp",
      "1 L": "/pics/pepsi 1 litre.avif",
      "1.5 L": "/pics/Pepsi-1.5-Liters.webp",
    },
  },
  {
    // One card with two sizes, chosen in the sheet like Pepsi / Cola Next.
    // Basket and WhatsApp print "Water Small" / "Water Large".
    id: "water",
    name: "Water",
    category: "drinks",
    group: "drinks",
    sizeOrder: ["Small", "Large"],
    prices: { Small: 60, Large: 100 },
    images: {},
  },
];

// Standalone items in the drinks box. Row/column reading is a best reading (CONFIRM).
export const DRINK_EXTRAS = [
  { id: "disposable-glass", name: "Disposable Glass", category: "drinks", group: "drink-extras", price: 10, image: PLACEHOLDER },
  { id: "extra-ketchup", name: "Extra Ketchup", category: "drinks", group: "drink-extras", price: 5, image: PLACEHOLDER },
];

// ---------------------------------------------------------------------------
// 2.9 Dips — "Special Mayo Dip" on posters = "Mayo Dip"
// ---------------------------------------------------------------------------
export const DIPS = [
  { id: "dynamite-sauce", name: "Dynamite Sauce", category: "drinks", group: "dips", price: 100, image: PLACEHOLDER },
  { id: "mayo-dip", name: "Mayo Dip", category: "drinks", group: "dips", price: 80, image: PLACEHOLDER },
];

// Deals live in src/data/deals.js (MENU-SPEC §3).
