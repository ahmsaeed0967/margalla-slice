import { Link, useParams } from "react-router-dom";
import { useMenu } from "../context/MenuContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import MenuGate from "../components/MenuGate.jsx";
import FoodImage from "../components/FoodImage.jsx";
import { formatRs, stockText } from "../utils/pricing.js";
import { MAX_PER_LINE } from "../rules/stockLimit.js";

export default function ItemDetails() {
  const { id } = useParams();
  const { items, status } = useMenu();
  const item = items.find((i) => i.id === id);

  usePageTitle(item ? item.name : status === "ready" ? "Item not found" : "Loading item");

  return (
    <div className="page">
      <p>
        <Link to="/menu">← Back to menu</Link>
      </p>
      <MenuGate>
        {!item ? (
          <div className="notice">
            <h1>We couldn't find that item</h1>
            <p>
              There is no dish with the address “{id}”. It may have been removed, or the link is wrong.
            </p>
            <Link className="btn btn--primary" to="/menu">
              See the full menu
            </Link>
          </div>
        ) : (
          <article className="details">
            <FoodImage item={item} className="details__image" />
            <div className="details__body">
              <p className="card__category">{item.category}</p>
              <h1>{item.name}</h1>
              <p>{item.description}</p>

              <h2 className="h3">Ingredients</h2>
              <ul className="chip-list">
                {item.ingredients.map((ing) => (
                  <li key={ing} className="chip chip--plain">
                    {ing}
                  </li>
                ))}
              </ul>

              <p>
                <strong>Preparation:</strong> about {item.prepMinutes} minutes
              </p>

              <h2 className="h3">{item.sizes ? "Sizes and prices" : "Price"}</h2>
              {item.sizes ? (
                <ul className="plain-list">
                  {item.sizes.map((s) => (
                    <li key={s.name}>
                      {s.name}: <strong>{formatRs(s.price)}</strong>
                      {item.special && s.name === "Small" && " — not available for special pizzas"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  <strong>{formatRs(item.price)}</strong>
                </p>
              )}

              <p className={`status ${item.stockToday <= 0 ? "status--bad" : item.stockToday <= 5 ? "status--warn" : "status--good"}`}>
                Availability today: {stockText(item)}
              </p>

              <ul className="rule-notes">
                <li>Maximum {MAX_PER_LINE} of one item per order, and never more than what is left today.</li>
                {item.special && <li>Special pizzas are made fresh in small batches: Medium and Large only.</li>}
              </ul>
            </div>
          </article>
        )}
      </MenuGate>
    </div>
  );
}
