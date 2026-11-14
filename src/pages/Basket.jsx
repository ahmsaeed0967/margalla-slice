import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useMenu } from "../context/MenuContext.jsx";
import { useBasketReview } from "../hooks/useBasketReview.js";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { MAX_PER_LINE } from "../rules/stockLimit.js";
import { summarize } from "../utils/orderSummary.js";
import { formatRs } from "../utils/pricing.js";
import MenuGate from "../components/MenuGate.jsx";
import ConflictBanner from "../components/ConflictBanner.jsx";
import DeliveryCheck from "../components/DeliveryCheck.jsx";
import OrderSummary from "../components/OrderSummary.jsx";
import QuantityStepper from "../components/QuantityStepper.jsx";

export default function Basket() {
  usePageTitle("Basket");
  const cart = useCart();
  const { items } = useMenu();
  const { conflicts } = useBasketReview();
  const { lines, orderType, areaId } = cart;

  const summary = summarize({ lines, items, orderType, areaId });
  const problemKeys = conflicts.map((c) => c.key);

  // Why checkout is blocked (empty string = allowed)
  let blockReason = "";
  if (conflicts.length > 0) blockReason = "Update your basket first (see the notice above).";
  else if (orderType === "delivery" && !summary.deliveryCheck.ok) blockReason = summary.deliveryCheck.message;

  return (
    <div className="page">
      <h1>Your basket</h1>

      {lines.length === 0 ? (
        <div className="notice">
          <h2>Your basket is empty</h2>
          <p>Pick something from the menu and it will show up here.</p>
          <Link className="btn btn--primary" to="/menu">
            Browse the menu
          </Link>
        </div>
      ) : (
        <MenuGate>
          <ConflictBanner conflicts={conflicts} />

          <ul className="basket-lines">
            {lines.map((line) => {
              const item = items.find((i) => i.id === line.itemId);
              // R1: stock still free for this line = stock minus the other lines of the same item
              const left = item ? item.stockToday - (cart.qtyForItem(line.itemId) - line.qty) : 0;
              const max = Math.max(line.qty > left ? 0 : Math.min(left, MAX_PER_LINE), 0);
              const note = !item ? "No longer on the menu" : left < MAX_PER_LINE ? `Only ${left} left` : `Max ${MAX_PER_LINE}`;
              return (
                <li key={line.key} className="basket-line">
                  <div className="basket-line__info">
                    <h2 className="h3">
                      {item ? <Link to={`/menu/${line.itemId}`}>{line.name}</Link> : line.name}
                    </h2>
                    {line.size && <p>Size: {line.size}</p>}
                    <p>
                      {formatRs(line.price)} each · line total <strong>{formatRs(line.price * line.qty)}</strong>
                    </p>
                    {problemKeys.includes(line.key) && <p className="status status--warn">! Needs updating</p>}
                  </div>
                  <QuantityStepper
                    value={line.qty}
                    max={max}
                    label={line.name}
                    note={note}
                    onChange={(qty) => cart.setQty(line.key, qty)}
                  />
                  <button type="button" className="btn btn--secondary" onClick={() => cart.removeLine(line.key)}>
                    <Trash2 size={18} aria-hidden="true" />
                    Remove<span className="visually-hidden"> {line.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="basket-side">
            <DeliveryCheck
              orderType={orderType}
              areaId={areaId}
              summary={summary}
              onOrderType={cart.setOrderType}
              onArea={cart.setAreaId}
            />
            <OrderSummary summary={summary} orderType={orderType} />

            {blockReason ? (
              <>
                <button type="button" className="btn btn--primary" disabled aria-describedby="block-reason">
                  Continue to checkout
                </button>
                <p id="block-reason" className="status status--warn">
                  ! {blockReason}
                </p>
              </>
            ) : (
              <Link className="btn btn--primary" to="/checkout">
                Continue to checkout
              </Link>
            )}
            <p className="field__hint">Demo — no real order is sent.</p>
          </div>
        </MenuGate>
      )}
    </div>
  );
}
