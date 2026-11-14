import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

// "View basket" bar: night, white bold text, ONE line. Directly above the phone
// bottom nav; a centred pill (max-w-xl) on desktop. Only shown when the basket
// has items. Sets data-basket on <html> so --bottom-bars (index.css) grows and
// the footer keeps its last line clear.
export default function BasketBar() {
  const { itemCount, total, openCart } = useCart();
  const visible = itemCount > 0;

  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.dataset.basket = "on";
    else delete root.dataset.basket;
    return () => {
      delete root.dataset.basket;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 z-40 px-3 pt-2"
      style={{ bottom: "var(--nav-total, 0px)", paddingBottom: "var(--basket-pad, 8px)" }}
    >
      <button
        type="button"
        onClick={openCart}
        className="w-full md:max-w-xl mx-auto h-14 rounded-2xl md:rounded-full bg-night text-white border-2 border-brand font-display font-extrabold text-sm min-[400px]:text-base whitespace-nowrap flex items-center justify-between gap-3 px-4 shadow-[0_8px_24px_-6px_rgba(5,42,68,0.55)] active:scale-[0.99] transition-transform"
      >
        <span className="flex items-center gap-2">
          <span className="relative">
            <ShoppingBag size={22} strokeWidth={2.2} aria-hidden="true" />
            <span className="absolute -top-2 -right-2.5 min-w-5 h-5 px-1 rounded-full bg-brand text-ink text-xs font-black flex items-center justify-center" aria-hidden="true">
              {itemCount}
            </span>
          </span>
          <span className="ml-1">View basket</span>
        </span>
        <span>
          {itemCount} {itemCount === 1 ? "item" : "items"} · Rs. {total.toLocaleString("en-US")}
        </span>
      </button>
    </div>
  );
}
