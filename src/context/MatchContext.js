// context/MatchContext.js
import React, { createContext, useContext } from "react";
import { useMatchUsers } from "../hooks/useMatchUsers";

// สร้าง Context
export const MatchContext = createContext();

// สร้าง Provider Component
export const MatchProvider = ({ children }) => {
  // ใช้ custom hook เพื่อจัดการข้อมูลและฟังก์ชัน
  const matchUserFunctions = useMatchUsers();

  console.log("MatchProvider: matchUserFunctions", {
    loading: matchUserFunctions.loading,
    usersLength: matchUserFunctions.users?.length,
    error: matchUserFunctions.error,
    currentPage: matchUserFunctions.currentPage,
    totalPages: matchUserFunctions.totalPages,
    totalCount: matchUserFunctions.totalCount,
    swipeCount: matchUserFunctions.swipeCount,
    //#### Add: เพิ่มการแสดงข้อมูล filters ใน log
    filters: matchUserFunctions.filters,
  });

  return <MatchContext.Provider value={matchUserFunctions}>{children}</MatchContext.Provider>;
};

// สร้าง custom hook สำหรับใช้งาน context
export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
};
