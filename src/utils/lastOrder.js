// The most recent simulated order lives in sessionStorage (it disappears when the tab closes).
const KEY = "ms.lastOrder.v1";

export function saveLastOrder(order) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // storage blocked: the confirmation page will show its "not found" message
  }
}

export function readLastOrder() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
}
