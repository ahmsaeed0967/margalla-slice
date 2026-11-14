import { DELIVERY_AREAS } from "../data/deliveryAreas.js";
import { checkDeliveryMinimum } from "../rules/deliveryMinimum.js";

// Everything shown in the summary is DERIVED from the basket: nothing is stored twice.
export function summarize({ lines, items, orderType, areaId }) {
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.price, 0);

  const area = DELIVERY_AREAS.find((a) => a.id === areaId) ?? null;
  const deliveryFee = orderType === "delivery" && area ? area.fee : 0;

  // Ready time = slowest dish + 15 min (pick-up) or + 30 min (delivery)
  const prepTimes = lines.map((l) => items.find((i) => i.id === l.itemId)?.prepMinutes ?? 0);
  const readyMinutes = lines.length === 0 ? 0 : Math.max(...prepTimes) + (orderType === "delivery" ? 30 : 15);

  return {
    itemCount,
    subtotal,
    area,
    deliveryFee,
    total: subtotal + deliveryFee,
    readyMinutes,
    deliveryCheck: checkDeliveryMinimum({ subtotal, orderType }), // rule R3
  };
}

// "7:45 PM" for "now + minutes"
export function readyClock(minutes) {
  const time = new Date(Date.now() + minutes * 60000);
  return time.toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit" });
}
