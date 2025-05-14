// context/MatchContext.js
import React, { createContext, useContext } from "react";
import { useMatchUsers } from "../hooks/useMatchUsers";

export const MatchContext = createContext();
export const MatchProvider = ({ children }) => {
  
  const matchUserFunctions = useMatchUsers();

  return <MatchContext.Provider value={matchUserFunctions}>{children}</MatchContext.Provider>;
};


export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
};
