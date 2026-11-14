import { useEffect, useState } from "react";
import { UtensilsCrossed, Tag, Info, Phone } from "lucide-react";
import { SITE } from "../../config/site";
import { toLocalDisplay, toPhoneHref } from "../../utils/contact";
import { scrollToId } from "../../utils/scroll";

// Phone / small-tablet bottom navigation (below md): Menu, Deals, About, Call.
// Every item always shows its icon AND its label.
const LINKS = [
  { id: "menu", label: "Menu", Icon: UtensilsCrossed },
  { id: "deals", label: "Deals", Icon: Tag },
  { id: "about", label: "About", Icon: Info },
];

export default function BottomNav() {
  const [active, setActive] = useState(null);

  // Scroll-spy: the section sitting just under the sticky header + chips is active
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return;

    const offset =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--menu-offset"), 10) || 140;
    const visible = new Map();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        const first = LINKS.find((l) => visible.get(l.id));
        setActive(first ? first.id : null);
      },
      // A band just below the sticky bars
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const cell = "flex items-center justify-center h-16";
  const pill = (isActive) =>
    `min-w-16 min-h-12 px-3 rounded-full flex flex-col items-center justify-center gap-0.5 text-ink text-xs font-bold ${
      isActive ? "bg-brand font-black" : ""
    }`;

  return (
    <nav
      aria-label="Main"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-paper border-t-2 border-night"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {LINKS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <li key={id} className={cell}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  if (scrollToId(id)) e.preventDefault();
                }}
                aria-current={isActive ? "location" : undefined}
                className={pill(isActive)}
              >
                <Icon size={22} strokeWidth={isActive ? 2.6 : 2} aria-hidden="true" />
                <span>{label}</span>
              </a>
            </li>
          );
        })}
        <li className={cell}>
          <a href={toPhoneHref(SITE.callNumber)} aria-label={`Call ${toLocalDisplay(SITE.callNumber)}`} className={pill(false)}>
            <Phone size={22} strokeWidth={2} aria-hidden="true" />
            <span aria-hidden="true">Call</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
