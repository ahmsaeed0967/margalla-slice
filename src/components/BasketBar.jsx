import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useMenu } from "../context/MenuContext.jsx";
import { summarize } from "../utils/orderSummary.js";
import { formatRs } from "../utils/pricing.js";
import DeliveryCheck from "./DeliveryCheck.jsx";

// Bar fixed to the bottom of the screen while the basket has items.
// It already shows the delivery check, so people see the minimum and fee early.
export default function BasketBar() {
  const { lines, orderType, areaId, itemCount, setOrderType, setAreaId } = useCart();
  const { items } = useMenu();
  const { pathname } = useLocation();

  const hiddenHere = ["/basket", "/checkout", "/confirmation"].some((p) => pathname.startsWith(p));
  if (lines.length === 0 || hiddenHere) return null;

  const summary = summarize({ lines, items, orderType, areaId });

  return (
    <aside className="basket-bar" aria-label="Basket summary">
      <p className="basket-bar__totals">
        <strong>
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </strong>{" "}
        · Subtotal {formatRs(summary.subtotal)}
      </p>
      <DeliveryCheck
        compact
        orderType={orderType}
        areaId={areaId}
        summary={summary}
        onOrderType={setOrderType}
        onArea={setAreaId}
      />
      <Link className="btn btn--primary" to="/basket">
        View basket
      </Link>
    </aside>
  );
}
