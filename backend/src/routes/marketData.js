import { Router } from "express";

const router = Router();

// GET /market-data?village=&block=&district=&business=
// TODO(Data workstream): back with real mandi/market price + Udyam data.
router.get("/", (req, res) => {
  const { village, block, district, business } = req.query;
  res.json({
    village: village ?? null,
    block: block ?? null,
    district: district ?? null,
    business: business ?? null,
    averagePrice: 42,
    demandTrend: "steady",
    nearestMandiKm: 8,
    note: "mock data — replace with verified market-data source",
  });
});

export default router;
