"""
GET /businesses
Returns the list of business categories the user can choose from.
Reads from data/mock_businesses.json — same data as the Node version.
"""

import json
from pathlib import Path
from fastapi import APIRouter

router = APIRouter(tags=["Businesses"])

_DATA_FILE = Path(__file__).parent.parent / "data" / "mock_businesses.json"


@router.get("/", tags=["Businesses"])
def get_businesses():
    """Return available business category options."""
    return json.loads(_DATA_FILE.read_text(encoding="utf-8"))
