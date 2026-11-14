import { fromPrice } from "./pricing.js";

export const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
  { value: "prep", label: "Fastest to prepare" },
];

// Does one item match the search text? Looks at name, description, ingredients and tags.
function matchesSearch(item, text) {
  const haystack = [item.name, item.description, ...item.ingredients, ...item.tags]
    .join(" ")
    .toLowerCase();
  return haystack.includes(text.toLowerCase());
}

// Search + category + availability filters, then sort. Returns a NEW array.
export function filterAndSort(items, { q, category, availableOnly, sort }) {
  const text = q.trim();
  const result = items
    .filter((item) => !text || matchesSearch(item, text))
    .filter((item) => !category || item.category === category)
    .filter((item) => !availableOnly || item.stockToday > 0);

  if (sort === "price-asc") result.sort((a, b) => fromPrice(a) - fromPrice(b));
  else if (sort === "price-desc") result.sort((a, b) => fromPrice(b) - fromPrice(a));
  else if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "prep") result.sort((a, b) => a.prepMinutes - b.prepMinutes);
  return result;
}
