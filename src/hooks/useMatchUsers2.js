// hooks/useMatchUsers.js
import { useState, useEffect } from "react";
import axios from "axios";

export function useMatchUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const [imageIndexes, setImageIndexes] = useState({});
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [seenAllUsers, setSeenAllUsers] = useState(false);
  const [viewedUserIds, setViewedUserIds] = useState(new Set());
  const [filters, setFilters] = useState({
    sexual_preference: null,
    age_range: null,
  });
  const [fetchingMoreUsers, setFetchingMoreUsers] = useState(false);
  const [noUsersFound, setNoUsersFound] = useState(false);

  /**
   * Function: setUserFilters - กำหนดค่าตัวกรองที่ใช้ในการค้นหา
   */
  const setUserFilters = (newFilters) => {
    // รีเซ็ตค่าต่างๆ เมื่อเปลี่ยนตัวกรอง
    setPage(1);
    setViewedUserIds(new Set());
    setSeenAllUsers(false);
    setCurrentIndex(0);
    setDisplayedUsers([]);
    setNoUsersFound(false);

    // กำหนดค่าตัวกรองใหม่
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));

    // โหลดข้อมูลใหม่ด้วยตัวกรองใหม่
    loadInitialData(newFilters);
  };

  /**
   * Function: fetchUsers : เรียกข้อมูลผู้ใช้จาก API พร้อมตัวกรอง
   */
  const fetchUsers = async (pageNumber = 1, filterOptions = filters) => {
    try {
      setLoading(true);
      const currentUserId = "bfd42907-62fa-44c9-bf18-38ac7478ac35";

      // สร้าง query string
      let queryParams = `page=${pageNumber}&limit=10&currentUserId=${currentUserId}`;

      // เพิ่ม sexual_preference ถ้ามี
      if (filterOptions.sexual_preference) {
        queryParams += `&sexual_preference=${filterOptions.sexual_preference}`;
      }

      // เพิ่ม age_range ถ้ามี
      if (filterOptions.age_range) {
        queryParams += `&age_range=${filterOptions.age_range}`;
      }

      const response = await axios.get(`/api/users?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function: loadInitialData : โหลดข้อมูลครั้งแรกหรือเมื่อมีการเปลี่ยนฟิลเตอร์
   */
  const loadInitialData = async (filterOptions = filters) => {
    try {
      setLoading(true);
      const data = await fetchUsers(1, filterOptions);

      if (data.users && data.users.length > 0) {
        setUsers(data.users);
        setTotalPages(data.meta.totalPages);
        setHasMorePages(data.meta.page < data.meta.totalPages);
        loadNextUser(data.users, 0);
        setNoUsersFound(false);
      } else {
        // ไม่พบผู้ใช้ที่ตรงตามเงื่อนไข
        setUsers([]);
        setDisplayedUsers([]);
        setNoUsersFound(true);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function: loadMoreUsers : โหลดข้อมูลเพิ่มเติม
   */
  const loadMoreUsers = async () => {
    if (loading || fetchingMoreUsers) return;

    try {
      setFetchingMoreUsers(true);
      let nextPage;

      // ถ้าไม่มีหน้าถัดไปแล้ว และมีการดูครบทุกคนแล้ว ให้กลับไปโหลดหน้าแรกใหม่
      if (!hasMorePages && seenAllUsers) {
        console.log("Restarting from page 1");
        nextPage = 1;
        // รีเซ็ตรายการผู้ใช้ที่เคยดูแล้ว
        setViewedUserIds(new Set());
        setSeenAllUsers(false);
      } else if (!hasMorePages) {
        // ถ้าไม่มีหน้าถัดไปแต่ยังดูไม่ครบทุกคน ให้ถือว่าเห็นผู้ใช้ครบทุกคนแล้ว
        setSeenAllUsers(true);
        setFetchingMoreUsers(false);
        return;
      } else {
        // ถ้ายังมีหน้าถัดไป ให้โหลดหน้าถัดไปตามปกติ
        nextPage = page + 1;
      }

      const data = await fetchUsers(nextPage);

      if (nextPage === 1) {
        // ถ้าเริ่มต้นใหม่ ให้แทนที่ข้อมูลเดิม
        setUsers(data.users);
      } else {
        // ถ้าโหลดหน้าถัดไป ให้เพิ่มข้อมูลต่อท้าย
        setUsers((prevUsers) => [...prevUsers, ...data.users]);
      }

      setPage(nextPage);
      setHasMorePages(data.meta.page < data.meta.totalPages);

      // ถ้าโหลดถึงหน้าสุดท้ายแล้ว
      if (nextPage === data.meta.totalPages) {
        setSeenAllUsers(true);
      }

      // เมื่อโหลดเสร็จแล้ว ให้โหลดผู้ใช้คนถัดไป
      if (displayedUsers.length === 0 && data.users.length > 0) {
        loadNextUser(data.users, 0);
      }
    } catch (error) {
      console.error("Error loading more users:", error);
      setError(error.message);
    } finally {
      setFetchingMoreUsers(false);
    }
  };

  /**
   * Function: loadNextUser : โหลดผู้ใช้คนถัดไป
   */
  const loadNextUser = (allUsers, index) => {
    if (!allUsers || allUsers.length === 0) {
      console.log("No users available");
      setLoading(false);
      return;
    }

    // ถ้า index เกินจำนวนผู้ใช้ที่มีอยู่
    if (index >= allUsers.length) {
      // ถ้าใกล้หมดข้อมูล (เหลือน้อยกว่า 3 คน) ให้โหลดข้อมูลเพิ่ม
      if (allUsers.length - index <= 3) {
        loadMoreUsers();
      }

      // ถ้ายังไม่มีข้อมูลเพิ่มเติม แต่ได้ดูผู้ใช้ครบทุกคนแล้ว ให้เริ่มต้นใหม่
      if (seenAllUsers && !hasMorePages && displayedUsers.length === 0) {
        console.log("Restarting display cycle");
        // เริ่มต้นใหม่ที่ index 0
        setFetchingMoreUsers(true);
        if (allUsers.length > 0) {
          setCurrentIndex(0);
          loadNextUser(allUsers, 0);
          setFetchingMoreUsers(false);
          return;
        }
      }

      // ถ้าไม่มีข้อมูลเพิ่มเติมและยังไม่ได้โหลดข้อมูลเพิ่ม ให้หยุดการโหลด
      if (index >= allUsers.length) {
        setLoading(false);
        setFetchingMoreUsers(false);
        return;
      }
    }

    const user = allUsers[index];

    // ข้ามผู้ใช้ที่เคยดูแล้ว ยกเว้นเมื่อเริ่มต้นวงจรใหม่
    if (viewedUserIds.has(user.id) && !seenAllUsers) {
      setCurrentIndex(index + 1);
      loadNextUser(allUsers, index + 1);
      return;
    }

    // เพิ่ม ID ของผู้ใช้ลงในรายการที่เคยดูแล้ว
    setViewedUserIds((prevIds) => new Set(prevIds).add(user.id));

    // คำนวณอายุจาก date_of_birth
    const age = calculateAge(user.date_of_birth);

    // สร้างข้อมูลผู้ใช้สำหรับแสดงผล
    const newPerson = {
      name: user.name,
      age: age,
      picture: user.profile_image_url,
      city: user.city,
      country: user.location,
      bio: user.bio,
      isMatch: user.isMatch,
      originalProfile: user,
    };

    setDisplayedUsers((prevUsers) => [...prevUsers, newPerson]);
    setCurrentIndex(index + 1);
    setLoading(false);
    setFetchingMoreUsers(false);
  };

  /**
   * Function: handleSwipe : จัดการการ swipe
   */
  const handleSwipe = async (direction, user) => {
    setLastDirection(direction);
    setFetchingMoreUsers(true);

    // ถ้า swipe ขวา (Like) ให้บันทึกการ Merry
    if (direction === "right") {
      try {
        const currentUserId = "bfd42907-62fa-44c9-bf18-38ac7478ac35"; // techguy

        const response = await axios.post("/api/merry", {
          fromUserId: currentUserId,
          toUserId: user.originalProfile.id,
        });

        if (response.data.isMatch) {
          console.log("It's a Match with", user.name);
          // อาจจะเพิ่มโค้ดแสดงการแจ้งเตือน Match ตรงนี้
        }
      } catch (error) {
        console.error("Error recording merry:", error);
      }
    }

    // ลบการ์ดผู้ใช้ที่ถูก swipe
    setDisplayedUsers((prevUsers) => prevUsers.filter((item) => item.name !== user.name));

    // โหลดผู้ใช้คนถัดไป (จะเรียกโดยอัตโนมัติผ่าน handleOutOfFrame)
  };

  /**
   * Function: handleOutOfFrame : จัดการเมื่อการ์ดหายไปจากหน้าจอ
   */
  const handleOutOfFrame = () => {
    // เมื่อการ์ดหายจากหน้าจอ ให้โหลดผู้ใช้คนถัดไป
    loadNextUser(users, currentIndex);
  };

  /**
   * Function: handleImageChange : เปลี่ยนรูปภาพ
   */
  const handleImageChange = (userName, direction) => {
    const user = users.find((u) => u.name === userName);
    if (!user) return;

    const newImageIndexes = { ...imageIndexes };

    if (!newImageIndexes[userName]) {
      newImageIndexes[userName] = 1;
    }

    // สร้างอาร์เรย์ของ URL รูปภาพที่มี
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

  /**
   * Function: handleButtonClick : จัดการการคลิกปุ่มเปลี่ยนรูปภาพ
   */
  const handleButtonClick = (e, userName, direction) => {
    e.stopPropagation();
    handleImageChange(userName, direction);
  };

  /**
   * Function: handleHeartButton : จัดการการคลิกปุ่ม Merry
   */
  const handleHeartButton = async (e, user) => {
    e.stopPropagation();
    console.log("Heart button clicked for", user.name);

    try {
      const currentUserId = "bfd42907-62fa-44c9-bf18-38ac7478ac35"; // techguy

      const response = await axios.post("/api/merry", {
        fromUserId: currentUserId,
        toUserId: user.originalProfile.id,
      });

      if (response.data.isMatch) {
        console.log("It's a Match with", user.name);
        // แสดงการแจ้งเตือน Match
      }

      // เมื่อกดปุ่ม Merry ให้ทำเหมือนกับการ swipe ขวา
      handleSwipe("right", user);
    } catch (error) {
      console.error("Error recording merry:", error);
    }
  };

  /**
   * Function: calculateAge : คำนวณอายุจากวันเกิด
   */
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

  /**
   * Function: resetUsers : รีเซ็ตและเริ่มต้นใหม่
   */
  const resetUsers = async () => {
    setPage(1);
    setViewedUserIds(new Set());
    setSeenAllUsers(false);
    setCurrentIndex(0);
    setDisplayedUsers([]);
    setNoUsersFound(false);
    setFilters({
      sexual_preference: null,
      age_range: null,
    });

    try {
      const data = await fetchUsers(1);
      setUsers(data.users);
      setTotalPages(data.meta.totalPages);
      setHasMorePages(data.meta.page < data.meta.totalPages);

      if (data.users && data.users.length > 0) {
        loadNextUser(data.users, 0);
      } else {
        setNoUsersFound(true);
      }
    } catch (error) {
      console.error("Error resetting users:", error);
      setError(error.message);
    }
  };

  // โหลดข้อมูลเริ่มต้นเมื่อ component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    loading,
    fetchingMoreUsers,
    displayedUsers,
    lastDirection,
    imageIndexes,
    error,
    hasMorePages,
    seenAllUsers,
    filters,
    noUsersFound,
    setUserFilters,
    handleSwipe,
    handleOutOfFrame,
    handleButtonClick,
    handleHeartButton,
    resetUsers,
    loadMoreUsers,
  };
}
