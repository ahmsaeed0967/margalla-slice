import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Pencil } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { useCart } from "../../context/CartContext";
import { choiceText, includesText } from "../../data/deals";
import CategoryBanner from "../menu/CategoryBanner";
import AddSheet from "../menu/AddSheet";
import { scrollToId } from "../../utils/scroll";

const PLACEHOLDER = "/pics/pizza-placeholder.svg";
const fmt = (n) => n.toLocaleString("en-US");

// Groups are shown in this order, all at once (no tab switching).
const GROUP_ORDER = ["deals", "combos", "family"];
const GROUP_TITLE = { deals: "Deals", combos: "Combos", family: "Family Deals" };
const groupId = (tab) => `deals-${tab}`;

// Cart line for a deal, in the existing addLine shape.
// The picks + includes live in the separate `deal` field, which the order
// message (src/utils/orderMessage.js) prints as:
//   "Pizza: Medium · Chicken Fajita" / "Includes: 2 Zinger Burger, ..."
// `notes` holds only the customer's own note.
function dealLine(deal, { picks = {}, qty = 1, notes = "" } = {}) {
  const choiceLines = deal.choices.map((c) => choiceText(c, picks[c.id] ?? c.default));
  const includes = includesText(deal);
  return {
    name: deal.label,
    size: null,
    toppings: [],
    notes,
    qty,
    image: deal.image || PLACEHOLDER,
    unit: deal.price,
    lineTotal: deal.price * qty,
    deal: { id: deal.id, choices: choiceLines, includes, note: notes },
  };
}

// "Choose pizza flavour", "Choose pasta", "Choose 2 wraps", "Choose 2 dips"
function choicePrompts(deal) {
  const groups = new Map();
  for (const c of deal.choices) {
    const base = c.label.replace(/\s\d+$/, "").toLowerCase(); // "Wrap 1" -> "wrap"
    groups.set(base, (groups.get(base) || 0) + 1);
  }
  return [...groups].map(([base, n]) =>
    base === "pizza" ? "Choose pizza flavour" : n > 1 ? `Choose ${n} ${base}s` : `Choose ${base}`
  );
}

// Compact deal card: shorter photo strip, title + price on one line,
// the "includes" list as flowing text instead of one line per item.
function DealCard({ deal, onAdd }) {
  const [imgOk, setImgOk] = useState(Boolean(deal.image));

  return (
    <article className="bg-paper rounded-2xl shadow-[0_1px_8px_rgba(0,0,0,0.07)] overflow-hidden flex flex-col">
      {imgOk && (
        <div className="bg-white px-3 pt-3">
          <img
            src={deal.image}
            alt={`${deal.label}: ${deal.includes.join(", ")}`}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            onError={() => setImgOk(false)}
            className="w-full h-32 sm:h-36 object-contain"
          />
        </div>
      )}

      <div className="px-4 pt-3 pb-4 flex-1 flex flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display font-black italic uppercase tracking-tight text-lg text-ink leading-tight">
            {deal.label}
          </h3>
          <p className="font-display font-black text-xl text-brand-deep whitespace-nowrap">Rs. {fmt(deal.price)}</p>
        </div>

        <p className="mt-1.5 text-sm text-muted leading-snug flex-1">
          <Check size={15} strokeWidth={3} className="inline text-brand-deep align-[-2px] mr-1" aria-hidden="true" />
          {deal.includes.join(" · ")}
        </p>

        {deal.choices.length > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-brand-deep">
            <Pencil size={14} strokeWidth={2.4} aria-hidden="true" />
            {choicePrompts(deal).join(" · ")}
          </p>
        )}

        <button
          type="button"
          onClick={() => onAdd(deal)}
          className="mt-3 w-full h-12 rounded-xl bg-primary hover:bg-primary-dark active:bg-primary-dark text-white font-display font-black text-base whitespace-nowrap active:scale-[0.98] transition-[transform,background-color]"
        >
          Add · Rs. {fmt(deal.price)}
        </button>
      </div>
    </article>
  );
}

