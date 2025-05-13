export const fetchAllUsers = async () => {
  try {
    const response = await fetch("https://yala.dev/api/merry-match.php");
    return await response.json();
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
};
