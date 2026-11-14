import { Minus, Plus } from "lucide-react";

// − [n] + control. It doesn't own the number: the parent passes `value` and gets
// the new number back through the `onChange` callback prop.
export default function QuantityStepper({ value, min = 1, max, onChange, label, note }) {
  return (
    <div className="stepper">
      <div className="stepper__controls" role="group" aria-label={label}>
        <button
          type="button"
          className="btn btn--secondary stepper__btn"
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          aria-label={`Decrease quantity, ${label}`}
        >
          <Minus size={18} aria-hidden="true" />
        </button>
        <span className="stepper__value" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className="btn btn--secondary stepper__btn"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={`Increase quantity, ${label}`}
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
      {note && <p className="stepper__note">{note}</p>}
    </div>
  );
}
