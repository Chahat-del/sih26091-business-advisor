/**
 * Thin fetch wrappers around the backend routes in docs/api-contracts.md.
 * Not wired into the UI yet (pages still use hardcoded/mock data) — swap the
 * hardcoded imports for these once the backend + data workstreams are live.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return res.json();
}

export const getLocations = () => request("/locations");
export const getBusinesses = () => request("/businesses");
export const getMarketData = (params) =>
  request(`/market-data?${new URLSearchParams(params)}`);

export const postAnalyze = (payload) =>
  request("/analyze", { method: "POST", body: JSON.stringify(payload) });

export const postFinancialCalculate = (payload) =>
  request("/financial/calculate", { method: "POST", body: JSON.stringify(payload) });

export const postGenerateReport = (payload) =>
  request("/generate-report", { method: "POST", body: JSON.stringify(payload) });
