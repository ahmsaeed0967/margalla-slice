import { checkStockLimit, MAX_PER_LINE } from "./stockLimit.js";
import { checkSizeEligibility } from "./sizeEligibility.js";
import { unitPrice } from "../utils/pricing.js";

// A basket line is identified by item + size, e.g. "pizza-fajita|Medium"
export function lineKey(itemId, size) {
  return `${itemId}|${size ?? ""}`;
}

// Compares the saved basket with the CURRENT menu and rules.
// Returns { conflicts, lines }: conflicts = what is wrong (for the banner),
// lines = the basket after the automatic fixes ("Update basket" uses this).
export function reviewBasket(lines, items) {
  const conflicts = [];
  const fixed = [];
  const usedByItem = {}; // how many of each item earlier lines already take from the stock

  for (const line of lines) {
    const item = items.find((i) => i.id === line.itemId);
    const label = line.size ? `${line.name} (${line.size})` : line.name;
    const problem = (message, fix) => conflicts.push({ key: line.key, message, fix });

    if (!item) {
      problem(`${label} is no longer on the menu.`, "It will be removed.");
      continue;
    }
    if (item.stockToday <= 0) {
      problem(`${label} is sold out today.`, "It will be removed.");
      continue;
    }

    let size = line.size;
    if (!checkSizeEligibility({ special: item.special, size }).ok) {
      problem(`${line.name}: Small is not available for special pizzas.`, "It will be changed to Medium.");
      size = "Medium";
    }
    const price = unitPrice(item, size);
    if (price === null) {
      problem(`${label} is no longer offered in that size.`, "It will be removed.");
      continue;
    }

    let qty = line.qty;
    const used = usedByItem[item.id] ?? 0;
    const allowed = Math.max(0, Math.min(item.stockToday - used, MAX_PER_LINE));
    if (checkStockLimit({ quantity: qty, stock: item.stockToday - used }).ok === false) {
      if (allowed === 0) {
        problem(`${label} has no stock left for this line.`, "It will be removed.");
        continue;
      }
      problem(`Only ${allowed} left of ${line.name}, but you have ${qty}.`, `Quantity will be set to ${allowed}.`);
      qty = allowed;
    }
    if (price !== line.price) {
      problem(`The price of ${label} changed from Rs. ${line.price} to Rs. ${price}.`, "The new price will be used.");
    }

    usedByItem[item.id] = used + qty;
    const key = lineKey(item.id, size);
    const same = fixed.find((l) => l.key === key); // size change may create a duplicate line
    if (same) same.qty += qty;
    else fixed.push({ ...line, key, size, qty, price });
  }

  return { conflicts, lines: fixed };
}
