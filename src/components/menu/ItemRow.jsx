import { Plus, Utensils } from "lucide-react";

const THUMB = 88;

// Photo thumbnail, or a same-size light tile with an icon for an item that has
// no photo yet (so the cards still line up). Used by the add sheet too.
export function ItemThumb({ src, alt, Icon = Utensils, size = THUMB, className = "" }) {
  const box = size ? { width: size, height: size } : undefined;
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        width={size || 160}
        height={size || 160}
        style={box}
        className={`rounded-xl object-cover bg-cream shrink-0 ${className}`}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      style={box}
      className={`rounded-xl bg-cream text-muted shrink-0 flex items-center justify-center ${className}`}
    >
      <Icon size={size ? Math.round(size * 0.4) : 48} strokeWidth={1.8} />
    </div>
  );
}

// One menu item as an MLTD-style card:
//   name / short description / price pill on the left,
//   square photo on the right with a round primary-blue "+" on its corner.
// The whole card is tappable (same action as the "+"), the "+" is the
// accessible control. showPhotos=false (section without photos) shows the
// icon tile instead of a photo, so every card keeps the same shape.
export default function ItemRow({ row, onAdd, showPhotos = false, Icon }) {
  const minPrice = Math.min(...row.options.map((o) => o.price));
  const hasChoice = row.options.length > 1;
  const line = row.desc || (hasChoice ? row.options.map((o) => o.label).join(" · ") : "");

  return (
    <li
      onClick={() => onAdd(row)}
      className="relative bg-paper rounded-2xl shadow-[0_1px_8px_rgba(0,0,0,0.07)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow cursor-pointer"
    >
      <div className="flex items-stretch gap-3 p-3.5 sm:p-4">
        <div className="flex-1 min-w-0 flex flex-col">
          <h4 className="font-display font-extrabold text-[15px] sm:text-base text-ink leading-snug line-clamp-2">{row.name}</h4>
          {line && <p className="mt-1 text-[13px] sm:text-sm text-muted leading-snug line-clamp-2">{line}</p>}
          <p className="mt-auto pt-3">
            <span className="inline-flex items-baseline gap-1 rounded-lg bg-cream px-2 py-1 font-display text-ink">
              {hasChoice && <span className="text-xs font-bold">From</span>}
              <span className="text-[17px] font-black whitespace-nowrap">Rs. {minPrice.toLocaleString("en-US")}</span>
            </span>
          </p>
        </div>

        <div className="relative shrink-0 self-start">
          <ItemThumb
            src={showPhotos ? row.image : null}
            alt={row.name}
            Icon={Icon}
            size={null}
            className="w-[118px] h-[118px] sm:w-[132px] sm:h-[132px]"
          />
          {/* 48px tap area, 36px visual primary-blue circle with a white plus */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(row);
            }}
            aria-label={hasChoice ? `Choose options for ${row.name}` : `Add ${row.name} to basket`}
            className="group absolute -bottom-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center"
          >
            <span className="w-9 h-9 rounded-full bg-primary group-hover:bg-primary-dark group-active:bg-primary-dark text-white flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.25)] ring-2 ring-white group-active:scale-90 transition-[transform,background-color]">
              <Plus size={20} strokeWidth={2.8} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </li>
  );
}
