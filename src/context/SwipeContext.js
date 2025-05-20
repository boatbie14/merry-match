// context/SwipeContext.js
import React, { createContext, useContext } from "react";
import { useSwipeUsers } from "../hooks/useSwipeUsers";

export const SwipeContext = createContext();
export const SwipeProvider = ({ children }) => {
  const matchUserFunctions = useSwipeUsers();

  return <SwipeContext.Provider value={matchUserFunctions}>{children}</SwipeContext.Provider>;
};

export const useSwipe = () => {
  const context = useContext(SwipeContext);
  if (context === undefined) {
    throw new Error("useMatch must be used within a SwipeProvider");
  }
  return context;
};