// Deals & combos (MENU-SPEC §3), right after the hero.
export default function DealsSection() {
  const { deals, dealTabs } = useMenu();
  const { addLine } = useCart();
  const groups = GROUP_ORDER.map((id) => {
    const items = deals.filter((d) => d.tab === id);
    const prices = new Set(items.map((d) => d.price));
    return {
      id,
      label: dealTabs.find((t) => t.id === id)?.label ?? GROUP_TITLE[id],
      title: GROUP_TITLE[id],
      items,
      samePrice: items.length > 0 && prices.size === 1 ? items[0].price : null,
    };
  }).filter((g) => g.items.length > 0);
  const [activeGroup, setActiveGroup] = useState(groups[0]?.id ?? null);
  const groupRefs = useRef({});
  const groupKey = groups.map((g) => g.id).join(",");
  const [sheetDeal, setSheetDeal] = useState(null);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Scroll-spy: the group sitting just under the sticky header + chips is active
  useEffect(() => {
    const ids = groupKey.split(",").filter(Boolean);
    const els = ids.map((id) => groupRefs.current[id]).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return;

    const offset =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--menu-offset"), 10) || 140;
    const visible = new Map();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.dataset.group, e.isIntersecting));
        const first = ids.find((id) => visible.get(id));
        if (first) setActiveGroup(first);
      },
      // A band just below the sticky bars
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groupKey]);

  const showToast = () => {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 1800);
  };

  const closeSheet = useCallback(() => setSheetDeal(null), []);

  function handleAdd(deal) {
    if (deal.choices.length > 0) {
      setSheetDeal(deal);
      return;
    }
    addLine(dealLine(deal));
    showToast();
  }

  function handleConfirm(line) {
    addLine(line);
    setSheetDeal(null);
    showToast();
  }

  return (
    <section id="deals" className="menu-anchor bg-cream pt-6 pb-4 lg:pt-10">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <CategoryBanner title="Deals" image="/pics/deals/deal-01.webp" />

        <nav aria-label="Deal types" className="mt-5 flex gap-2 flex-wrap">
          {groups.map((g) => {
            const active = g.id === activeGroup;
            return (
              <a
                key={g.id}
                href={`#${groupId(g.id)}`}
                aria-current={active ? "true" : undefined}
                onClick={(e) => {
                  if (scrollToId(groupId(g.id))) e.preventDefault();
                  setActiveGroup(g.id);
                }}
                className={`h-11 px-5 rounded-full font-display text-sm inline-flex items-center gap-1.5 transition-colors ${
                  active ? "bg-night text-white font-black" : "bg-primary text-white border-2 border-primary font-bold"
                }`}
              >
                {active && <Check size={16} strokeWidth={3} aria-hidden="true" />}
                {g.label} {g.items.length}
              </a>
            );
          })}
        </nav>

        {groups.map((g) => (
          <div
            key={g.id}
            data-group={g.id}
            ref={(el) => {
              groupRefs.current[g.id] = el;
            }}
            className="mt-5"
          >
            <h3
              id={groupId(g.id)}
              className="menu-anchor font-display font-black text-lg text-ink mb-3 flex items-center gap-2"
            >
              <span aria-hidden="true" className="w-1.5 h-5 rounded-full bg-brand" />
              {g.title}
              {g.samePrice !== null && (
                <span className="ml-1 text-sm font-bold text-muted">Rs. {fmt(g.samePrice)} each</span>
              )}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {g.items.map((deal) => (
                <DealCard key={deal.id} deal={deal} onAdd={handleAdd} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {sheetDeal && (
        <AddSheet
          key={sheetDeal.id}
          row={{
            name: sheetDeal.label,
            desc: sheetDeal.includes.join(" · "),
            image: null,
            options: [{ key: "deal", label: sheetDeal.label, price: sheetDeal.price }],
            choices: sheetDeal.choices,
          }}
          buildLine={({ qty, notes, picks }) => dealLine(sheetDeal, { picks, qty, notes })}
          onClose={closeSheet}
          onConfirm={handleConfirm}
        />
      )}

      <div
        role="status"
        aria-live="polite"
        className={`fixed left-1/2 -translate-x-1/2 z-50 px-5 h-12 rounded-full bg-night text-white font-display font-extrabold text-[15px] flex items-center gap-2 shadow-lg transition-opacity duration-200 pointer-events-none ${
          toast ? "opacity-100" : "opacity-0"
        }`}
        style={{ bottom: "calc(var(--bottom-bars, 0px) + 12px)" }}
      >
        {toast && (
          <>
            <Check size={18} strokeWidth={3} aria-hidden="true" />
            Added
          </>
        )}
      </div>
    </section>
  );
}
