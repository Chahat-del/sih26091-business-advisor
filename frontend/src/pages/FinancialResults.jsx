import NavBar from "../components/layout/NavBar.jsx";
import PageShell from "../components/layout/PageShell.jsx";

// Piece 4 owns this page: financial results fed by mock JSON matching the
// "Financial output" shape in docs/api-contracts.md, plus PDF download stub.
export default function FinancialResults() {
  return (
    <PageShell>
      <NavBar stepLabel="Results · Financing" />
      <header className="hero">
        <h1 className="h1">Financial results (Piece 4)</h1>
      </header>
      <div className="card">
        <p>TODO: project cost, loan amount, scheme, EMI, repayment schedule + PDF button.</p>
      </div>
    </PageShell>
  );
}
