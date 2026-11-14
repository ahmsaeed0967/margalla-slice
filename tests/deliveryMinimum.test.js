// Run with: npm test   (uses the built-in Node test runner)
import test from "node:test";
import assert from "node:assert/strict";
import { checkDeliveryMinimum, DELIVERY_MINIMUM } from "../src/rules/deliveryMinimum.js";

test("the minimum is Rs. 800", () => {
  assert.equal(DELIVERY_MINIMUM, 800);
});

test("delivery well above the minimum is allowed", () => {
  const result = checkDeliveryMinimum({ subtotal: 1500, orderType: "delivery" });
  assert.equal(result.ok, true);
  assert.equal(result.shortBy, 0);
});

test("delivery exactly at the minimum (800) is allowed", () => {
  const result = checkDeliveryMinimum({ subtotal: 800, orderType: "delivery" });
  assert.equal(result.ok, true);
  assert.equal(result.code, "OK");
});

test("delivery one rupee below the minimum (799) is blocked", () => {
  const result = checkDeliveryMinimum({ subtotal: 799, orderType: "delivery" });
  assert.equal(result.ok, false);
  assert.equal(result.shortBy, 1);
  assert.equal(result.message, "Add Rs. 1 more for delivery");
});

test("pick-up has no minimum", () => {
  const result = checkDeliveryMinimum({ subtotal: 100, orderType: "pickup" });
  assert.equal(result.ok, true);
});

test("invalid subtotals are rejected", () => {
  assert.equal(checkDeliveryMinimum({ subtotal: NaN, orderType: "delivery" }).ok, false);
  assert.equal(checkDeliveryMinimum({ subtotal: -5, orderType: "delivery" }).ok, false);
  assert.equal(checkDeliveryMinimum({ subtotal: "900", orderType: "delivery" }).code, "INVALID");
});
