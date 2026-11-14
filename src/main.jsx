import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/checkout.css";
import App from "./App.jsx";
import { MenuProvider } from "./context/MenuContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MenuProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </MenuProvider>
    </BrowserRouter>
  </StrictMode>
);
