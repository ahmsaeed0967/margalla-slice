import { Award, Leaf, ShieldCheck, Tag, Smile, Heart } from "lucide-react";
import { SITE } from "../../config/site";

// Text and order taken from the client's "About Tasto Pizza" poster (menu-source/about .jpeg,
// MENU-SPEC §8), rebuilt as live text in the site's colours. Night background:
// white text, brand-tint for secondary text, brand blue only for large bold headings.

const FEATURES = [
  { label: "Quality Ingredients", Icon: Award },
  { label: "Freshness Always", Icon: Leaf },
  { label: "Hygienic Preparation", Icon: ShieldCheck },
  { label: "Reasonable Prices", Icon: Tag },
  { label: "Great Taste", Icon: Smile },
];

// Faint line-art pizza slice, decorative only (like the poster's lower-left corner)
function SliceArt({ className }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M20 40 L180 70 L60 185 Z" />
      <path d="M20 40 C60 20 140 35 180 70" />
      <circle cx="75" cy="85" r="10" />
      <circle cx="110" cy="105" r="8" />
      <circle cx="75" cy="135" r="9" />
      <path d="M95 140 q8 -6 16 0" />
      <path d="M50 65 q6 8 14 4" />
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-night text-white py-12 lg:py-16">
      <SliceArt className="absolute -left-10 bottom-10 w-56 h-56 lg:w-72 lg:h-72 text-brand-tint opacity-10 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
          <div>
            <h2 className="font-display font-black leading-tight">
              <span className="block text-3xl lg:text-4xl text-white">About</span>
              <span className="block text-4xl lg:text-5xl text-brand">{SITE.name}</span>
            </h2>
            <span className="block w-12 h-1 rounded-full bg-white mt-4" aria-hidden="true" />
          </div>
          <p className="font-display italic font-bold text-xl lg:text-2xl text-brand-tint lg:-rotate-6 lg:mt-2">
            Fresh Food, Great Taste
          </p>
        </div>

        <p className="mt-5 text-base lg:text-lg leading-relaxed max-w-3xl">
          Tasto Pizza is your destination for a complete fast-food experience, offering delicious, fresh, and quality
          food at reasonable prices. We focus on quality ingredients, freshness, hygiene, and great taste in everything
          we serve.
        </p>

        <p className="mt-5 inline-block rounded-xl bg-white text-ink px-4 py-2 font-display font-black text-base lg:text-lg">
          High Quality, Low Price — That&apos;s Our Mission.
        </p>

        <p className="mt-4 text-base text-brand-tint">At Tasto Pizza, we strive to earn your trust with every order.</p>

        <p className="mt-6 font-display font-black text-xl">
          Welcome, Our Valued Customers!
          <Heart size={20} strokeWidth={2.4} className="inline-block align-[-3px] ml-2" aria-hidden="true" />
        </p>

        {/* Five features: 3 + 2 on phones (second row centred), one row with thin dividers on wider screens */}
        <ul className="mt-8 grid grid-cols-6 sm:flex sm:justify-between gap-y-6 sm:gap-0">
          {FEATURES.map(({ label, Icon }, i) => (
            <li
              key={label}
              className={`col-span-2 ${i === 3 ? "col-start-2" : ""} sm:flex-1 flex flex-col items-center text-center px-2 sm:border-l sm:border-white/30 sm:first:border-l-0`}
            >
              <span className="w-14 h-14 rounded-full bg-white text-brand-deep flex items-center justify-center">
                <Icon size={26} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="mt-2 text-sm font-bold leading-tight">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
