import { useRef, useState } from "react";
import { Plus, Trash2, MapPin, X, AlertTriangle, ArrowRight, Check, ShoppingBag, Store, Bike, UtensilsCrossed } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { SITE } from "../../config/site";
import { scrollToId } from "../../utils/scroll";

const rs = (n) => `Rs. ${Number(n || 0).toLocaleString("en-US")}`;

// Text inputs: white, 2px ink/30 border, visible label above, 3px brand-deep focus outline.
const fieldClass =
  "w-full rounded-xl border-2 border-ink/30 bg-paper px-3.5 text-[15px] font-semibold text-ink placeholder:text-muted focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-brand-deep";

function Field({ id, label, required, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-ink mb-1.5">
        {label} {required ? <span aria-hidden="true">*</span> : <span className="font-semibold text-muted">(optional)</span>}
      </label>
      {children}
      {hint}
    </div>
  );
}

function ErrorText({ children, id }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm font-bold text-error">
      <AlertTriangle size={16} strokeWidth={2.4} className="shrink-0 mt-0.5" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    removeLine,
    orderType,
    setOrderType,
    customer,
    setCustomer,
    deliveryCheck,
    subtotal,
    deliveryFee,
    total,
    shareLocation,
    sendWhatsAppOrder,
  } = useCart();

  const [locStatus, setLocStatus] = useState("");
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  // Set when "Place order" is tapped with the form incomplete: the error then shows under the missing field
  const [showErrors, setShowErrors] = useState(false);
  const bodyRef = useRef(null);

  const radius = SITE.deliveryRadiusKm;

  const totalQty = Array.isArray(cart)
    ? cart.reduce((s, l) => s + (Number(l.qty) || 0), 0)
    : 0;

  // Validation Rules
  const hasItems = cart && cart.length > 0;
  const hasName = Boolean(customer?.name?.trim());
  const hasPhone = Boolean(customer?.phone?.trim());
  const hasAddress = Boolean(customer?.address?.trim());

  // Pick-up requires Name; Delivery requires Name + Phone + Address + Eligible Location
  const isDeliveryEligible =
    orderType !== "Delivery" || (deliveryCheck.checked && deliveryCheck.eligible);

  const isValid =
    orderType === "Pickup"
      ? hasItems && hasName
      : hasItems && hasName && hasPhone && hasAddress && isDeliveryEligible;

  function handleDeliveryClick() {
    if (deliveryCheck?.checked && !deliveryCheck?.eligible) {
      setShowRadiusModal(true);
      return;
    }
    setOrderType("Delivery");
  }

  function handleShareLocation() {
    shareLocation((msg, isOutOfRange) => {
      setLocStatus(msg);
      if (isOutOfRange) {
        setShowRadiusModal(true);
      }
    });
  }

  function handleSend() {
    if (!isValid) {
      if (!hasItems) {
        // Nothing to order: show the "basket is empty" message at the top
        bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setShowErrors(true);
      if (orderType === "Delivery" && deliveryCheck.checked && !deliveryCheck.eligible) {
        setShowRadiusModal(true);
      }
      // Scroll to the first missing field and focus it (nothing is sent)
      const el = document.getElementById(missingField);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus({ preventScroll: true });
      }
      return;
    }
    const result = sendWhatsAppOrder();
    if (!result?.ok && result?.error) {
      alert(result.error);
    }
  }

  function handleAddMore() {
    closeCart();
    scrollToId("menu");
  }

  const missingText =
    orderType === "Delivery"
      ? !hasName
        ? "Please enter your name"
        : !hasPhone
        ? "Please enter your phone number"
        : !hasAddress
        ? "Please enter your delivery address"
        : deliveryCheck?.checked && !deliveryCheck?.eligible
        ? `Address is outside the ${radius} km delivery area (switch to Pick-up)`
        : `Please share your location to check the ${radius} km delivery area`
      : "Please enter your name for pick-up";

  // First missing field (same validation conditions as isValid above)
  const missingField = !hasName
    ? "cust-name"
    : orderType === "Delivery"
    ? !hasPhone
      ? "cust-phone"
      : !hasAddress
      ? "cust-address"
      : "share-location"
    : null;
  const errorFor = (fieldId) =>
    showErrors && !isValid && hasItems && missingField === fieldId ? (
      <div className="mt-1.5">
        <ErrorText id={`${fieldId}-error`}>{missingText}</ErrorText>
      </div>
    ) : null;
  const errorProps = (fieldId) =>
    errorFor(fieldId) ? { "aria-invalid": true, "aria-describedby": `${fieldId}-error` } : {};

  const typeButton = (active) =>
    `min-h-12 px-3 rounded-xl font-display font-extrabold text-sm border-2 transition-colors flex items-center justify-center gap-1.5 ${
      active ? "bg-primary text-white border-primary" : "bg-paper text-ink border-brand"
    }`;

  return (
    <>
      {/* Outside-delivery-area dialog */}
      {showRadiusModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/70" role="dialog" aria-modal="true" aria-labelledby="radius-title">
          <div className="bg-paper rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-brand text-center space-y-4">
            <div className="w-14 h-14 bg-cream-deep text-error rounded-2xl mx-auto flex items-center justify-center">
              <AlertTriangle size={28} strokeWidth={2.3} aria-hidden="true" />
            </div>

            <div className="space-y-1.5">
              <h4 id="radius-title" className="font-display font-black text-lg text-ink">
                Outside Delivery Area
              </h4>
              <p className="text-sm text-muted font-medium leading-relaxed">
                You are about{" "}
                <strong className="text-error">
                  {deliveryCheck?.distanceKm ? deliveryCheck.distanceKm.toFixed(1) : `> ${radius}`} km
                </strong>{" "}
                away from Tasto Pizza. We deliver within <strong className="text-ink">{radius} km</strong>.
              </p>
            </div>

            <p className="bg-cream p-3 rounded-2xl text-sm font-semibold text-ink">
              You can still order for <strong>Pick-up</strong> and collect it from the shop.
            </p>

            <div className="pt-1 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setOrderType("Pickup");
                  setShowRadiusModal(false);
                }}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark active:bg-primary-dark text-white font-display font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-[transform,background-color]"
              >
                <span>Switch to Pick-up</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setShowRadiusModal(false)}
                className="w-full h-12 text-ink underline text-sm font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div
        className={`${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } fixed inset-0 bg-ink/60 z-50 transition-opacity duration-300`}
        onClick={closeCart}
      />

      {/* Slide-over Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        aria-hidden={!isOpen}
        className={`${
          isOpen ? "translate-x-0 visible" : "translate-x-full invisible"
        } fixed top-0 right-0 z-50 bg-cream h-[100dvh] w-full sm:w-[440px] md:w-[480px] shadow-2xl flex flex-col transition-[transform,visibility] duration-300 ease-in-out`}
      >
        {/* Header: brand blue (primary), white text — matches the category boxes and Add buttons */}
        <div className="bg-primary px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={22} strokeWidth={2.2} className="text-white" aria-hidden="true" />
            <h3 className="font-display font-black text-xl text-white">Your Basket</h3>
            <span className="bg-paper text-ink font-extrabold text-sm px-2.5 py-0.5 rounded-full">
              {totalQty} {totalQty === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close basket"
            className="w-12 h-12 rounded-full bg-paper text-ink flex items-center justify-center focus-visible:outline-white"
          >
            <X size={20} strokeWidth={2.4} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
          {!cart || cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-brand-tint mx-auto flex items-center justify-center">
                <ShoppingBag size={28} className="text-brand-deep" aria-hidden="true" />
              </div>
              <p className="text-ink font-extrabold text-base">Your basket is empty</p>
              <p className="text-muted text-sm font-medium">Add a deal or something from the menu to start.</p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddMore}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-primary-dark active:bg-primary-dark text-white font-display font-black text-base active:scale-[0.98] transition-[transform,background-color]"
                >
                  <UtensilsCrossed size={18} strokeWidth={2.4} aria-hidden="true" />
                  <span>Browse menu</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <ul className="space-y-2.5">
                {cart.map((l) => {
                  const choices = l.deal?.choices || [];
                  const note = l.deal ? l.deal.note : l.notes;
                  return (
                    <li key={l.uid} className="bg-paper rounded-2xl p-3 border-2 border-line flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-black text-ink text-[15px] leading-snug">
                          {l.name}
                          {l.size ? ` (${l.size})` : ""} <span className="font-bold text-muted">× {l.qty}</span>
                        </h4>
                        {choices.map((c) => (
                          <p key={c} className="text-sm font-semibold text-ink mt-0.5">{c}</p>
                        ))}
                        {Array.isArray(l.toppings) && l.toppings.length > 0 && (
                          <p className="text-sm font-semibold text-brand-deep mt-0.5">+ {l.toppings.join(", ")}</p>
                        )}
                        {note && <p className="text-sm text-muted font-medium italic mt-0.5">Note: {note}</p>}
                        <span className="font-display font-black text-brand-deep text-[15px] block mt-1">{rs(l.lineTotal)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLine(l.uid)}
                        aria-label={`Remove ${l.name}`}
                        className="w-12 h-12 rounded-xl bg-cream-deep text-error flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                      >
                        <Trash2 size={18} strokeWidth={2.2} />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={handleAddMore}
                className="w-full min-h-12 px-4 rounded-xl border-2 border-dashed border-brand bg-paper text-ink font-display font-black text-sm flex items-center justify-center gap-1.5"
              >
                <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
                <span>Add more items</span>
              </button>
            </div>
          )}

          {/* Order Type */}
          <fieldset className="bg-paper rounded-2xl p-4 border-2 border-line space-y-3">
            <legend className="sr-only">Order type</legend>
            <span className="text-sm font-black text-ink uppercase tracking-wider block" aria-hidden="true">Order Type</span>
            <div className="grid grid-cols-2 gap-2.5">
              <button type="button" onClick={() => setOrderType("Pickup")} aria-pressed={orderType === "Pickup"} className={typeButton(orderType === "Pickup")}>
                {orderType === "Pickup" ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : <Store size={16} aria-hidden="true" />}
                Pick-up
              </button>
              <button type="button" onClick={handleDeliveryClick} aria-pressed={orderType === "Delivery"} className={typeButton(orderType === "Delivery")}>
                {orderType === "Delivery" ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : <Bike size={16} aria-hidden="true" />}
                <span className="whitespace-nowrap">Delivery +{rs(SITE.deliveryFee)}</span>
              </button>
            </div>

            {orderType === "Delivery" && (
              <div className="pt-1 space-y-2">
                <p className="text-sm font-semibold text-muted">Delivery is available within {radius} km of our branch.</p>

                {deliveryCheck?.checked &&
                  (deliveryCheck.eligible ? (
                    <p className="flex items-start gap-1.5 p-2.5 rounded-xl bg-brand-tint text-sm font-bold text-ink">
                      <Check size={16} strokeWidth={3} className="text-brand-deep shrink-0 mt-0.5" aria-hidden="true" />
                      Delivery available ({deliveryCheck.distanceKm?.toFixed(1)} km away).
                    </p>
                  ) : (
                    <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-cream-deep">
                      <ErrorText>
                        Your location ({deliveryCheck.distanceKm?.toFixed(1)} km) is outside our {radius} km area.
                      </ErrorText>
                      <button type="button" onClick={() => setShowRadiusModal(true)} className="underline shrink-0 text-ink font-black text-sm min-h-12 px-1">
                        Details
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </fieldset>

          {/* Price summary */}
          <div className="bg-paper border-2 border-line rounded-2xl p-4 space-y-2 text-[15px]">
            <div className="flex justify-between text-muted font-semibold">
              <span>Subtotal</span>
              <span className="font-extrabold text-ink">{rs(subtotal)}</span>
            </div>
            {orderType === "Delivery" && (
              <div className="flex justify-between text-muted font-semibold">
                <span>Delivery fee</span>
                <span className="font-extrabold text-ink">{rs(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2.5 border-t-2 border-line">
              <span className="font-display font-black text-ink text-base">Total</span>
              <span className="font-display font-black text-brand-deep text-lg">{rs(total)}</span>
            </div>
          </div>

          {/* Customer details */}
          <div className="bg-paper rounded-2xl p-4 border-2 border-line space-y-4">
            <span className="text-sm font-black text-ink uppercase tracking-wider block">
              {orderType === "Pickup" ? "Pick-up Details" : "Delivery Details"}
            </span>

            <Field id="cust-name" label="Your name" required hint={errorFor("cust-name")}>
              <input
                id="cust-name"
                {...errorProps("cust-name")}
                type="text"
                autoComplete="name"
                value={customer?.name || ""}
                onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                className={`${fieldClass} h-12`}
              />
            </Field>

            <Field id="cust-phone" label="WhatsApp / phone number" required={orderType === "Delivery"} hint={errorFor("cust-phone")}>
              <input
                id="cust-phone"
                {...errorProps("cust-phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="03xx xxxxxxx"
                value={customer?.phone || ""}
                onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                className={`${fieldClass} h-12`}
              />
            </Field>

            {orderType === "Delivery" && (
              <>
                <Field id="cust-address" label="Delivery address / house number" required hint={errorFor("cust-address")}>
                  <textarea
                    id="cust-address"
                    {...errorProps("cust-address")}
                    rows={2}
                    autoComplete="street-address"
                    value={customer?.address || ""}
                    onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
                    className={`${fieldClass} py-3`}
                  />
                </Field>
                <div>
                  <button
                    id="share-location"
                    {...errorProps("share-location")}
                    type="button"
                    onClick={handleShareLocation}
                    className="w-full min-h-12 rounded-xl bg-primary hover:bg-primary-dark active:bg-primary-dark text-white font-display font-black text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MapPin size={16} strokeWidth={2.2} aria-hidden="true" />
                    <span>Share my GPS location</span>
                  </button>
                  {errorFor("share-location")}
                </div>
              </>
            )}
            {locStatus && orderType === "Delivery" && (
              <p className="text-sm font-semibold text-ink bg-brand-tint p-2.5 rounded-xl" role="status">
                {locStatus}
              </p>
            )}
          </div>
        </div>

        {/* Footer: total + send on WhatsApp (sticky at the bottom of the drawer) */}
        <div
          className="px-4 sm:px-5 pt-3 bg-paper border-t border-line shrink-0 space-y-2.5"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold text-muted">Total</span>
            <span className="font-display font-black text-lg text-ink whitespace-nowrap">{rs(total)}</span>
          </div>

          {/* Never looks disabled: if the form is incomplete, handleSend points to the missing field instead */}
          <button
            type="button"
            onClick={handleSend}
            className="w-full h-14 rounded-xl bg-whatsapp text-ink font-display font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.33 4.96L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2Z" />
            </svg>
            <span>Place order on WhatsApp</span>
          </button>
        </div>
      </div>
    </>
  );
}
