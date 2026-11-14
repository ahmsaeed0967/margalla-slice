import { MapPin, ArrowRight, Bike, Store, Clock } from "lucide-react";
import Reveal from "../common/Reveal";
import BrushLabel from "../common/BrushLabel";
import { SITE } from "../../config/site";

export default function LocationMap() {
  return (
    <section id="location" className="py-12 lg:py-16 bg-cream border-t-2 border-line">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <Reveal className="mb-6 lg:mb-8">
          <h2 className="font-display font-black italic text-2xl lg:text-3xl">
            <BrushLabel className="px-5">Find Us</BrushLabel>
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-semibold text-ink">
            {SITE.pickupAvailable && (
              <li className="flex items-center gap-1.5">
                <Store size={18} className="text-brand-deep" aria-hidden="true" /> Pick-up from the shop
              </li>
            )}
            <li className="flex items-center gap-1.5">
              <Bike size={18} className="text-brand-deep" aria-hidden="true" /> Delivery within {SITE.deliveryRadiusKm} km · Fee Rs.{" "}
              {SITE.deliveryFee}
            </li>
            <li className="flex items-center gap-1.5">
              <Clock size={18} className="text-brand-deep" aria-hidden="true" /> Open {SITE.hours.label}
            </li>
          </ul>
        </Reveal>

        <Reveal className="bg-paper rounded-2xl lg:rounded-3xl border-2 border-brand overflow-hidden">
          <div className="relative w-full h-64 lg:h-80 bg-brand-tint">
            <iframe
              className="w-full h-full border-0"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${SITE.name}, Adyala Road, ${SITE.address.city}`)}&z=15&output=embed`}
              title={`${SITE.name} location on Google Maps`}
            />
          </div>

          <div className="p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t-2 border-line">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-tint text-brand-deep flex items-center justify-center shrink-0">
                <MapPin size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="font-display font-extrabold text-ink text-base leading-tight">{SITE.name}</p>
                <p className="text-sm font-medium text-muted mt-0.5">{SITE.address.line}</p>
              </div>
            </div>

            <a
              href={SITE.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-12 px-5 rounded-xl bg-night text-white font-display font-extrabold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span>Get directions</span>
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
