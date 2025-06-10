import { userActivityServices } from "@/services/userUpdateActivityService";

export function useUpdateUserActivity() {
  const updateLastActiveAsync = (userId) => {
    if (!userId) return;

    userActivityServices.updateLastActive(userId).catch((err) => {
      console.error("Failed to update last active:", err);
    });
  };

  return {
    updateLastActiveAsync,
  };
}
