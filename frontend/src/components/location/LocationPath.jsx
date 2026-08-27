import { Check } from "lucide-react";

/**
 * Signature UI element for this piece: a "growing stem" that fills in as the
 * user drills from State -> District -> Block -> Village. Doubles as a
 * progress indicator. Hidden on narrow screens (see location-picker.css).
 */
export default function LocationPath({ stateId, districtId, blockId, village }) {
  return (
    <div className="lp-path" aria-hidden="true">
      <Node on={Boolean(stateId)} stem={Boolean(districtId)} />
      <Node on={Boolean(districtId)} stem={Boolean(blockId)} />
      <Node on={Boolean(blockId)} stem={Boolean(village)} />
      <Node on={Boolean(village)} last />
    </div>
  );
}

function Node({ on, stem, last }) {
  return (
    <div className="lp-node-row" style={{ flex: "0 0 auto" }}>
      <div className={`lp-node ${on ? "on" : ""}`}>
        {on && <Check size={12} strokeWidth={3} />}
      </div>
      {!last && <div className={`lp-stem ${stem ? "on" : ""}`} />}
    </div>
  );
}