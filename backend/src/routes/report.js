import { Router } from "express";

const router = Router();

// POST /generate-report — body: full analysis result (business + financial output)
// TODO(Report/Integration workstream): render an actual PDF and return a real URL.
router.post("/", (_req, res) => {
  res.json({
    reportUrl: "https://example.com/mock-report.pdf",
    generatedAt: new Date().toISOString(),
    note: "stub — wire up real PDF generation here",
  });
});

export default router;
