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
    const options = { timeZone: "Asia/Bangkok" };
    const bangkokDate = new Date(new Date().toLocaleString("en-US", options));
    const dateString = bangkokDate.toISOString();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await apiClient.post("/merry/like", { toUserId, dateString, timezone });
    return response.data;
  } catch (error) {
    console.error("Error fetching merried users:", error);
    throw error;
  }
};

export const deleteMerriedLike = async (toUserId) => {
  const unlikeUserId = toUserId;
  try {
    console.log("loop");
    const response = await apiClient.delete(`/merry/${unlikeUserId}`);
    return response;
  } catch (error) {
    console.error("Error fetching merried users:", error);
    throw error;
  }
};
