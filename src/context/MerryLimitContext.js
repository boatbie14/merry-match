// contexts/MerryLimitContext.js
import { createContext, useState, useContext, useEffect } from "react";

// สร้าง Context
const MerryLimitContext = createContext();

// สร้าง Provider Component
export function MerryLimitProvider({ children }) {
  const [merryLimit, setMerryLimit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMerryLimit = async () => {
    try {
      setLoading(true);
      // ส่ง timezone ของ user ไปด้วย
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch(`/api/merry-limit?timezone=${timezone}`);

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

  // เรียกใช้ตอนโหลดคอมโพเนนต์ครั้งแรก
  useEffect(() => {
    fetchMerryLimit();
  }, []);

  // สร้าง value object ที่จะส่งไปยัง context
  const value = {
    merryLimit,
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
