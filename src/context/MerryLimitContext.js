// contexts/MerryLimitContext.js

import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// สร้าง Context
const MerryLimitContext = createContext();

// สร้าง Provider Component
export function MerryLimitProvider({ children }) {
  const { userInfo } = useAuth(); // ใช้ useAuth hook เพื่อดึง userInfo

  // กำหนดค่าเริ่มต้นให้ merryLimit เพื่อป้องกัน null
  const [merryLimit, setMerryLimit] = useState({
    count: 0,
    merry_per_day: 10,
    package_name: "",
    user_id: "",
    log_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMerryLimit = async () => {
    if (!userInfo?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const currentDate = new Date();
      const todayYMD =
        currentDate.getFullYear() +
        "-" +
        String(currentDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(currentDate.getDate()).padStart(2, "0");
      const timezoneOffset = currentDate.getTimezoneOffset();

      // ส่ง user_id จาก userInfo ไปยัง API
      const response = await fetch(`/api/merry-limit?today=${todayYMD}&timezone_offset=${timezoneOffset}&user_id=${userInfo.id}`);

      // จัดการ 401 Unauthorized
      if (response.status === 401) {
        setError("Authentication expired");
        setLoading(false);
        // ไม่ throw error เพื่อป้องกัน app crash
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch merry limit`);
      }

      const data = await response.json();

      setMerryLimit({ ...data });
      setError(null);
      return data;
    } catch (err) {
      // แยกประเภท error
      if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        setError("Network connection error");
      } else if (err.message.includes("401")) {
        setError("Authentication expired");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // เรียกใช้เมื่อ component โหลดครั้งแรกและเมื่อ userInfo เปลี่ยนแปลง
  useEffect(() => {
    // เพิ่มการตรวจสอบเพิ่มเติม
    if (userInfo?.id) {
      fetchMerryLimit();
    } else if (userInfo === null) {
      // userInfo เป็น null หมายถึง user ไม่ได้ login
      setLoading(false);
      setError(null);
    }
    // ถ้า userInfo เป็น undefined หมายถึงยังโหลดอยู่ ให้รอต่อ
  }, [userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  // เพิ่ม retry function
  const retryFetch = () => {
    setError(null);
    fetchMerryLimit();
  };

  // สร้าง value object ที่จะส่งไปยัง context
  const value = {
    merryLimit,
    setMerryLimit,
    loading,
    error,
    refreshMerryLimit: fetchMerryLimit,
    retryFetch, // เพิ่ม retry function
  };

  return <MerryLimitContext.Provider value={value}>{children}</MerryLimitContext.Provider>;
}

// สร้าง custom hook สำหรับการใช้งาน context นี้
export function useMerryLimit() {
  const context = useContext(MerryLimitContext);
  if (context === undefined) {
    throw new Error("useMerryLimit must be used within a MerryLimitProvider");
  }
  return context;
}
