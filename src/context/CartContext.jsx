import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { toPkIntl } from "../utils/contact";
import { SITE } from "../config/site";
import { buildOrderMessage } from "../utils/orderMessage";

const CartContext = createContext(null);

const DELIVERY_FEE = SITE.deliveryFee;
const DELIVERY_RADIUS_KM = SITE.deliveryRadiusKm;
const STORE_LOCATION = SITE.storeLocation;

function distanceKm(aLat, aLng, bLat, bLng) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);

  const hav =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * 6371 * Math.asin(Math.sqrt(hav));
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderType, setOrderType] = useState("Pickup");
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  const [deliveryCheck, setDeliveryCheck] = useState({
    checked: false,
    eligible: null,
    distanceKm: null,
  });

  const addLine = useCallback((line) => {
    setCart((prev) => [...prev, { uid: Date.now() + Math.random(), ...line }]);
  }, []);

  const removeLine = useCallback((uid) => {
    setCart((prev) => prev.filter((l) => l.uid !== uid));
  }, []);

  const updateLineQty = useCallback((uid, delta) => {
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.uid !== uid) return line;
          const nextQty = line.qty + delta;
          if (nextQty <= 0) return null;
          return {
            ...line,
            qty: nextQty,
            lineTotal: (line.unit || line.lineTotal / line.qty) * nextQty,
          };
        })
        .filter(Boolean)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const deliveryFee = useMemo(
    () => (orderType === "Delivery" ? DELIVERY_FEE : 0),
    [orderType]
  );

  const subtotal = useMemo(
    () => cart.reduce((s, l) => s + l.lineTotal, 0),
    [cart]
  );

  const total = useMemo(
    () => subtotal + deliveryFee,
    [subtotal, deliveryFee]
  );

  const itemCount = useMemo(
    () => cart.reduce((s, l) => s + l.qty, 0),
    [cart]
  );

  const shareLocation = useCallback((onStatus) => {
    if (!navigator.geolocation) {
      onStatus?.("Location sharing is not supported on this device.", false);
      return;
    }
    onStatus?.("Getting your location…", false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const km = distanceKm(latitude, longitude, STORE_LOCATION.lat, STORE_LOCATION.lng);
        const eligible = km <= DELIVERY_RADIUS_KM;
        const kmText = km.toFixed(1);

        setDeliveryCheck({ checked: true, eligible, distanceKm: km });

        const link = `https://maps.google.com/?q=${latitude},${longitude}`;
        setCustomer((prev) => ({
          ...prev,
          address: (prev.address ? prev.address + "\n" : "") + "My location: " + link,
        }));

        if (eligible) {
          onStatus?.(`Location added ✓ You are ${kmText} km away. Delivery is available.`, false);
        } else {
          onStatus?.(`You are ${kmText} km away (outside our ${DELIVERY_RADIUS_KM} km delivery area).`, true);
        }
      },
      () => onStatus?.("Could not get location — please type your address manually.", false)
    );
  }, []);

  const sendWhatsAppOrder = useCallback(() => {
    const { name, phone, address } = customer;

    if (cart.length === 0) return { ok: false, error: "Your basket is empty — please add an item first." };
    if (!name.trim()) return { ok: false, error: "Please enter your name." };
    if (orderType === "Delivery" && !phone.trim()) return { ok: false, error: "Please enter your phone number for delivery." };
    if (orderType === "Delivery" && !deliveryCheck.checked)
      return { ok: false, error: `Please share your GPS location first to verify ${DELIVERY_RADIUS_KM} km delivery coverage.` };
    if (orderType === "Delivery" && !deliveryCheck.eligible)
      return { ok: false, error: `Delivery is only available within ${DELIVERY_RADIUS_KM} km of the branch. Please switch to Pick-Up.` };
    if (orderType === "Delivery" && !address.trim())
      return { ok: false, error: "Please enter your delivery address." };

    // Message text only (MENU-SPEC §7) — built by a pure, tested function.
    const msg = buildOrderMessage({
      items: cart,
      orderType,
      deliveryFee,
      distanceKm: deliveryCheck.distanceKm,
      customer: { name, phone, address },
    });

    const whatsAppTarget = toPkIntl(SITE.whatsappNumber);
    window.open(`https://wa.me/${whatsAppTarget}?text=${encodeURIComponent(msg)}`, "_blank");
    return { ok: true };
  }, [cart, customer, orderType, deliveryCheck, deliveryFee]);

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      openCart,
      closeCart,
      addLine,
      removeLine,
      updateLineQty,
      clearCart,
      orderType,
      setOrderType,
      customer,
      setCustomer,
      deliveryCheck,
      subtotal,
      deliveryFee,
      total,
      itemCount,
      shareLocation,
      sendWhatsAppOrder,
    }),
    [
      cart,
      isOpen,
      openCart,
      closeCart,
      addLine,
      removeLine,
      updateLineQty,
      clearCart,
      orderType,
      customer,
      deliveryCheck,
      subtotal,
      deliveryFee,
      total,
      itemCount,
      shareLocation,
      sendWhatsAppOrder,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}