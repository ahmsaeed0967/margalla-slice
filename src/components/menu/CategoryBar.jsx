import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { scrollBehavior } from "../../utils/scroll";

// Where each chip scrolls to.
const targetId = (catId) => (catId === "deals" ? "deals" : `cat-${catId}`);

// Sticky, horizontally scrollable chip bar (MENU-SPEC §1, §9), MLTD-style:
// white bar, primary-blue pills with white text, the active pill charcoal (night) with a check mark.
export default function CategoryBar() {
  const { categories } = useMenu();
  const [active, setActive] = useState(categories[0]?.id);
  const barRef = useRef(null);
  const chipRefs = useRef({});
  const lockUntil = useRef(0);

  // The bar sticks to the very top of the screen (the header scrolls away).
  // Sections scroll to just below it.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const update = () =>
      document.documentElement.style.setProperty("--menu-offset", `${bar.offsetHeight + 8}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  // Highlight the chip of the section currently under the bar
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      if (Date.now() < lockUntil.current) return;
      const offset = (barRef.current?.getBoundingClientRect().bottom ?? 0) + 16;
      let current = categories[0]?.id;
      for (const c of categories) {
        const el = document.getElementById(targetId(c.id));
        if (el && el.getBoundingClientRect().top <= offset) current = c.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [categories]);

  // Keep the active chip visible inside the bar (scrolls the bar only, never the page)
  useEffect(() => {
    const bar = barRef.current;
    const chip = chipRefs.current[active];
    if (!bar || !chip) return;
    const left = chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2;
    bar.scrollTo({ left: Math.max(0, left), behavior: scrollBehavior() });
  }, [active]);

  function goTo(catId) {
    const el = document.getElementById(targetId(catId));
    if (!el) return;
    setActive(catId);
    lockUntil.current = Date.now() + 900; // don't flicker through chips while scrolling
    el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-0 z-30 bg-paper shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
    >
      <div
        ref={barRef}
        className="max-w-6xl mx-auto flex gap-2 overflow-x-auto px-4 lg:px-6 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              ref={(el) => (chipRefs.current[c.id] = el)}
              type="button"
              onClick={() => goTo(c.id)}
              aria-current={isActive ? "true" : undefined}
              className={`h-11 px-4 shrink-0 rounded-full font-display text-sm whitespace-nowrap inline-flex items-center gap-1.5 transition-colors ${
                isActive ? "bg-night text-white font-black shadow-md" : "bg-primary text-white font-bold"
              }`}
            >
              {isActive && <Check size={16} strokeWidth={3} aria-hidden="true" />}
              {c.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
