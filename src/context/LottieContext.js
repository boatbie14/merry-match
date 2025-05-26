// context/LottieContext.js
import React, { createContext, useContext, useState } from "react";

const LottieContext = createContext();

export const LottieProvider = ({ children }) => {
  const [currentAnimation, setCurrentAnimation] = useState(null);

  const showAnimation = (lottieData) => {
    setCurrentAnimation(lottieData);
  };

  const hideAnimation = () => {
    setCurrentAnimation(null);
  };

  return (
    <LottieContext.Provider
      value={{
        currentAnimation,
        showAnimation,
        hideAnimation,
      }}
    >
      {children}
    </LottieContext.Provider>
  );
};

export const useLottieContext = () => {
  const context = useContext(LottieContext);
  if (!context) {
    throw new Error("useLottieContext must be used within a LottieProvider");
  }
  return context;
};
