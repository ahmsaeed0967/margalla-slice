import { useCallback, useMemo, useState } from "react";
import { Pizza, CookingPot, Hamburger, Sandwich, Drumstick, CupSoda, Utensils } from "lucide-react";
import { useMenu } from "../../context/MenuContext";
import { useCart } from "../../context/CartContext";
import { withPhotos, menuImage } from "../../utils/menuImages";
import ItemRow from "../menu/ItemRow";
import AddSheet from "../menu/AddSheet";
import CategoryBanner from "../menu/CategoryBanner";
import ToppingsInfo from "../menu/ToppingsInfo";

// Icon for the "no photo yet" tile in photo sections
const SECTION_ICON = {
  pizza: Pizza,
  pasta: CookingPot,
  burgers: Hamburger,
  wraps: Sandwich,
  sides: Drumstick,
  drinks: CupSoda,
};

// Photo on each category banner
const BANNER_IMAGE = {
  pizza: "/pics/Fajita.jpg",
  pasta: menuImage("crunchy-pasta"),
  burgers: menuImage("zinger-burger"),
  wraps: menuImage("malai-boti-wrap"),
  sides: menuImage("oven-wings"),
  drinks: menuImage("cola-next"),
};

// Resolve photos per section: thumbnails only if >= 80% of the section's items have one.
function usePhotoSections(sections) {
  return useMemo(
    () =>
      sections.map((section) => {
        const all = section.groups.flatMap((g) => g.rows);
        const { showPhotos, rows } = withPhotos(all);
        const byId = new Map(rows.map((r) => [r.id, r]));
        return {
          ...section,
          showPhotos,
          groups: section.groups.map((g) => ({ ...g, rows: g.rows.map((r) => byId.get(r.id)) })),
        };
      }),
    [sections]
  );
}

// All menu sections from src/data/menu.js as MLTD-style cards.
// Phones: one column. Tablet: two. Laptop (lg+): three.
export default function MenuSections() {
  const { sections } = useMenu();
  const { addLine, openCart } = useCart();
  const [sheetRow, setSheetRow] = useState(null);
  const view = usePhotoSections(sections);

  const closeSheet = useCallback(() => setSheetRow(null), []);

  function handleAdd(row) {
    if (row.options.length > 1 || row.toppings) {
      setSheetRow(row);
      return;
    }
    const o = row.options[0];
    addLine({
      name: o.cartName,
      size: o.cartSize,
      toppings: [],
      notes: "",
      qty: 1,
      image: row.image || "/pics/pizza-placeholder.svg",
      unit: o.price,
      lineTotal: o.price,
    });
    openCart();
  }

  function handleConfirm(line) {
    addLine(line);
    setSheetRow(null);
    openCart();
  }

  return (
    <div id="menu" className="bg-cream">
      {view.map((section) => {
        const Icon = SECTION_ICON[section.id] || Utensils;
        return (
          <section
            key={section.id}
            id={`cat-${section.id}`}
            data-category={section.id}
            data-photos={section.showPhotos ? "on" : "off"}
            className="menu-anchor pt-6 pb-4 lg:pt-10"
          >
            <div className="max-w-6xl mx-auto px-4 lg:px-6">
              <CategoryBanner title={section.title} image={BANNER_IMAGE[section.id]} />

              {section.groups.map((group) => (
                <div key={group.id} id={group.id} className="menu-anchor mt-5">
                  {group.title && section.groups.length > 1 && (
                    <h3 className="font-display font-black text-lg text-ink mb-3 flex items-center gap-2">
                      <span aria-hidden="true" className="w-1.5 h-5 rounded-full bg-brand" />
                      {group.title}
                    </h3>
                  )}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {group.rows.map((row) => (
                      <ItemRow key={row.id} row={row} onAdd={handleAdd} showPhotos={section.showPhotos} Icon={Icon} />
                    ))}
                  </ul>
                </div>
              ))}

              {/* Info only: extra topping prices, after the last pizza card */}
              {section.id === "pizza" && <ToppingsInfo />}
            </div>
          </section>
        );
      })}

      {sheetRow && (
        <AddSheet key={sheetRow.id} row={sheetRow} onClose={closeSheet} onConfirm={handleConfirm} />
      )}
    </div>
  );
}
