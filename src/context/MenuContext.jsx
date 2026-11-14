import { createContext, useContext } from "react";
import { SITE } from "../config/site";
import { CATEGORIES } from "../data/menu";
import { MENU_SECTIONS } from "../data/menuSections";
import { DEALS, DEAL_TABS } from "../data/deals";

// Menu lives in code (src/data/menu.js). No Firestore reads or writes.

const MenuContext = createContext(null);

const VALUE = {
  categories: CATEGORIES,
  settings: {
    callNumber: SITE.callNumber,
    whatsappNumber: SITE.whatsappNumber,
    logoImage: SITE.logoImage,
    branchStatus: "open",
  },
  sections: MENU_SECTIONS,
  deals: DEALS,
  dealTabs: DEAL_TABS,
};

export function MenuProvider({ children }) {
  return <MenuContext.Provider value={VALUE}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
}
