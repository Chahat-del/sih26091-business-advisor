import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BusinessSelect from "./pages/BusinessSelect.jsx";
import Feasibility from "./pages/Feasibility.jsx";
import FinancialResults from "./pages/FinancialResults.jsx";

// Flow: Home (location) -> BusinessSelect (business + margin)
//   -> Feasibility (business analysis) + FinancialResults (finance analysis)
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/business" element={<BusinessSelect />} />
      <Route path="/feasibility" element={<Feasibility />} />
      <Route path="/results" element={<FinancialResults />} />
    </Routes>
  );
}
