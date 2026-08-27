import { Router } from "express";
import { requireFields } from "../middleware/validate.js";

const router = Router();

// POST /analyze — body: { village, block, district, business, margin }
// Returns the "Business output" shape from docs/api-contracts.md.
// TODO(AI/NLP workstream): replace mock with real pipeline output —
// explain real numbers pulled from Data workstream, never invent them.
router.post("/", requireFields(["village", "block", "district", "business"]), (req, res) => {
  const { village, block, district, business } = req.body;

  res.json({
    marketReach: `Estimated catchment of ~12 villages around ${village}, ${block} block.`,
    competition: `3 similar ${business} businesses identified within 10km of ${village}.`,
    opportunities: [
      "No organized competitor within the village itself",
      "Proximity to district market road",
    ],
    threats: ["Seasonal demand dip", "Input price volatility"],
    pricing: `Suggested pricing benchmarked against ${district} district mandi rates.`,
    swot: {
      strengths: ["Low competition in-village", "Local raw material access"],
      weaknesses: ["Limited cold storage / infrastructure"],
      opportunities: ["Growing demand in nearby block market"],
      threats: ["New entrants from district town"],
    },
  });
});

export default router;
