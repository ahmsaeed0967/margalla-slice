// Photos live in src/assets/menu/. Vite bundles them; items refer to them by file name.
const files = import.meta.glob("../assets/menu/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

// "../assets/menu/zinger-burger.webp" -> "zinger-burger"
const BY_NAME = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split("/").pop().replace(".webp", ""), url])
);

// Returns the photo URL for an image name, or null (the card then shows a drawn fallback).
export function menuImage(name) {
  return (name && BY_NAME[name]) || null;
}
