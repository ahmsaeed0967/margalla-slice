import { Link, NavLink, Outlet } from "react-router-dom";
import Logo from "./Logo.jsx";
import BasketBar from "./BasketBar.jsx";
import { useCart } from "../context/CartContext.jsx";
import { SITE } from "../config/site.js";

// Shared frame for every page: skip link, header + navigation, <main> (the routed page), footer.
export default function Layout() {
  const { itemCount } = useCart();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <p className="demo-banner">{SITE.demoLabel}</p>
      <header className="site-header">
        <Link to="/" className="brand">
          <Logo />
          <span>{SITE.name}</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav-list">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/menu">Menu</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/basket">
                Basket
                <span className="badge">
                  {itemCount}
                  <span className="visually-hidden"> items in basket</span>
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main">
        <Outlet />
      </main>

      <BasketBar />

      <footer className="site-footer">
        <p>
          <strong>{SITE.name}</strong> is a fictional restaurant. {SITE.demoLabel}. No personal data is stored or sent.
        </p>
      </footer>
    </>
  );
}
