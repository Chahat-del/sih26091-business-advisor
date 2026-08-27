/**
 * Minimal body validator: 400s if any required field is missing.
 * Usage: router.post("/", requireFields(["village","block","district","business","margin"]), handler)
 */
export function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => req.body?.[f] === undefined || req.body?.[f] === null);
    if (missing.length) {
      return res.status(400).json({ error: `Missing required field(s): ${missing.join(", ")}` });
    }
    next();
  };
}
