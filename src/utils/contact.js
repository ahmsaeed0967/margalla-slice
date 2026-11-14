export function digitsOnly(value) {
  return String(value || "").replace(/\D+/g, "");
}

export function toPkIntl(value) {
  const digits = digitsOnly(value);
  if (!digits) return "";
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
}

export function toPhoneHref(value) {
  const intl = toPkIntl(value);
  return intl ? `tel:+${intl}` : "#";
}

export function toWhatsAppHref(value, text = "") {
  const intl = toPkIntl(value);
  if (!intl) return "#";
  return text ? `https://wa.me/${intl}?text=${encodeURIComponent(text)}` : `https://wa.me/${intl}`;
}

export function toLocalDisplay(value) {
  const intl = toPkIntl(value);
  if (intl.length === 12 && intl.startsWith("92")) {
    return `0${intl.slice(2, 5)} ${intl.slice(5)}`;
  }
  return value || "";
}
