// Small helpers for prices and stock text. No React here.

// 1150 -> "Rs. 1,150"
export function formatRs(amount) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

// Lowest price of an item (used for "from" prices and price sorting)
export function fromPrice(item) {
  return item.sizes ? Math.min(...item.sizes.map((s) => s.price)) : item.price;
}

// Price of one item in a given size (size is null for single-price items)
export function unitPrice(item, sizeName) {
  if (!item.sizes) return item.price;
  const size = item.sizes.find((s) => s.name === sizeName);
  return size ? size.price : null;
}

// Stock shown as text (not colour only)
export function stockText(item) {
  if (item.stockToday <= 0) return "Sold out";
  if (item.stockToday <= 5) return `Only ${item.stockToday} left`;
  return "Available";
}
