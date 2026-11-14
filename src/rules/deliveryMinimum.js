// Rule R3 (fulfilment): delivery needs a subtotal of at least Rs. 800. Pick-up has no minimum.
// Pure function: no React, no browser. Used by the app AND by tests/deliveryMinimum.test.js.
export const DELIVERY_MINIMUM = 800;

export function checkDeliveryMinimum({ subtotal, orderType }) {
  const minimum = DELIVERY_MINIMUM;

  if (typeof subtotal !== "number" || Number.isNaN(subtotal) || subtotal < 0) {
    return { ok: false, minimum, shortBy: minimum, code: "INVALID", message: "The order total is not valid." };
  }
  if (orderType !== "delivery") {
    return { ok: true, minimum, shortBy: 0, code: "PICKUP", message: "Pick-up has no minimum." };
  }
  if (subtotal >= minimum) {
    return { ok: true, minimum, shortBy: 0, code: "OK", message: "Delivery minimum reached." };
  }
  const shortBy = minimum - subtotal;
  return {
    ok: false,
    minimum,
    shortBy,
    code: "BELOW_MINIMUM",
    message: `Add Rs. ${shortBy} more for delivery`,
  };
}
