import { useMenu } from "../context/MenuContext.jsx";

// Wraps a page that needs the menu: shows loading, error + retry, or the page itself.
export default function MenuGate({ children }) {
  const { status, error, reload } = useMenu();

  if (status === "loading") {
    return (
      <div role="status" aria-live="polite">
        <p>Loading the menu…</p>
        <ul className="card-grid" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <li key={n} className="card card--skeleton" />
          ))}
        </ul>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="notice notice--error" role="alert">
        <h2>We couldn't load the menu</h2>
        <p>{error}</p>
        <button type="button" className="btn btn--primary" onClick={reload}>
          Try again
        </button>
      </div>
    );
  }

  return children;
}
