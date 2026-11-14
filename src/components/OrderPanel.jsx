import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { lineKey } from "../rules/basketConflicts.js";
import { checkStockLimit, MAX_PER_LINE } from "../rules/stockLimit.js";
import { checkSizeEligibility } from "../rules/sizeEligibility.js";
import { formatRs, unitPrice } from "../utils/pricing.js";
import QuantityStepper from "./QuantityStepper.jsx";

// "Build your order" box on the details page: choose size, quantity, add to basket.
export default function OrderPanel({ item }) {
  const { addLine, qtyForItem, qtyForLine } = useCart();
  const sizes = item.sizes ?? [];

  // Default to Medium for pizzas (it is allowed for every pizza)
  const [size, setSize] = useState(item.sizes ? "Medium" : null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState({ type: "", text: "" });

  // How many of this line are already in the basket, and how much stock is left for it
  const key = lineKey(item.id, size);
  const inLine = qtyForLine(key);
  const otherLines = qtyForItem(item.id) - inLine;
  const stockForLine = item.stockToday - otherLines;
  const room = Math.max(0, Math.min(stockForLine, MAX_PER_LINE) - inLine); // R1: how many more fit
  const wanted = Math.min(qty, Math.max(room, 1));
  const limit = checkStockLimit({ quantity: inLine + wanted, stock: stockForLine });

  const soldOut = item.stockToday <= 0;
  const canAdd = !soldOut && room > 0 && limit.ok;

  let stepperNote = "";
  if (!soldOut) {
    if (room === 0) stepperNote = inLine > 0 ? "You already have the most you can order." : limit.message;
    else if (stockForLine < MAX_PER_LINE) stepperNote = `Only ${stockForLine} left`;
    else stepperNote = `Max ${MAX_PER_LINE}`;
  }

  function handleAdd() {
    const result = addLine(item, size, wanted);
    if (result.ok) {
      setMessage({ type: "good", text: `Added ${wanted} × ${item.name}${size ? ` (${size})` : ""} to your basket.` });
      setQty(1);
    } else {
      setMessage({ type: "bad", text: result.message });
    }
  }

  return (
    <section className="order-panel" aria-labelledby="order-heading">
      <h2 id="order-heading" className="h3">
        Build your order
      </h2>

      {item.sizes && (
        <fieldset className="size-picker">
          <legend>Size</legend>
          {sizes.map((s) => {
            const eligibility = checkSizeEligibility({ special: item.special, size: s.name });
            const id = `size-${s.name}`;
            return (
              <div key={s.name} className="size-picker__option">
                <input
                  type="radio"
                  id={id}
                  name="size"
                  value={s.name}
                  checked={size === s.name}
                  disabled={!eligibility.ok}
                  onChange={() => {
                    setSize(s.name);
                    setMessage({ type: "", text: "" });
                  }}
                />
                <label htmlFor={id}>
                  {s.name} — {formatRs(unitPrice(item, s.name))}
                  {!eligibility.ok && <span className="size-picker__reason"> (not available: special pizza)</span>}
                </label>
              </div>
            );
          })}
          {item.special && <p className="field__hint">Special pizzas are not made in Small.</p>}
        </fieldset>
      )}

      <QuantityStepper
        value={wanted}
        max={Math.max(room, 1)}
        onChange={setQty}
        label={item.name}
        note={stepperNote}
      />

      <p className="order-panel__total">
        Line total: <strong>{formatRs(unitPrice(item, size) * wanted)}</strong>
      </p>

      <button type="button" className="btn btn--primary" onClick={handleAdd} disabled={!canAdd}>
        {soldOut ? "Sold out" : "Add to basket"}
      </button>

      <p className={`feedback ${message.type ? `feedback--${message.type}` : ""}`} role="status">
        {message.type === "good" && "✓ "}
        {message.type === "bad" && "✕ "}
        {message.text}
      </p>
    </section>
  );
}
