import { BadgeCheck, Clock } from "lucide-react";
import { SITE } from "../../config/site";

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

// Hero with the shop-front photo as the background (as on the original site).
// A dark overlay (flat + gradient) keeps the white text readable on any part
// of the photo; the text block also sits on its own dark, blurred panel.
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-night text-white">
      <img
        src="/pics/shop-front.webp"
        alt=""
        width={1200}
        height={900}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
      />
      {/* Flat darkening + directional gradient (stronger at the bottom-left, where the text is) */}
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,.25) 0%, rgba(10,10,10,.35) 45%, rgba(10,10,10,.9) 100%), linear-gradient(100deg, rgba(10,10,10,.6) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 lg:px-6 pt-24 pb-10 sm:pt-32 lg:pt-40 lg:pb-16 min-h-[460px] sm:min-h-[520px] lg:min-h-[600px] flex flex-col justify-end">
        <div className="max-w-xl">
          <p className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm font-bold text-ink">
            Fresh out of the oven
          </p>

          <h1 className="mt-4 font-display font-black italic leading-[1.05] text-[2.5rem] sm:text-5xl lg:text-6xl tracking-tight drop-shadow-[0_3px_18px_rgba(0,0,0,.7)]">
            Hot, Cheesy &amp;
            <br />
            Made Just For You.
          </h1>

          <p className="mt-4 text-base lg:text-lg font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,.7)]">
            Hand-tossed dough, smoky chicken and our signature sauces, cooked fresh at our kitchen{" "}
            {lowerFirst(SITE.address.line.replace(/, Rawalpindi$/, ""))}.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
            <a
              href="#deals"
              className="h-[52px] rounded-full bg-brand text-ink font-display font-black text-base flex items-center justify-center active:scale-95 transition-transform"
            >
              See Deals
            </a>
            <a
              href="#menu"
              className="h-[52px] rounded-full bg-white text-ink font-display font-black text-base flex items-center justify-center active:scale-95 transition-transform"
            >
              View Menu
            </a>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-bold">
            {SITE.showHalalBadge && (
              <li className="flex items-center gap-1.5">
                <BadgeCheck size={18} aria-hidden="true" /> 100% Halal
              </li>
            )}
            <li className="flex items-center gap-1.5">
              <Clock size={18} aria-hidden="true" /> Open {SITE.hours.label}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
