/** @type {import('tailwindcss').Config} */

// Palette — Nov 2026 redesign (MLTD-style charcoal + white, Tasto blue accent).
// Token NAMES are kept from the earlier "Cream + Navy" palette so every
// component and the contrast script keep working; only the values changed:
//   night = charcoal (header, category bar, buttons, footer)
//   cream / cream-deep = light grey page surfaces behind the white cards
// This REPLACES Tailwind's whole colour palette on purpose: old classes such as
// bg-stone-100, text-teal or bg-red-50 no longer exist, so they cannot sneak back.
//
// Colour rules
// - Text on brand blue is ALWAYS ink. White text only on night, brand-deep or primary.
// - primary = deeper brand blue for category boxes, menu chips and Add buttons
//   (white text 4.9:1). The logo blue #00ACEE is too light behind white text.
// - Blue text on white/cream is ALWAYS brand-deep. brand as TEXT only on night, 24px+ bold.
// - On night, small text is white or brand-tint.
// - Secondary text is muted (#4B5563), 14px minimum. No lighter greys.
// Ratios are checked by `npm run check-contrast` (scripts/check-contrast.mjs).
export const PALETTE = {
  brand: '#00ACEE',
  'brand-deep': '#006A9E',
  'brand-tint': '#E6F7FD',
  // Category boxes, menu chips, Add buttons — change this ONE line to change the shade
  primary: '#0077B6',
  'primary-dark': '#005F94', // hover / pressed state of primary
  ink: '#0A0A0A',
  muted: '#4B5563',
  night: '#1F1F1F',
  cream: '#F5F5F5',
  'cream-deep': '#EDEDED',
  paper: '#FFFFFF',
  error: '#B42318',
  whatsapp: '#25D366',
  // Open/closed dot only (always shown with a text label)
  'status-open': '#15803D',
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Colour classes come out as plain hex (no --tw-*-opacity variables), which
  // older phone browsers handle reliably.
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      brand: {
        DEFAULT: PALETTE.brand,
        deep: PALETTE['brand-deep'],
        tint: PALETTE['brand-tint'],
      },
      primary: {
        DEFAULT: PALETTE.primary,
        dark: PALETTE['primary-dark'],
      },
      ink: PALETTE.ink,
      muted: PALETTE.muted,
      night: PALETTE.night,
      cream: {
        DEFAULT: PALETTE.cream,
        deep: PALETTE['cream-deep'],
      },
      paper: PALETTE.paper,
      // Thin dividers: brand at 35%
      line: 'rgba(0, 172, 238, 0.35)',
      error: PALETTE.error,
      whatsapp: PALETTE.whatsapp,
      'status-open': PALETTE['status-open'],
    },
    extend: {
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
