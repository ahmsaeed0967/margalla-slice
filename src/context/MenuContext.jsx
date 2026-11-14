import { createContext, useContext, useEffect, useState } from "react";
import { loadMenu } from "../services/menuApi.js";

const MenuContext = createContext(null);

// Loads the menu once and shares it (plus loading/error state) with every page.
export function MenuProvider({ children }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0); // bump this to load again

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    loadMenu({ signal: controller.signal })
      .then((data) => {
        setItems(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // we left; ignore
        setError(err.message);
        setStatus("error");
      });
    return () => controller.abort(); // cleanup: cancel a request still in flight
  }, [attempt]);

  const reload = () => setAttempt((n) => n + 1);

  return (
    <MenuContext.Provider value={{ items, status, error, reload }}>{children}</MenuContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components
export function useMenu() {
  return useContext(MenuContext);
}
