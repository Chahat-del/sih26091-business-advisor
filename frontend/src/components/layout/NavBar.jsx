import { Sprout } from "lucide-react";

export default function NavBar({ stepLabel }) {
  return (
    <nav className="nav">
      <div className="brand">
        <span className="brand-mark"><Sprout size={16} strokeWidth={2.2} /></span>
        GramUdyam Advisor
      </div>
      {stepLabel && <span className="step-tag">{stepLabel}</span>}
    </nav>
  );
}
