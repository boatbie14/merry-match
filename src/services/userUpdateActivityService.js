class UserActivityServices {
  async updateLastActive(userId) {
    const response = await fetch("/api/users/update-activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        lastActiveAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update last active");
    }

    return response.json();
  }
}

export const userActivityServices = new UserActivityServices();
