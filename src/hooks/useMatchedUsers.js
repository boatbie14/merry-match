// hooks/useMatchedUsers.js
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function useMatchedUsers() {
  const { userInfo } = useAuth();
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ตรวจสอบว่ามี userInfo หรือไม่
    if (!userInfo) return;

    const fetchMatchedUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        // เรียกใช้ API endpoint
        const response = await fetch(`/api/match-list?user_id=${userInfo.id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch matched users");
        }

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
  }, [userInfo]);

  return { matchedUsers, loading, error };
}
