import { MENU_ITEMS } from "../data/menuItems.js";

// Demo switches (set from the footer "Demo controls"). Stored so they survive refresh.
export const DEMO_KEY = "ms.demo.v1";
export const DEFAULT_DEMO = { fail: false, empty: false, changed: false };

export function readDemoFlags() {
  try {
    return { ...DEFAULT_DEMO, ...JSON.parse(localStorage.getItem(DEMO_KEY)) };
  } catch {
    return { ...DEFAULT_DEMO };
  }
}

export function saveDemoFlags(flags) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(flags));
  } catch {
    // storage unavailable: the switches simply won't persist
  }
}

// Waits `ms` milliseconds, but stops early (rejects) if the request is aborted.
function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

// "Changed availability" demo: one item sells out, another runs low.
function applyChangedAvailability(items) {
  return items.map((item) => {
    if (item.id === "pizza-chicken-tikka") return { ...item, stockToday: 0 };
    if (item.id === "side-fries") return { ...item, stockToday: 2 };
    return item;
  });
}

// Mock network call: ~800 ms, can fail, can return an empty menu.
export async function loadMenu({ signal } = {}) {
  await wait(800, signal);
  const flags = readDemoFlags();
  if (flags.fail) throw new Error("The menu could not be loaded (simulated failure).");
  if (flags.empty) return [];
  return flags.changed ? applyChangedAvailability(MENU_ITEMS) : MENU_ITEMS;
}
