import useOpenStatus from "../../hooks/useOpenStatus";

// The only green/red dot on the site — always with a text label, never colour alone.
export default function StatusPill({ className = "" }) {
  const isOpen = useOpenStatus();
  return (
    <div className={`inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-sm font-bold text-ink ${className}`}>
      <span
        aria-hidden="true"
        className={`w-2.5 h-2.5 rounded-full pulse-dot bg-current ${isOpen ? "text-status-open" : "text-error"}`}
      />
      <span>{isOpen ? "Open now" : "Closed"}</span>
    </div>
  );
}
