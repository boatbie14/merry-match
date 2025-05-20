// hooks/useSwipeUsers.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export function useSwipeUsers() {
  const { userInfo } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // swipe
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState(null);
  const [imageIndexes, setImageIndexes] = useState({});

  // count swipe
  const [swipeCount, setSwipeCount] = useState(0);
  const [leftSwipes, setLeftSwipes] = useState(0);
  const [rightSwipes, setRightSwipes] = useState(0);

  // add state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10); // Limit per page

  //Filter state
  const [filters, setFilters] = useState({
    sexual_preference: null,
    age_range: "18-80",
  });

  //Current user state
  const [currentUser, setCurrentUser] = useState(null);

  // Start load component on mount - only if userInfo exists
  useEffect(() => {
    if (userInfo) {
      // call first page only if user is logged in
      fetchUsers(1);
    }
  }, [userInfo]);

  //useEffect check filter change - only if userInfo exists
  useEffect(() => {
    if (userInfo) {
      fetchUsers(1);
    }
  }, [filters, userInfo]);

  // Fetch Users
  const fetchUsers = async (page = 1) => {
    if (!userInfo) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const currentUserId = userInfo.id;

      let url = `/api/users?page=${page}&limit=${limit}`;

      // Only add currentUserId if it exists
      if (currentUserId) {
        url += `&currentUserId=${currentUserId}`;
      }

      if (filters.sexual_preference) {
        url += `&sexual_preference=${filters.sexual_preference}`;
      }

      if (filters.age_range) {
        url += `&age_range=${filters.age_range}`;
      }

      const response = await axios.get(url);

      if (response.data && response.data.users) {
        if (page === 1) {
          setUsers(response.data.users);
          // Reset swipe counters after load first page
          setSwipeCount(0);
          setLeftSwipes(0);
          setRightSwipes(0);

          if (response.data.meta?.userSexualPreference && !filters.sexual_preference) {
            setFilters((prev) => ({
              ...prev,
              sexual_preference: response.data.meta.userSexualPreference,
            }));
          }
        } else {
          setUsers((prevUsers) => [...prevUsers, ...response.data.users]);
        }

        if (response.data.meta) {
          setTotalCount(response.data.meta.totalCount);
          setTotalPages(response.data.meta.totalPages);
          setCurrentPage(response.data.meta.page);

          if (response.data.meta.currentUser && !currentUser) {
            setCurrentUser(response.data.meta.currentUser);
          }
        }

        if (page === 1 && response.data.users.length > 0) {
          const firstUser = response.data.users[0];
          if (firstUser) {
            const newPerson = {
              name: firstUser.name,
              age: calculateAge(firstUser.date_of_birth),
              picture: firstUser.profile_image_url,
              city: firstUser.city,
              country: firstUser.location,
              bio: firstUser.bio,
              isMatch: firstUser.isMatch || false,
              originalProfile: firstUser,
            };
            setDisplayedUsers([newPerson]);
            setCurrentIndex(0);
          }
        }
      } else {
        if (page === 1) {
          setUsers([]);
          setDisplayedUsers([]);
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const loadNextUser = () => {
    if (!users || users.length === 0) {
      return;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= users.length) {
      // Check whether the next page should be loaded.
      if (currentPage < totalPages) {
        fetchUsers(currentPage + 1);
        return;
      } else {
        //if last page and swipeCount = totalCount
        if (swipeCount >= totalCount - 1) {
          // reset swipe and load first page
          setSwipeCount(0);
          setLeftSwipes(0);
          setRightSwipes(0);
          fetchUsers(1);
          return;
        }

        // If the totalCount hasn't been reached yet but there are no more pages (special case).
        return;
      }
    }

    const user = users[nextIndex];

    // เพิ่มการตรวจสอบว่ามี user ข้อมูล
    if (!user) {
      console.warn("User not found at index:", nextIndex);
      return;
    }

    const age = calculateAge(user.date_of_birth);
    const newPerson = {
      name: user.name,
      age: age,
      picture: user.profile_image_url,
      city: user.city || "Unknown",
      country: user.location || "Unknown",
      bio: user.bio || "",
      isMatch: user.isMatch || false,
      originalProfile: user,
    };

    setDisplayedUsers((prev) => [...prev, newPerson]);
    setCurrentIndex(nextIndex);
  };

  const handleOutOfFrame = () => {
    // Card out of frame handler
  };

  // Change Click Arrow icon to change images
  const handleButtonClick = (e, userName, direction) => {
    e.stopPropagation();
    handleImageChange(userName, direction);
  };

  const handleImageChange = (userName, direction) => {
    const user = users.find((u) => u.name === userName);
    if (!user) return;

    const newImageIndexes = { ...imageIndexes };

    if (!newImageIndexes[userName]) {
      newImageIndexes[userName] = 1;
    }

    const imageUrls = [user.profile_image_url, user.image2_url, user.image3_url, user.image4_url, user.image5_url].filter(
      (url) => url !== null && url !== undefined
    );

    if (direction === "next") {
      newImageIndexes[userName] = newImageIndexes[userName] >= imageUrls.length ? 1 : newImageIndexes[userName] + 1;
    } else {
      newImageIndexes[userName] = newImageIndexes[userName] <= 1 ? imageUrls.length : newImageIndexes[userName] - 1;
    }

    setImageIndexes(newImageIndexes);
  };

  const handleHeartButton = (e, user) => {
    e.stopPropagation();
    // Click heart then do swipe right
    handleSwipe("right", user);
  };

  // Swipe
  const handleSwipe = (direction, user) => {
    if (!userInfo || !user || loading || !user.originalProfile?.id) {
      console.warn("Invalid swipe. Possibly still loading or user is invalid.", { direction, user });
      return;
    }

    setLastDirection(direction);

    // count swipe
    setSwipeCount((prev) => prev + 1);

    if (direction === "left") {
      setLeftSwipes((prev) => prev + 1);
    } else if (direction === "right") {
      setRightSwipes((prev) => prev + 1);

      // ✅ ป้องกัน error ถ้า originalProfile.id ไม่ถูกต้อง
      createMatch(user.originalProfile.id);
    }

    // ลบการ์ดหลัง swipe
    setDisplayedUsers((prevUsers) => {
      const remaining = prevUsers.filter((item) => item.name !== user.name);
      return remaining;
    });

    setTimeout(() => {
      if (displayedUsers.length <= 1) {
        loadNextUser();
      }

      if (users.length - currentIndex <= 2 && currentPage < totalPages) {
        fetchUsers(currentPage + 1);
      }

      if (swipeCount >= totalCount && currentPage >= totalPages) {
        setTimeout(() => {
          setSwipeCount(0);
          setLeftSwipes(0);
          setRightSwipes(0);
          fetchUsers(1);
        }, 500);
      }
    }, 300);
  };

  // Function to create a match when swiping right
  const createMatch = async (targetUserId) => {
    if (!userInfo?.id || !targetUserId || typeof targetUserId !== "string") {
      console.warn("Invalid parameters for createMatch", { userId: userInfo?.id, targetUserId });
      return;
    }

    try {
      const response = await axios.post("/api/match", {
        user_id: userInfo.id,
        target_user_id: targetUserId,
      });

      if (response.data?.isMatch) {
        // TODO: แสดง popup หรือเสียงดนตรี 🎉
      }
    } catch (err) {
      console.error("Error creating match:", err?.response?.data || err.message);
    }
  };

  const setUserFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const resetUsers = () => {
    setFilters({
      sexual_preference: null,
      age_range: "18-80",
    });
  };

  return {
    users,
    displayedUsers,
    currentIndex,
    lastDirection,
    imageIndexes,
    loading,
    error,
    swipeCount,
    leftSwipes,
    rightSwipes,
    currentPage,
    totalPages,
    totalCount,
    filters,
    currentUser,
    handleSwipe,
    handleOutOfFrame,
    handleButtonClick,
    handleHeartButton,
    setUserFilters,
    resetUsers,
  };
}
