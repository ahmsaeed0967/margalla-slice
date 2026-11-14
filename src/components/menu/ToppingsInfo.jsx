import { EXTRA_TOPPINGS, TOPPING_SIZE_ORDER, TOPPING_SIZE_LABELS } from "../../data/menu";

const rs = (n) => `Rs. ${n.toLocaleString("en-US")}`;

// Information-only "Extra Toppings" block shown after the last pizza card.
// Same sub-heading style as "Regular Pizza" / "Special Pizza"; white cards like
// the menu cards but with no photo and no "+" (nothing can be added from here).
// Prices come from EXTRA_TOPPINGS in src/data/menu.js (shared with the pizza sheet).
export default function ToppingsInfo() {
  return (
    <div id="extra-toppings" className="menu-anchor mt-5">
      <h3 className="font-display font-black text-lg text-ink mb-3 flex items-center gap-2">
        <span aria-hidden="true" className="w-1.5 h-5 rounded-full bg-brand" />
        Extra Toppings
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {EXTRA_TOPPINGS.map((t) => (
          <li key={t.id} className="bg-paper rounded-2xl shadow-[0_1px_8px_rgba(0,0,0,0.07)] p-3.5 sm:p-4">
            <h4 className="font-display font-extrabold text-[15px] sm:text-base text-ink leading-snug">{t.title}</h4>
            <dl className="mt-2 divide-y divide-cream-deep">
              {TOPPING_SIZE_ORDER.filter((s) => t.prices[s] != null).map((s) => (
                <div key={s} className="flex items-center justify-between gap-3 py-1.5 text-[15px] text-ink">
                  <dt className="font-medium">{TOPPING_SIZE_LABELS[s]}</dt>
                  <dd className="font-display font-black whitespace-nowrap">{rs(t.prices[s])}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">Add these when you choose your pizza.</p>
    </div>
  );
}
