# API Contract — SIH26091 Rural Business Advisor

Agreed before the starter split. Every piece (frontend or backend) must match
these shapes exactly so nothing blocks anything else.

## Analysis request (sent by frontend to backend)

```json
{
  "village": "string",
  "block": "string",
  "district": "string",
  "business": "string",
  "margin": 0
}
```

## Financial output (`POST /financial/calculate`)

```json
{
  "projectCost": 0,
  "maxLoanAmount": 0,
  "scheme": "Micro Finance | Term Loan",
  "interestRate": 0,
  "tenureYears": 0,
  "moratoriumMonths": 0,
  "quarterlyEMI": 0
}
```

## Business output (`POST /analyze`)

```json
{
  "marketReach": "string | object",
  "competition": "string | object",
  "opportunities": ["string"],
  "threats": ["string"],
  "pricing": "string | object",
  "swot": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  }
}
```

## Routes

| Method | Route                  | Owner            | Returns                        |
|--------|-------------------------|------------------|---------------------------------|
| GET    | `/locations`            | Backend (5)      | district → block → village tree |
| GET    | `/businesses`           | Backend (5)      | list of business categories     |
| GET    | `/market-data`          | Backend (5)      | mock market/mandi data           |
| POST   | `/analyze`               | Backend (6)      | Business output (above)         |
| POST   | `/financial/calculate`  | Backend (6)      | Financial output (above)        |
| POST   | `/generate-report`      | Backend (6)      | `{ reportUrl: string }`         |

Everyone builds against these shapes with mock data until the finance
calculator and AI/data layer are wired in for real.
