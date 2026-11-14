import { createContext, useContext, useEffect, useState } from "react";
import { checkStockLimit } from "../rules/stockLimit.js";
import { checkSizeEligibility } from "../rules/sizeEligibility.js";
import { lineKey, reviewBasket } from "../rules/basketConflicts.js";
import { unitPrice } from "../utils/pricing.js";

const CartContext = createContext(null);
const STORAGE_KEY = "ms.basket.v1";

function isValidLine(line) {
  return (
    line &&
    typeof line.itemId === "string" &&
    typeof line.name === "string" &&
    (line.size === null || typeof line.size === "string") &&
    Number.isInteger(line.qty) &&
    line.qty > 0 &&
    typeof line.price === "number"
  );
}

// Reads the saved basket. Corrupt or missing data just gives an empty basket.
function readSaved() {
  const empty = { lines: [], orderType: "pickup", areaId: "" };
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data || !Array.isArray(data.lines)) return empty;
    return {
      lines: data.lines.filter(isValidLine).map((l) => ({ ...l, key: lineKey(l.itemId, l.size) })),
      orderType: data.orderType === "delivery" ? "delivery" : "pickup",
      areaId: typeof data.areaId === "string" ? data.areaId : "",
    };
  } catch {
    return empty;
  }
}

// The basket, shared by header, cards, details page, basket bar, basket page and checkout.
export function CartProvider({ children }) {
  const [saved] = useState(readSaved);
  const [lines, setLines] = useState(saved.lines);
  const [orderType, setOrderType] = useState(saved.orderType);
  const [areaId, setAreaId] = useState(saved.areaId);

  // Save to localStorage whenever the basket or the delivery choice changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, orderType, areaId }));
    } catch {
      // storage full or blocked: the basket still works, it just isn't saved
    }
  }, [lines, orderType, areaId]);

  const qtyForItem = (itemId) =>
    lines.filter((l) => l.itemId === itemId).reduce((sum, l) => sum + l.qty, 0);

  const qtyForLine = (key) => lines.find((l) => l.key === key)?.qty ?? 0;

  // Adds `qty` of an item. Rules R1 and R2 are checked here too, not only in the UI.
  function addLine(item, size, qty) {
    const key = lineKey(item.id, size);
    const sizeCheck = checkSizeEligibility({ special: item.special, size });
    if (!sizeCheck.ok) return sizeCheck;

    const otherQty = qtyForItem(item.id) - qtyForLine(key);
    const stockCheck = checkStockLimit({
      quantity: qtyForLine(key) + qty,
      stock: item.stockToday - otherQty,
    });
    if (!stockCheck.ok) return stockCheck;

    const price = unitPrice(item, size);
    setLines((prev) =>
      prev.some((l) => l.key === key)
        ? prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
        : [...prev, { key, itemId: item.id, name: item.name, size, qty, price }]
    );
    return stockCheck;
  }

  const setQty = (key, qty) =>
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty } : l)));

  const removeLine = (key) => setLines((prev) => prev.filter((l) => l.key !== key));

  const clearBasket = () => setLines([]);

  // "Update basket": apply the automatic fixes from reviewBasket
  const repairBasket = (items) => setLines((prev) => reviewBasket(prev, items).lines);

  const value = {
    lines,
    orderType,
    areaId,
    itemCount: lines.reduce((sum, l) => sum + l.qty, 0),
    qtyForItem,
    qtyForLine,
    addLine,
    setQty,
    removeLine,
    clearBasket,
    repairBasket,
    setOrderType,
    setAreaId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react/only-export-components
export function useCart() {
  return useContext(CartContext);
}
