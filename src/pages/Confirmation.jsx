import { Link, useParams } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { readLastOrder } from "../utils/lastOrder.js";
import { formatRs } from "../utils/pricing.js";

export default function Confirmation() {
  const { orderId } = useParams();
  const saved = readLastOrder();
  const order = saved && saved.id === orderId ? saved : null;

  usePageTitle(order ? "Order confirmed" : "Order not found");

  if (!order) {
    return (
      <div className="page">
        <h1>We couldn't find order {orderId}</h1>
        <p>
          Simulated orders are only remembered in this browser tab, so a refreshed tab, a new tab or a
          wrong link will not show one.
        </p>
        <Link className="btn btn--primary" to="/menu">
          Start a new order
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="notice notice--success">
        <p className="eyebrow">SIMULATED ORDER — nothing was sent</p>
        <h1>Thank you! Order {order.id} is confirmed (demo)</h1>
        <p>No real food will be made and no payment was taken.</p>
      </div>

      <h2>Your items</h2>
      <ul className="plain-list">
        {order.lines.map((l) => (
          <li key={`${l.name}-${l.size}`}>
            {l.qty} × {l.name}
            {l.size && ` (${l.size})`} — {formatRs(l.qty * l.price)}
          </li>
        ))}
      </ul>

      <dl className="summary__list confirmation-list">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatRs(order.subtotal)}</dd>
        </div>
        <div>
          <dt>Delivery fee</dt>
          <dd>{formatRs(order.deliveryFee)}</dd>
        </div>
        <div className="summary__total">
          <dt>Total</dt>
          <dd>{formatRs(order.total)}</dd>
        </div>
        <div>
          <dt>Order type</dt>
          <dd>{order.orderType === "delivery" ? `Delivery to ${order.areaName}` : "Pick-up"}</dd>
        </div>
        <div>
          <dt>Time slot</dt>
          <dd>{order.slot}</dd>
        </div>
        <div>
          <dt>Estimated ready</dt>
          <dd>{order.readyText}</dd>
        </div>
        <div>
          <dt>Contact (masked)</dt>
          <dd>{order.phoneMasked}</dd>
        </div>
      </dl>

      <Link className="btn btn--primary" to="/menu">
        Order something else
      </Link>
    </div>
  );
}
