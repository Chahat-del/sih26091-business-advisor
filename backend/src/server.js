import express from "express";
import cors from "cors";
import "dotenv/config";

import locationsRouter from "./routes/locations.js";
import businessesRouter from "./routes/businesses.js";
import marketDataRouter from "./routes/marketData.js";
import analyzeRouter from "./routes/analyze.js";
import financialRouter from "./routes/financial.js";
import reportRouter from "./routes/report.js";

const app = express();
app.use(cors());
app.use(express.json());

// GET routes — Piece 5
app.use("/locations", locationsRouter);
app.use("/businesses", businessesRouter);
app.use("/market-data", marketDataRouter);

// POST routes — Piece 6
app.use("/analyze", analyzeRouter);
app.use("/financial/calculate", financialRouter);
app.use("/generate-report", reportRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SIH26091 backend listening on :${PORT}`));
