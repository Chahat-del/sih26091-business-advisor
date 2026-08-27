import NavBar from "../components/layout/NavBar.jsx";
import PageShell from "../components/layout/PageShell.jsx";
import { useAppFlow } from "../context/AppFlowContext.jsx";

// Piece 2 owns this page: business category picker + margin input,
// then navigate("/feasibility") and navigate("/results") once both
// analyses are ready. `location` is already in context from Piece 1.
export default function BusinessSelect() {
  const { location } = useAppFlow();

  return (
    <PageShell>
      <NavBar stepLabel="Step 2 of 2 · Business" />
      <header className="hero">
        <h1 className="h1">Business selection (Piece 2)</h1>
        <p className="sub">
          Location received from Piece 1: <code>{JSON.stringify(location)}</code>
        </p>
      </header>
      <div className="card">
        <p>TODO: business category picker + available margin input here.</p>
      </div>
    </PageShell>
  );
}
