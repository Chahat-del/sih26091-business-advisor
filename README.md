# SIH26091 — Rural Business Advisor

AI advisory tool: pick a location, pick a business, enter available margin,
get a feasibility + financing recommendation and a downloadable PDF report.

## Structure
- `frontend/` — React + Vite app (pages/components split by the 6-piece plan)
- `backend/` — Express API, routes return mock data matching `docs/api-contracts.md`
- `docs/` — shared contract everyone builds against

## Run it

```bash
# backend
cd backend && npm install && npm run dev   # http://localhost:4000

# frontend (separate terminal)
cd frontend && npm install && npm run dev  # http://localhost:5173
```

## Where each of the 6 starter pieces lives
1. Home + location picker → `frontend/src/pages/Home.jsx`, `components/location/`
2. Business picker + margin input → `frontend/src/pages/BusinessSelect.jsx`
3. Feasibility dashboard → `frontend/src/pages/Feasibility.jsx`
4. Financial results + PDF stub → `frontend/src/pages/FinancialResults.jsx`
5. Backend GET routes → `backend/src/routes/locations.js`, `businesses.js`, `marketData.js`
6. Backend POST routes → `backend/src/routes/analyze.js`, `financial.js`, `report.js`
