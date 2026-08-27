import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, FileDown, ArrowLeft, Info } from "lucide-react";
import NavBar from "../components/layout/NavBar.jsx";
import PageShell from "../components/layout/PageShell.jsx";
import { useAppFlow } from "../context/AppFlowContext.jsx";

/**
 * Implements the exact financial logic from the problem statement:
 *   projectCost    = margin / 0.10
 *   maxLoanAmount  = projectCost * 0.90   (= margin * 9)
 *
 * Scheme routing:
 *   projectCost ≤ 1,40,000  → Micro Finance  (6.5% p.a., 3 yr, 3-month moratorium)
 *   projectCost ≤ 50,00,000 → Term Loan      (8.0% p.a., 7 yr, 6-month moratorium)
 *
 * EMI uses quarterly compounding on the reducing balance after moratorium.
 */
function calculateFinance(margin) {
  const projectCost   = Math.round(margin / 0.10);
  const maxLoanAmount = Math.round(projectCost * 0.90);

  const isMicro = projectCost <= 140000;
  const scheme          = isMicro ? "Micro Finance Scheme" : "Term Loan Scheme";
  const interestRate    = isMicro ? 6.5 : 8.0;           // % per annum
  const tenureYears     = isMicro ? 3   : 7;
  const moratoriumMonths = isMicro ? 3  : 6;

  // Quarterly rate
  const r = interestRate / 100 / 4;
  // Active repayment quarters (after moratorium)
  const n = (tenureYears * 12 - moratoriumMonths) / 3;

  // Simple interest accrued during moratorium, added to principal
  const moratoriumInterest = maxLoanAmount * (interestRate / 100) * (moratoriumMonths / 12);
  const effectivePrincipal = maxLoanAmount + moratoriumInterest;

  // Standard reducing-balance quarterly EMI
  const quarterlyEMI = Math.round(
    (effectivePrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  );

  // Build repayment schedule (first 8 quarters shown in UI)
  const schedule = [];
  let balance = effectivePrincipal;
  for (let q = 1; q <= n; q++) {
    const interestPart  = Math.round(balance * r);
    const principalPart = quarterlyEMI - interestPart;
    balance = Math.max(0, Math.round(balance - principalPart));
    schedule.push({ quarter: q, payment: quarterlyEMI, interest: interestPart, principal: principalPart, balance });
  }

  return {
    projectCost, maxLoanAmount, scheme, interestRate,
    tenureYears, moratoriumMonths, quarterlyEMI, schedule,
    totalRepayment: quarterlyEMI * n,
    totalInterest: Math.round(quarterlyEMI * n - effectivePrincipal),
  };
}

function inr(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export default function FinancialResults() {
  const navigate = useNavigate();
  const { location, business, margin } = useAppFlow();
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  // Use mock margin if user lands directly (for demo)
  const effectiveMargin = margin ?? 100000;
  const fin = calculateFinance(effectiveMargin);

  const previewRows = showFullSchedule ? fin.schedule : fin.schedule.slice(0, 8);

  function handlePdfDownload() {
    // PDF generation stub — replace with real jsPDF / backend call
    window.alert("PDF generation will be wired here. Download stub triggered.");
  }

  return (
    <PageShell>
      <NavBar stepLabel="Results · Financing" />

      <header className="hero">
        <div className="eyebrow">
          <Calculator size={13} strokeWidth={2.5} />
          Smart Financial Calculator &amp; Scheme Router
        </div>
        <h1 className="h1">Your financial roadmap</h1>
        <p className="sub">
          Based on your available margin of {inr(effectiveMargin)} for{" "}
          {business ?? "your business"} in{" "}
          {location?.village ?? "your village"}.
        </p>
      </header>

      {/* Summary cards row */}
      <div className="fin-summary-row" style={{ marginBottom: 16 }}>
        <div className="fin-summary-card primary">
          <span className="fin-summary-label">Project Cost</span>
          <span className="fin-summary-value">{inr(fin.projectCost)}</span>
          <span className="fin-summary-note">Your 10% unlocks this</span>
        </div>
        <div className="fin-summary-card">
          <span className="fin-summary-label">Govt. Loan (90%)</span>
          <span className="fin-summary-value">{inr(fin.maxLoanAmount)}</span>
          <span className="fin-summary-note">Maximum eligible</span>
        </div>
        <div className="fin-summary-card accent">
          <span className="fin-summary-label">Quarterly EMI</span>
          <span className="fin-summary-value">{inr(fin.quarterlyEMI)}</span>
          <span className="fin-summary-note">Every 3 months</span>
        </div>
      </div>

      {/* Scheme card */}
      <div className="card fin-scheme-card" style={{ marginBottom: 16 }}>
        <div className="fin-scheme-header">
          <span className="fin-scheme-badge">{fin.scheme}</span>
          <span className="fin-scheme-rate">{fin.interestRate}% p.a.</span>
        </div>
        <div className="fin-scheme-details">
          <div className="fin-detail-item">
            <span className="fin-detail-label">Tenure</span>
            <span className="fin-detail-val">{fin.tenureYears} years</span>
          </div>
          <div className="fin-detail-item">
            <span className="fin-detail-label">Moratorium</span>
            <span className="fin-detail-val">{fin.moratoriumMonths} months</span>
          </div>
          <div className="fin-detail-item">
            <span className="fin-detail-label">Total Repayment</span>
            <span className="fin-detail-val">{inr(fin.totalRepayment)}</span>
          </div>
          <div className="fin-detail-item">
            <span className="fin-detail-label">Total Interest</span>
            <span className="fin-detail-val">{inr(fin.totalInterest)}</span>
          </div>
        </div>
        <div className="fin-scheme-note">
          <Info size={13} strokeWidth={2} />
          <span>
            Moratorium means no repayment for the first {fin.moratoriumMonths} months.
            Interest accrued during moratorium is added to the principal.
          </span>
        </div>
      </div>

      {/* Repayment schedule */}
      <div className="card" style={{ marginBottom: 24, overflow: "hidden" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 17 }}>Quarterly Repayment Schedule</h2>
        <div className="fin-table-wrap">
          <table className="fin-table">
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row) => (
                <tr key={row.quarter}>
                  <td>Q{row.quarter}</td>
                  <td>{inr(row.payment)}</td>
                  <td>{inr(row.principal)}</td>
                  <td>{inr(row.interest)}</td>
                  <td>{inr(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {fin.schedule.length > 8 && (
          <button
            className="fin-toggle-btn"
            onClick={() => setShowFullSchedule((v) => !v)}
          >
            {showFullSchedule
              ? "Show fewer rows"
              : `Show all ${fin.schedule.length} quarters`}
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="fin-actions">
        <button className="fin-back-btn" onClick={() => navigate("/feasibility")}>
          <ArrowLeft size={15} strokeWidth={2.3} />
          Back to Feasibility
        </button>
        <button className="fin-pdf-btn" onClick={handlePdfDownload}>
          <FileDown size={16} strokeWidth={2.3} />
          Download Report (PDF)
        </button>
      </div>
    </PageShell>
  );
}
