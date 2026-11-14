// Rule R2 (eligibility): special pizzas are never sold in Small.
// Pure function: no React, no browser.
export const RESTRICTED_SIZE = "Small";

export function checkSizeEligibility({ special, size }) {
  if (special && size === RESTRICTED_SIZE) {
    return {
      ok: false,
      code: "SPECIAL_NOT_SMALL",
      message: "Special pizzas are not made in Small. Choose Medium or Large.",
    };
  }
  return { ok: true, code: "OK", message: "" };
}
