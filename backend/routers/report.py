"""
POST /generate-report
Body: full analysis result (business output + financial output combined)
Returns a report URL (stub — wire up real PDF generation here).

TODO(Report/Integration workstream):
  - Use reportlab or weasyprint to render a PDF from a Jinja2 HTML template
  - Save to /tmp or object storage and return a signed URL
"""

from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Optional

router = APIRouter(tags=["Report"])


class ReportRequest(BaseModel):
    # Accept any keys — the full merged analysis + financial payload
    model_config = {"extra": "allow"}

    village:  Optional[str] = None
    block:    Optional[str] = None
    district: Optional[str] = None
    business: Optional[str] = None
    margin:   Optional[float] = None


class ReportResponse(BaseModel):
    reportUrl:   str
    generatedAt: str
    note:        str


@router.post("/", response_model=ReportResponse)
def generate_report(req: ReportRequest):
    """
    Generate a PDF business feasibility + loan report.
    Currently returns a stub URL — replace with real PDF rendering.
    """
    return {
        "reportUrl":   "https://example.com/mock-report.pdf",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "note":        "stub — wire up real PDF generation (reportlab / weasyprint) here",
    }
