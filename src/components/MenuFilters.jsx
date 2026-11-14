import { useEffect, useState } from "react";
import { CATEGORIES } from "../data/menuItems.js";
import { SORT_OPTIONS } from "../utils/menuQuery.js";

// Search + filter + sort controls. They don't change the URL themselves:
// they call the callback props (onSearch, onCategory, ...) and the Menu page decides.
export default function MenuFilters({
  q,
  category,
  availableOnly,
  sort,
  onSearch,
  onCategory,
  onAvailable,
  onSort,
}) {
  // The box has its own text so typing feels instant; the URL is updated after a pause.
  const [text, setText] = useState(q);

  // Keep the box in step when the URL changes from outside (Back button, "Clear filters")
  useEffect(() => {
    setText(q);
  }, [q]);

  // Debounce: wait 300 ms after the last keystroke, then tell the page.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text !== q) onSearch(text);
    }, 300);
    return () => clearTimeout(timer); // cleanup: a new keystroke cancels the old timer
  }, [text]); // eslint-disable-line

  return (
    <form className="filters" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor="menu-search">Search the menu</label>
        <input
          id="menu-search"
          type="search"
          value={text}
          placeholder="Name, ingredient or tag, e.g. chicken"
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="menu-category">Category</label>
        <select id="menu-category" value={category} onChange={(e) => onCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="menu-sort">Sort by</label>
        <select id="menu-sort" value={sort} onChange={(e) => onSort(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field field--check">
        <input
          id="menu-available"
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => onAvailable(e.target.checked)}
        />
        <label htmlFor="menu-available">Available now only</label>
      </div>
    </form>
  );
}
