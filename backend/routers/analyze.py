"""
POST /analyze
Body: { village, block, district, business, margin }
Returns the "Business output" shape from docs/api-contracts.md.

TODO(AI/NLP workstream): replace mock with real pipeline —
  - pull actual competitor count from Udyam MSME registrations
  - pull market reach from Census village population data
  - pull pricing from e-NAM / mandi arrival prices
  - AI explains those real numbers; it never invents them
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional

router = APIRouter(tags=["Analysis"])


class AnalyzeRequest(BaseModel):
    village:  str = Field(..., examples=["Dadabari"])
    block:    str = Field(..., examples=["Ladpura"])
    district: str = Field(..., examples=["Kota"])
    business: str = Field(..., examples=["dairy"])
    margin:   Optional[float] = Field(None, examples=[100000])


class SWOTOutput(BaseModel):
    strengths:     List[str]
    weaknesses:    List[str]
    opportunities: List[str]
    threats:       List[str]


class AnalyzeResponse(BaseModel):
    marketReach:   str
    competition:   dict
    opportunities: List[str]
    threats:       List[str]
    pricing:       str
    swot:          SWOTOutput


@router.post("/", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    """
    Generate a hyper-local business feasibility report.
    Currently returns parameterised mock data; wire the AI/NLP pipeline here.
    """
    village  = req.village
    block    = req.block
    district = req.district
    business = req.business

    return {
        "marketReach": (
            f"Estimated catchment of ~14 villages (≈ 42,000 people) within 10 km of "
            f"{village}, {block} block. Primary distribution channels: weekly haat bazaar "
            f"({block} every Thursday), PMGSY road to {district} town."
        ),
        "competition": {
            "count": 3,
            "detail": (
                f"3 similar {business} businesses registered in {block} block "
                f"(Udyam data). None located in {village} village itself — "
                "first-mover advantage available."
            ),
        },
        "opportunities": [
            f"No organised {business} unit inside {village} — immediate captive demand",
            f"Proximity to {district} district-level mandi (8 km) for direct procurement",
            "Government e-NAM portal linkage possible for price discovery",
            "SHG (Self-Help Group) network in block can act as distribution channel",
        ],
        "threats": [
            "Seasonal demand dip (June–August monsoon period)",
            "Input price volatility linked to state wholesale index",
            "Dependency on single road connecting village to block HQ",
            "Potential new entrant from district town with higher capital",
        ],
        "pricing": (
            f"Suggested retail price: ₹42–₹48/unit based on {district} mandi arrivals data. "
            f"Regional purchasing power index (RPI) for {block}: 0.74 (vs. state average 1.0). "
            "Price at lower band to capture volume."
        ),
        "swot": {
            "strengths": [
                "No direct competitor in-village",
                "Local raw material availability reduces procurement cost",
                "Government scheme reduces upfront capital requirement to 10%",
            ],
            "weaknesses": [
                "First-time entrepreneur — limited operational experience",
                "Village infrastructure (cold storage, power backup) limited",
                "Working capital gap in first 3 months (moratorium covers EMI, not opex)",
            ],
            "opportunities": [
                f"Growing block-level demand — {block} population up 11% (Census 2011→2021)",
                "Udyam registration unlocks priority lending and GST exemptions",
                "School / ICDS nutrition programme procurement contracts available",
            ],
            "threats": [
                "State cooperative may enter block market within 2 years",
                "Fuel price increase raises last-mile delivery cost",
                "Climate risk: erratic monsoon affects input supply chain",
            ],
        },
    }
