import { Router } from "express";
import { requireFields } from "../middleware/validate.js";

const router = Router();

/**
 * POST /financial/calculate
 * Body: { village, block, district, business, margin }
 *
 * Implements the exact scheme logic from the problem statement:
 *   projectCost   = margin / 0.10          (margin is always 10%)
 *   maxLoanAmount = projectCost * 0.90
 *
 * Scheme routing:
 *   projectCost ≤ 1,40,000  → Micro Finance (6.5% p.a., 3 yr, 3-month moratorium)
 *   projectCost ≤ 50,00,000 → Term Loan     (8.0% p.a., 7 yr, 6-month moratorium)
 *
 * EMI uses reducing-balance quarterly compounding post-moratorium.
 */
router.post("/", requireFields(["business", "margin"]), (req, res) => {
  const margin = Number(req.body.margin);

  if (!margin || margin <= 0) {
    return res.status(400).json({ error: "margin must be a positive number" });
  }

  const projectCost   = Math.round(margin / 0.10);
  const maxLoanAmount = Math.round(projectCost * 0.90);

  if (projectCost > 5000000) {
    return res.status(400).json({ error: "Project cost exceeds ₹50 lakh — outside scheme eligibility" });
  }

  const isMicro         = projectCost <= 140000;
  const scheme          = isMicro ? "Micro Finance Scheme" : "Term Loan Scheme";
  const interestRate    = isMicro ? 6.5 : 8.0;          // % p.a.
  const tenureYears     = isMicro ? 3   : 7;
  const moratoriumMonths = isMicro ? 3  : 6;

  // Quarterly reducing-balance EMI (post-moratorium)
  const r = interestRate / 100 / 4;                          // quarterly rate
  const n = (tenureYears * 12 - moratoriumMonths) / 3;       // repayment quarters

  // Simple interest on principal during moratorium, capitalised
  const moratoriumInterest = maxLoanAmount * (interestRate / 100) * (moratoriumMonths / 12);
  const effectivePrincipal = maxLoanAmount + moratoriumInterest;

  const quarterlyEMI = Math.round(
    (effectivePrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  );

  res.json({
    projectCost,
    maxLoanAmount,
    scheme,
    interestRate,
    tenureYears,
    moratoriumMonths,
    quarterlyEMI,
    totalRepayment: quarterlyEMI * n,
    totalInterest: Math.round(quarterlyEMI * n - effectivePrincipal),
  });
});

export default router;
