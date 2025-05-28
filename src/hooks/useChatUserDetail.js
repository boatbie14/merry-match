import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { decryptUserId } from "@/utils/crypto";

export function useChatUserDetail() {
  const [chatUserDetail, setChatUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChatUserDetail = async () => {
      const { u } = router.query; // encrypted user ID จาก URL

      if (!u) {
        setChatUserDetail(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching chat user detail for encrypted ID:", u);

        // Decrypt user ID
        const userId = decryptUserId(u);
        console.log("🔓 Decrypted user ID:", userId);

        if (!userId) {
          throw new Error("Invalid encrypted user ID");
        }

        // เรียก API เพื่อดึงข้อมูล user
        const response = await fetch(`/api/users/user?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user data");
        }

        if (data.success && data.user) {
          console.log("👤 Found chat user detail:", data.user.name);
          setChatUserDetail({
            id: data.user.id,
            name: data.user.name,
            profile_image_url: data.user.profile_image_url,
            email: data.user.email,
          });
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        console.error("💥 Error fetching chat user detail:", err);
        setError(err.message);
        setChatUserDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChatUserDetail();
  }, [router.query.u]);

  return {
    chatUserDetail,
    loading,
    error,
    // Helper functions
    getChatUserName: () => chatUserDetail?.name || "your match",
    getChatUserImage: () => chatUserDetail?.profile_image_url || "/default-avatar.png",
  };
}
