import { useMemo } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useMenu } from "../context/MenuContext.jsx";
import { reviewBasket } from "../rules/basketConflicts.js";

// Checks the saved basket against the current menu. It re-runs whenever the basket
// or the menu data changes (including after "Try again" or the demo controls).
export function useBasketReview() {
  const { lines } = useCart();
  const { items, status } = useMenu();
  return useMemo(() => {
    if (status !== "ready") return { conflicts: [], lines };
    return reviewBasket(lines, items);
  }, [lines, items, status]);
}
