import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useMenu } from "../context/MenuContext.jsx";
import { useBasketReview } from "../hooks/useBasketReview.js";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { TIME_SLOTS } from "../config/site.js";
import { checkDeliveryMinimum } from "../rules/deliveryMinimum.js";
import { summarize, readyClock } from "../utils/orderSummary.js";
import { FIELD_ORDER, NOTE_MAX, maskPhone, validateAll, validateField } from "../utils/validation.js";
import { saveLastOrder } from "../utils/lastOrder.js";
import MenuGate from "../components/MenuGate.jsx";
import ConflictBanner from "../components/ConflictBanner.jsx";
import DeliveryCheck from "../components/DeliveryCheck.jsx";
import OrderSummary from "../components/OrderSummary.jsx";

const FIELD_IDS = { name: "co-name", phone: "co-phone", area: "co-area", slot: "co-slot", note: "co-note" };
const LABELS = { name: "Name", phone: "Mobile number", area: "Delivery area", slot: "Time slot", note: "Note" };

export default function Checkout() {
  usePageTitle("Checkout");
  const navigate = useNavigate();
  const cart = useCart();
  const { items } = useMenu();
  const { conflicts } = useBasketReview();
  const { lines, orderType, areaId } = cart;

  // The form's own fields. Order type and area live in the cart (shared with the delivery check).
  const [fields, setFields] = useState({ name: "", phone: "", slot: "", note: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ruleError, setRuleError] = useState("");

  const summary = summarize({ lines, items, orderType, areaId });
  const values = { ...fields, orderType, areaId };

  // Validate one field (on blur, or while typing once it already shows an error)
  function checkField(field, nextValues = values) {
    const message = validateField(field, nextValues);
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const nextFields = { ...fields, [name]: value }; // new object, old one untouched
    setFields(nextFields);
    if (errors[name]) checkField(name, { ...nextFields, orderType, areaId });
  }

  function handleOrderType(type) {
    cart.setOrderType(type);
    if (errors.area) checkField("area", { ...values, orderType: type });
  }

  function handleArea(id) {
    cart.setAreaId(id);
    if (errors.area) checkField("area", { ...values, areaId: id });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setRuleError("");

    const found = validateAll(values);
    setErrors(found);
    const firstBad = FIELD_ORDER.find((f) => found[f]);
    if (firstBad) {
      document.getElementById(FIELD_IDS[firstBad])?.focus();
      return;
    }

    // Business rules again, at submit time (R1/R2 through the basket review, R3 directly)
    if (conflicts.length > 0) {
      setRuleError("Your basket changed. Please update it before placing the order.");
      return;
    }
    const r3 = checkDeliveryMinimum({ subtotal: summary.subtotal, orderType });
    if (!r3.ok) {
      setRuleError(`${r3.message} (delivery minimum is Rs. ${r3.minimum}).`);
      return;
    }

    // Build the SIMULATED order. The real name and number are NOT saved; the phone is masked.
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const number = String(Math.floor(Math.random() * 900) + 100);
    const order = {
      id: `MS-${dd}${mm}-${number}`,
      lines: lines.map((l) => ({ name: l.name, size: l.size, qty: l.qty, price: l.price })),
      itemCount: summary.itemCount,
      subtotal: summary.subtotal,
      deliveryFee: summary.deliveryFee,
      total: summary.total,
      orderType,
      areaName: summary.area?.name ?? "",
      slot: fields.slot,
      readyText: `about ${summary.readyMinutes} min (around ${readyClock(summary.readyMinutes)})`,
      phoneMasked: maskPhone(fields.phone),
    };
    saveLastOrder(order);
    cart.clearBasket();
    navigate(`/confirmation/${order.id}`);
  }

  const errorFields = FIELD_ORDER.filter((f) => errors[f]);

  // Helpers so every input points at its error message
  const ariaFor = (field, hintId) => ({
    "aria-invalid": errors[field] ? "true" : undefined,
    "aria-describedby": [hintId, errors[field] ? `${FIELD_IDS[field]}-error` : null].filter(Boolean).join(" ") || undefined,
  });
  const fieldError = (field) =>
    errors[field] && (
      <p id={`${FIELD_IDS[field]}-error`} className="field__error">
        {errors[field]}
      </p>
    );

  if (lines.length === 0) {
    return (
      <div className="page">
        <h1>Checkout</h1>
        <div className="notice">
          <h2>Your basket is empty</h2>
          <p>Add something to the basket before checking out.</p>
          <Link className="btn btn--primary" to="/menu">
            Browse the menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Checkout</h1>
      <p className="notice notice--plain">
        <strong>Demo — use fake details; nothing is stored or sent.</strong> This places a SIMULATED order only.
      </p>

      <MenuGate>
        <ConflictBanner conflicts={conflicts} />

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            {submitted && errorFields.length > 0 && (
              <div className="notice notice--error" role="alert">
                <h2 className="h3">Please fix {errorFields.length} {errorFields.length === 1 ? "problem" : "problems"}</h2>
                <ul className="plain-list">
                  {errorFields.map((f) => (
                    <li key={f}>
                      <a href={`#${FIELD_IDS[f]}`}>
                        {LABELS[f]}: {errors[f]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {ruleError && (
              <div className="notice notice--error" role="alert">
                <p>{ruleError}</p>
              </div>
            )}

            <div className={`field ${errors.name ? "field--invalid" : ""}`}>
              <label htmlFor="co-name">Name</label>
              <input
                id="co-name"
                name="name"
                type="text"
                autoComplete="off"
                value={fields.name}
                onChange={handleChange}
                onBlur={() => checkField("name")}
                {...ariaFor("name")}
              />
              {fieldError("name")}
            </div>

            <div className={`field ${errors.phone ? "field--invalid" : ""}`}>
              <label htmlFor="co-phone">Mobile number</label>
              <input
                id="co-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="off"
                value={fields.phone}
                onChange={handleChange}
                onBlur={() => checkField("phone")}
                {...ariaFor("phone", "co-phone-hint")}
              />
              <p id="co-phone-hint" className="field__hint">
                Format 03XX-XXXXXXX. Use a made-up number.
              </p>
              {fieldError("phone")}
            </div>

            <DeliveryCheck
              orderType={orderType}
              areaId={areaId}
              summary={summary}
              onOrderType={handleOrderType}
              onArea={handleArea}
              onAreaBlur={() => checkField("area")}
              areaError={errors.area}
              areaFieldId="co-area"
            />

            <div className={`field ${errors.slot ? "field--invalid" : ""}`}>
              <label htmlFor="co-slot">Time slot</label>
              <select
                id="co-slot"
                name="slot"
                value={fields.slot}
                onChange={handleChange}
                onBlur={() => checkField("slot")}
                {...ariaFor("slot")}
              >
                <option value="">Choose a time slot</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {fieldError("slot")}
            </div>

            <div className={`field ${errors.note ? "field--invalid" : ""}`}>
              <label htmlFor="co-note">Note for the kitchen (optional)</label>
              <textarea
                id="co-note"
                name="note"
                rows="3"
                value={fields.note}
                onChange={handleChange}
                onBlur={() => checkField("note")}
                {...ariaFor("note", "co-note-count")}
              />
              <p id="co-note-count" className="field__hint">
                {fields.note.length} / {NOTE_MAX} characters
              </p>
              {fieldError("note")}
            </div>

            <button type="submit" className="btn btn--primary" disabled={conflicts.length > 0}>
              Place simulated order
            </button>
            <p className="field__hint">Demo — no real order is sent. Payment is fictional.</p>
          </form>

          <OrderSummary summary={summary} orderType={orderType} />
        </div>
      </MenuGate>
    </div>
  );
}
