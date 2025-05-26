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
    // ตรวจสอบว่ามี userInfo หรือไม่
    if (!userInfo?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // ส่ง user_id จาก userInfo ไปยัง API
      const response = await fetch(`/api/merry-limit?timezone=${timezone}&user_id=${userInfo.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch merry limit");
      }

      const data = await response.json();
      setMerryLimit(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching merry limit:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // เรียกใช้เมื่อ component โหลดครั้งแรกและเมื่อ userInfo เปลี่ยนแปลง
  useEffect(() => {
    if (userInfo?.id) {
      fetchMerryLimit();
    }
  }, [userInfo]); // เพิ่ม userInfo เป็น dependency

  // สร้าง value object ที่จะส่งไปยัง context
  const value = {
    merryLimit,
    setMerryLimit,
    loading,
    error,
    refreshMerryLimit: fetchMerryLimit,
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
