import { useEffect, useState } from "react";
import { SITE } from "../config/site";

// Opening hours come from src/config/site.js (12:00 PM to 3:00 AM PKT, every day).
const { timeZone, openMinutes, closeMinutes } = SITE.hours;

function computeStatus() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date());
  const hour = parseInt(parts.find((p) => p.type === "hour").value, 10);
  const minute = parseInt(parts.find((p) => p.type === "minute").value, 10);
  const minutesNow = hour * 60 + minute;
  // Hours cross midnight (open > close)
  return minutesNow >= openMinutes || minutesNow < closeMinutes;
}

export default function useOpenStatus() {
  const [isOpen, setIsOpen] = useState(computeStatus());

  useEffect(() => {
    const id = setInterval(() => setIsOpen(computeStatus()), 60000);
    return () => clearInterval(id);
  }, []);

  return isOpen;
}
