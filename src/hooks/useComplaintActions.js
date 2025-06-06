// src/hooks/useComplaintActions.js
import { useState } from "react";
import { useRouter } from "next/router";

export const useComplaintActions = (apiService) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const handleApiCall = async (updateTo) => {
    if (!id) {
      console.error("No complaint ID found");
      return { success: false, error: "No complaint ID found" };
    }

    if (!apiService) {
      console.error("No API service provided");
      return { success: false, error: "No API service provided" };
    }

    setIsLoading(true);
    try {
      const result = await apiService.updateComplaintStatus(id, updateTo);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatusToPending = () => handleApiCall("pending");
  const updateStatusToResolved = () => handleApiCall("resolved");
  const updateStatusToCancel = () => handleApiCall("cancel");

  return {
    updateStatusToPending,
    updateStatusToResolved,
    updateStatusToCancel,
    isLoading,
  };
};
