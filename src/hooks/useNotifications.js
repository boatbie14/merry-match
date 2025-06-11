//// this is 10/6
// hooks/useNotifications.js
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setError(null);
      setLoading(false);
      setUnreadCount(0);
      return;
    }

    const loadNotifications = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("notifications")
          .select(
            `
            id,
            message,
            is_read,
            created_at,
            noti_type,
            from_user:users (
              id,
              profile_image_url
            )
          `
          )
          .eq("to_user_id", userId)
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setNotifications(data || []);
      } catch (err) {
        console.error("Error loading notifications:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        const { count, error: countError } = await supabase
          .from("notifications")
          .select(`*`, { head: true, count: "exact" })
          .eq("to_user_id", userId)
          .eq("is_read", false);

        if (countError) throw countError;

        console.log("raw unread count from Supabase:", count);
        setUnreadCount(count ?? 0);
      } catch (err) {
        console.error("Error counting unread notifications:", err);
        setUnreadCount(0);
      }
    };

    loadNotifications();
    fetchUnreadCount();
  }, [userId, router.asPath]);

  const markAsRead = useCallback(async (id) => {
    try {
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(`Error marking notification ${id} as read:`, err);
    }
  }, []);

  return { notifications, markAsRead, loading, error, unreadCount };
}
