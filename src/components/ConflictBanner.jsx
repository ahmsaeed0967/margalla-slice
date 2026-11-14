import { useCart } from "../context/CartContext.jsx";
import { useMenu } from "../context/MenuContext.jsx";

// Explains each problem found by reviewBasket and offers one button to fix them all.
export default function ConflictBanner({ conflicts }) {
  const { repairBasket } = useCart();
  const { items } = useMenu();

  if (conflicts.length === 0) return null;

  return (
    <section className="notice notice--warn" role="alert" aria-labelledby="conflict-heading">
      <h2 id="conflict-heading">Your basket needs updating</h2>
      <p>The menu changed since you added these items. Checkout is paused until you update the basket.</p>
      <ul className="plain-list">
        {conflicts.map((c, index) => (
          <li key={`${c.key}-${index}`}>
            {c.message} <em>{c.fix}</em>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn--primary" onClick={() => repairBasket(items)}>
        Update basket
      </button>
    </section>
  );
}
