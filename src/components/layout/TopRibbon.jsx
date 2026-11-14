import { SITE } from "../../config/site";

// One neutral info line on night (under the charcoal header), values from src/config/site.js.
export default function TopRibbon() {
  return (
    <p className="bg-night text-white border-t border-white/15 text-center py-2 px-4 font-display font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
      Delivery within {SITE.deliveryRadiusKm} km · Fee Rs. {SITE.deliveryFee}
    </p>
  );
}
