import { MapPin, Clock, Phone, MessageCircle, Bike, Store } from "lucide-react";
import { toLocalDisplay, toPhoneHref, toWhatsAppHref } from "../../utils/contact";
import { SITE } from "../../config/site";
import StatusPill from "../common/StatusPill";

// Night background: small text is white or brand-tint; brand blue only for large headings.
const link =
  "inline-flex items-center min-h-12 underline underline-offset-4 decoration-2 text-white hover:decoration-brand";

// Social icons (inline SVG glyphs, no icon dependency). Links come from SITE.social.
const SOCIAL = [
  {
    key: "facebook",
    label: "Facebook",
    path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  },
  {
    key: "instagram",
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.414.56.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.053 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.058-1.646.07-4.85.07s-3.585-.012-4.85-.07c-1.17-.053-1.805-.249-2.227-.413a3.71 3.71 0 0 1-1.382-.896 3.71 3.71 0 0 1-.896-1.382c-.164-.422-.36-1.057-.413-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.053-1.17.249-1.805.413-2.227.217-.562.477-.96.896-1.381.42-.419.819-.679 1.382-.896.422-.165 1.057-.36 2.227-.414C8.416 2.175 8.796 2.163 12 2.163M12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.902.333 4.14.63a5.88 5.88 0 0 0-2.126 1.384A5.88 5.88 0 0 0 .63 4.14C.333 4.902.13 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.058 1.277.261 2.15.558 2.913a5.88 5.88 0 0 0 1.384 2.126A5.88 5.88 0 0 0 4.14 23.37c.763.297 1.636.5 2.913.558C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.15-.261 2.913-.558a5.88 5.88 0 0 0 2.126-1.384 5.88 5.88 0 0 0 1.384-2.126c.297-.763.5-1.636.558-2.913.058-1.28.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.058-1.278-.261-2.15-.558-2.913a5.88 5.88 0 0 0-1.384-2.126A5.88 5.88 0 0 0 19.86.63C19.098.333 18.225.13 16.948.072 15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z",
  },
  {
    key: "tiktok",
    label: "TikTok",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z",
  },
];

function SocialIcons() {
  const base = "w-12 h-12 rounded-full bg-white text-ink flex items-center justify-center";
  return (
    <ul className="flex items-center gap-3 pt-2" aria-label="Social media">
      {SOCIAL.map(({ key, label, path }) => {
        const url = (SITE.social?.[key] || "").trim();
        const glyph = (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
            <path d={path} />
          </svg>
        );
        const name = `${SITE.name} on ${label}`;
        return (
          <li key={key}>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className={`${base} active:scale-95 transition-transform hover:ring-2 hover:ring-brand`}
              >
                {glyph}
              </a>
            ) : (
              // Link not added yet: shown, but not clickable (no href)
              <a aria-label={name} aria-disabled="true" className={`${base} cursor-default`}>
                {glyph}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Footer() {
  const callHref = toPhoneHref(SITE.callNumber);
  const whatsappHref = toWhatsAppHref(
    SITE.whatsappNumber,
    "Assalam-o-Alaikum, I would like to place an order from Tasto Pizza."
  );

  return (
    <footer
      className="bg-night text-white pt-12 overflow-hidden"
      // Keep the last line clear of the phone bottom nav + basket bar
      style={{ paddingBottom: "calc(2rem + var(--bottom-bars, 0px))" }}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/20">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={SITE.logoImage}
                alt=""
                width={48}
                height={48}
                loading="lazy"
                className="w-12 h-12 rounded-full bg-white ring-2 ring-white object-contain"
              />
              <span className="font-display font-black italic text-2xl text-white">TASTO PIZZA</span>
            </div>
            <p className="text-[15px] text-brand-tint font-medium">{SITE.tagline}</p>
            <StatusPill />
          </div>

          {/* Visit & order */}
          <div className="space-y-3 text-[15px]">
            <h2 className="font-display font-black text-2xl text-brand">Visit &amp; Order</h2>
            <p className="flex items-start gap-2.5">
              <MapPin size={18} className="shrink-0 mt-0.5 text-brand-tint" aria-hidden="true" />
              <span>{SITE.address.line}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Clock size={18} className="shrink-0 text-brand-tint" aria-hidden="true" />
              <span>Open {SITE.hours.label}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone size={18} className="shrink-0 text-brand-tint" aria-hidden="true" />
              <a href={callHref} className={link}>
                Call {toLocalDisplay(SITE.callNumber)}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <MessageCircle size={18} className="shrink-0 text-brand-tint" aria-hidden="true" />
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={link}>
                WhatsApp {toLocalDisplay(SITE.whatsappNumber)}
              </a>
            </p>
            <SocialIcons />
          </div>

          {/* Delivery */}
          <div className="space-y-3 text-[15px]">
            <h2 className="font-display font-black text-2xl text-brand">Delivery</h2>
            <p className="flex items-start gap-2.5">
              <Bike size={18} className="shrink-0 mt-0.5 text-brand-tint" aria-hidden="true" />
              <span>
                Within {SITE.deliveryRadiusKm} km of the shop · Fee Rs. {SITE.deliveryFee}
              </span>
            </p>
            {SITE.pickupAvailable && (
              <p className="flex items-start gap-2.5">
                <Store size={18} className="shrink-0 mt-0.5 text-brand-tint" aria-hidden="true" />
                <span>Pick-up from the shop, no fee</span>
              </p>
            )}
            {SITE.deliveryTimeText && (
              <p className="flex items-start gap-2.5">
                <Clock size={18} className="shrink-0 mt-0.5 text-brand-tint" aria-hidden="true" />
                <span>Delivery time: {SITE.deliveryTimeText}</span>
              </p>
            )}
          </div>
        </div>

        <div className="my-8 flex justify-center">
          <div className="w-full max-w-xl bg-white rounded-2xl p-3 sm:p-4">
            <img
              src="/pics/footer-brand.webp"
              alt={`${SITE.name} — ${SITE.tagline}`}
              width={1200}
              height={200}
              className="w-full h-auto max-h-16 sm:max-h-24 object-contain"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-brand-tint font-medium text-center">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>{SITE.address.line}</p>
        </div>
      </div>
    </footer>
  );
}
