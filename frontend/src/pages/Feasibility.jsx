import NavBar from "../components/layout/NavBar.jsx";
import PageShell from "../components/layout/PageShell.jsx";

// Piece 3 owns this page: feasibility dashboard fed by mock JSON matching
// the "Business output" shape in docs/api-contracts.md until /analyze is real.
export default function Feasibility() {
  return (
    <PageShell>
      <NavBar stepLabel="Results · Feasibility" />
      <header className="hero">
        <h1 className="h1">Feasibility dashboard (Piece 3)</h1>
      </header>
      <div className="card">
        <p>TODO: market reach, competitors, SWOT, threats, pricing cards.</p>
      </div>
    </PageShell>
  );
}
