// hooks/useMatchedUsers.js
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// ✅ เพิ่มพารามิเตอร์ refreshTrigger
export function useMatchedUsers(refreshTrigger = null) {
  const { userInfo } = useAuth();
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) return;

    const fetchMatchedUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/match-list?user_id=${userInfo.id}`);
        if (!response.ok) throw new Error("Failed to fetch matched users");

        const data = await response.json();
        setMatchedUsers(data.matches);
      } catch (err) {
        console.error("Error fetching matched users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedUsers();
  }, [userInfo, refreshTrigger]); // ✅ trigger เมื่อ refreshKey เปลี่ยน

  return { matchedUsers, loading, error };
}
