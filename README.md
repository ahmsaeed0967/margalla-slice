# Tasto Pizza — React Website + Admin Panel

Original single-file HTML site converted into a full **React (Vite)** project.
Every section is its own component, the whole site is responsive, and it now has
an **Admin Panel** where you can log in and add/remove pizzas (or any menu item)
without touching code — new items show up on the customer menu instantly.

---

## Urdu / Roman Urdu me short guide

Yeh poora website ab React components me convert ho chuka hai — har section
(Header, Hero, Deal Banner, Specials, Menu, Extras, Reviews, Location, Footer,
Cart) apna alag component hai. Poora site fully responsive hai (mobile, tablet,
desktop).

**Admin Panel** `/admin` route par hai:
- Login: username `admin`, password `tasto123` (yeh `src/context/AuthContext.jsx`
  me change kar sakte hain).
- Login ke baad aap Pizzas, Specials, Wings, aur Extras/Drinks — har category me
  naya item **add** kar sakte hain (naam, tasveer, description, price daal kar),
  ya koi purana item **edit/remove** kar sakte hain.
- Jaise hi aap koi naya item add karte hain, wo turant customer-facing menu me
  show ho jata hai — koi refresh ya publish button nahi chahiye.
- Data browser ke `localStorage` me save hota hai, isliye aapke changes browser
  band karne ke baad bhi maujood rehte hain.

Neeche "How to run" section me commands diye hain (`npm install` phir
`npm run dev`).

---

## Project structure

```
src/
  components/
    layout/       Header, TopRibbon, MobileNav, Footer
    sections/     Hero, DealBanner, Specials, Menu, Extras, Reviews, LocationMap
    menu/         PizzaCard, SimpleItemCard (Wing/Extra cards)
    cart/         BasketBar, CartDrawer
    admin/        ItemForm, CategoryManager
    common/       Reveal (scroll animation), StatusPill (open/closed)
  context/
    CartContext.jsx    basket state + WhatsApp checkout
    MenuContext.jsx    menu data (pizzas/specials/wings/extras) + CRUD, saved to localStorage
    AuthContext.jsx    admin login/logout (session-based)
  pages/
    Home.jsx                    customer-facing site
    admin/AdminLogin.jsx        admin login screen
    admin/AdminDashboard.jsx    admin dashboard with tabs per category
  routes/ProtectedRoute.jsx     redirects to /admin/login if not authenticated
  data/menuData.js              default/seed menu data
  hooks/useReveal.js, useOpenStatus.js
```

## How to run

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

- Customer site: `/`
- Admin login: `/admin/login`
- Admin dashboard (after login): `/admin`

## Build for production

```bash
npm run build
```

Output goes to `dist/` — upload that folder to any static host (Vercel,
Netlify, cPanel, etc).

## Things to change before going live

1. **Admin password** — edit `ADMIN_USERNAME` / `ADMIN_PASSWORD` in
   `src/context/AuthContext.jsx`. This is a simple client-side login, good for
   a small single-admin site; for stronger security wire this up to a real
   backend/auth service instead.
2. **WhatsApp number** — edit `WHATSAPP_NUMBER` in `src/context/CartContext.jsx`
   and the header/footer links in `Header.jsx` / `Footer.jsx`.
3. **Images** — placeholder SVGs live in `public/pics/`. Replace
   `logo.svg`, `deal.svg`, and `pizza-placeholder.svg` with your real photos
   (jpg/png work fine — just update the `src` paths, or upload new images from
   the Admin Panel per item).
4. **Menu data** — `src/data/menuData.js` is only the *starting* data. Once you
   add/edit items from the Admin Panel, everything is stored in the browser's
   `localStorage` under the key `tasto_menu_data_v1`. Use "Reset menu to
   defaults" in the admin dashboard if you want to start over.

## Notes on the admin data storage

This project has no backend — menu data is stored in the visitor's own browser
via `localStorage`. That means:

- Changes you make as admin are saved on **the device/browser you're using**.
- Customers on other devices will see whatever data was baked in at
  `src/data/menuData.js` (the defaults) unless you deploy an update, **or**
  you connect a real backend/database.
- For a production restaurant site with multiple staff logging in from
  different devices, you'll eventually want a small backend (e.g. Firebase,
  Supabase, or a simple Node/Express + database API) so menu changes made by
  admin are visible to *every* visitor everywhere. Happy to help wire that up
  if you need it.
