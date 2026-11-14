import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Self-hosted fonts (font-display: swap), only the weights the site uses.
// Latin subset only — keeps the download small.
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/poppins/latin-800.css";
import "@fontsource/poppins/latin-900.css";
import "@fontsource/poppins/latin-700-italic.css";
import "@fontsource/poppins/latin-800-italic.css";
import "@fontsource/poppins/latin-900-italic.css";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
