import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import Select from "./Select.jsx";
import LocationPath from "./LocationPath.jsx";
import { STATES } from "../../data/locations.js";
import { useAppFlow } from "../../context/AppFlowContext.jsx";
import "./location-picker.css";

const STEPS = ["State", "District", "Block", "Village"];

export default function LocationPicker() {
  const navigate = useNavigate();
  const { setLocation } = useAppFlow();

  const [stateId, setStateId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [blockId, setBlockId] = useState(null);
  const [village, setVillage] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const state = useMemo(() => STATES.find((s) => s.id === stateId) ?? null, [stateId]);
  const district = useMemo(
    () => state?.districts.find((d) => d.id === districtId) ?? null,
    [state, districtId]
  );
  const block = useMemo(() => district?.blocks.find((b) => b.id === blockId) ?? null, [district, blockId]);

  const progress =
    (stateId ? 1 : 0) + (districtId ? 1 : 0) + (blockId ? 1 : 0) + (village ? 1 : 0);
  const canContinue = Boolean(stateId && districtId && blockId && village);

  function handleStateChange(id) {
    setStateId(id);
    setDistrictId(null);
    setBlockId(null);
    setVillage(null);
    setConfirmed(false);
  }

  function handleDistrictChange(id) {
    setDistrictId(id);
    setBlockId(null);
    setVillage(null);
    setConfirmed(false);
  }

  function handleBlockChange(id) {
    setBlockId(id);
    setVillage(null);
    setConfirmed(false);
  }

  function handleVillageChange(v) {
    setVillage(v);
    setConfirmed(false);
  }

  function handleContinue() {
    if (!canContinue) return;
    const payload = { village, block: block.name, district: district.name, state: state.name };
    setLocation(payload); // shared across the flow via AppFlowContext
    setConfirmed(true);
    navigate("/business"); // hand off to Piece 2 (business picker + margin)
  }

  return (
    <section className="lp-card">
      <LocationPath stateId={stateId} districtId={districtId} blockId={blockId} village={village} />

      <div className="lp-fields">
        <Select
          label={STEPS[0]}
          placeholder="Select state"
          value={stateId}
          onChange={handleStateChange}
          options={STATES}
        />

        <Select
          label={STEPS[1]}
          placeholder={state ? "Select district" : "Select a state first"}
          value={districtId}
          onChange={handleDistrictChange}
          options={state?.districts ?? []}
          disabled={!state}
        />

        <Select
          label={STEPS[2]}
          placeholder={district ? "Select block" : "Select a district first"}
          value={blockId}
          onChange={handleBlockChange}
          options={district?.blocks ?? []}
          disabled={!district}
        />

        <Select
          label={STEPS[3]}
          placeholder={block ? "Select village" : "Select a block first"}
          value={village}
          onChange={handleVillageChange}
          options={block?.villages ?? []}
          disabled={!block}
        />

        <div className="lp-footer">
          <span className="lp-progress-text">{progress} / 4 selected</span>
          <button className="lp-continue" disabled={!canContinue} onClick={handleContinue}>
            Continue to business selection
            <ArrowRight size={16} strokeWidth={2.3} />
          </button>
        </div>

        {confirmed && (
          <div className="lp-confirm">
            <Check size={18} strokeWidth={2.5} />
            <div>
              Location saved.
              <code className="lp-confirm-code">
                {JSON.stringify({ village, block: block?.name, district: district?.name, state: state?.name })}
              </code>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}