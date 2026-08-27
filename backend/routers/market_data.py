"""
GET /market-data?village=&block=&district=&business=
Returns mock mandi/market price data for the given location + business.
TODO(Data workstream): replace with real Census / e-NAM / Udyam data.
"""

from typing import Optional
from fastapi import APIRouter

router = APIRouter(tags=["Market Data"])


@router.get("/", tags=["Market Data"])
def get_market_data(
    village:  Optional[str] = None,
    block:    Optional[str] = None,
    district: Optional[str] = None,
    business: Optional[str] = None,
):
    """Return mock market data for the given location and business sector."""
    return {
        "village":       village,
        "block":         block,
        "district":      district,
        "business":      business,
        "averagePrice":  42,
        "demandTrend":   "steady",
        "nearestMandiKm": 8,
        "note":          "mock data — replace with verified market-data source",
    }
