// Rule R1 (availability): you can't order more than what is left today, or more than 10 of one item.
// Pure function: no React, no browser. Tested by hand and used by the app.
export const MAX_PER_LINE = 10;

// stock = how many are left today for this item (already minus other basket lines of the same item)
export function checkStockLimit({ quantity, stock, maxPerLine = MAX_PER_LINE }) {
  if (stock <= 0) {
    return { ok: false, max: 0, code: "SOLD_OUT", message: "Sold out today." };
  }
  if (quantity > stock) {
    return {
      ok: false,
      max: Math.min(stock, maxPerLine),
      code: "OVER_STOCK",
      message: `Only ${stock} left today. Please choose ${stock} or fewer.`,
    };
  }
  if (quantity > maxPerLine) {
    return {
      ok: false,
      max: Math.min(stock, maxPerLine),
      code: "OVER_MAX",
      message: `Max ${maxPerLine} per item.`,
    };
  }
  return { ok: true, max: Math.min(stock, maxPerLine), code: "OK", message: "" };
}
