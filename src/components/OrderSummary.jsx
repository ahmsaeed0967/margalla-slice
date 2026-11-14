import { formatRs } from "../utils/pricing.js";
import { readyClock } from "../utils/orderSummary.js";

// Totals box (item count, subtotal, delivery fee, total, ready time). Pure display:
// every number comes from summarize() in the parent.
export default function OrderSummary({ summary, orderType }) {
  return (
    <section className="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="h3">
        Order summary
      </h2>
      <dl className="summary__list">
        <div>
          <dt>Items</dt>
          <dd>{summary.itemCount}</dd>
        </div>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatRs(summary.subtotal)}</dd>
        </div>
        <div>
          <dt>Delivery fee</dt>
          <dd>
            {orderType === "delivery"
              ? summary.area
                ? formatRs(summary.deliveryFee)
                : "Choose an area"
              : "Rs. 0 (pick-up)"}
          </dd>
        </div>
        <div className="summary__total">
          <dt>Total</dt>
          <dd>{formatRs(summary.total)}</dd>
        </div>
        <div>
          <dt>Estimated ready</dt>
          <dd>
            about {summary.readyMinutes} min (around {readyClock(summary.readyMinutes)})
          </dd>
        </div>
      </dl>
      {orderType === "delivery" && !summary.deliveryCheck.ok && (
        <p className="status status--warn">! {summary.deliveryCheck.message} to unlock delivery</p>
      )}
    </section>
  );
}
