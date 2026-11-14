import { menuImage } from "../utils/menuImages.js";

// Shows the item's photo, or a drawn plate when there is no photo.
export default function FoodImage({ item, className = "" }) {
  const url = menuImage(item.image);
  if (url) {
    return (
      <img
        className={`food-image ${className}`}
        src={url}
        alt={`${item.name} (sample photo)`}
        loading="lazy"
        width="400"
        height="300"
      />
    );
  }
  return (
    <div className={`food-image food-image--fallback ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 75" width="64" height="48" focusable="false">
        <circle cx="50" cy="38" r="26" fill="#FFF4DC" stroke="#B42318" strokeWidth="3" />
        <circle cx="50" cy="38" r="16" fill="#E8A33D" />
        <circle cx="44" cy="34" r="3" fill="#B42318" />
        <circle cx="56" cy="42" r="3" fill="#B42318" />
      </svg>
      <span>{item.category}</span>
    </div>
  );
}
