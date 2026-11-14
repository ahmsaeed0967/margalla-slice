import { useId } from "react";
import { DELIVERY_AREAS } from "../data/deliveryAreas.js";
import { DELIVERY_MINIMUM } from "../rules/deliveryMinimum.js";
import { formatRs } from "../utils/pricing.js";

// "Delivery check": order type + area, with the minimum (rule R3) and the fee
// shown BEFORE checkout. State lives in the cart; this component only shows it
// and reports choices through callback props.
export default function DeliveryCheck({
  orderType,
  areaId,
  summary,
  onOrderType,
  onArea,
  onAreaBlur,
  areaError = "",
  areaFieldId,
  compact = false,
}) {
  const uid = useId();
  const selectId = areaFieldId ?? `${uid}-area`;
  const check = summary.deliveryCheck;
  const delivery = orderType === "delivery";

  return (
    <fieldset className={`delivery-check ${compact ? "delivery-check--compact" : ""}`}>
      <legend>Delivery check</legend>

      <div className="radio-row">
        <label className="radio">
          <input
            type="radio"
            name={`${uid}-type`}
            value="pickup"
            checked={!delivery}
            onChange={() => onOrderType("pickup")}
          />
          Pick-up
        </label>
        <label className="radio">
          <input
            type="radio"
            name={`${uid}-type`}
            value="delivery"
            checked={delivery}
            onChange={() => onOrderType("delivery")}
          />
          Delivery
        </label>
      </div>

      {delivery && (
        <div className={`field ${areaError ? "field--invalid" : ""}`}>
          <label htmlFor={selectId}>Delivery area</label>
          <select
            id={selectId}
            value={areaId}
            onChange={(e) => onArea(e.target.value)}
            onBlur={onAreaBlur}
            aria-invalid={areaError ? "true" : undefined}
            aria-describedby={areaError ? `${selectId}-error` : undefined}
          >
            <option value="">Choose an area</option>
            {DELIVERY_AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {formatRs(a.fee)}
              </option>
            ))}
          </select>
          {areaError && (
            <p id={`${selectId}-error`} className="field__error">
              {areaError}
            </p>
          )}
        </div>
      )}

      {/* Live result of rule R3 and the fee */}
      {!delivery && <p className="status status--good">✓ Pick-up has no minimum</p>}
      {delivery && check.ok && <p className="status status--good">✓ Delivery minimum reached</p>}
      {delivery && !check.ok && (
        <>
          <p className="status status--warn">! {check.message}</p>
          {!compact && (
            <p className="progress-line">
              <progress max={DELIVERY_MINIMUM} value={Math.min(summary.subtotal, DELIVERY_MINIMUM)}>
                {summary.subtotal} of {DELIVERY_MINIMUM}
              </progress>
              <span>
                {formatRs(summary.subtotal)} of {formatRs(DELIVERY_MINIMUM)}
              </span>
            </p>
          )}
        </>
      )}
      {delivery && (
        <p className="delivery-check__fee">
          {summary.area
            ? `Delivery fee: ${formatRs(summary.deliveryFee)} (${summary.area.name})`
            : "Choose an area to see the delivery fee."}
        </p>
      )}
    </fieldset>
  );
}
