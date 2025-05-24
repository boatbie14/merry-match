// context/SwipeContext.js
import React, { createContext, useContext } from "react";
import { useSwipeUsers } from "../hooks/useSwipeUsers";
import { useMerryLimit } from "../context/MerryLimitContext";

export const SwipeContext = createContext();

export const SwipeProvider = ({ children }) => {
  const matchUserFunctions = useSwipeUsers();
  const { merryLimit, refreshMerryLimit } = useMerryLimit();

  const enhancedFunctions = {
    ...matchUserFunctions,
    currentMerryLimit: merryLimit,
    refreshMerryLimitGlobal: refreshMerryLimit,
  };

  return <SwipeContext.Provider value={enhancedFunctions}>{children}</SwipeContext.Provider>;
};

export const useSwipe = () => {
  const context = useContext(SwipeContext);
  if (context === undefined) {
    throw new Error("useMatch must be used within a SwipeProvider");
  }
  return context;
};
