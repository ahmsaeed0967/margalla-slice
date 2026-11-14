import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MenuProvider } from "./context/MenuContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";

// There is no admin panel: the menu lives in code (src/data/menu.js, src/data/deals.js)
// and the shop details in src/config/site.js. The old admin pages were removed;
// they are still in git history (commit 48ff998 and earlier) if ever needed.

export default function App() {
  return (
    <MenuProvider>
      <BrowserRouter>
        <Routes>
          {/* Home route with CartProvider */}
          <Route
            path="/"
            element={
              <CartProvider>
                <Home />
              </CartProvider>
            }
          />

          {/* Admin routes closed -> Home */}
          <Route path="/admin/*" element={<Navigate to="/" replace />} />

          {/* Fallback for any unknown route -> Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MenuProvider>
  );
}
