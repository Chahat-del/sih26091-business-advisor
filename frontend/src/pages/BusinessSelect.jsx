import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight, IndianRupee, ChevronRight } from "lucide-react";
import NavBar from "../components/layout/NavBar.jsx";
import PageShell from "../components/layout/PageShell.jsx";
import { useAppFlow } from "../context/AppFlowContext.jsx";

const BUSINESS_CATEGORIES = [
  { id: "dairy",       name: "Dairy & Milk Collection",   icon: "🐄", desc: "Milk collection, chilling, distribution" },
  { id: "kirana",      name: "Kirana / General Store",     icon: "🏪", desc: "Daily essentials, FMCG retail" },
  { id: "tailoring",   name: "Tailoring Unit",             icon: "🧵", desc: "Stitching, alterations, uniforms" },
  { id: "flour-mill",  name: "Flour Mill (Atta Chakki)",   icon: "🌾", desc: "Wheat, maize, pulse grinding" },
  { id: "poultry",     name: "Poultry Farming",            icon: "🐔", desc: "Broiler / layer birds, egg production" },
  { id: "handicraft",  name: "Handicrafts & Weaving",      icon: "🧶", desc: "Handloom, pottery, bamboo crafts" },
  { id: "agri-input",  name: "Agri Input Shop",            icon: "🌱", desc: "Seeds, fertilisers, tools" },
  { id: "beauty",      name: "Beauty & Wellness",          icon: "💇", desc: "Salon, parlour, grooming services" },
  { id: "transport",   name: "Mini Transport",             icon: "🛺", desc: "Auto / e-rickshaw hire, last-mile delivery" },
  { id: "food-proc",   name: "Food Processing",            icon: "🫙", desc: "Pickles, papad, masala, packaging" },
];

function formatInr(val) {
  if (!val) return "";
  const n = Number(String(val).replace(/,/g, ""));
  if (isNaN(n)) return val;
  return n.toLocaleString("en-IN");
}

export default function BusinessSelect() {
  const navigate = useNavigate();
  const { location, setBusiness, setMargin } = useAppFlow();

  const [selectedId, setSelectedId] = useState(null);
  const [marginRaw, setMarginRaw] = useState("");
  const [error, setError] = useState("");

  const marginNum = Number(String(marginRaw).replace(/,/g, ""));
  const projectCost = marginNum > 0 ? marginNum / 0.1 : 0;
  const loanAmount = projectCost - marginNum;

  const isMarginValid = marginNum >= 1000 && marginNum <= 5000000;
  const canContinue = selectedId && isMarginValid;

  function handleMarginChange(e) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setMarginRaw(raw);
    setError("");
  }

  function handleContinue() {
    if (!selectedId) { setError("Please select a business category."); return; }
    if (!isMarginValid) { setError("Enter a valid margin between ₹1,000 and ₹50,00,000."); return; }
    setBusiness(selectedId);
    setMargin(marginNum);
    navigate("/feasibility");
  }

  return (
    <PageShell>
      <NavBar stepLabel="Step 2 of 2 · Business" />

      <header className="hero">
        <div className="eyebrow">
          <Briefcase size={13} strokeWidth={2.5} />
          {location
            ? `${location.village}, ${location.block}, ${location.district}`
            : "Business & Capital"}
        </div>
        <h1 className="h1">What business do you want to start?</h1>
        <p className="sub">
          Pick a category and enter the cash you have in hand. We'll calculate your
          eligible loan and repayment instantly.
        </p>
      </header>

      {/* Business category grid */}
      <div className="card" style={{ marginBottom: 20 }}>
        <p className="bs-section-label">Business Category</p>
        <div className="bs-grid">
          {BUSINESS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`bs-tile ${selectedId === cat.id ? "selected" : ""}`}
              onClick={() => { setSelectedId(cat.id); setError(""); }}
              aria-pressed={selectedId === cat.id}
            >
              <span className="bs-tile-icon">{cat.icon}</span>
              <span className="bs-tile-name">{cat.name}</span>
              <span className="bs-tile-desc">{cat.desc}</span>
              {selectedId === cat.id && (
                <span className="bs-tile-check" aria-hidden="true">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Margin input + live preview */}
      <div className="card" style={{ marginBottom: 20 }}>
        <p className="bs-section-label">Available Margin Capital (your 10%)</p>
        <div className="bs-margin-row">
          <label className="bs-margin-field">
            <span className="bs-rupee-wrap">
              <IndianRupee size={16} strokeWidth={2.3} className="bs-rupee-icon" />
              <input
                className="bs-margin-input"
                inputMode="numeric"
                placeholder="e.g. 1,00,000"
                value={marginRaw ? formatInr(marginRaw) : ""}
                onChange={handleMarginChange}
                aria-label="Available margin capital in rupees"
              />
            </span>
          </label>
        </div>

        {marginNum >= 1000 && (
          <div className="bs-calc-preview">
            <div className="bs-calc-item">
              <span className="bs-calc-label">Your Margin (10%)</span>
              <span className="bs-calc-value">₹{marginNum.toLocaleString("en-IN")}</span>
            </div>
            <ChevronRight size={16} className="bs-calc-arrow" aria-hidden="true" />
            <div className="bs-calc-item">
              <span className="bs-calc-label">Total Project Cost</span>
              <span className="bs-calc-value highlight">₹{projectCost.toLocaleString("en-IN")}</span>
            </div>
            <ChevronRight size={16} className="bs-calc-arrow" aria-hidden="true" />
            <div className="bs-calc-item">
              <span className="bs-calc-label">Govt. Loan (90%)</span>
              <span className="bs-calc-value">₹{loanAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}

        {error && <p className="bs-error" role="alert">{error}</p>}
      </div>

      <div className="bs-footer">
        <button
          className="lp-continue"
          disabled={!canContinue}
          onClick={handleContinue}
          aria-disabled={!canContinue}
        >
          View Feasibility &amp; Financials
          <ArrowRight size={16} strokeWidth={2.3} />
        </button>
      </div>
    </PageShell>
  );
}
