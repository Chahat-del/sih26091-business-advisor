"""
POST /financial/calculate
Body: { village, block, district, business, margin }

Implements the exact scheme logic from the problem statement:
    project_cost    = margin / 0.10          (your cash is always the 10%)
    max_loan_amount = project_cost * 0.90

Scheme routing:
    project_cost ≤ 1,40,000  → Micro Finance Scheme
                                 rate 6.5% p.a., tenure 3 yr, moratorium 3 months
    project_cost ≤ 50,00,000 → Term Loan Scheme
                                 rate 8.0% p.a., tenure 7 yr, moratorium 6 months

EMI: reducing-balance quarterly compounding on the principal after
capitalising simple interest accrued during the moratorium period.
"""

from __future__ import annotations

from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

router = APIRouter(tags=["Financial Calculator"])

# ── Scheme constants ──────────────────────────────────────────────────────────
MAX_PROJECT_COST = 5_000_000   # ₹50 lakh upper bound

MICRO = {
    "name":              "Micro Finance Scheme",
    "interest_rate":     6.5,   # % per annum
    "tenure_years":      3,
    "moratorium_months": 3,
    "max_project_cost":  140_000,
}

TERM = {
    "name":              "Term Loan Scheme",
    "interest_rate":     8.0,
    "tenure_years":      7,
    "moratorium_months": 6,
    "max_project_cost":  5_000_000,
}
# ─────────────────────────────────────────────────────────────────────────────


class FinancialRequest(BaseModel):
    village:  Optional[str] = None
    block:    Optional[str] = None
    district: Optional[str] = None
    business: str = Field(..., examples=["dairy"])
    margin:   float = Field(..., gt=0, examples=[100000])

    @field_validator("margin")
    @classmethod
    def margin_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("margin must be a positive number")
        return v


class RepaymentRow(BaseModel):
    quarter:   int
    payment:   int
    principal: int
    interest:  int
    balance:   int


class FinancialResponse(BaseModel):
    projectCost:      int
    maxLoanAmount:    int
    scheme:           str
    interestRate:     float
    tenureYears:      int
    moratoriumMonths: int
    quarterlyEMI:     int
    totalRepayment:   int
    totalInterest:    int
    schedule:         List[RepaymentRow]


def _calculate(margin: float) -> dict:
    project_cost    = round(margin / 0.10)
    max_loan_amount = round(project_cost * 0.90)

    if project_cost > MAX_PROJECT_COST:
        raise HTTPException(
            status_code=400,
            detail="Project cost exceeds ₹50 lakh — outside scheme eligibility",
        )

    scheme_params = MICRO if project_cost <= MICRO["max_project_cost"] else TERM

    rate              = scheme_params["interest_rate"]
    tenure_years      = scheme_params["tenure_years"]
    moratorium_months = scheme_params["moratorium_months"]

    # Quarterly rate
    r = rate / 100 / 4
    # Active repayment quarters (after moratorium)
    n = (tenure_years * 12 - moratorium_months) // 3

    # Capitalise simple interest accrued during moratorium into principal
    moratorium_interest  = max_loan_amount * (rate / 100) * (moratorium_months / 12)
    effective_principal  = max_loan_amount + moratorium_interest

    # Reducing-balance quarterly EMI
    quarterly_emi = round(
        (effective_principal * r * (1 + r) ** n) / ((1 + r) ** n - 1)
    )

    # Build full repayment schedule
    schedule = []
    balance = effective_principal
    for q in range(1, n + 1):
        interest_part  = round(balance * r)
        principal_part = quarterly_emi - interest_part
        balance        = max(0.0, balance - principal_part)
        schedule.append(RepaymentRow(
            quarter=q,
            payment=quarterly_emi,
            principal=principal_part,
            interest=interest_part,
            balance=round(balance),
        ))

    total_repayment = quarterly_emi * n
    total_interest  = round(total_repayment - effective_principal)

    return {
        "projectCost":      project_cost,
        "maxLoanAmount":    max_loan_amount,
        "scheme":           scheme_params["name"],
        "interestRate":     rate,
        "tenureYears":      tenure_years,
        "moratoriumMonths": moratorium_months,
        "quarterlyEMI":     quarterly_emi,
        "totalRepayment":   total_repayment,
        "totalInterest":    total_interest,
        "schedule":         schedule,
    }


@router.post("/calculate", response_model=FinancialResponse)
def financial_calculate(req: FinancialRequest):
    """
    Calculate project cost, eligible loan, scheme, EMI,
    and full quarterly repayment schedule from available margin capital.
    """
    return _calculate(req.margin)
