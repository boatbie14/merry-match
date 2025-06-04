import apiClient from "@/interceptor/apiClient";

export const getMarriedUsers = async () => {
  try {
    const response = await apiClient.get(`/merry/merry-users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching merried users:", error);
    throw error;
  }
};

export const getMerriedMe = async () => {
  try {
    const response = await apiClient.get(`merry/merry-me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users like you :", error);
    throw error;
  }
};

export const getMerriedMatch = async () => {
  try {
    const response = await apiClient.get(`merry/merry-match`);
    return response.data;
  } catch (error) {
    console.error("Error fetching like :", error);
    throw error;
  }
};

export const getMerriedLike = async () => {
  try {
    const response = await apiClient.get("/merry/getlike");
    return response;
  } catch (error) {
    console.error("Error fetching merried users:", error);
    throw error;
  }
};

export const postMerriedLike = async (toUserId) => {
  try {
    //New timezone
    const currentDate = new Date();
    const todayYMD =
      currentDate.getFullYear() +
      "-" +
      String(currentDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(currentDate.getDate()).padStart(2, "0");
    const timezoneOffset = currentDate.getTimezoneOffset();

    const response = await apiClient.post("/merry/like", { toUserId, todayYMD, timezoneOffset });
    return response.data;
  } catch (error) {
    console.error("Error fetching merried users:", error);
    throw error;
  }
};

export const deleteMerriedLike = async (toUserId) => {
  const unlikeUserId = toUserId;
  try {
    const response = await apiClient.delete(`/merry/${unlikeUserId}`);
    return response;
  } catch (error) {
    console.error("Error fetching merried users:", error);
    throw error;
  }
};
