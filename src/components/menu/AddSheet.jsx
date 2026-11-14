import { useEffect, useId, useState } from "react";
import { X, Minus, Plus, Check } from "lucide-react";
import { EXTRA_TOPPINGS } from "../../data/menu";
import { ItemThumb } from "./ItemRow";

const rs = (n) => `Rs. ${n.toLocaleString("en-US")}`;

// Selected = brand + ink text + check icon + 2px ink border (never colour alone).
function ChipGroup({ title, items, activeKey, onPick }) {
  return (
    <fieldset>
      <legend className="text-sm font-black text-ink uppercase tracking-wider mb-2">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => {
          const active = it.key === activeKey;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onPick(it.key)}
              aria-pressed={active}
              className={`min-h-12 px-3.5 py-1.5 rounded-xl border-2 text-[15px] text-ink flex items-center gap-1.5 text-left leading-tight transition-colors ${
                active ? "bg-brand border-ink font-black" : "bg-white border-brand font-semibold"
              }`}
            >
              {active && <Check size={16} strokeWidth={3} className="shrink-0" aria-hidden="true" />}
              <span className="flex flex-col">
                <span>{it.label}</span>
                {it.sub && <span className="text-sm font-bold">{it.sub}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// Bottom sheet for items with sizes / choices, and for deals with choices.
// row: { name, desc, options[], toppings?, choices? }
// buildLine (optional): ({ option, unit, qty, notes, picks }) => cart line. Default builds a menu-item line.
// Mount with a `key` per row so the state starts fresh each time.
export default function AddSheet({ row, onClose, onConfirm, buildLine }) {
  const choices = row.choices || [];
  const noteId = useId();
  const titleId = useId();
  const [optionKey, setOptionKey] = useState(row.options[0].key);
  const [picks, setPicks] = useState(() => Object.fromEntries(choices.map((c) => [c.id, c.default ?? c.options[0]])));
  const [toppingIds, setToppingIds] = useState([]); // ticked EXTRA_TOPPINGS ids
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  const option = row.options.find((o) => o.key === optionKey) || row.options[0];
  // Extra toppings priced by the selected pizza size (shared data in src/data/menu.js)
  const toppings = row.toppings
    ? EXTRA_TOPPINGS.map((t) => ({ ...t, price: t.prices[option.key] ?? 0 }))
    : [];
  const picked = toppings.filter((t) => toppingIds.includes(t.id));
  const unit = option.price + picked.reduce((s, t) => s + t.price, 0);
  const toggleTopping = (id) =>
    setToppingIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  // Close on Escape, stop the page scrolling behind the sheet
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  function handleAdd() {
    const trimmed = notes.trim();
    if (buildLine) {
      onConfirm(buildLine({ option, unit, qty, notes: trimmed, picks }));
      return;
    }
    onConfirm({
      name: option.cartName,
      size: option.cartSize,
      toppings: picked.map((t) => t.name),
      notes: trimmed,
      qty,
      image: row.image || "/pics/pizza-placeholder.svg",
      unit,
      lineTotal: unit * qty,
    });
  }

  const stepBtn =
    "w-12 h-12 rounded-full bg-night text-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" aria-label="Close" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-ink/60 cursor-default" />

      <div className="relative w-full md:max-w-lg bg-paper rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[92svh] flex flex-col">
        <div className="pt-2.5 flex justify-center md:hidden" aria-hidden="true">
          <span className="w-12 h-1.5 rounded-full bg-ink/25" />
        </div>

        {/* Head */}
        <div className="flex items-start gap-3 px-4 pt-3 pb-3 border-b-2 border-line">
          {/* Photo only when the item's section is in photo mode (row.image resolved by MenuSections) */}
          {row.image && <ItemThumb src={row.image} alt="" size={72} />}
          <div className="flex-1 min-w-0">
            <h3 id={titleId} className="font-display font-black text-xl text-ink leading-tight">{row.name}</h3>
            {row.desc && <p className="text-sm text-muted font-medium mt-1">{row.desc}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-12 h-12 -mt-1 -mr-1 shrink-0 rounded-full bg-brand-tint text-ink flex items-center justify-center"
          >
            <X size={20} strokeWidth={2.4} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-4 py-4 space-y-5">
          {row.options.length > 1 && (
            <ChipGroup
              title="Choose size"
              items={row.options.map((o) => ({ key: o.key, label: o.label, sub: rs(o.price) }))}
              activeKey={option.key}
              onPick={setOptionKey}
            />
          )}

          {choices.map((c) => (
            <ChipGroup
              key={c.id}
              title={c.detail ? `${c.label} (${c.detail})` : c.label}
              items={c.options.map((o) => ({ key: o, label: o }))}
              activeKey={picks[c.id]}
              onPick={(v) => setPicks((p) => ({ ...p, [c.id]: v }))}
            />
          ))}

          {toppings.length > 0 && (
            <fieldset>
              <legend className="text-sm font-black text-ink uppercase tracking-wider mb-2">Extra toppings</legend>
              <div className="space-y-2">
                {toppings.map((t) => {
                  const on = toppingIds.includes(t.id);
                  // Selected = brand fill + 2px ink border + check icon (never colour alone)
                  return (
                    <label
                      key={t.id}
                      className={`flex items-center justify-between gap-3 min-h-12 px-3 py-2 rounded-xl border-2 cursor-pointer select-none transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-deep ${
                        on ? "bg-brand border-ink" : "bg-white border-brand"
                      }`}
                    >
                      <input type="checkbox" checked={on} onChange={() => toggleTopping(t.id)} className="sr-only" />
                      <span className="flex items-center gap-2.5 text-[15px] text-ink">
                        <span
                          aria-hidden="true"
                          className={`w-6 h-6 shrink-0 rounded-md border-2 border-ink flex items-center justify-center ${on ? "bg-ink text-white" : "bg-white"}`}
                        >
                          {on && <Check size={16} strokeWidth={3} />}
                        </span>
                        <span className={on ? "font-black" : "font-bold"}>{t.name}</span>
                      </span>
                      <span className="text-[15px] font-extrabold text-ink whitespace-nowrap">+{rs(t.price)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-ink uppercase tracking-wider">Quantity</p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity" className={stepBtn}>
                <Minus size={20} strokeWidth={2.8} />
              </button>
              <span className="w-6 text-center font-black text-lg text-ink" aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className={stepBtn}>
                <Plus size={20} strokeWidth={2.8} />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor={noteId} className="block text-sm font-bold text-ink mb-1.5">
              Note <span className="font-semibold text-muted">(optional)</span>
            </label>
            <input
              id={noteId}
              type="text"
              placeholder="e.g. less spicy"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={100}
              className="w-full h-12 rounded-xl border-2 border-ink/30 bg-paper px-3 text-[15px] font-medium text-ink placeholder:text-muted focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-brand-deep"
            />
          </div>
        </div>

        {/* Foot */}
        <div className="px-4 pt-3 border-t-2 border-line" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <button
            type="button"
            onClick={handleAdd}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-dark active:bg-primary-dark text-white font-display font-black text-base whitespace-nowrap active:scale-[0.98] transition-[transform,background-color]"
          >
            Add · {rs(unit * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}
