import { createContext, useContext, useState, useMemo } from "react";

/**
 * Holds the user's picks as they move through the flow, so each page
 * doesn't have to pass everything through router state by hand.
 * Shape mirrors the shared contract in docs/api-contracts.md:
 *   { village, block, district, business, margin }
 */
const AppFlowContext = createContext(null);

export function AppFlowProvider({ children }) {
  const [location, setLocation] = useState(null); // { village, block, district }
  const [business, setBusiness] = useState(null); // string
  const [margin, setMargin] = useState(null); // number

  const value = useMemo(
    () => ({
      location,
      setLocation,
      business,
      setBusiness,
      margin,
      setMargin,
      // Full payload matching the /analyze and /financial/calculate request body
      requestPayload: location && {
        village: location.village,
        block: location.block,
        district: location.district,
        business,
        margin,
      },
    }),
    [location, business, margin]
  );

  return <AppFlowContext.Provider value={value}>{children}</AppFlowContext.Provider>;
}

export function useAppFlow() {
  const ctx = useContext(AppFlowContext);
  if (!ctx) throw new Error("useAppFlow must be used inside <AppFlowProvider>");
  return ctx;
}
