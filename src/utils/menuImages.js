// src/utils/menuImages.js
// Menu photos live in src/assets/menu/, named by item id:  <item-id>.webp
// (.jpg / .jpeg / .png also work). Vite picks them up automatically at build
// time — no code change needed when photos are added. See ADDING-PHOTOS.md.

const files = import.meta.glob("../assets/menu/*.{webp,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
});

// "../assets/menu/chicken-tikka.webp" -> "chicken-tikka"
const BY_ID = Object.fromEntries(
  Object.entries(files).map(([file, url]) => [file.split("/").pop().replace(/\.[^.]+$/, ""), url])
);

/** Photo URL for a menu item id, or null. Falls back to an existing item.image. */
export function menuImage(id, fallback = null) {
  return BY_ID[id] || fallback || null;
}

// A section shows thumbnails only when at least this share of its items has a photo.
export const PHOTO_THRESHOLD = 0.8;

/**
 * Decide photo mode for a list of rows.
 * Returns { showPhotos, rows } where each row gets `image` = photo url (or null).
 * In text-only sections every row's image is null (stray photos hidden, files kept).
 */
export function withPhotos(rows) {
  const resolved = rows.map((r) => ({ ...r, image: menuImage(r.id, r.image) }));
  const withPhoto = resolved.filter((r) => r.image).length;
  const showPhotos = resolved.length > 0 && withPhoto / resolved.length >= PHOTO_THRESHOLD;
  return {
    showPhotos,
    rows: showPhotos ? resolved : resolved.map((r) => ({ ...r, image: null })),
  };
}
