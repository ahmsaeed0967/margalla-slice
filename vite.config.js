import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { SITE } from "./src/config/site.js";

// Structured data (JSON-LD) for search engines, built from src/config/site.js so the
// phone, address and hours are never typed twice. Opening hours / price range are only
// included when they exist in the config.
function siteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE.url}/#restaurant`,
    name: SITE.name,
    slogan: SITE.tagline,
    url: `${SITE.url}/`,
    image: [`${SITE.url}/og-image.jpg`, `${SITE.url}/logo-512.png`],
    logo: `${SITE.url}/logo-512.png`,
    telephone: `+92${SITE.callNumber.replace(/\D/g, "").replace(/^0/, "")}`,
    servesCuisine: ["Pizza", "Fast Food"],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.storeLocation.lat, longitude: SITE.storeLocation.lng },
    hasMenu: `${SITE.url}/#menu`,
  };
  if (SITE.hours?.opens && SITE.hours?.closes) {
    data.openingHoursSpecification = [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ];
  }
  if (SITE.priceRange) data.priceRange = SITE.priceRange;

  return {
    name: "site-json-ld",
    transformIndexHtml(html) {
      return html.replace(
        "<!--SITE_JSON_LD-->",
        `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), siteJsonLd()],
  build: {
    outDir: "dist",
    // Lower modern colour syntax (8-digit hex like #00acee40, "rgb(r g b / a)")
    // to rgba() so older phone browsers don't drop the colour.
    cssTarget: ["chrome64", "safari12", "firefox67", "edge79"],
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
