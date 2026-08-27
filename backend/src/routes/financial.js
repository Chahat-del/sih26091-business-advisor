import { Router } from "express";
import { requireFields } from "../middleware/validate.js";

const router = Router();

// POST /financial/calculate — body: { village, block, district, business, margin }
// Returns the "Financial output" shape from docs/api-contracts.md.
// TODO(Finance calculator workstream): replace mock with real
// margin -> project cost -> loan amount -> scheme -> EMI logic.
router.post("/", requireFields(["business", "margin"]), (req, res) => {
  const { margin } = req.body;

  const projectCost = Math.round(margin * 4);
  const maxLoanAmount = projectCost - margin;
  const scheme = maxLoanAmount <= 100000 ? "Micro Finance" : "Term Loan";
  const interestRate = scheme === "Micro Finance" ? 9.5 : 11.2;
  const tenureYears = scheme === "Micro Finance" ? 3 : 5;
  const moratoriumMonths = 6;

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;
  const monthlyEMI =
    (maxLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  res.json({
    projectCost,
    maxLoanAmount,
    scheme,
    interestRate,
    tenureYears,
    moratoriumMonths,
    quarterlyEMI: Math.round(monthlyEMI * 3),
  });
});

export default router;
