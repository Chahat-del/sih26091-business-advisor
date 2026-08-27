import { MapPin } from "lucide-react";
import NavBar from "../components/layout/NavBar.jsx";
import PageShell from "../components/layout/PageShell.jsx";
import LocationPicker from "../components/location/LocationPicker.jsx";

export default function Home() {
  return (
    <PageShell>
      <NavBar stepLabel="Step 1 of 2 · Location" />

      <header className="hero">
        <div className="eyebrow">
          <MapPin size={13} strokeWidth={2.5} />
          Business Feasibility &amp; Loan Advisor
        </div>
        <h1 className="h1">Where are you planning to start your business?</h1>
        <p className="sub">
          Pick your state, district, block and village. We'll use local market, competition
          and lending data for that exact area to tell you if your idea works — and how much
          you can safely borrow.
        </p>
      </header>

      <div className="card">
        <LocationPicker />
      </div>
    </PageShell>
  );
}