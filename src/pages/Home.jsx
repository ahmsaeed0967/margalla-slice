import { Link } from "react-router-dom";
import { useMenu } from "../context/MenuContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { SITE } from "../config/site.js";
import ItemCard from "../components/ItemCard.jsx";

export default function Home() {
  usePageTitle("Home");
  const { items, status } = useMenu();
  const specials = items.filter((item) => item.special);

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">{SITE.demoLabel}</p>
        <h1>{SITE.name}: {SITE.tagline}</h1>
        <p className="lead">
          Pizza, pasta, burgers and wraps for students and families near FAST-NUCES Islamabad.
          Build an order, check delivery before you pay, and place a simulated order.
        </p>
        <div className="button-row">
          <Link className="btn btn--primary" to="/menu">
            Browse the menu
          </Link>
          <Link className="btn btn--secondary" to="/about">
            Delivery areas and rules
          </Link>
        </div>
      </section>

      <section aria-labelledby="specials-heading">
        <h2 id="specials-heading">Made fresh in small batches</h2>
        {status === "ready" && specials.length > 0 ? (
          <ul className="card-grid">
            {specials.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <p>{status === "loading" ? "Loading specials…" : "Specials will show here when the menu is available."}</p>
        )}
      </section>
    </div>
  );
}
