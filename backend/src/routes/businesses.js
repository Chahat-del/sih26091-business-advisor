import { Router } from "express";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "../data/mockBusinesses.json");

// GET /businesses -> list of business categories to choose from
router.get("/", async (_req, res) => {
  const raw = await readFile(dataPath, "utf-8");
  res.json(JSON.parse(raw));
});

export default router;
