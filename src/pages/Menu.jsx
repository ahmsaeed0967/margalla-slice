import { Link, useSearchParams } from "react-router-dom";
import { useMenu } from "../context/MenuContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { filterAndSort } from "../utils/menuQuery.js";
import { CATEGORIES } from "../data/menuItems.js";
import MenuGate from "../components/MenuGate.jsx";
import MenuFilters from "../components/MenuFilters.jsx";
import ItemCard from "../components/ItemCard.jsx";

export default function Menu() {
  usePageTitle("Menu");
  const { items } = useMenu();
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL is the single source of truth for search / filter / sort
  const filters = {
    q: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    availableOnly: searchParams.get("available") === "1",
    sort: searchParams.get("sort") ?? "",
  };

  // Set one parameter (or remove it when the value is empty) and keep the others
  function updateParam(key, value, replace = false) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace }
    );
  }

  const results = filterAndSort(items, filters);
  const anyFilter = filters.q.trim() || filters.category || filters.availableOnly;

  return (
    <div className="page">
      <h1>Menu</h1>
      <p className="lead">Search, filter and sort. The address bar keeps your choices, so Back and refresh restore them.</p>

      <MenuGate>
        {items.length === 0 ? (
          <div className="notice">
            <h2>The menu is being updated</h2>
            <p>There are no dishes to show right now. Please check again soon.</p>
          </div>
        ) : (
          <>
            <MenuFilters
              {...filters}
              onSearch={(value) => updateParam("q", value.trim(), true)}
              onCategory={(value) => updateParam("category", value)}
              onAvailable={(checked) => updateParam("available", checked ? "1" : "")}
              onSort={(value) => updateParam("sort", value)}
            />

            <p className="result-count" aria-live="polite">
              Showing {results.length} of {items.length} items
            </p>

            {results.length === 0 ? (
              <div className="notice">
                <h2>No dishes match</h2>
                <p>
                  Nothing found
                  {filters.q.trim() && <> for “{filters.q.trim()}”</>}
                  {filters.category && <> in {filters.category}</>}
                  {filters.availableOnly && <> that is available now</>}.
                </p>
                <button type="button" className="btn btn--primary" onClick={() => setSearchParams({})}>
                  Clear filters
                </button>
                <p className="notice__label">Or jump to a category:</p>
                <ul className="chip-list">
                  {CATEGORIES.map((c) => (
                    <li key={c}>
                      <Link className="chip" to={`/menu?category=${c}`}>
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="card-grid">
                {results.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </ul>
            )}
            {anyFilter && results.length > 0 && (
              <p>
                <button type="button" className="btn btn--secondary" onClick={() => setSearchParams({})}>
                  Clear filters
                </button>
              </p>
            )}
          </>
        )}
      </MenuGate>
    </div>
  );
}
