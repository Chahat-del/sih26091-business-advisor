import { ChevronDown } from "lucide-react";

export default function Select({ label, placeholder, value, onChange, options, disabled }) {
  return (
    <label className="lp-field">
      <span className="lp-field-label">{label}</span>
      <div className="lp-select-wrap">
        <select
          className="lp-select"
          value={value ?? ""}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value || null)}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id ?? opt} value={opt.id ?? opt}>
              {opt.name ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown className="lp-select-icon" size={18} strokeWidth={2} />
      </div>
    </label>
  );
}
