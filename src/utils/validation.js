import { TIME_SLOTS } from "../config/site.js";

export const NOTE_MAX = 120;

// Checks ONE field and returns an error message ("" when it is fine).
// `values` holds every field because the area depends on the order type.
export function validateField(field, values) {
  switch (field) {
    case "name": {
      const length = values.name.trim().length;
      if (length === 0) return "Enter a name for the order.";
      if (length < 2) return "The name must have at least 2 characters.";
      if (length > 40) return "The name must have at most 40 characters.";
      return "";
    }
    case "phone": {
      const digits = values.phone.replace(/[\s-]/g, "");
      if (digits === "") return "Enter a mobile number, e.g. 0300-1234567.";
      if (!/^\d+$/.test(digits)) return "Use digits only (dashes and spaces are fine).";
      if (!/^03\d{9}$/.test(digits)) return "Use a Pakistani mobile number: 11 digits starting with 03.";
      return "";
    }
    case "area":
      return values.orderType === "delivery" && !values.areaId ? "Choose a delivery area." : "";
    case "slot":
      return TIME_SLOTS.includes(values.slot) ? "" : "Choose a time slot.";
    case "note":
      return values.note.length > NOTE_MAX ? `The note must be at most ${NOTE_MAX} characters.` : "";
    default:
      return "";
  }
}

export const FIELD_ORDER = ["name", "phone", "area", "slot", "note"];

// Returns { fieldName: message } for every invalid field
export function validateAll(values) {
  const errors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, values);
    if (message) errors[field] = message;
  }
  return errors;
}

// 03001234567 -> 0300-****567 (used on the confirmation page; the real number is never stored)
export function maskPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return `${digits.slice(0, 4)}-****${digits.slice(-3)}`;
}
