import { Phone } from "lucide-react";
import TopRibbon from "./TopRibbon";
import StatusPill from "../common/StatusPill";
import { toLocalDisplay, toPhoneHref, toWhatsAppHref } from "../../utils/contact";
import { SITE } from "../../config/site";

// Charcoal header, white text (MLTD-style). It scrolls away with the page; the
// category bar below is what stays fixed at the top while browsing the menu.
// The basket lives in the "View basket" bar, not here.
// WhatsApp logo glyph (inline, no icon dependency)
function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Header() {
  const callHref = toPhoneHref(SITE.callNumber);
  // Same number and wa.me format as checkout (digits only, with country code)
  const whatsappHref = toWhatsAppHref(SITE.whatsappNumber, "Hi Tasto Pizza");

  return (
    <header className="relative z-40 bg-night text-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between gap-3 h-16 lg:h-20">
          <a href="#top" className="flex items-center gap-2.5 min-w-0 min-h-12 rounded-full" aria-label={`${SITE.name} — back to top`}>
            <img
              src={SITE.logoImage}
              alt=""
              width={48}
              height={48}
              loading="eager"
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white ring-2 ring-white object-contain shrink-0"
            />
            <span className="min-w-0">
              <span className="block font-display font-black italic text-lg lg:text-2xl leading-none tracking-tight">
                TASTO PIZZA
              </span>
              <span className="block font-bold text-xs tracking-[0.18em] uppercase mt-1 text-brand-tint">{SITE.tagline}</span>
            </span>
          </a>

          {/* Desktop navigation — same targets as the phone bottom nav */}
          <nav aria-label="Sections" className="hidden lg:flex items-center gap-1 font-display text-base font-extrabold">
            {[
              ["#deals", "Deals"],
              ["#menu", "Menu"],
              ["#about", "About"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="px-3 h-12 inline-flex items-center rounded-full hover:underline underline-offset-4 decoration-2">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <StatusPill className="hidden md:inline-flex" />
            <a
              href={callHref}
              aria-label={`Call ${toLocalDisplay(SITE.callNumber)}`}
              className="w-12 h-12 rounded-full bg-white text-ink flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <Phone size={20} strokeWidth={2.4} aria-hidden="true" />
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="w-12 h-12 rounded-full bg-[#1DA851] text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <WhatsAppGlyph />
            </a>
          </div>
        </div>
      </div>

      <TopRibbon />
    </header>
  );
}
