// hooks/useSwipeUsers.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useMerryLike } from "@/context/MerryLikeContext";
import { useMerryLimit } from "@/context/MerryLimitContext";
import { useLottie } from "@/hooks/useLottie";

export function useSwipeUsers() {
  const { userInfo } = useAuth();
  const { toggleLike } = useMerryLike();
  const { refreshMerryLimit, merryLimit } = useMerryLimit();

  //lottie
  const { playHeart, playBrokenHeart } = useLottie();

  // users
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
  const [limit] = useState(10);

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

      let url = `/api/users/not-merry-users?page=${page}&limit=${limit}`;

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
      if (currentPage < totalPages) {
        fetchUsers(currentPage + 1);
        return;
      } else {
        if (swipeCount >= totalCount - 1) {
          setSwipeCount(0);
          setLeftSwipes(0);
          setRightSwipes(0);
          fetchUsers(1);
          return;
        }
        return;
      }
    }

    const user = users[nextIndex];

    if (!user) {
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

  //=================> EDIT: แก้ไข handleHeartButton
  const handleHeartButton = (e, user) => {
    e.stopPropagation();

    // ถ้าเป็น match card ให้ทำการ swipe right ปกติ (ลบและไปต่อ)
    if (user.isMatch) {
      removeCurrentCardAndLoadNext(user);
      return;
    }

    // ถ้าไม่ใช่ match card ให้ทำ swipe right ที่จะเรียก addMerry
    handleSwipe("right", user);
  };

  //=================> EDIT: แก้ไข handleSwipe function - แสดงหัวใจก่อน ลบ delay
  const handleSwipe = async (direction, user) => {
    if (!userInfo || !user || loading || !user.originalProfile?.id) {
      return;
    }

    setLastDirection(direction);
    setSwipeCount((prev) => prev + 1);

    if (direction === "left") {
      setLeftSwipes((prev) => prev + 1);

      //=================> ADD: ถ้าเป็น match card ให้ปัดซ้ายได้
      if (user.isMatch) {
        removeCurrentCardAndLoadNext(user);
        return;
      }

      // ปกติ swipe left
      removeCurrentCardAndLoadNext(user);
    } else if (direction === "right") {
      setRightSwipes((prev) => prev + 1);

      //=================> ADD: ถ้าเป็น match card ให้ปัดขวาได้
      if (user.isMatch) {
        removeCurrentCardAndLoadNext(user);
        return;
      }

      //=================> EDIT: เล่น playHeart ก่อนทุกอย่าง
      playHeart();

      //=================> EDIT: ลบ card ทันทีหลังจาก playHeart
      setDisplayedUsers((prevUsers) => {
        const remaining = prevUsers.filter((item) => item.name !== user.name);
        return remaining;
      });

      try {
        const result = await addMerry(user.originalProfile.id);
        const isMatchUser = result?.checkMatchUser;

        if (isMatchUser) {
          //=================> ADD: ถ้า match ให้ card เด้งกลับมาเป็น match card
          const matchedUser = {
            ...user,
            isMatch: true,
          };
          // แสดง match card กลับมาทันที
          setDisplayedUsers([matchedUser]);
        } else {
          //=================> ADD: ถ้าไม่ match ให้โหลด card ถัดไป
          loadNextUserAfterSwipe();
        }
      } catch (error) {
        // ถ้า error ให้โหลด card ถัดไป
        loadNextUserAfterSwipe();
      }
    }
  };

  //=================> EDIT: ลบ delay ออกจาก removeCurrentCardAndLoadNext
  const removeCurrentCardAndLoadNext = (user) => {
    // ลบ card ปัจจุบัน
    setDisplayedUsers((prevUsers) => {
      const remaining = prevUsers.filter((item) => item.name !== user.name);
      return remaining;
    });

    // โหลด card ถัดไปทันที (ไม่มี setTimeout)
    loadNextUserAfterSwipe();
  };

  //=================> EDIT: แก้ไข loadNextUserAfterSwipe - ลด delay เหลือเฉพาะที่จำเป็น
  const loadNextUserAfterSwipe = () => {
    const isLastUser = currentIndex >= users.length - 1;
    const isLastPage = currentPage >= totalPages;
    const isLastSwipe = swipeCount >= totalCount - 1;

    if (isLastUser && isLastPage && isLastSwipe) {
      // หมดคนแล้ว reset กลับหน้าแรก
      setDisplayedUsers([]);
      // ลด delay ลงเหลือแค่ 100ms สำหรับ state update
      setTimeout(() => {
        setSwipeCount(0);
        setLeftSwipes(0);
        setRightSwipes(0);
        setCurrentIndex(0);
        fetchUsers(1);
      }, 100);
      return;
    }

    // โหลด user ถัดไปทันที
    if (displayedUsers.length <= 1) {
      loadNextUser();
    }

    // โหลดหน้าถัดไปถ้าจำเป็น
    if (users.length - currentIndex <= 2 && currentPage < totalPages) {
      fetchUsers(currentPage + 1);
    }
  };

  //=================> EDIT: ลบ delay ออกจาก addMerry
  const addMerry = async (userId) => {
    try {
      const result = await toggleLike(userId);

      // ไม่ต้องหน่วงเวลา - ลบ Promise timeout ออก
      return result;
    } catch (error) {
      throw error;
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

  //=================> EDIT: เพิ่มฟังก์ชันใหม่ใน return
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
    merryLimit,
    refreshMerryLimit,
    removeCurrentCardAndLoadNext,
    loadNextUserAfterSwipe,
    shouldRefreshMatches: null,
  };
}
