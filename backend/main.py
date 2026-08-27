"""
SIH26091 — GramUdyam Business Advisor
FastAPI backend — mirrors all routes from the original Node/Express server.

Start:
    uvicorn main:app --reload --port 4000

Routes:
    GET  /health
    GET  /locations
    GET  /businesses
    GET  /market-data
    POST /analyze
    POST /financial/calculate
    POST /generate-report
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import locations, businesses, market_data, analyze, financial, report

app = FastAPI(
    title="GramUdyam Business Advisor API",
    description="Hyper-local business feasibility + smart loan calculator for rural entrepreneurs.",
    version="0.1.0",
)

# Allow the Vite dev server (and any origin in dev) to call this API.
# Tighten origins list before production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(locations.router,   prefix="/locations")
app.include_router(businesses.router,  prefix="/businesses")
app.include_router(market_data.router, prefix="/market-data")
app.include_router(analyze.router,     prefix="/analyze")
app.include_router(financial.router,   prefix="/financial")
app.include_router(report.router,      prefix="/generate-report")


@app.get("/health", tags=["Meta"])
def health():
    return {"status": "ok"}
