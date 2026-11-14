// Smooth scrolling unless the visitor asked for reduced motion.
export function scrollBehavior() {
  if (typeof window === "undefined" || !window.matchMedia) return "smooth";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

// Scroll to a section by id. The section's CSS scroll-margin-top keeps it
// clear of the sticky header + category chips.
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  return true;
}
