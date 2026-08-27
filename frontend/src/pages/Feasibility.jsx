import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, ShieldAlert, Zap, Tag, ArrowRight, BarChart2 } from "lucide-react";
import NavBar from "../components/layout/NavBar.jsx";
import PageShell from "../components/layout/PageShell.jsx";
import { useAppFlow } from "../context/AppFlowContext.jsx";

// Mock matching the agreed "Business output" contract.
// Replace with a real /analyze POST call once the backend is wired.
function getMockAnalysis(village, block, district, business) {
  return {
    marketReach: `Estimated catchment of ~14 villages (≈ 42,000 people) within 10 km of ${village}, ${block} block. Primary distribution channels: weekly haat bazaar (${block} every Thursday), PMGSY road to ${district} town.`,
    competition: {
      count: 3,
      detail: `3 similar ${business} businesses registered in ${block} block (Udyam data). None located in ${village} village itself — first-mover advantage available.`,
    },
    opportunities: [
      `No organised ${business} unit inside ${village} — immediate captive demand`,
      `Proximity to ${district} district-level mandi (8 km) for direct procurement`,
      "Government e-NAM portal linkage possible for price discovery",
      "SHG (Self-Help Group) network in block can act as distribution channel",
    ],
    threats: [
      "Seasonal demand dip (June–August monsoon period)",
      "Input price volatility linked to state wholesale index",
      "Dependency on single road connecting village to block HQ",
      "Potential new entrant from district town with higher capital",
    ],
    pricing: `Suggested retail price: ₹42–₹48/unit based on ${district} mandi arrivals data. Regional purchasing power index (RPI) for ${block}: 0.74 (vs. state average 1.0). Price at lower band to capture volume.`,
    swot: {
      strengths: [
        "No direct competitor in-village",
        "Local raw material availability reduces procurement cost",
        "Government scheme reduces upfront capital requirement to 10%",
      ],
      weaknesses: [
        "First-time entrepreneur — limited operational experience",
        "Village infrastructure (cold storage, power backup) limited",
        "Working capital gap in first 3 months (moratorium covers EMI, not opex)",
      ],
      opportunities: [
        `Growing block-level demand — ${block} population up 11% (Census 2011→2021)`,
        "Udyam registration unlocks priority lending and GST exemptions",
        "School / ICDS nutrition programme procurement contracts available",
      ],
      threats: [
        "State cooperative may enter block market within 2 years",
        "Fuel price increase raises last-mile delivery cost",
        "Climate risk: erratic monsoon affects input supply chain",
      ],
    },
  };
}

const SWOT_META = [
  { key: "strengths",     label: "Strengths",     color: "#1a7a4a", bg: "#e6f4ec" },
  { key: "weaknesses",    label: "Weaknesses",    color: "#b45309", bg: "#fef3c7" },
  { key: "opportunities", label: "Opportunities", color: "#1d4ed8", bg: "#dbeafe" },
  { key: "threats",       label: "Threats",       color: "#b91c1c", bg: "#fee2e2" },
];

export default function Feasibility() {
  const navigate = useNavigate();
  const { location, business } = useAppFlow();

  const village  = location?.village  ?? "your village";
  const block    = location?.block    ?? "your block";
  const district = location?.district ?? "your district";
  const biz      = business           ?? "your business";

  const data = getMockAnalysis(village, block, district, biz);

  return (
    <PageShell>
      <NavBar stepLabel="Results · Feasibility" />

      <header className="hero">
        <div className="eyebrow">
          <BarChart2 size={13} strokeWidth={2.5} />
          Hyper-Local Business Feasibility Report
        </div>
        <h1 className="h1">Market analysis for {village}</h1>
        <p className="sub">
          Based on Census village data, Udyam MSME registrations, and mandi price
          arrivals for {block}, {district}.
        </p>
      </header>

      {/* Market Reach */}
      <div className="card feas-card" style={{ marginBottom: 16 }}>
        <div className="feas-card-header">
          <TrendingUp size={18} strokeWidth={2} className="feas-icon" />
          <h2 className="feas-title">Market Reach</h2>
        </div>
        <p className="feas-body">{data.marketReach}</p>
      </div>

      {/* Competitor Mapping */}
      <div className="card feas-card" style={{ marginBottom: 16 }}>
        <div className="feas-card-header">
          <Users size={18} strokeWidth={2} className="feas-icon" />
          <h2 className="feas-title">Competitor Mapping</h2>
          <span className="feas-badge">{data.competition.count} competitors nearby</span>
        </div>
        <p className="feas-body">{data.competition.detail}</p>
      </div>

      {/* Opportunities */}
      <div className="card feas-card" style={{ marginBottom: 16 }}>
        <div className="feas-card-header">
          <Zap size={18} strokeWidth={2} className="feas-icon opportunity" />
          <h2 className="feas-title">Opportunities</h2>
        </div>
        <ul className="feas-list">
          {data.opportunities.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </div>

      {/* Threats */}
      <div className="card feas-card" style={{ marginBottom: 16 }}>
        <div className="feas-card-header">
          <ShieldAlert size={18} strokeWidth={2} className="feas-icon threat" />
          <h2 className="feas-title">Threats &amp; Risks</h2>
        </div>
        <ul className="feas-list threat-list">
          {data.threats.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>

      {/* Pricing */}
      <div className="card feas-card" style={{ marginBottom: 16 }}>
        <div className="feas-card-header">
          <Tag size={18} strokeWidth={2} className="feas-icon" />
          <h2 className="feas-title">Product Market Value &amp; Pricing</h2>
        </div>
        <p className="feas-body">{data.pricing}</p>
      </div>

      {/* SWOT */}
      <div className="card feas-card" style={{ marginBottom: 24 }}>
        <div className="feas-card-header" style={{ marginBottom: 16 }}>
          <BarChart2 size={18} strokeWidth={2} className="feas-icon" />
          <h2 className="feas-title">SWOT Analysis</h2>
        </div>
        <div className="swot-grid">
          {SWOT_META.map(({ key, label, color, bg }) => (
            <div key={key} className="swot-quadrant" style={{ background: bg, borderColor: color + "33" }}>
              <p className="swot-label" style={{ color }}>{label}</p>
              <ul className="swot-items">
                {data.swot[key].map((item, i) => (
                  <li key={i} style={{ color: color }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bs-footer">
        <button className="lp-continue" onClick={() => navigate("/results")}>
          View Financial Calculator
          <ArrowRight size={16} strokeWidth={2.3} />
        </button>
      </div>
    </PageShell>
  );
}
